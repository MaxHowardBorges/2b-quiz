#!/bin/sh

yarn typeorm:migrate &

exec "$@"
