# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application into the working directory
COPY . .

# Expose the application on port 3000
EXPOSE 3000

# Command to run the app
CMD ["npm", "start"]
