#!/bin/bash

BUCKETNAME=hugot-usercontent-development
# KEY=files/c58e504f548442a195ca9d3ea5fea41d57d21509ab074bcaa75422f9c7268d227bd0d93a3f874733bcd58dc0eed0574c

for KEY in $(aws s3api list-objects \
   --bucket $BUCKETNAME \
   --query "Contents[].[Key]" \
   --output text)
do
  aws s3api head-object \
     --bucket $BUCKETNAME \
     --key $KEY \
     --query "[\`$KEY\`,ContentDisposition]" \
     --output text
done
