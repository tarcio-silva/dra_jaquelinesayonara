#!/bin/bash
# Bundla e minifica CSS via lightningcss
# - styles.min.css: bundle completo (home)
# - styles-treatment.min.css: bundle para páginas de tratamento (tree-shaked)
cd "$(dirname "$0")"
npx lightningcss --minify --bundle assets/css/styles.css -o assets/css/styles.min.css
echo "✓ styles.min.css ($(wc -c < assets/css/styles.min.css) bytes)"
npx lightningcss --minify --bundle assets/css/styles-treatment.css -o assets/css/styles-treatment.min.css
echo "✓ styles-treatment.min.css ($(wc -c < assets/css/styles-treatment.min.css) bytes)"
