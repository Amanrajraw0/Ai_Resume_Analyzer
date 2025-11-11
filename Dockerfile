# -----------------------------
# 🧱 Stage 1: Build React App
# -----------------------------
FROM node:20-slim AS build
WORKDIR /app

# Copy dependency files and install dependencies
COPY package*.json ./
RUN npm install --quiet

# Copy rest of project and build
COPY . .
RUN npm run build

# -----------------------------
# 🚀 Stage 2: Serve via Nginx
# -----------------------------
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Copy build output from previous stage
COPY --from=build /app/build ./

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
