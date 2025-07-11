#!/bin/sh
set -e

echo "Waiting for database to be ready..."

# Function to check if postgres is ready using pg_isready
wait_for_postgres() {
  echo "Checking if postgres is ready..."
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
exec npm run start:dev
