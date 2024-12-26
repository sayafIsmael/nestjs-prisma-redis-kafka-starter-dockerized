#!/bin/bash

# Load environment variables from .env file
export $(grep -v '^#' .env | xargs)

# Check if the required environment variables are set
if [ -z "$POSTGRES_USER" ] || [ -z "$POSTGRES_PASSWORD" ] || [ -z "$POSTGRES_DB" ]; then
  echo "Error: Missing environment variables (POSTGRES_USER, POSTGRES_PASSWORD, or POSTGRES_DB)"
  exit 1
fi

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
until pg_isready -h "postgres" -p "$DATABASE_PORT" -U "$POSTGRES_USER"; do
  sleep 2
done

# Connect to PostgreSQL and create the user and database
echo "Creating database user..."
psql -h "postgres" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "CREATE USER $POSTGRES_USER WITH PASSWORD '$POSTGRES_PASSWORD';"
psql -h "postgres" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "GRANT ALL PRIVILEGES ON DATABASE $POSTGRES_DB TO $POSTGRES_USER;"

# If you want to create additional users dynamically, you can add logic here.
# For example, create a new database user with privileges from the .env file.
