FROM node:25-alpine AS dev
WORKDIR /cache
COPY package*.json .
RUN npm i
WORKDIR /app
CMD ["sh", "-c", "cp -r /cache/node_modules /app/node_modules && npm ci && npm run dev"]
