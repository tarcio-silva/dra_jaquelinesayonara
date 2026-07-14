# Reorganização da Estrutura do Projeto

> **Data:** 2026-07-14  
> **Status:** Pendente  
> **Impacto em produção:** Nenhum (apenas reorganização de arquivos internos + remoção de assets não utilizados)

---

## Motivação

A raiz do projeto acumula 7+ documentos `.md` que dificultam a navegação, possui arquivos legados sem utilização (API, imagens, CSS vazio), e um `.gitignore` genérico de 100+ linhas para frameworks não utilizados. A reorganização visa:

1. Raiz limpa com apenas arquivos operacionais
2. Documentação centralizada em `docs/`
3. Remoção de código/assets mortos
4. `.gitignore` enxuto e relevante

---

## Estrutura Atual (ANTES)

```
repo_site/
├── index.html
├── robots.txt
├── sitemap.xml
├── vercel.json
├── package.json
├── package-lock.json
├── build-css.sh
├── .gitignore                              ← 100+ linhas, template genérico
├── google962378b089d1b19d.html
│
├── README.md                               ← Raiz (manter)
├── README_STATIC.md                        ← Raiz (redundante)
├── OPTIMIZATION_GUIDE.md                   ← Raiz
├── MULTIPAGE_STRATEGY.md                   ← Raiz
├── DOMAIN_SETUP.md                         ← Raiz
├── DESIGN_GUIDE.md                         ← Raiz
├── REFACTORING_GUIDE.md                    ← Raiz
├── IMPLEMENTATION_PLAN.md                  ← Raiz
├── TEST_PLAN.md                            ← Raiz
│
├── api/                                    ← LEGADO (não utilizado)
│   └── get-reviews.js
│
├── docs/
│   └── adr/
│       └── 001-escolha-de-tecnologia-multipage.md
│
├── assets/
│   ├── css/
│   │   ├── styles.css
│   │   ├── styles.min.css
│   │   ├── globalStyle.css
│   │   ├── dark-theme.css
│   │   ├── about.css
│   │   ├── cards.css
│   │   ├── results.css
│   │   ├── plans.css
│   │   ├── rating.css
│   │   ├── cta-final.css
│   │   ├── location.css
│   │   ├── footer.css
│   │   └── header/
│   │       ├── header.css
│   │       ├── hamburger.css
│   │       ├── offcanva.css
│   │       ├── switch-button.css
│   │       └── accsessebility-buttons.css  ← VAZIO (só comentário) + typo no nome
│   ├── js/
│   │   └── main.js
│   ├── img/
│   │   ├── favicon.webp
│   │   ├── logo_js_2026.webp
│   │   ├── video-placeholder-1024x576.jpg  ← NÃO USADO (bloco HTML comentado)
│   │   ├── about/
│   │   │   ├── dra-jaqueline-sayonara-sobre.webp  ✓ usado
│   │   │   └── photos.webp                        ← NÃO USADO
│   │   ├── care/                                   ✓ todos usados
│   │   ├── header/main-banner/                     ✓ usado
│   │   ├── icons/
│   │   │   ├── home.png                            ✓ usado (offcanva)
│   │   │   ├── about.png                           ✓ usado (offcanva)
│   │   │   ├── care.png                            ✓ usado (offcanva)
│   │   │   ├── result.png                          ✓ usado (offcanva)
│   │   │   ├── location.png                        ✓ usado (offcanva)
│   │   │   ├── high-contrast.png                   ← NÃO USADO
│   │   │   └── company.png                         ← NÃO USADO
│   │   ├── plans/                                  ✓ todos usados
│   │   └── results/
│   │       ├── clareamento.webp                    ✓ usado
│   │       ├── clareamentoII.webp                  ✓ usado
│   │       ├── clareamentoIII.webp                 ← NÃO USADO
│   │       ├── facetas.webp                        ✓ usado
│   │       ├── facetasII.webp                      ✓ usado
│   │       ├── facetasIII.webp                     ← NÃO USADO
│   │       ├── facetasIII (2).webp                 ← NÃO USADO + espaço no nome
│   │       ├── restauracao.webp                    ✓ usado
│   │       ├── proteseII.webp                      ✓ usado
│   │       └── limpeza.webp                        ← NÃO USADO
│   ├── font/
│   │   ├── Manrope-VariableFont_wght.woff2
│   │   └── Manrope-VariableFont_wght.ttf
│   └── media/
│       └── location.mp4
```

