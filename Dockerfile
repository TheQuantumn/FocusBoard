# Stage 1 — Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2 — Prisma generate
FROM node:20-alpine AS prisma
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY prisma ./prisma
RUN npx prisma generate

# Stage 3 — Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=prisma /app/node_modules/.prisma ./node_modules/.prisma
COPY . .
RUN npm run build

# Stage 4 — Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/@prisma/engines ./node_modules/@prisma/engines

EXPOSE 3000

CMD ["node", "server.js"]