# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the Next.js application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install dumb-init to handle signals properly
RUN apk add --no-cache dumb-init

# Copy package files
COPY package.json package-lock.json* ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built application from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/middleware.js ./
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/jsconfig.json ./

# Create a non-root user
RUN addgroup --gid 1001 nodejs && \
    adduser --uid 1001 --ingroup nodejs nextjs

# Change ownership
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

# Use dumb-init to handle signals correctly
ENTRYPOINT ["dumb-init", "--"]

CMD ["npm", "start"]
