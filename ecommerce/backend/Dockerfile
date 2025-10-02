# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY src/ ./src/
COPY prisma/ ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S crunchypaws -u 1001

# Copy built application
COPY --from=builder --chown=crunchypaws:nodejs /app/dist ./dist
COPY --from=builder --chown=crunchypaws:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=crunchypaws:nodejs /app/package*.json ./
COPY --from=builder --chown=crunchypaws:nodejs /app/prisma ./prisma

# Create uploads directory
RUN mkdir -p uploads && chown crunchypaws:nodejs uploads

# Switch to non-root user
USER crunchypaws

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]
