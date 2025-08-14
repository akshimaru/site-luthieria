# Use Node.js official image
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application code
COPY . .

# Run initialization script to ensure data exists
RUN node init.js

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "app.js"]
