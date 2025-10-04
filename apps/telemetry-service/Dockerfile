# 1) deps
FROM node:20-alpine AS deps
WORKDIR /workspace
COPY package.json ./
RUN npm ci --no-audit --no-fund || npm install --no-audit --no-fund

FROM node:20-alpine AS build
WORKDIR /workspace
COPY --from=deps /workspace .
COPY tsconfig.json ./
COPY src/types.ts ./types.ts
COPY src ./src
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=deps /workspace/node_modules ./node_modules
COPY --from=build /workspace/dist ./dist
EXPOSE 8082
CMD ["node", "dist/main.js"]