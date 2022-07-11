#!/bin/sh


# vercel
vercel build
mv ./.vercel/output/static ./.vercel/static
mv ./.vercel/output/functions/api ./.vercel/lambda/api
cp ./lambda.js ./.vercel/lambda/lambda.js
cp ./lambda-package.json ./.vercel/lambda/package.json
yarn --cwd ./.vercel/lambda install
zip -r ./.vercel/lambda/lambda.zip ./.vercel/lambda/

aws --endpoint-url=https://storage.yandexcloud.net s3 rm s3://daily-mephi/static --recursive
aws --endpoint-url=https://storage.yandexcloud.net s3 cp --recursive ./.vercel/static/ s3://daily-mephi/static
# aws --endpoint-url=https://storage.yandexcloud.net s3 cp ./.vercel/lambda/lambda.zip s3://daily-mephi/lambda.zip

yc serverless function version create \
  --function-name=daily-mephi \
  --runtime nodejs16 \
  --entrypoint lambda.handler \
  --memory 256m \
  --execution-timeout 10s \
  --source-path ./.vercel/lambda/lambda.zip