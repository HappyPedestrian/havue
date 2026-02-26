#!/usr/bin/env sh

set -e

pnpm i --frozen-lockfile

pnpm build:internal

pnpm update:version

pnpm build:lib

pnpm -r publish --access public

echo "✅ Publish completed"
