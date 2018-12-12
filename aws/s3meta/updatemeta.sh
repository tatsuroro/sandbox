#!/bin/bash

BUCKETNAME=hugot-usercontent-development
#TYPE KEY: 'files/c58e504f548442a195ca9d3ea5fea41d57d21509ab074bcaa75422f9c7268d227bd0d93a3f874733bcd58dc0eed0574c'

for KEY in $(aws s3api list-objects \
  --bucket $BUCKETNAME \
  --query "Contents[].[Key]" \
  --output text)
do
  aws s3api copy-object \
    --bucket $BUCKETNAME \
    --copy-source $BUCKETNAME/$KEY \
    --key $KEY \
    --metadata-directive "REPLACE" \
    --content-disposition 'attachment; filename="test.mp4"'
    --content-type 'video/mp4'
done
