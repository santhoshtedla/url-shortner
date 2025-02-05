const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models');

passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/api/auth/google/callback',
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user exists in the database
        const existingUser = await User.findOne({ where: { google_id: profile.id } });
        if (existingUser) {
          return done(null, existingUser);
        }

        // Create a new user if not found
        const newUser = await User.create({
          google_id: profile.id,
          email: profile.emails[0].value,
          first_name: profile.name.givenName,
          last_name: profile.name.familyName,
          profile_picture: profile.photos[0]?.value,
        });
        return done(null, newUser);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (user, done) => {
  try {
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
