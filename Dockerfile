# Use official Node.js runtime
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the entire project
COPY . .

# Expose port
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
