# =============================================
# DOCKERFILE - ADMINISTRACIÓN FRONTEND
# =============================================
# Angular 20 + Tailwind CSS
# =============================================

# Etapa de construcción
FROM node:20-alpine AS builder

# Metadatos
LABEL maintainer="CrunchyPaws <dev@crunchypaws.com>"
LABEL description="Administración Frontend - Angular 20 + Tailwind CSS"
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
RUN npm run build

# Etapa de producción
FROM nginx:alpine AS runner

# Metadatos
LABEL maintainer="CrunchyPaws <dev@crunchypaws.com>"
LABEL description="Administración Frontend - Nginx serving Angular app"
LABEL version="1.0.0"

# Copiar archivos construidos
COPY --from=builder /app/dist/administracion /usr/share/nginx/html

# Copiar configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto
EXPOSE 4200

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:4200/health || exit 1

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"]




