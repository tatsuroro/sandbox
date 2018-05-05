#!/bin/bash

BUCKETNAME=hugot-usercontent-development

for KEY in $(aws s3api list-objects \
   --bucket $BUCKETNAME \
   --query "Contents[].[Key]" \
   --output text)
do
  RES=$(aws s3api head-object \
       --bucket $BUCKETNAME \
       --key $KEY \
       --query "{filepath:\`$KEY\`,contentDisposition:ContentDisposition,contentType:ContentType}" \
       --output json)

  FILEPATH=$(echo $RES | jq -r '.filepath')
  CD_FILENAME=$(echo $RES | jq -r '.contentDisposition' | awk '/filename.*$/ { print $2 }')
  CONTENT_TYPE=$(echo $RES | jq -r '.contentType')

  echo $FILEPATH
  echo $CD_FILENAME
  echo $CONTENT_TYPE

  aws s3api copy-object \
    --bucket $BUCKETNAME \
    --copy-source $BUCKETNAME/$KEY \
    --key $KEY \
    --metadata-directive "REPLACE" \
    --content-disposition "attachment; $CD_FILENAME" \
    --content-type $CONTENT_TYPE

  # check result
  MOD_RESULT=$(aws s3api head-object \
       --bucket $BUCKETNAME \
       --key $KEY \
       --query "{filepath:\`$KEY\`,contentDisposition:ContentDisposition,contentType:ContentType}" \
       --output json)

  echo "Result: "
  echo $MOD_RESULT
done
