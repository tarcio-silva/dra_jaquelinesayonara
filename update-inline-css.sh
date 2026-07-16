#!/bin/bash
# update-inline-css.sh — Automatiza o inline do CSS em todos os HTMLs
# Uso: ./update-inline-css.sh
#
# 1. Executa o build CSS (LightningCSS)
# 2. Substitui o conteúdo entre <style>...</style> em todos os HTMLs
# 3. Reporta arquivos atualizados e tamanhos

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CSS_FILE="$SCRIPT_DIR/assets/css/styles.min.css"

echo "🔨 Building CSS..."
"$SCRIPT_DIR/build-css.sh"
echo ""

if [ ! -f "$CSS_FILE" ]; then
  echo "❌ Erro: $CSS_FILE não encontrado"
  exit 1
fi

CSS_SIZE=$(wc -c < "$CSS_FILE")
echo "📦 Bundle: styles.min.css ($CSS_SIZE bytes)"
echo ""

# Encontrar todos os HTMLs que possuem <style> inline
HTML_FILES=(
  "$SCRIPT_DIR/index.html"
)

# Adicionar páginas de tratamento
for dir in "$SCRIPT_DIR"/tratamentos/*/; do
  if [ -f "${dir}index.html" ]; then
    HTML_FILES+=("${dir}index.html")
  fi
done

echo "📝 Atualizando ${#HTML_FILES[@]} arquivo(s)..."
echo ""

# Usar Python para substituição segura (preserva @ e caracteres especiais)
python3 -c "
import re, sys

css_file = sys.argv[1]
html_files = sys.argv[2:]

with open(css_file, 'r') as f:
    css = f.read().strip()

style_block = '<style>' + css + '</style>'

for filepath in html_files:
    with open(filepath, 'r') as f:
        content = f.read()

    new_content = re.sub(r'<style>.*?</style>', style_block, content, flags=re.DOTALL)

    if new_content == content:
        print(f'   ⏭  {filepath} (sem alteração)')
    else:
        with open(filepath, 'w') as f:
            f.write(new_content)
        import os
        size = os.path.getsize(filepath)
        print(f'   ✓  {filepath} ({size:,} bytes)')
" "$CSS_FILE" "${HTML_FILES[@]}"

echo ""
echo "✅ Inline CSS atualizado com sucesso!"
