#!/bin/sh
cat <<EOF
{
  "sha256": "$(find ${1:-.} -type f | xargs cat | sha256sum | awk '{print $1}')"
}
EOF
#echo "{ \"hash\": \"$(cat "$ZIP_PATH" | shasum -a 256 | cut -d " " -f 1 | xxd -r -p | base64)\" }"
