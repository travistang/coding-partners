# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY app/package*.json ./app/
COPY backend/package*.json ./backend/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build both frontend and backend
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files and built artifacts
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/backend/package*.json ./backend/
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/public ./backend/public

# Install production dependencies only
ENV NODE_ENV=production
RUN npm ci --only=production --workspace=backend

# Set environment variables
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start the server
CMD ["npm", "start"]