# Use Node.js official image
FROM node:18-alpine

WORKDIR /app

# Copy package.json first for better caching
COPY package.json ./

# Install dependencies
RUN npm install --production

# Copy all application files
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Initialize data
RUN node init.js

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "app.js"]
