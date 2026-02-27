# FROM node:20-alpine AS base
# WORKDIR /app
# COPY package*.json ./

# FROM base AS development
# RUN npm install
# COPY . .
# EXPOSE 5173
# CMD ["npm", "run", "dev"]

# FROM base AS build
# RUN npm ci
# COPY . .
# RUN npm run build

# FROM nginx:alpine AS production
# COPY --from=build /app/dist /usr/share/nginx/html
# RUN printf 'server {\n  listen 80;\n  root /usr/share/nginx/html;\n  location / { try_files $uri $uri/ /index.html; }\n}\n' \
#     > /etc/nginx/conf.d/default.conf
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]


# Stage 1 (compile)
# Copy package*.json
# npm i

# Stage - production (nginx, run)
# Copy /dist
# Copy package*.json
# npm i --omit=dev
# CMD ["nginx", "-g", "daemon off;"]

# Stage - dev
# CMD ["npm", "run", "dev"]

# FROM node:25-alpine AS base
# WORKDIR /app
# COPY package*.json .
# RUN npm i

FROM node:25-alpine AS dev
WORKDIR /cache
COPY package*.json .
RUN npm i
WORKDIR /app
CMD ["sh", "-c", "cp -r /cache/node_modules /app/node_modules && npm ci && npm run dev"]
