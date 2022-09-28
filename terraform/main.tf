variable "token" {
  type     = string
  nullable = false
  sensitive = true
}

variable "cloud_id" {
  type     = string
  nullable = false
  sensitive = true
}

variable "folder_id" {
  type     = string
  nullable = false
  sensitive = true
}

variable "zone" {
  type     = string
  nullable = false
  sensitive = true
}

variable "DOMAIN_ID" {
  type     = string
  nullable = false
  sensitive = true
}

locals {
  mime_types = jsondecode(file("${path.module}/mimes.json"))
}

terraform {
  required_providers {
    yandex = {
      source = "yandex-cloud/yandex"
    }
  }
  required_version = ">= 0.13"
  backend "s3" {
    endpoint   = "storage.yandexcloud.net"
    bucket     = "daily-service"
    region     = "ru-central1"
    key        = "daily-mephi-terraform/main.tfstate"


    skip_region_validation      = true
    skip_credentials_validation = true

  }
}

provider "yandex" {
  token     = var.token
  cloud_id  = var.cloud_id
  folder_id = var.folder_id
  zone      = var.zone
}

#data "terraform_remote_state" "state" {
#  backend = "s3"
#  config = {
#    endpoint   = "storage.yandexcloud.net"
#    bucket     = "daily-service"
#    region     = "ru-central1"
#    key        = "daily-mephi-terraform/main.tfstate"

#    access_key = var.s3_access_key
#    secret_key = var.s3_secret_key
#
#    skip_region_validation      = true
#    skip_credentials_validation = true
#
#  }
#}

resource "yandex_iam_service_account" "sa" {
  folder_id = var.folder_id
  name      = "tf-sa"
}

// Grant permissions
resource "yandex_resourcemanager_folder_iam_member" "sa-editor" {
  folder_id = var.folder_id
  role      = "admin"
  member    = "serviceAccount:${yandex_iam_service_account.sa.id}"
}

// Create Static Access Keys
resource "yandex_iam_service_account_static_access_key" "sa-static-key" {
  service_account_id = yandex_iam_service_account.sa.id
  description        = "static access key for object storage"
}

resource "yandex_iam_service_account_api_key" "sa-api-key" {
  service_account_id = yandex_iam_service_account.sa.id
  description        = "api key for authorization"
}

// Use keys to create bucket
resource "yandex_storage_bucket" "public" {
  access_key = yandex_iam_service_account_static_access_key.sa-static-key.access_key
  secret_key = yandex_iam_service_account_static_access_key.sa-static-key.secret_key
  acl    = "public-read"
#  force_destroy = true
  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "POST", "PUT", "DELETE", "HEAD"]
    allowed_origins = ["https://login.mephi.ru", "https://daily-mephi.ru", "https://mc.yandex.ru", "https://yastatic.net"]
    expose_headers  = ["ETag"]
    max_age_seconds = 0
  }


  bucket = "public-bucket"
}

#resource "yandex_storage_object" "static-object" {
#  depends_on = [yandex_storage_bucket.public, null_resource.build]
#  for_each = fileset("${path.root}/static", "**/*")
#
#  bucket = yandex_storage_bucket.public.bucket
#  key    = "static/${each.value}"
#  source = "${path.root}/static/${each.value}"
#
##  etag         = filesha256("${path.root}/static/${each.value}")
#  content_type = lookup(local.mime_types, regex("\\.[^.]+$", each.value), null)
#}

#content_type = lookup(local.mime_types, regex("\\.[^.]+$", "index.html"), null)

resource "null_resource" "build_notion" {
  triggers = {
    build_number = timestamp()
  }
  provisioner "local-exec" {
    #    interpreter = ["PowerShell", "-Command"]
    command = <<-EOT
    cd ${path.root}/../
    yarn --cwd ./cloud-functions/notion-api/ install
    EOT
  }
}

data "archive_file" "zip_notion" {
  depends_on = [null_resource.build_notion]
  type        = "zip"
  source_dir = "../cloud-functions/notion-api/"
  output_path = "notion-api.zip"
  excludes = []
}

