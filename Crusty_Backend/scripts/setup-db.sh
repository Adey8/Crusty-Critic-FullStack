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
if psql -lqt | cut -d \| -f 1 | grep -qw crustydb; then
    echo "Database crustydb already exists. Dropping it..."
    dropdb crustydb
fi

# Create and initialize the database
echo "Creating and initializing crustydb..."
psql -U postgres -f "$PROJECT_DIR/database/init.sql"

echo "Database setup complete!" 