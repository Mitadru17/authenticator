FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy app source code
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose the port the app runs on
EXPOSE 5000

# Create a non-root user and switch to it
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Give the nodejs user ownership of the app directory
RUN chown -R nodejs:nodejs /usr/src/app

# Switch to the nodejs user
USER nodejs

# Start the application
CMD ["node", "server.js"] 