resource "yandex_function" "notion" {
  depends_on = [data.archive_file.zip_notion]
  for_each = toset( [for i in range(1, 6) : tostring(i)] )
  name               = "notion-api-${each.value}"
  description        = "notion-api-${each.value}"
  user_hash          = data.archive_file.zip_notion.output_sha
  runtime            = "nodejs16"
  entrypoint         = "index.handler"
  memory             = "128"
  execution_timeout  = "3"
  content {
    zip_filename   = data.archive_file.zip_notion.output_path
  }
}

locals {
  notion_ids = sensitive([for k, v in yandex_function.notion: v.id])
}

resource "yandex_function_iam_binding" "notion" {
  for_each = yandex_function.notion
  function_id = each.value.id
  role        = "serverless.functions.invoker"
  members     = ["system:allUsers"]
}



resource "null_resource" "environment_vars" {
  triggers = {
    build_number = timestamp()
  }
  provisioner "local-exec" {
    command = <<-EOT
echo NOTION_YC_IDS="${join(";", local.notion_ids)}" >> ${path.module}/../.env
EOT
  }
}

resource "null_resource" "build" {
  depends_on = [yandex_storage_bucket.public, null_resource.environment_vars, yandex_function_iam_binding.notion]
  triggers = {
    build_number = timestamp()
  }
  provisioner "local-exec" {
    command = <<-EOT
cd ${path.root}/../

rm -rf ./terraform/static ./terraform/main-lambda

tf-next build --skipDownload
yarn next export
unzip -o .next-tf/deployment.zip -d .next-tf >/dev/null 2>&1
echo "Unzipped deployment.zip"
rm -rf .next-tf/deployment.zip
rm -rf ./terraform/main-lambdas
mkdir ./terraform/main-lambdas
cd ./terraform
    EOT
  }
}

resource "null_resource" "upload_static" {
  depends_on = [null_resource.build]
  triggers = {
    build_number = timestamp()
  }
  provisioner "local-exec" {
    command = <<-EOT
cd ${path.root}/../

mv out ./terraform/static

aws --endpoint-url=https://storage.yandexcloud.net s3 rm s3://${yandex_storage_bucket.public.bucket}/static --recursive >/dev/null 2>&1
echo "Removed old static files"
aws --endpoint-url=https://storage.yandexcloud.net s3 cp --recursive ./terraform/static/ s3://${yandex_storage_bucket.public.bucket}/static >/dev/null 2>&1
echo "Uploaded new static files"
    EOT
  }
}

resource "null_resource" "build_api" {
  depends_on = [null_resource.build]
  triggers   = {
    build_number = timestamp()
  }
  provisioner "local-exec" {

    command = <<-EOT
cd ${path.root}/../

unzip -o .next-tf/lambdas/__NEXT_API_LAMBDA_0.zip -d .next-tf/api-lambda >/dev/null 2>&1
echo "Unzipped __NEXT_API_LAMBDA_0.zip"
rm -rf .next-tf/lambdas/__NEXT_API_LAMBDA_0.zip

mv .next-tf/api-lambda ./terraform/main-lambdas/api-lambda

mv ./thumbnails ./terraform/main-lambdas/api-lambda/thumbnails
mv ./fonts ./terraform/main-lambdas/api-lambda/fonts

rm ./terraform/main-lambdas/api-lambda/now__bridge.js
cp ./cloud-functions/main/now__bridge.js ./terraform/main-lambdas/api-lambda/now__bridge.js

TEXT="console.error"
TEXTR="// console.error"
TEXT1="\"Failed to find matching page for\""
TEXTR1="// \"Failed to find matching page for\""
TEXT2="// console.error('Unhandled error during request:', err)"
TEXTR2="console.error('pages in lambda', Object.keys(pages))"
NUM=`grep -n "\"Failed to find matching page for\"" ./terraform/main-lambdas/api-lambda/now__launcher.js | cut -d : -f 1`
NUM=$((NUM+1))
sed -i "s@$TEXT@$TEXTR@" ./terraform/main-lambdas/api-lambda/now__launcher.js
sed -i "s@$TEXT1@$TEXTR1@g" ./terraform/main-lambdas/api-lambda/now__launcher.js
sed -i "s@$TEXT2@$TEXTR2@g" ./terraform/main-lambdas/api-lambda/now__launcher.js
sed -i ""$NUM"s@)@// )@" ./terraform/main-lambdas/api-lambda/now__launcher.js
sed -i "s@500@404@" ./terraform/main-lambdas/api-lambda/now__launcher.js
sed -i "s@internal server error@page not found@" ./terraform/main-lambdas/api-lambda/now__launcher.js

cd ./terraform/main-lambdas/api-lambda
zip -r ../api-lambda.zip . >/dev/null 2>&1
echo "Zipped api-lambda.zip"
cd ../../../
aws --endpoint-url=https://storage.yandexcloud.net s3 cp ./terraform/main-lambdas/api-lambda.zip s3://daily-service/main-lambdas/api-lambda.zip >/dev/null 2>&1
echo "Uploaded api-lambda.zip"
    EOT
  }
}


