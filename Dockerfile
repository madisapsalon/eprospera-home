FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache postgresql-client
RUN npm install -g db-migrate db-migrate-pg

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/migrations ./migrations
COPY --from=builder /app/database.json ./database.json

# Create directory for certificates and copy the CA certificate
RUN mkdir -p /app/certs
COPY certs/global-bundle.pem /app/certs/

COPY docker-entrypoint-prod.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

CMD ["/docker-entrypoint.sh"]
