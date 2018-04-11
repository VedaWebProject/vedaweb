#!/bin/bash

#arg check
if [[ "$#" != 1 ]]
then
	echo "only one argument (on/off) allowed."
    exit
fi

if [[ "$1" == 'on' ]]
then
	service mongod start
	service elasticsearch start
	echo "started services."
    exit
fi

if [[ "$1" == 'off' ]]
then
	service mongod stop
	service elasticsearch stop
	echo "stopped services."
    exit
fi