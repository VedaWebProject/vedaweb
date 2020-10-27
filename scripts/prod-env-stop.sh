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

# Infor about ...
# ... elastic data volume ...
volume_exists "$VW_VOLUME_ELASTIC_ID" && \
    echo "The Docker volume \"$VW_VOLUME_ELASTIC_ID\" (containing application data) will not be deleted ..."
# ... mongo data volume
volume_exists "$VW_VOLUME_MONGODB_ID" && \
    echo "The Docker volume \"$VW_VOLUME_MONGODB_ID\" (containing application data) will not be deleted ..."

# stopping production environment
echo "Stopping production environment ..."
docker-compose down