#!/bin/bash
# Bundla e minifica todos os CSS em styles.min.css via lightningcss
cd "$(dirname "$0")"
npx lightningcss --minify --bundle assets/css/styles.css -o assets/css/styles.min.css
echo "✓ styles.min.css ($(wc -c < assets/css/styles.min.css) bytes)"
