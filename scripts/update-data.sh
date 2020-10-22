#!/bin/sh

#
#   THIS SCRIPT EXPECTS THE WORKING DIRECTORY TO BE
#   THE PROJECT DIRECTORY (PARENT OF THIS ONE) !!!!
#

# create temporary directory
mkdir /tmp/vedaweb/

# download and extract TEI data
wget -q -O /tmp/vedaweb/tei.tar.gz https://github.com/cceh/c-salt_vedaweb_tei/archive/master.tar.gz
mkdir -p resources/tei
tar -xf /tmp/vedaweb/tei.tar.gz -C resources/tei --strip 1
rm /tmp/vedaweb/tei.tar.gz

# download and extract references data
wget -q -O /tmp/vedaweb/references.tar.gz https://github.com/VedaWebPlatform/vedaweb-data-external/archive/master.tar.gz
mkdir -p resources/references
tar -xf /tmp/vedaweb/references.tar.gz -C resources/references --strip 1
rm /tmp/vedaweb/references.tar.gz