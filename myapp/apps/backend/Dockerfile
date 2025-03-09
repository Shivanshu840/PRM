# Use Node Alpine as base image
FROM node:18-alpine AS base

# Set working directory inside container
WORKDIR /app

# Install dependencies separately
FROM base AS builder
RUN apk add --no-cache libc6-compat

# Copy only package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./
RUN npm install --omit=dev  # Install only production dependencies

# Copy the entire backend source code
COPY . .

# Build the backend (if needed)
RUN npm run build

# Final image
FROM base AS runner
WORKDIR /app

# Copy only necessary files from builder stage
COPY --from=builder /app /app

# Expose the port (change according to your backend)
EXPOSE 5000

# Start the backend server
CMD ["npm", "run", "start"]