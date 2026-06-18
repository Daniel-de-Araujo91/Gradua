# Build static frontend with Vite and serve with nginx
FROM node:20-alpine AS build
WORKDIR /app

# Allow injecting API URL at build time. Default points to localhost (browser will hit host)
ARG VITE_API_URL=http://localhost:8080
ENV VITE_API_URL=${VITE_API_URL}

# Install deps
COPY package.json package-lock.json* ./
RUN npm ci --silent

# Copy source and build (Vite will inline VITE_API_URL from environment at build time)
COPY . .
RUN npm run build

# Serve with nginx
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
