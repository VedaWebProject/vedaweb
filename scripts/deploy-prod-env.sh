#!/bin/sh

#
#   THIS SCRIPT EXPECTS THE WORKING DIRECTORY TO BE
#   THE PROJECT DIRECTORY (PARENT OF THIS ONE) !!!!
#

echo "Building VedaWeb and starting containers for services and main application ..."

# build production environment
docker-compose build --no-cache --force-rm

# run production environment
docker-compose up --detach