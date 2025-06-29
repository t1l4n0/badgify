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

# Build the application, prune dev dependencies and regenerate Prisma client
RUN npm run build \
    && npm prune --omit=dev \
    && npx prisma generate

# Expose port
EXPOSE 8080

# Set environment variable for port
ENV PORT=8080

# Start the application with proper database initialization
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && npm start"]
