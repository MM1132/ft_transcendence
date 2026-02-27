# FROM node:20-alpine AS base
# WORKDIR /app
# COPY package*.json ./

# FROM base AS development
# EXPOSE 3000
# CMD ["sh", "-c", "npm install && npm run dev"]

# FROM base AS build
# RUN npm ci --only=production
# COPY . .
# RUN npm run build

# FROM node:20-alpine AS production
# WORKDIR /app

# RUN addgroup -g 1001 -S nodejs && \
#     adduser -S nodejs -u 1001

# COPY --from=build --chown=nodejs:nodejs /app/node_modules ./node_modules
# COPY --from=build --chown=nodejs:nodejs /app/build ./build
# COPY --from=build --chown=nodejs:nodejs /app/package*.json ./

# USER nodejs

# EXPOSE 3000

# CMD ["npm", "start"]

FROM node:25-alpine AS dev
WORKDIR /cache
COPY package*.json .
RUN npm i
WORKDIR /app
CMD ["sh", "-c", "cp -r /cache/node_modules /app/node_modules && npm ci && npm run dev"]
