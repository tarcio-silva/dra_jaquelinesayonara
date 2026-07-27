# Arquitetura do Projeto

Documentação técnica da arquitetura do site institucional da Dra. Jaqueline Sayonara.

## Stack Tecnológica

| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| HTML5 | — | Estrutura semântica |
| CSS3 | — | Estilização com Custom Properties, Grid, clamp() |
| JavaScript (vanilla) | ES6+ | Lógica do cliente — **zero dependências de runtime** |
| LightningCSS | 1.28.2 | Bundling e minificação CSS |
| Vitest | 2.x | Testes unitários e de integração |
| happy-dom | 15.x | Ambiente DOM para testes |
| Husky | 9.x | Git hooks (pre-commit) |
| lint-staged | 15.x | Linting em arquivos staged |
| Vercel | — | Hospedagem e deploy automático |
| Manrope | Variable | Fonte self-hosted (WOFF2 + TTF fallback) |

**Princípio fundamental:** Zero dependências de runtime. Todo o JavaScript roda sem bundler, sem framework, sem bibliotecas externas. As `devDependencies` existem apenas para build CSS e testes.

---

## Estrutura de Arquivos (Alto Nível)

```
repo_site/
├── index.html                    # Home (CSS inline para performance)
├── primeira-consulta/index.html  # Página "Primeira Consulta"
├── tratamentos/
│   ├── index.html                # Listagem de tratamentos (Schema.org ItemList)
│   ├── _template.html            # Template base com placeholders
│   ├── aparelho-ortodontico/
│   ├── clareamento-dental/
│   ├── exodontia/
│   ├── facetas-dentarias/
│   ├── profilaxia/
│   ├── protese-dentaria/
│   └── restauracao-dentaria/
├── atendimento/                  # SEO local (6 cidades)
│   ├── mari/
│   ├── sobrado/
│   ├── cruz-do-espirito-santo/
│   ├── riachao-do-poco/
│   ├── pilar/
│   └── caldas-brandao/
├── assets/
│   ├── css/                      # Módulos CSS + bundles
│   ├── js/main.js                # Toda a lógica JS
│   ├── img/                      # Imagens organizadas por seção
│   ├── font/                     # Manrope variable (WOFF2 + TTF)
│   └── media/location.mp4       # Vídeo do consultório
├── build-css.sh                  # Script de build CSS
├── vercel.json                   # Config de deploy (redirects + cache)
├── vitest.config.js              # Config de testes
├── sitemap.xml                   # 17 URLs indexáveis
├── robots.txt                    # Crawl rules
├── docs/                         # Documentação
└── tests/                        # Suíte de testes
```

---

## Pipeline de Build

### CSS Build (`build-css.sh`)

O build CSS utiliza o LightningCSS para resolver `@import`, fazer bundling e minificação:

```bash
#!/bin/bash
npx lightningcss --minify --bundle assets/css/styles.css -o assets/css/styles.min.css
npx lightningcss --minify --bundle assets/css/styles-treatment.css -o assets/css/styles-treatment.min.css
```

**Gera dois bundles:**

1. **`styles.min.css`** — Bundle completo (home e páginas gerais)
2. **`styles-treatment.min.css`** — Bundle otimizado para páginas de tratamento (tree-shaked)

**Entry point** (`assets/css/styles.css`):

```css
@import "./dark-theme.css";
@import "./globalStyle.css";
@import "./header/header.css";
@import "./header/hamburger.css";
@import "./header/offcanva.css";
@import "./header/switch-button.css";
@import "./about.css";
@import "./cards.css";
@import "./results.css";
@import "./plans.css";
@import "./rating.css";
@import "./location.css";
@import "./cta-final.css";
@import "./faq.css";
@import "./footer.css";
@import "./treatment.css";
@import "./micro-interactions.css";
@import "./compare-slider.css";
```

### Git Hooks (lint-staged)

O `husky` + `lint-staged` garante que alterações em CSS disparam o rebuild automaticamente no pre-commit:

```json
"lint-staged": {
  "assets/css/**/*.css": "npm run build:css",
  "assets/img/**/*.{webp,png,jpg}": "node scripts/check-image-size.js"
}
```

### Build de Produção (`npm run build`)

Executa `node scripts/build.js` — referenciado no `vercel.json` como `buildCommand`.

---

## Deploy Flow

```
Código → push para main → Vercel detecta → npm run build → Deploy automático
```

### Configuração Vercel (`vercel.json`)

**Redirects 301:**
- `drajaquelinesayonara.vercel.app/*` → `www.drajaquelinesayonara.com.br/*`
- `drajaquelinesayonara.com.br/*` → `www.drajaquelinesayonara.com.br/*` (force www)

**Cache Headers (imutável, 1 ano):**
- `/assets/css/*` — `public, max-age=31536000, immutable`
- `/assets/font/*` — `public, max-age=31536000, immutable`
- `/assets/img/*` — `public, max-age=31536000, immutable`
- `/assets/js/*` — `public, max-age=31536000, immutable`
- `/assets/media/*` — `public, max-age=31536000, immutable`

