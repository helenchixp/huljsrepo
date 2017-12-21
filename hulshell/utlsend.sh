TARGET=/home/guest01/hulft/hulft840

HULPATH=$TARGET/etc
export HULPATH
HULEXEP=$TARGET/bin
export HULEXEP

PATH=$HULEXEP:$PATH
export PATH

utlkillsnd
echo utlkillsnd:$?
hulsndd
echo hulsndd:$?
