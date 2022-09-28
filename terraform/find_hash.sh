#!/bin/sh


cat <<EOF
{
  "pages_hash": "$(find ../out/_next/data/*/tutors  | head -1 | cut -d/ -f5 | awk '{print $1}')"
}
EOF
#echo "{ \"hash\": \"$(cat "$ZIP_PATH" | shasum -a 256 | cut -d " " -f 1 | xxd -r -p | base64)\" }"
