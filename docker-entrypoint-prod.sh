#!/bin/sh
set -e

# Set environment variables for SSL certificate handling
# Set to false if you're having certificate verification issues
export DATABASE_SSL_REJECT_UNAUTHORIZED=${DATABASE_SSL_REJECT_UNAUTHORIZED:-false}

echo "Waiting for database to be ready..."

wait_for_postgres() {
  echo "Checking if postgres is ready..."
  # Set PGSSLMODE environment variable to require SSL
  export PGSSLMODE=require
  until pg_isready -h $DATABASE_HOST -p $DATABASE_PORT -U $DATABASE_USER; do
    echo "Postgres is unavailable - sleeping"
    sleep 2
  done
  echo "Postgres is up - executing migrations"
}

wait_for_postgres

echo "Running database migrations..."
db-migrate up

echo "Starting application..."
exec node dist/main