---

## Estrutura Proposta (DEPOIS)

```
repo_site/
├── index.html                              # Página principal
├── robots.txt                              # SEO crawl rules
├── sitemap.xml                             # SEO sitemap
├── vercel.json                             # Deploy: redirects + cache
├── package.json                            # Dependências
├── package-lock.json                       # Lock file
├── build-css.sh                            # Build: CSS bundle
├── .gitignore                              # Simplificado (~25 linhas)
├── google962378b089d1b19d.html             # Google Search Console verification
├── README.md                               # README principal (atualizado)
│
├── docs/                                   # Toda documentação centralizada
│   ├── adr/
│   │   └── 001-escolha-de-tecnologia-multipage.md
│   ├── RESTRUCTURE.md                      # Este documento
│   ├── IMPLEMENTATION_PLAN.md
│   ├── TEST_PLAN.md
│   ├── MULTIPAGE_STRATEGY.md
│   ├── OPTIMIZATION_GUIDE.md
│   ├── DOMAIN_SETUP.md
│   ├── DESIGN_GUIDE.md
│   └── REFACTORING_GUIDE.md
│
├── assets/
│   ├── css/
│   │   ├── styles.css                      # Entry point (import removido)
│   │   ├── styles.min.css                  # Build output
│   │   ├── globalStyle.css
│   │   ├── dark-theme.css
│   │   ├── about.css
│   │   ├── cards.css
│   │   ├── results.css
│   │   ├── plans.css
│   │   ├── rating.css
│   │   ├── cta-final.css
│   │   ├── location.css
│   │   ├── footer.css
│   │   └── header/
│   │       ├── header.css
│   │       ├── hamburger.css
│   │       ├── offcanva.css
│   │       └── switch-button.css
│   ├── js/
│   │   └── main.js
│   ├── img/
│   │   ├── favicon.webp
│   │   ├── logo_js_2026.webp
│   │   ├── about/
│   │   │   └── dra-jaqueline-sayonara-sobre.webp
│   │   ├── care/
│   │   │   ├── aparelho.webp
│   │   │   ├── clareamento.webp
│   │   │   ├── exodontia.webp
│   │   │   ├── facetas.webp
│   │   │   ├── profilaxia.webp
│   │   │   ├── protose.webp
│   │   │   └── restauracao.webp
│   │   ├── header/main-banner/
│   │   │   └── dra-jaqueline-sayonara-dentista-sape.webp
│   │   ├── icons/
│   │   │   ├── home.png
│   │   │   ├── about.png
│   │   │   ├── care.png
│   │   │   ├── result.png
│   │   │   └── location.png
│   │   ├── plans/
│   │   │   ├── logo-clin.png
│   │   │   └── logo-unidentis.webp
│   │   └── results/
│   │       ├── clareamento.webp
│   │       ├── clareamentoII.webp
│   │       ├── facetas.webp
│   │       ├── facetasII.webp
│   │       ├── restauracao.webp
│   │       └── proteseII.webp
│   ├── font/
│   │   ├── Manrope-VariableFont_wght.woff2
│   │   └── Manrope-VariableFont_wght.ttf
│   └── media/
│       └── location.mp4
│
└── tratamentos/                            # (futuro — multipage)
```

---

## Mapeamento de Ações

### 1. Mover documentação para `docs/`

| Arquivo (antes) | Destino (depois) |
|-----------------|------------------|
| `OPTIMIZATION_GUIDE.md` | `docs/OPTIMIZATION_GUIDE.md` |
| `MULTIPAGE_STRATEGY.md` | `docs/MULTIPAGE_STRATEGY.md` |
| `DOMAIN_SETUP.md` | `docs/DOMAIN_SETUP.md` |
| `DESIGN_GUIDE.md` | `docs/DESIGN_GUIDE.md` |
| `REFACTORING_GUIDE.md` | `docs/REFACTORING_GUIDE.md` |
| `IMPLEMENTATION_PLAN.md` | `docs/IMPLEMENTATION_PLAN.md` |
| `TEST_PLAN.md` | `docs/TEST_PLAN.md` |

