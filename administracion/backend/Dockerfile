# =============================================
# DOCKERFILE - ADMINISTRACIÓN BACKEND
# =============================================
# Node.js 20 + Express + TypeScript + TypeORM
# =============================================

FROM node:20-alpine

# Metadatos
LABEL maintainer="CrunchyPaws <dev@crunchypaws.com>"
LABEL description="Administración Backend - Node.js + Express + TypeScript + TypeORM"
LABEL version="1.0.0"

# Instalar dependencias del sistema
RUN apk add --no-cache \
    dumb-init \
    curl \
    && rm -rf /var/cache/apk/*

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY tsconfig*.json ./

# Instalar dependencias
RUN npm ci --only=production && npm cache clean --force

# Copiar código fuente
COPY . .

# Cambiar propietario de archivos
RUN chown -R nodejs:nodejs /app

# Cambiar a usuario no-root
USER nodejs

# Exponer puerto
EXPOSE 3003

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3003/health || exit 1

# Comando por defecto
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "run", "start:prod"]




