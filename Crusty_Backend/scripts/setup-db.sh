#!/bin/bash

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "PostgreSQL is not installed. Please install it first."
    exit 1
fi

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Check if the database exists
if psql -lqt | cut -d \| -f 1 | grep -qw pizza_db; then
    echo "Database pizza_db already exists. Dropping it..."
    dropdb pizza_db
fi

# Create and initialize the database
echo "Creating and initializing pizza_db..."
psql -U postgres -f "$PROJECT_DIR/database/init.sql"

echo "Database setup complete!" 