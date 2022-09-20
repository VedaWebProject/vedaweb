#!/bin/sh

if [ -z "$1" ] ; then
    echo "The path to the target resources directory must be given as the only argument!"
    exit 1
fi

if [ ! -d "$1" ]; then
    echo "$1 is not a valid directory!"
    exit 1
fi

# temp dir
vw_temp="/tmp/vedaweb_$EPOCHSECONDS/"

# create temporary directory
mkdir "$vw_temp"

# download and extract TEI data
wget -q -O "$vw_temp/tei.tar.gz" https://github.com/cceh/c-salt_vedaweb_tei/archive/master.tar.gz
mkdir -p "$1/tei"
tar -xf "$vw_temp/tei.tar.gz" -C "$1/tei" --strip 1

# download and extract references data
wget -q -O "$vw_temp/references.tar.gz" https://github.com/VedaWebPlatform/vedaweb-data-external/archive/master.tar.gz
mkdir -p "$1/references"
tar -xf "$vw_temp/references.tar.gz" -C "$1/references" --strip 1

rm -r "$vw_temp"