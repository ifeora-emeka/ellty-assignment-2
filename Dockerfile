FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npm ci
ARG DATABASE_URL="file:./dev.db"
ENV DATABASE_URL=${DATABASE_URL}
RUN npx prisma generate

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build
RUN npm run build:server

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080
ENV DATABASE_URL="file:/app/data/prod.db"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expressuser

COPY --from=builder --chown=expressuser:nodejs /app/dist ./dist
COPY --from=builder --chown=expressuser:nodejs /app/dist-server ./dist-server
COPY --from=builder --chown=expressuser:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=expressuser:nodejs /app/prisma ./prisma
COPY --from=builder --chown=expressuser:nodejs /app/prisma.config.ts ./
COPY --from=builder --chown=expressuser:nodejs /app/package*.json ./

RUN mkdir -p /app/data && chown -R expressuser:nodejs /app/data

USER expressuser

EXPOSE 8080

CMD npx prisma migrate deploy && npx prisma db seed && node dist-server/server.js
