const models = require('../models/index');
const tinyurl = require('tinyurl');
var validate = require('url-validator');
const crypto = require('crypto');
const geoip = require('geoip-lite');
const UAParser = require('ua-parser-js');
const { Op, fn, col, literal } = require('sequelize')
const moment = require('moment');
const redis = require('../config/redis');

const createShortLink = async (params, userId) => {
    const { longUrl, topic } = params;
    let customAlias = params.customAlias
    if (!longUrl) throw new Error('longUrl is required');
    if (!validate(longUrl)) throw new Error('please enter a valid url');
    try {
        const existingUrl = await models.Url.findOne({ where: { long_url: longUrl, created_by: userId } });
        if (existingUrl) return {
            message: 'You have already created a short url for this long url. please check the details below.',
            shortUrl: existingUrl.short_url
        };
        if (customAlias) {
            const existingAlias = await models.Url.findOne({ where: { alias: customAlias } });
            if (existingAlias) throw new Error('Custom alias is already taken. Please try with other alias')
        } else {
            customAlias = crypto.randomBytes(3).toString('hex');
        }
        const shortUrl = await tinyurl.shorten(longUrl);
        const currentTime = new Date()
        await models.Url.create({
            long_url: longUrl,
            short_url: shortUrl,
            alias: customAlias,
            topic,
            created_by: userId,
            created_at: currentTime,
            updated_at: currentTime
        })
        await redis.set(`short:${customAlias}`, longUrl);
        return {
            shortUrl,
            createdAt: currentTime
        }
    } catch (err) {
        throw err;
    }
};

const getLongUrl = async (alias, userAgent, ipAddress, userId) => {
    try {
        const url = await models.Url.findOne({ where: { alias } });
        if (!url) throw new Error('alias not found');
        const geo = geoip.lookup(ipAddress);
        const parser = new UAParser().setUA(userAgent);
        const deviceDetails = parser.getResult();
        await models.Analytics.create({
            url_id: url.id,
            user_agent: userAgent || null,
            ip_address: ipAddress || null,
            geolocation: geo || null,
            os_type: deviceDetails?.os?.name || 'Unknown',
            device_type: deviceDetails?.device?.type || 'desktop',
            user_id: userId,
            timestamp: new Date()
        });
        return url.long_url;
    } catch (err) {
        throw err;
    }
}

const retrieveUrlData = async (params) => {
    const { alias } = params;
    try {
        const url = await models.Url.findOne({ where: { alias } });
        if (!url) throw new Error('Short URL not found');
        const [totalClicks, uniqueUsers, clicksByDate, osType, deviceType] = await Promise.all([
            models.Analytics.count({
                where: { url_id: url.id },
            }),
            models.Analytics.count({
                distinct: true,
                col: 'user_id',
                where: { url_id: url.id },
            }),
            models.Analytics.findAll({
                where: {
                    url_id: url.id,
                    timestamp: {
                        [Op.gte]: moment().subtract(7, 'days').startOf('day').toDate(),
                    },
                },
                attributes: [
                    [fn('date', col('timestamp')), 'date'],
                    [fn('count', col('id')), 'clickCount'],
                ],
                group: ['date'],
                order: [['date', 'DESC']],
            }),
            models.Analytics.findAll({
                where: { url_id: url.id },
                attributes: ['os_type', [fn('count', col('id')), 'uniqueClicks'], [fn('count', fn('distinct', col('user_id'))), 'uniqueUsers']],
                group: ['os_type'],
            }),
            models.Analytics.findAll({
                where: { url_id: url.id },
                attributes: ['device_type', [fn('count', col('id')), 'uniqueClicks'], [fn('count', fn('distinct', col('user_id'))), 'uniqueUsers']],
                group: ['device_type'],
            })
        ])
        return {
            totalClicks,
            uniqueUsers,
            clicksByDate,
            osType,
            deviceType,
        }
    } catch (err) {
        throw err;
    }
}

const retrieveTopicBasedAnalytics = async (topic) => {
    try {
        const urls = await models.Url.findAll({ where: { topic } });
        if (!urls || urls.length === 0) throw new Error('No URLs found for this topic');
        const urlIds = urls.map(url => url.id);
        const [totalClicks, uniqueUsers, clicksByDate, urlsAnalytics] = await Promise.all([
            models.Analytics.count({
                where: {
                    url_id: {
                        [Op.in]: urlIds,
                    },
                },
            }),
            models.Analytics.count({
                distinct: true,
                col: 'user_id',
                where: {
                    url_id: {
                        [Op.in]: urlIds,
                    },
                },
            }),
            models.Analytics.findAll({
                where: {
                    url_id: {
                        [Op.in]: urlIds,
                    },
                },
                attributes: [
                    [fn('date', col('timestamp')), 'date'],
                    [fn('count', col('id')), 'clickCount'],
                ],
                group: ['date'],
                order: [['date', 'DESC']],
            }),
            models.Analytics.findAll({
                attributes: [
                    'url_id',
                    [fn('COUNT', col('id')), 'totalClicks'],
                    [fn('COUNT', literal('DISTINCT "user_id"')), 'uniqueUsers'],
                ],
                where: {
                    url_id: { [Op.in]: urlIds },
                },
                group: ['url_id'],
            })
        ])

        const urlData = urls.map((url) => {
            const analytics = urlsAnalytics.find((item) => item.url_id === url.id);
            return {
                shortUrl: url.short_url,
                totalClicks: analytics ? analytics.get('totalClicks') : 0,
                uniqueUsers: analytics ? analytics.get('uniqueUsers') : 0,
            };
        });

        return {
            totalClicks,
            uniqueUsers,
            clicksByDate,
            urls: urlData,
        }
    } catch (err) {
        throw err;
    }
}

const fetchOverallAnalytics = async (userId) => {
    try {
        const urls = await models.Url.findAll({ where: { created_by: userId } });
        if (!urls || urls.length === 0) throw new Error('No URLs found for this user');
        const urlIds = urls.map(url => url.id);
        const [totalClicks, uniqueUsers, clicksByDate, osType, deviceType] = await Promise.all([
            models.Analytics.count({
                where: {
                    url_id: {
                        [Op.in]: urlIds,
                    },
                },
            }),
            models.Analytics.count({
                distinct: true,
                col: 'user_id',
                where: {
                    url_id: {
                        [Op.in]: urlIds,
                    },
                },
            }),
            models.Analytics.findAll({
                where: {
                    url_id: {
                        [Op.in]: urlIds,
                    },
                },
                attributes: [
                    [fn('date', col('timestamp')), 'date'],
                    [fn('count', col('id')), 'clickCount'],
                ],
                group: ['date'],
                order: [['date', 'DESC']],
            }),
            models.Analytics.findAll({
                where: { url_id: { [Op.in]: urlIds } },
                attributes: ['os_type', [fn('count', col('id')), 'uniqueClicks'], [fn('count', fn('distinct', col('user_id'))), 'uniqueUsers']],
                group: ['os_type'],
            }),
            models.Analytics.findAll({
                where: { url_id: { [Op.in]: urlIds } },
                attributes: ['device_type', [fn('count', col('id')), 'uniqueClicks'], [fn('count', fn('distinct', col('user_id'))), 'uniqueUsers']],
                group: ['device_type'],
            })
        ])

        return {
            totalUrls: urlIds.length,
            totalClicks,
            uniqueUsers,
            clicksByDate,
            osType,
            deviceType
        }
    } catch (err) {
        throw err;
    }
}
module.exports = { createShortLink, getLongUrl, retrieveUrlData, retrieveTopicBasedAnalytics, fetchOverallAnalytics };