#!/usr/bin/env bash
set -e

echo "Starting background worker..."
python manage.py run_worker &

echo "Starting Django API..."
gunicorn config.wsgi:application
