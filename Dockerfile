# Use Node.js 18 Alpine as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install system dependencies for Prisma compatibility
RUN apk add --no-cache openssl curl libc6-compat

# Copy package files first for better caching
COPY package*.json ./

# Install ALL dependencies (including devDependencies for build)
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Generate Prisma client with correct binary targets
RUN npx prisma generate

# Build the application
RUN npm run build

# Remove devDependencies after build to reduce image size
RUN npm prune --production

# Regenerate Prisma client for production (ensures correct binaries)
RUN npx prisma generate

# Expose port
EXPOSE 8080

# Set environment variable for port
ENV PORT=8080

# Start the application with proper database initialization
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && npm start"]