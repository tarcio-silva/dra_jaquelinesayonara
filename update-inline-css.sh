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
CSS_TREATMENT_FILE="$SCRIPT_DIR/assets/css/styles-treatment.min.css"

echo "🔨 Building CSS..."
"$SCRIPT_DIR/build-css.sh"
echo ""

if [ ! -f "$CSS_FILE" ]; then
  echo "❌ Erro: $CSS_FILE não encontrado"
  exit 1
fi

if [ ! -f "$CSS_TREATMENT_FILE" ]; then
  echo "❌ Erro: $CSS_TREATMENT_FILE não encontrado"
  exit 1
fi

CSS_SIZE=$(wc -c < "$CSS_FILE")
CSS_TREATMENT_SIZE=$(wc -c < "$CSS_TREATMENT_FILE")
echo "📦 Bundle home: styles.min.css ($CSS_SIZE bytes)"
echo "📦 Bundle tratamentos: styles-treatment.min.css ($CSS_TREATMENT_SIZE bytes)"
echo ""

# Encontrar todos os HTMLs que possuem <style> inline
HTML_FILES=(
  "$SCRIPT_DIR/index.html"
)

# Adicionar página índice de tratamentos
if [ -f "$SCRIPT_DIR/tratamentos/index.html" ]; then
  HTML_FILES+=("$SCRIPT_DIR/tratamentos/index.html")
fi

# Adicionar páginas de tratamento individuais
for dir in "$SCRIPT_DIR"/tratamentos/*/; do
  if [ -f "${dir}index.html" ]; then
    HTML_FILES+=("${dir}index.html")
  fi
done

# Adicionar listagem do blog
if [ -f "$SCRIPT_DIR/blog/index.html" ]; then
  HTML_FILES+=("$SCRIPT_DIR/blog/index.html")
fi

# Adicionar artigos de blog individuais
for dir in "$SCRIPT_DIR"/blog/*/; do
  if [ -f "${dir}index.html" ]; then
    HTML_FILES+=("${dir}index.html")
  fi
done

# Adicionar páginas de atendimento (cidades)
for dir in "$SCRIPT_DIR"/atendimento/*/; do
  if [ -f "${dir}index.html" ]; then
    HTML_FILES+=("${dir}index.html")
  fi
done

# Adicionar primeira-consulta
if [ -f "$SCRIPT_DIR/primeira-consulta/index.html" ]; then
  HTML_FILES+=("$SCRIPT_DIR/primeira-consulta/index.html")
fi

echo "📝 Atualizando ${#HTML_FILES[@]} arquivo(s)..."
echo ""

# Usar Python para substituição segura (preserva @ e caracteres especiais)
python3 -c "
import re, sys

css_home = sys.argv[1]
css_treatment = sys.argv[2]
html_files = sys.argv[3:]

with open(css_home, 'r') as f:
    css_home_content = f.read().strip()

with open(css_treatment, 'r') as f:
    css_treatment_content = f.read().strip()

for filepath in html_files:
    with open(filepath, 'r') as f:
        content = f.read()

    # Determinar qual bundle usar.
    # Páginas de tratamento, blog, atendimento e primeira-consulta usam o bundle
    # treatment (compartilham .treatment-*, .related-card/.related-grid, .breadcrumb
    # e o header com dropdown). A home usa o bundle próprio.
    is_treatment = ('/tratamentos/' in filepath or '/blog/' in filepath
                    or '/atendimento/' in filepath or '/primeira-consulta/' in filepath)
    css = css_treatment_content if is_treatment else css_home_content
    style_block = '<style>' + css + '</style>'

    new_content = re.sub(r'<style>.*?</style>', style_block, content, flags=re.DOTALL)

    if new_content == content:
        print(f'   ⏭  {filepath} (sem alteração)')
    else:
        with open(filepath, 'w') as f:
            f.write(new_content)
        import os
        size = os.path.getsize(filepath)
        print(f'   ✓  {filepath} ({size:,} bytes)')
" "$CSS_FILE" "$CSS_TREATMENT_FILE" "${HTML_FILES[@]}"

echo ""
echo "✅ Inline CSS atualizado com sucesso!"
