variable "token" {
  type     = string
  nullable = false
}

variable "cloud_id" {
  type     = string
  nullable = false
}

variable "folder_id" {
  type     = string
  nullable = false
}

variable "zone" {
  type     = string
  nullable = false
}

variable "s3_access_key" {
  type     = string
  nullable = false
}

variable "s3_secret_key" {
  type     = string
  nullable = false
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
    access_key = var.s3_access_key
    secret_key = var.s3_secret_key

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


resource "yandex_iam_service_account" "sa" {
  folder_id = var.folder_id
  name      = "tf-test-sa"
}

// Grant permissions
resource "yandex_resourcemanager_folder_iam_member" "sa-editor" {
  folder_id = var.folder_id
  role      = "admin"
  member    = "serviceAccount:${yandex_iam_service_account.sa.id}"
}

resource "yandex_resourcemanager_folder_iam_member" "sa-editor" {
  folder_id = var.folder_id
  role      = "storage.editor"
  member    = "serviceAccount:${yandex_iam_service_account.sa.id}"
}

// Create Static Access Keys
resource "yandex_iam_service_account_static_access_key" "sa-static-key" {
  service_account_id = yandex_iam_service_account.sa.id
  description        = "static access key for object storage"
}

// Use keys to create bucket
resource "yandex_storage_bucket" "public" {
  access_key = yandex_iam_service_account_static_access_key.sa-static-key.access_key
  secret_key = yandex_iam_service_account_static_access_key.sa-static-key.secret_key
  acl    = "public-read"

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "POST", "PUT", "DELETE", "HEAD"]
    allowed_origins = ["https://login.mephi.ru", "https://daily-mephi.ru"]
    expose_headers  = ["ETag"]
    max_age_seconds = 0
  }

  versioning {
    enabled = true
  }

  bucket = "public-bucket"
}

resource "null_resource" "upload" {
  depends_on = [yandex_storage_bucket.public]
  triggers = {
    user_hash = filesha256("${path.root}/main-lambda.zip")
  }
  provisioner "local-exec" {
    command = <<EOT
    aws --endpoint-url=https://storage.yandexcloud.net s3 rm s3://public-bucket/static --recursive &&
    aws --endpoint-url=https://storage.yandexcloud.net s3 cp --recursive ${path.root}/static/ s3://public-bucket/static"
    EOT
  }
}

#resource "yandex_storage_object" "static-object" {
#  for_each = fileset("${path.root}/static", "**/*")
#
#  bucket = "public-bucket"
#  key    = each.value
#  source = "${path.root}/static/${each.value}"
#
#  etag         = filesha256("${path.root}/static/${each.value}")
#  content_type = lookup(local.mime_types, regex("\\.[^.]+$", each.value), null)
#}

#content_type = lookup(local.mime_types, regex("\\.[^.]+$", "index.html"), null)

resource "yandex_storage_object" "static-object" {
  for_each = fileset("${path.root}/static", "**/*")

  bucket = "public-bucket"
  key    = each.value
  source = "${path.root}/static/${each.value}"

  etag         = filesha256("${path.root}/static/${each.value}")
  content_type = lookup(local.mime_types, regex("\\.[^.]+$", each.value), null)
}

resource "yandex_function" "backend" {
  name               = "daily-mephi-backend"
  description        = "daily-mephi-backend"
  user_hash          = filesha256("${path.root}/main-lambda.zip")
  runtime            = "nodejs16"
  entrypoint         = "lambda.handler"
  memory             = "256"
  execution_timeout  = "10"
  content {
    zip_filename   = "${path.root}/main-lambda.zip"
  }
}

resource "null_resource" "upload" {
  depends_on = [yandex_storage_bucket.public]
  provisioner "local-exec" {
    command = <<EOT
    aws --endpoint-url=https://storage.yandexcloud.net s3 rm s3://public-bucket/static --recursive &&
    aws --endpoint-url=https://storage.yandexcloud.net s3 cp --recursive ./.vercel/static/ s3://public-bucket/static"
    EOT
  }
}

#output "yandex_function_test-function" {
#  value = yandex_function.backend.id
#}

resource "yandex_api_gateway" "daily-mephi-gateway" {
  name = "daily-mephi"
  description = "Daily mephi gateway"
  spec = file("${path.module}/yandex-gateway.yaml")
}