resource "null_resource" "build_pages" {
    depends_on = [null_resource.build]
    triggers   = {
        build_number = timestamp()
    }
    provisioner "local-exec" {

        command = <<-EOT
cd ${path.root}/../

unzip -o .next-tf/lambdas/__NEXT_PAGE_LAMBDA_0.zip -d .next-tf/pages-lambda >/dev/null 2>&1
echo "Unzipped __NEXT_PAGE_LAMBDA_0.zip"
rm -rf .next-tf/lambdas/__NEXT_PAGE_LAMBDA_0.zip

mv .next-tf/pages-lambda ./terraform/main-lambdas/pages-lambda

rm ./terraform/main-lambdas/pages-lambda/now__bridge.js
cp ./cloud-functions/main/now__bridge.js ./terraform/main-lambdas/pages-lambda/now__bridge.js

TEXT="console.error"
TEXTR="// console.error"
TEXT1="\"Failed to find matching page for\""
TEXTR1="// \"Failed to find matching page for\""
TEXT2="// console.error('Unhandled error during request:', err)"
TEXTR2="console.error('pages in lambda', Object.keys(pages))"
NUM=`grep -n "\"Failed to find matching page for\"" ./terraform/main-lambdas/pages-lambda/now__launcher.js | cut -d : -f 1`
NUM=$((NUM+1))
sed -i "s@$TEXT@$TEXTR@" ./terraform/main-lambdas/pages-lambda/now__launcher.js
sed -i "s@$TEXT1@$TEXTR1@g" ./terraform/main-lambdas/pages-lambda/now__launcher.js
sed -i "s@$TEXT2@$TEXTR2@g" ./terraform/main-lambdas/pages-lambda/now__launcher.js
sed -i ""$NUM"s@)@// )@" ./terraform/main-lambdas/pages-lambda/now__launcher.js
sed -i "s@500@404@" ./terraform/main-lambdas/pages-lambda/now__launcher.js
sed -i "s@internal server error@page not found@" ./terraform/main-lambdas/pages-lambda/now__launcher.js

cd ./terraform/main-lambdas/pages-lambda
zip -r ../pages-lambda.zip . >/dev/null 2>&1
echo "Zipped pages-lambda.zip"
cd ../../../
aws --endpoint-url=https://storage.yandexcloud.net s3 cp ./terraform/main-lambdas/pages-lambda.zip s3://daily-service/main-lambdas/pages-lambda.zip >/dev/null 2>&1
echo "Uploaded pages-lambda.zip"
        EOT
    }

}
#access_key = yandex_iam_service_account_static_access_key.sa-static-key.access_key
#secret_key = yandex_iam_service_account_static_access_key.sa-static-key.secret_key

resource "null_resource" "set_domain" {
  depends_on = [yandex_api_gateway.daily-mephi-gateway]
    triggers = {
        build_number = yandex_api_gateway.daily-mephi-gateway.id
    }
    provisioner "local-exec" {
        command = "yc serverless api-gateway add-domain ${yandex_api_gateway.daily-mephi-gateway.id} --domain-id ${var.DOMAIN_ID}"
    }
}

