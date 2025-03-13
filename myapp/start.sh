#!/bin/sh

echo "Waiting for PostgreSQL to be ready..."
npx wait-on tcp:postgres:5432 -t 60000

echo "Running database migrations..."
npx prisma migrate deploy

echo "Starting the application..."
node dist/index.js