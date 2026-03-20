#!/bin/bash
# Starts the local user-space PostgreSQL cluster (port 5434)
PGDATA="$HOME/local-postgres-db"
PG_CTL="pg_ctl" # Assume pg_ctl is in path

if $PG_CTL -D "$PGDATA" status > /dev/null 2>&1; then
    echo "PostgreSQL is already running."
else
    echo "Starting PostgreSQL..."
    $PG_CTL -D "$PGDATA" -l "$PGDATA/logfile" start
    echo "PostgreSQL started on port 5434."
fi
