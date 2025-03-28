#!/bin/sh

set -e

pnpm i --frozen-lockfile

pnpm build:internal

pnpm update:version

pnpm build:lib

npm publish -ws --access public

echo "✅ Publish completed"
