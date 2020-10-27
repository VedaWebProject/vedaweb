#!/bin/bash

#
#   THIS SCRIPT EXPECTS THE WORKING DIRECTORY TO BE
#   THE PROJECT DIRECTORY (PARENT OF THIS ONE) !!!!
#

# check for root permissions
if [ "$EUID" -ne 0 ]; then
    echo "To run this script, you'll need root permissions."
    echo "Please login as root or use sudo!"
	exit 1
fi

# define function to check for existing volume
volume_exists() {
    test $(docker volume ls | grep "$1\$" | wc -l) -eq 1
}

# source env vars from .env
echo "Reading source env vars from .env ..."
set -a; . .env; set +a

# create external volumes for data persistance IF they don't already exist
echo "Creating Docker volumes for data persistance ..."
# ... elastic data volume ...
if volume_exists "$VW_VOLUME_ELASTIC_ID"; then
    echo "WARNING: Docker volume \"$VW_VOLUME_ELASTIC_ID\" already exists. Skipping!"
else
    docker volume create "$VW_VOLUME_ELASTIC_ID" &> /dev/null
fi
# ... mongo data volume ...
if volume_exists "$VW_VOLUME_MONGODB_ID"; then
    echo "WARNING: Docker volume \"$VW_VOLUME_MONGODB_ID\" already exists. Skipping!"
else
    docker volume create "$VW_VOLUME_MONGODB_ID" &> /dev/null
fi

# build production environment
echo "Building production environment ..."
docker-compose build --no-cache --force-rm

# run production environment
echo "Running production environment ..."
docker-compose up --detach