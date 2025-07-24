# Use Node.js 20 slim base image for efficiency
FROM node:20-slim

# Set working directory
WORKDIR /assessment

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js app for production
RUN npm run build

# Expose port 3000 for the Next.js app
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "run", "start"]