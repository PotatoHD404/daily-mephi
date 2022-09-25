This is a [Next.js](https://nextjs.org/) project bootstrapped
with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/[reviewId].tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed
on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited
in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated
as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions
are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use
the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)
from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Deploy on yandex cloud


### Installing dependencies

```shell
npm i -g yarn
yarn
yarn global add vercel
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
rm awscliv2.zip
rm -rf ./aws
sudo apt install zip unzip 
curl https://storage.yandexcloud.net/yandexcloud-yc/install.sh | bash
```

Now you need to configure your yandex cloud account to work with aws cli.

Follow the instructions on [Yandex Cloud AWS CLI documentation](https://cloud.yandex.ru/docs/storage/tools/aws-cli)

Also, you need to configure your yandex cloud account

Follow the instructions on [Yandex Cloud CLI documentation](https://cloud.yandex.com/en-ru/docs/cli/quickstart#install)

### Configuring Vercel

Go to [Vercel](https://vercel.com) and create a new account.


Run the following command to configure Vercel:

(You will configure your account and deploy your project)

```shell
vercel
```

Go to [Vercel Dashboard](https://vercel.com/dashboard) and add environment variables to your project.

(Vercel -> Your Project -> Settings -> Environment Variables)

### Deploying to yandex cloud

First, you need to create a new bucket in your yandex cloud account.

```shell
aws --endpoint-url=https://storage.yandexcloud.net s3 mb s3://daily-mephi
```

Then you need to create a new serverless function in your yandex cloud account.

```shell
yc serverless function create --name=daily-mephi
```

Then you are ready to deploy your project to yandex cloud.

You can do it just by running the following command:

```shell
sh yandex-cloud.sh
```

yandex-cloud.sh:
```shell
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

yc serverless function version create \
  --function-name=daily-mephi \
  --runtime nodejs16 \
  --entrypoint lambda.handler \
  --memory 256m \
  --execution-timeout 10s \
  --source-path ./.vercel/lambda/lambda.zip
```

Now you need to configure gateway for your project.

Edit service domains, account id and function id in yandex-gateway.yaml
according to your project.

Also, you need to edit paths in yandex-gateway.yaml according to your next-js project.

You may find paths in .vercel/output/config.json
Specifically you need to look at overrides section.

Then you can deploy your gateway configuration to cloud.

```shell
yc serverless api-gateway create --name daily-mephi --spec=yandex-gateway.yaml --description "Daily Mephi"
```

Also, you can add domain to your yandex gateway.

[Connecting a domain](https://cloud.yandex.com/en-ru/docs/api-gateway/operations/api-gw-domains)

## Congratulations

You have successfully deployed your Next.js project to yandex cloud.