**README_STATIC.md** → Conteúdo relevante incorporado no README.md, arquivo removido.

### 2. Remover arquivos legados

| Arquivo | Motivo da remoção |
|---------|-------------------|
| `api/get-reviews.js` | Serverless function nunca usada (reviews são estáticas no HTML) |
| `api/` (diretório) | Fica vazio após remoção do arquivo |
| `assets/css/header/accsessebility-buttons.css` | Conteúdo é apenas um comentário CSS (60 bytes); nome tem typo |

### 3. Remover imagens não utilizadas

| Arquivo | Motivo |
|---------|--------|
| `assets/img/video-placeholder-1024x576.jpg` | Referenciado apenas em bloco HTML comentado |
| `assets/img/about/photos.webp` | Não referenciado em nenhum lugar |
| `assets/img/results/clareamentoIII.webp` | Não referenciado no HTML |
| `assets/img/results/facetasIII.webp` | Não referenciado no HTML |
| `assets/img/results/facetasIII (2).webp` | Não referenciado + espaço no nome (inválido para URL) |
| `assets/img/results/limpeza.webp` | Não referenciado no HTML |
| `assets/img/icons/high-contrast.png` | Não referenciado em nenhum lugar |
| `assets/img/icons/company.png` | Não referenciado em nenhum lugar |

**Espaço liberado:** ~297 KB em imagens não utilizadas

### 4. Atualizar `styles.css`

Remover a linha de import do arquivo CSS vazio:

```css
/* REMOVER esta linha: */
@import "./header/accsessebility-buttons.css";
```

### 5. Simplificar `.gitignore`

**Antes:** 100+ linhas com templates de frameworks não utilizados (Gatsby, Nuxt, Next.js, Svelte, Vue, Firebase, etc.)

**Depois:** ~25 linhas relevantes ao projeto real:

```gitignore
# Dependencies
node_modules/

# Build output
assets/css/styles.min.css

# Environment
.env
.env.*
!.env.example

# OS
.DS_Store
Thumbs.db

# Editor
.vscode/
.idea/
*.swp
*.swo

# Logs
*.log
npm-debug.log*

# Coverage (futuro)
coverage/
.nyc_output/
```

### 6. Atualizar README.md

- Atualizar a seção "Estrutura de Arquivos" com a nova árvore
- Atualizar links para documentação (`./docs/OPTIMIZATION_GUIDE.md`, etc.)
- Incorporar informações relevantes do README_STATIC.md (se houver algo não duplicado)
- Remover menção ao `api/`

### 7. Remover bloco HTML comentado

No `index.html`, remover o bloco comentado da seção "Company images" (linhas 422-435 aprox.) que referencia `video-placeholder` e um carousel owl nunca implementado.

---

## Impacto e Riscos

| Ação | Impacto em produção | Risco |
|------|---------------------|-------|
| Mover .md para docs/ | Nenhum | Zero — docs não são servidos |
| Remover api/ | Nenhum | Zero — não é chamada por nada |
| Remover CSS vazio | Nenhum | Zero — arquivo sem conteúdo funcional |
| Remover imagens não usadas | Nenhum | Baixo — verificar se algum CSS background as usa |
| Simplificar .gitignore | Nenhum | Zero — apenas limpeza |
| Atualizar README | Nenhum | Zero — documentação |
| Remover HTML comentado | Nenhum | Zero — código morto |

### Validações pós-implementação

- [ ] `build-css.sh` roda sem erro (importar arquivo removido = falha)
- [ ] `index.html` não referencia nenhum arquivo removido
- [ ] Nenhum CSS referencia imagens removidas
- [ ] Links internos da documentação funcionam
- [ ] Git status mostra apenas as mudanças esperadas

---

## Ordem de Execução

1. Mover documentos para `docs/`
2. Remover `api/` (diretório completo)
3. Remover `accsessebility-buttons.css` + atualizar `styles.css`
4. Remover imagens não utilizadas
5. Remover bloco HTML comentado no `index.html`
6. Substituir `.gitignore`
7. Atualizar `README.md`
8. Rodar `build-css.sh` para validar
9. Verificar referências

---

## Rollback

Todas as alterações são reversíveis via `git checkout -- .` antes do commit, ou via `git revert` após commit.
