#!/bin/sh
set -e

# SSL configuration for database connections
# By default, enable certificate validation for security
# Set to 'false' only if you're having certificate issues that can't be resolved
export DATABASE_SSL_REJECT_UNAUTHORIZED=${DATABASE_SSL_REJECT_UNAUTHORIZED:-true}

# Note: We previously used NODE_TLS_REJECT_UNAUTHORIZED=0 as a workaround
# But that's insecure as it disables certificate validation globally
# Instead, we now handle certificate validation properly in the application code

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