**Cache para páginas de tratamento:**
- `/tratamentos/*` — `public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400`

---

## Tipos de Página

### 1. Home (`/`)
- CSS inline via `<style>` (critical CSS para LCP)
- JS via `<script defer src="/assets/js/main.js">`
- Todas as seções: hero, sobre, tratamentos, resultados, compare, planos, avaliações, FAQ, CTA, localização

### 2. Tratamentos — Listagem (`/tratamentos/`)
- Grid de cards com Schema.org `ItemList`
- Links para as 7 páginas individuais

### 3. Tratamentos — Individual (`/tratamentos/{slug}/`)
- 7 páginas: aparelho-ortodontico, clareamento-dental, exodontia, facetas-dentarias, profilaxia, protese-dentaria, restauracao-dentaria
- CSS inline (bundle minificado completo no `<style>`)
- Schema.org `MedicalProcedure` + `FAQPage` + `BreadcrumbList`
- Template base: `tratamentos/_template.html` com placeholders `{{...}}`

### 4. Atendimento — SEO Local (`/atendimento/{cidade}/`)
- 6 páginas: mari, sobrado, cruz-do-espirito-santo, riachao-do-poco, pilar, caldas-brandao
- CSS inline (mesmo bundle)
- Schema.org `Dentist` com `areaServed` específico para a cidade
- Conteúdo localizado (distância, keywords regionais)

### 5. Primeira Consulta (`/primeira-consulta/`)
- Página informativa sobre o que esperar na primeira visita
- Mesmo padrão de CSS inline + JS defer

---

## Arquitetura CSS

### Organização Modular

```
assets/css/
├── styles.css              # Entry point (só @imports)
├── styles.min.css          # Bundle minificado (output)
├── styles-treatment.css    # Entry point para tratamentos
├── styles-treatment.min.css # Bundle tratamentos (output)
├── globalStyle.css         # :root vars, reset, tipografia, utilitários
├── dark-theme.css          # .dark-theme overrides de variáveis
├── header/
│   ├── header.css          # Navbar desktop + hero
│   ├── hamburger.css       # Botão hamburger animado
│   ├── offcanva.css        # Menu mobile fullscreen
│   └── switch-button.css   # Toggle dark mode
├── about.css               # Seção Sobre
├── cards.css               # Grid mosaico de tratamentos
├── results.css             # Carousel + lightbox
├── plans.css               # Convênios aceitos
├── rating.css              # Avaliações do Google
├── location.css            # Vídeo + mapa
├── cta-final.css           # CTA final
├── faq.css                 # FAQ accordion
├── footer.css              # Footer multi-coluna
├── treatment.css           # Páginas de tratamento (hero, content, FAQ, related)
├── micro-interactions.css  # Scroll progress + ripple
└── compare-slider.css      # Slider antes/depois
```

### Design Tokens (CSS Custom Properties)

```css
:root {
  font-size: 62.5%;                          /* 1rem = 10px */
  --logo-pallete-petal-rose: #fae7eb;        /* Background suave */
  --logo-pallete-velvety-cherry: #a25356;    /* Primária */
  --logo-pallete-light: #fff;                /* Texto em fundos escuros */
  --color-bg: #fdfbfc;                       /* Background geral */
  --color-surface: #ffffff;                  /* Cards/superfícies */
  --color-text: #2d2d2d;                    /* Texto principal */
  --color-text-muted: #6b4a4c;             /* Texto secundário */
  --color-accent: #a85860;                  /* Hover/destaque */
  --color-success: #25d366;                 /* WhatsApp */
  --shadow-sm/md/lg: ...;                   /* Sombras com matiz cherry */
}
```

### Breakpoints

| Nome | Media Query | Uso |
|------|-------------|-----|
| Mobile | `max-width: 599px` | Grid 2 cols nos cards |
| Tablet | `600px – 1199px` | Grid 3 cols nos cards |
| Desktop | `min-width: 1200px` | Layout split, navbar completa, bento grid 4 cols |

### Estratégia CSS Inline

Todas as páginas usam CSS inline em `<style>` (conteúdo de `styles.min.css` copiado diretamente). Isso elimina a requisição de CSS externo e garante FCP rápido. O trade-off (HTML maior) é compensado pelo cache do HTML via CDN da Vercel.

---

## Arquitetura JavaScript

### Arquivo Único: `assets/js/main.js`

Carregado com `defer` em todas as páginas. Contém módulos separados por comentários:

