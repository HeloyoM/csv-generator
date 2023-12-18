# Use the official Node.js 16 base image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the app dependencies
RUN npm install

# Copy the app source code to the container
COPY . .

RUN npm run build

# Expose the port that the NestJS app will listen on
EXPOSE 80 8080 443

# Start the NestJS app
CMD ["node", "dist/main.js"]