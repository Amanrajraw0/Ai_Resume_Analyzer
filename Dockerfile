<<<<<<< HEAD
# Step 1: Build React App
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all project files and build
COPY . .
RUN npm run build

# Step 2: Serve with Nginx
FROM nginx:alpine

# Copy build output to Nginx html directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
=======
# -----------------------------
# 🧱 Stage 1: Build the App
# -----------------------------
FROM node:20-alpine AS build
WORKDIR /app

# Copy dependency files and install all dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# -----------------------------
# 🚀 Stage 2: Production Image
# -----------------------------
FROM node:20-alpine
WORKDIR /app

# Copy only what's needed for runtime
COPY package*.json ./
RUN npm ci --omit=dev

# Copy build artifacts from the build stage
COPY --from=build /app/build ./build

# Expose app port (React Router serve defaults to 3000)
EXPOSE 3000

# Start the React Router server
CMD ["npm", "start"]
>>>>>>> 5b58bb2 (Added optimized Dockerfile for AI Resume Analyzer)
