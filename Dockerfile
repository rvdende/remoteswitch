##### BUILDER
FROM --platform=linux/amd64 node:lts-alpine3.16 
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY . .

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV DATABASE_URL "file:/data/db/db.sqlite"
RUN yarn global add pnpm
RUN pnpm install
ENV SKIP_ENV_VALIDATION true
RUN pnpm build

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

USER nextjs
EXPOSE 3000
EXPOSE 1883
ENV PORT 3000
CMD ["pnpm", "start"]
