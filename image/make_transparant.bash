#!/bin/bash

#convert cv.png -alpha set -channel A -evaluate set 50% tr_cv.png

rm tr_*

for image in *.png
do
#  echo "converting: $image"
   convert $image -alpha set -channel A -evaluate set 50% "tr_$image"
done

#convert schulen.png -alpha set -channel A -evaluate set 50% schulen_transparant.png