| Módulo | Linhas | Responsabilidade |
|--------|--------|------------------|
| Menu Offcanva | ~120 | Toggle, focus trap, backdrop, swipe, edge swipe, inert, aria-live |
| Active Section | ~15 | IntersectionObserver (`threshold: 0.3`), classe `.active` nos links |
| Fade-in | ~10 | IntersectionObserver (`threshold: 0.05`), classe `.visible`, unobserve |
| Lightbox | ~80 | Open/close, keyboard (Escape, setas), focus trap, swipe mobile, prev/next |
| Filtros de Resultados | ~20 | Botões `.filter-btn`, filtra `.result-item` por `data-category` |
| Carousel | ~100 | scroll-snap, autoplay 4s, pause on interaction, dots, prev/next |
| Dark Mode | ~40 | Toggle sincronizado (desktop/mobile/nav), localStorage, aria-checked |
| Reduced Motion | ~5 | Pausa vídeos com `autoplay`, respeita `prefers-reduced-motion` |
| Lazy Video | ~20 | IntersectionObserver para `<source data-src>`, carrega quando visível |
| Compare Slider | ~40 | IIFE, range input + pointer events para drag |
| Scroll Progress | ~15 | IIFE, `scroll` event → atualiza `width` de `.scroll-progress` |
| Ripple Effect | ~15 | IIFE, delegação de evento em `.btn-cta`, cria `<span class="ripple">` |

### Funções Principais

| Função | Descrição |
|--------|-----------|
| `toggleNav()` | Abre/fecha offcanva, gerencia classes, ARIA, inert, focus |
| `trapFocusInOffcanva(e)` | Focus trap circular (Tab/Shift+Tab) |
| `toggleDarkMode(source)` | Alterna tema, sincroniza toggles, persiste em localStorage |
| `openLightbox(index)` | Abre modal com imagem no index fornecido |
| `closeLightbox()` | Fecha modal, restaura foco e overflow |
| `navigate(direction)` | Navega entre imagens no lightbox (+1 ou -1) |
| `updateLightboxImage()` | Atualiza src, alt, counter e CTA contextual |
| `getVisibleItems()` | Retorna result-items não ocultos pelo filtro |
| `updateCarouselDots()` | Recalcula e renderiza dots de paginação |
| `updateCarouselState()` | Atualiza disabled nos arrows e dot ativo |
| `scrollToPage(page)` | Scroll suave para uma página específica do carousel |
| `startAutoplay()` / `stopAutoplay()` | Controle do autoplay do carousel |
| `initCompareSliders()` | IIFE — inicializa sliders de comparação |
| `initScrollProgress()` | IIFE — barra de progresso no topo |
| `initRipple()` | IIFE — ripple effect nos botões CTA |

### Por que Sem Bundler?

- Arquivo único < 15KB — não justifica overhead de bundler
- Zero dependências — nada para resolver
- `defer` no `<script>` é suficiente para não bloquear parsing
- Cache imutável de 1 ano via Vercel

---

## Estratégia de Performance

### Critical CSS (LCP)

- CSS completo inline em `<style>` no `<head>` de cada página
- Elimina requisição bloqueante de CSS externo
- FCP e LCP chegam sem esperar download de stylesheet

### Cache Imutável

Headers via `vercel.json`:
```
Cache-Control: public, max-age=31536000, immutable
```
- Aplicado a: `/assets/css/`, `/assets/font/`, `/assets/img/`, `/assets/js/`, `/assets/media/`
- Assets nunca expiram na cache do browser (versionamento via nome de arquivo se necessário)

### Lazy Loading

- **Imagens:** `loading="lazy"` em todas as imagens abaixo do fold
- **Vídeo:** `<source data-src="...">` com IntersectionObserver (`rootMargin: 200px`) que carrega quando próximo do viewport
- **Fonte:** `font-display: swap` — texto visível imediatamente com fallback

### Preload Crítico

```html
<link rel="preload" href="/assets/font/Manrope-VariableFont_wght.woff2" as="font" type="font/woff2" crossorigin>
```

### Reduced Motion

CSS e JS respeitam `prefers-reduced-motion: reduce`:
- CSS: desabilita todas as animações/transições
- JS: pausa vídeos autoplay, desabilita scroll progress bar e ripple effect

### Resultados Lighthouse

| Métrica | Score |
|---------|-------|
| Performance | 97/100 |
| Acessibilidade | 100/100 |
| SEO | 100/100 |

---

## Diagrama de Fluxo

```
┌─────────────┐    build-css.sh     ┌──────────────────┐
│ CSS Modules │───────────────────▶  │ styles.min.css   │
│ (17 files)  │   LightningCSS      │ (bundle inline)  │
└─────────────┘                      └──────────────────┘

┌─────────────┐                      ┌──────────────────┐
│  main.js    │── defer load ───────▶│  Browser         │
│  (single)   │                      │  (no bundler)    │
└─────────────┘                      └──────────────────┘

┌─────────────┐   git push main      ┌──────────────────┐
│  Repo       │──────────────────────▶│  Vercel CDN      │
│  (main)     │   auto-deploy         │  (global edge)   │
└─────────────┘                      └──────────────────┘
```
