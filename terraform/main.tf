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

variable "DATABASE_URL" {
  type     = string
  nullable = false
  sensitive = true
}

variable "LOCAL" {
  type     = string
  nullable = false
  sensitive = true
}

variable "NEXTAUTH_SECRET" {
  type     = string
  nullable = false
  sensitive = true
}

variable "HASH_SECRET" {
  type     = string
  nullable = false
  sensitive = true
}

variable "HASH_SALT" {
  type     = string
  nullable = false
  sensitive = true
}

variable "HASH_MEMORY_COST" {
  type     = string
  nullable = false
  sensitive = true
}

variable "HASH_TYPE" {
  type     = string
  nullable = false
  sensitive = true
}

variable "HASH_TIME_COST" {
  type     = string
  nullable = false
  sensitive = true
}

variable "HASH_PARALLELISM" {
  type     = string
  nullable = false
  sensitive = true
}

variable "AES_NONCE" {
  type     = string
  nullable = false
  sensitive = true
}

variable "AES_KEY256" {
  type     = string
  nullable = false
  sensitive = true
}

variable "NEXTAUTH_URL" {
  type     = string
  nullable = false
  sensitive = true
}

variable "JWT_PRIVATE" {
  type     = string
  nullable = false
  sensitive = true
}

variable "NOTION_TOKEN" {
  type     = string
  nullable = false
  sensitive = true
}

variable "NOTION_PRIVATE_PAGE" {
  type     = string
  nullable = false
  sensitive = true
}

variable "NOTION_TOKEN_V2" {
  type     = string
  nullable = false
  sensitive = true
}

variable "NOTION_EMAIL" {
  type     = string
  nullable = false
  sensitive = true
}

variable "NOTION_PASSWORD" {
  type     = string
  nullable = false
  sensitive = true
}

variable "RECAPTCHA_SECRET" {
  type     = string
  nullable = false
  sensitive = true
}

variable "RECAPTCHA_PUBLIC" {
  type     = string
  nullable = false
  sensitive = true
}

variable "DATABASE_KEY" {
  type     = string
  nullable = false
  sensitive = true
}

variable "VERCEL_TOKEN" {
  type     = string
  nullable = false
  sensitive = true
}

variable "certificate_id" {
  type     = string
  nullable = false
  sensitive = true
}

variable "DOMAIN_ID" {
  type     = string
  nullable = false
  sensitive = true
}

variable "GOOGLE_API_KEY" {
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
    allowed_origins = ["https://login.mephi.ru", "https://daily-mephi.ru"]
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
  for_each = toset( [for i in range(1, 7) : tostring(i)] )
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
  notion_ids = [for k, v in yandex_function.notion: v.id]
}

resource "yandex_function_iam_binding" "notion" {
  for_each = yandex_function.notion
  function_id = each.value.id
  role        = "serverless.functions.invoker"
  members     = ["system:allUsers"]
}



resource "local_file" "environment_vars" {
  content  = <<EOF
DATABASE_URL="${var.DATABASE_URL}"

LOCAL = "${var.LOCAL}"

NEXTAUTH_SECRET="${var.NEXTAUTH_SECRET}"

HASH_SECRET="${var.HASH_SECRET}"
HASH_SALT="${var.HASH_SALT}"
HASH_MEMORY_COST="${var.HASH_MEMORY_COST}"
HASH_TYPE="${var.HASH_TYPE}"
HASH_TIME_COST="${var.HASH_TIME_COST}"
HASH_PARALLELISM="${var.HASH_PARALLELISM}"



AES_NONCE="${var.AES_NONCE}"
AES_KEY256="${var.AES_KEY256}"
NEXTAUTH_URL="${var.NEXTAUTH_URL}"

JWT_PRIVATE="${var.JWT_PRIVATE}"

NOTION_YC_IDS="${join(";", local.notion_ids)}"

NOTION_TOKEN="${var.NOTION_TOKEN}"

NOTION_PRIVATE_PAGE="${var.NOTION_PRIVATE_PAGE}"
NOTION_TOKEN_V2="${var.NOTION_TOKEN_V2}"

NOTION_EMAIL="${var.NOTION_EMAIL}"
NOTION_PASSWORD="${var.NOTION_PASSWORD}"

RECAPTCHA_SECRET="${var.RECAPTCHA_SECRET}"
RECAPTCHA_PUBLIC="${var.RECAPTCHA_PUBLIC}"

DATABASE_KEY="${var.DATABASE_KEY}"

GOOGLE_API_KEY="${var.GOOGLE_API_KEY}"
EOF
  filename = "${path.module}/../.env"
}

resource "null_resource" "build" {
  depends_on = [yandex_storage_bucket.public, local_file.environment_vars, yandex_function_iam_binding.notion]
  triggers = {
    build_number = timestamp()
  }
  provisioner "local-exec" {
#    interpreter = ["PowerShell", "-Command"]
    #rm -rf ./terraform/main-lambda/api/v1
    command = <<-EOT
cd ${path.root}/../
vercel pull --yes --environment=preview --token=${var.VERCEL_TOKEN}
vercel build --token=${var.VERCEL_TOKEN}
rm -rf ./terraform/static ./terraform/main-lambda
cp -R ./cloud-functions/main ./terraform/main-lambda
mv ./.vercel/output/static ./terraform/static
mv ./.vercel/output/functions/api ./terraform/main-lambda/api

yarn --cwd ./terraform/main-lambda install
rm -rf ./terraform/main-lambda/api/v1
cd ./terraform/main-lambda/ && zip -r ./../main-lambda.zip . > /dev/null 2>&1
cd ./../../
aws --endpoint-url=https://storage.yandexcloud.net s3 rm s3://${yandex_storage_bucket.public.bucket}/static --recursive
aws --endpoint-url=https://storage.yandexcloud.net s3 cp --recursive ./terraform/static/ s3://${yandex_storage_bucket.public.bucket}/static
aws --endpoint-url=https://storage.yandexcloud.net s3 cp ./terraform/main-lambda.zip s3://daily-service/main-lambda.zip
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

data "external" "zip_main" {
  depends_on = [null_resource.build]
  program = ["./hash.sh", "main-lambda.zip"]
}

resource "yandex_function" "backend" {
  depends_on        = [null_resource.build, data.external.zip_main]
  name              = "daily-mephi-backend"
  description       = "daily-mephi-backend"
  user_hash         = data.external.zip_main.result.sha256
  runtime           = "nodejs16"
  entrypoint        = "lambda.handler"
  memory            = "1024"
  execution_timeout = "10"
  package {
    sha_256     = data.external.zip_main.result.sha256
    bucket_name = "daily-service"
    object_name = "main-lambda.zip"
  }
  environment = {"FONTCONFIG_PATH" = "/function/code/fonts/"}
}

resource "yandex_function_iam_binding" "backend" {
  function_id = yandex_function.backend.id
  role        = "serverless.functions.invoker"
  members     = ["system:allUsers"]
}

data "template_file" "api_gateway" {
  template = file("${path.module}/yandex-gateway.yaml")
  vars = {
    service_account_id = yandex_iam_service_account.sa.id
    function_id = yandex_function.backend.id
    bucket_name = yandex_storage_bucket.public.bucket
  }
}

resource "yandex_api_gateway" "daily-mephi-gateway" {
  name = "daily-mephi"
  description = "Daily mephi gateway"
  spec = data.template_file.api_gateway.rendered
}

