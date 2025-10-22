# =============================================
# DOCKERFILE - ECOMMERCE FRONTEND
# =============================================
# Angular 20 + SSR + Tailwind CSS
# =============================================

# Etapa de construcción
FROM node:20-alpine AS builder

# Metadatos
LABEL maintainer="CrunchyPaws <dev@crunchypaws.com>"
LABEL description="Ecommerce Frontend - Angular 20 + SSR + Tailwind CSS"
LABEL version="1.0.0"

# Instalar dependencias del sistema
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    && rm -rf /var/cache/apk/*

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY angular.json ./
COPY tsconfig*.json ./
COPY tailwind.config.js ./

# Instalar dependencias
RUN npm ci && npm cache clean --force

# Copiar código fuente
COPY . .

# Construir aplicación
RUN npm run build:ssr

# Etapa de producción
FROM node:20-alpine AS runner

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

# Copiar archivos construidos desde la etapa anterior
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --only=production && npm cache clean --force

# Cambiar a usuario no-root
USER nodejs

# Exponer puerto
EXPOSE 4200

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:4200/health || exit 1

# Comando por defecto
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "run", "serve:ssr"]




