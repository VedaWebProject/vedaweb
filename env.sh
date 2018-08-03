#!/bin/bash

#arg check
if [[ "$#" != 1 ]]
then
	echo "only one argument (on/off) allowed."
    exit
fi

if [[ "$1" == 'on' ]]
then
	sudo service mongod start
	sudo service elasticsearch start
	echo "started services."
    exit
fi

if [[ "$1" == 'off' ]]
then
	sudo service mongod stop
	sudo service elasticsearch stop
	echo "stopped services."
    exit
fi