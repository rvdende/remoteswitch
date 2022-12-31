##### BUILDER
FROM --platform=linux/amd64 node:lts-alpine3.16 
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY . .

RUN pnpm install

RUN \
 if [ -f yarn.lock ]; then SKIP_ENV_VALIDATION=1 yarn build; \
 elif [ -f package-lock.json ]; then SKIP_ENV_VALIDATION=1 npm run build; \
 elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && SKIP_ENV_VALIDATION=1 pnpm run build; \
 else echo "Lockfile not found." && exit 1; \
 fi

ENV NEXT_TELEMETRY_DISABLED 1

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

USER nextjs
EXPOSE 3000
EXPOSE 1883
ENV PORT 3000
CMD ["pnpm", "start"]
