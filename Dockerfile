# Use an official Node runtime as a parent image
FROM node:18.18.0

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json files to the container
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the application for production
RUN npm run build

# Install a lightweight web server for serving the production build
RUN npm install -g serve

# Expose the port on which the application will run
EXPOSE 3000

# Command to run the application
CMD ["serve", "-s", "dist"]
