#!/bin/sh

# HULPATH, HULEXEP set sample file for bsh

TARGET=/home/guest01/hulft/hulft840

HULPATH=$TARGET/etc
export HULPATH
HULEXEP=$TARGET/bin
export HULEXEP

PATH=$HULEXEP:$PATH
export PATH

utlsend -f A
echo utlsend:$?