#resource "null_resource" "add_domain" {
#  depends_on = [yandex_api_gateway.daily-mephi-gateway]
#  triggers = {
#    build_number = yandex_api_gateway.daily-mephi-gateway.id
#  }
#  provisioner "local-exec" {
#    command     = <<-EOT
#    yc serverless api-gateway add-domain --id ${yandex_api_gateway.daily-mephi-gateway.id} --certificate-id fpqnqevnths37vkvhhqn
#    EOT
#  }
#}

#data "archive_file" "zip_main" {
#  depends_on = [null_resource.build]
#  type        = "zip"
#  source_dir = "./main-lambda/"
#  output_path = "main-lambda.zip"
##  excludes = fileset(path.module, "main-lambda/api/v1/**/*")
#}

#resource "yandex_storage_object" "static-object" {
#  depends_on = [data.archive_file.zip_main]
#
#  bucket = yandex_storage_bucket.public.bucket
#  key    = "static/${each.value}"
#  source = "daily-mephi-terraform/${each.value}"
#
##  etag         = filesha256("${path.root}/static/${each.value}")
#  content_type = lookup(local.mime_types, regex("\\.[^.]+$", each.value), null)
#}

#data "local_file" "input" {
#  depends_on = [null_resource.build]
#  filename = "main-lambda.zip"
#}

data "external" "zip_main_pages" {
  depends_on = [null_resource.build_pages]
  program = ["./hash.sh", "main-lambdas/pages-lambda.zip"]
}

data "external" "zip_main_api" {
  depends_on = [null_resource.build_api]
  program = ["./hash.sh", "main-lambdas/api-lambda.zip"]
}

resource "yandex_function" "backend_api" {
  depends_on        = [null_resource.build_api, data.external.zip_main_api]
  name              = "daily-mephi-backend-api"
  description       = "daily-mephi-backend-api"
  user_hash         = data.external.zip_main_api.result.sha256
  runtime           = "nodejs16"
  entrypoint        = "now__launcher.launcher"
  memory            = "1024"
  execution_timeout = "10"
  package {
    sha_256     = data.external.zip_main_api.result.sha256
    bucket_name = "daily-service"
    object_name = "main-lambdas/api-lambda.zip"
  }
  environment = {"FONTCONFIG_PATH" = "/function/code/fonts/"}
}

resource "yandex_function" "backend_pages" {
  depends_on        = [null_resource.build_pages, data.external.zip_main_pages]
  name              = "daily-mephi-backend-pages"
  description       = "daily-mephi-backend-pages"
  user_hash         = data.external.zip_main_pages.result.sha256
  runtime           = "nodejs16"
  entrypoint        = "now__launcher.launcher"
  memory            = "256"
  execution_timeout = "5"
  package {
    sha_256     = data.external.zip_main_pages.result.sha256
    bucket_name = "daily-service"
    object_name = "main-lambdas/pages-lambda.zip"
  }
}

resource "yandex_function_iam_binding" "backend_api" {
  function_id = yandex_function.backend_api.id
  role        = "serverless.functions.invoker"
  members     = ["system:allUsers"]
}

resource "yandex_function_iam_binding" "backend_pages" {
  function_id = yandex_function.backend_pages.id
  role        = "serverless.functions.invoker"
  members     = ["system:allUsers"]
}

data "external" "pages_hash" {
  depends_on = [null_resource.build]
  program = ["./find_hash.sh"]
}

data "template_file" "api_gateway" {
  template = file("${path.module}/yandex-gateway.yaml")
  vars = {
    service_account_id = yandex_iam_service_account.sa.id
    api_function_id = yandex_function.backend_api.id
    pages_function_id = yandex_function.backend_pages.id
    bucket_name = yandex_storage_bucket.public.bucket
    hash = data.external.pages_hash.result.pages_hash
  }
}

resource "yandex_api_gateway" "daily-mephi-gateway" {
  name = "daily-mephi"
  description = "Daily mephi gateway"
  spec = data.template_file.api_gateway.rendered
}

