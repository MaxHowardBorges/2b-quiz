#!/bin/sh

yarn migrate-backend-prod &

exec "$@"
