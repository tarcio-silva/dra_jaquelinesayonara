# Guia de Desenvolvimento

Guia prático para desenvolvedores que vão trabalhar no projeto.

---

## Setup do Projeto

### Pré-requisitos

- Node.js ≥ 18
- npm

### Instalação

```bash
# Clonar repositório
git clone <repo-url>
cd repo_site

# Instalar dependências (dev only — zero deps de runtime)
npm install

# Build do CSS (gera bundles minificados)
./build-css.sh

# Servir localmente
npx serve .
# Acesse http://localhost:3000
```

### Scripts Disponíveis

| Comando | Ação |
|---------|------|
| `npm run build` | Build de produção (usado pelo Vercel) |
| `npm run build:css` | Executa `./build-css.sh` |
| `npm test` | Roda todos os testes (Vitest, execução única) |
| `npm run test:watch` | Testes em modo watch |
| `npm run test:coverage` | Testes + relatório de cobertura (v8) |
| `npm run prepare` | Instala Husky (git hooks) |

---

## Como Adicionar uma Nova Página de Tratamento

### 1. Criar diretório e arquivo

```bash
mkdir -p tratamentos/novo-tratamento/
cp tratamentos/_template.html tratamentos/novo-tratamento/index.html
```

### 2. Preencher placeholders no HTML

O template `_template.html` contém placeholders `{{...}}` para substituir:

| Placeholder | Exemplo |
|-------------|---------|
| `{{SLUG}}` | `novo-tratamento` |
| `{{PAGE_TITLE}}` | `Novo Tratamento em Sapé/PB \| Dra. Jaqueline Sayonara` |
| `{{META_DESCRIPTION}}` | Descrição ≤155 chars com keyword + CTA |
| `{{META_KEYWORDS}}` | Keywords separadas por vírgula |
| `{{OG_TITLE}}` | Título para Open Graph |
| `{{OG_DESCRIPTION}}` | Descrição para Open Graph |
| `{{TWITTER_TITLE}}` | Título para Twitter Card |
| `{{TWITTER_DESCRIPTION}}` | Descrição para Twitter Card |
| `{{TREATMENT_NAME}}` | `Novo Tratamento` |
| `{{TREATMENT_NAME_LOWER}}` | `novo tratamento` |
| `{{TREATMENT_SUBTITLE}}` | Subtítulo com keyword secundária |
| `{{TREATMENT_DESCRIPTION}}` | Descrição para Schema.org |
| `{{TREATMENT_INDICATION}}` | Indicação médica (Schema.org) |
| `{{WHATSAPP_TEXT}}` | Texto URL-encoded para WhatsApp |
| `{{HERO_IMG_ALT}}` | Alt text da imagem hero |
| `{{CONTENT_WHAT_IS}}` | Parágrafos `<p>` explicando o tratamento |
| `{{CONTENT_BENEFITS}}` | Itens `<li>` dos benefícios |
| `{{CONTENT_HOW_IT_WORKS}}` | Parágrafos `<p>` do procedimento |
| `{{CONTENT_INDICATIONS}}` | Parágrafos `<p>` das indicações |
| `{{FAQ_ITEMS}}` | Blocos `<details><summary>...</details>` |
| `{{FAQ_SCHEMA_ITEMS}}` | JSON-LD das perguntas (Question/Answer) |
| `{{RELATED_TREATMENTS_CARDS}}` | HTML dos cards dos outros tratamentos |

### 3. Adicionar imagem hero

```
assets/img/tratamentos/novo-tratamento-hero.webp
```

- Formato: WebP
- Dimensões recomendadas: 600×400px (ou proporcional)
- Usar compressão adequada (manter < 100KB se possível)

### 4. Atualizar CSS inline

O template já inclui o CSS minificado inline no `<style>`. Se houve alterações no CSS:

```bash
./build-css.sh
# Copiar conteúdo de styles-treatment.min.css para o <style> do novo arquivo
```

### 5. Adicionar ao sitemap

Editar `sitemap.xml` — adicionar nova entrada:

```xml
<url>
  <loc>https://www.drajaquelinesayonara.com.br/tratamentos/novo-tratamento/</loc>
  <lastmod>2026-07-27</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

### 6. Adicionar à navegação

- Adicionar card em `index.html` na seção `#care` (`.cards-container`)
- Adicionar card na listagem `tratamentos/index.html`
- Atualizar os `{{RELATED_TREATMENTS_CARDS}}` das outras páginas de tratamento

### 7. Verificar

```bash
npm test                    # Testes passam
npx serve .                 # Verificar visual
# Checar Schema.org: https://search.google.com/test/rich-results
```

---

## Como Adicionar uma Nova Página de Atendimento (Cidade)

### 1. Criar diretório

```bash
mkdir -p atendimento/nome-da-cidade/
```

### 2. Criar `index.html`

Usar como referência `atendimento/mari/index.html`. A estrutura é similar às páginas de tratamento:

- CSS inline (mesmo bundle)
- Schema.org `Dentist` com `areaServed` da cidade
- Meta tags com keywords locais
- Breadcrumb: Home → Atendimento → Cidade
- Conteúdo: distância até Sapé, tratamentos oferecidos, CTA WhatsApp

### 3. Atualizar

- Adicionar ao `sitemap.xml` (priority 0.8)
- Adicionar link no footer (seção "Cidades Atendidas")
- Atualizar Schema.org na home (`areaServed` array)

---

## Como Modificar CSS

### Fluxo

1. Editar o módulo CSS apropriado em `assets/css/`
2. Executar build:
   ```bash
   ./build-css.sh
   ```
3. Verificar o resultado:
   ```bash
   npx serve .
   ```
4. **Importante:** O CSS inline nas páginas HTML precisa ser atualizado manualmente (copiar conteúdo do `.min.css` para as tags `<style>` das páginas).

### Estrutura dos Módulos

| Módulo | Responsabilidade |
|--------|------------------|
| `globalStyle.css` | Variáveis, reset, tipografia, utilitários (`.sr-only`, `.skip-link`, `.fade-in`, `.whatsapp-float`) |
| `dark-theme.css` | Overrides de variáveis e componentes para tema escuro |
| `header/header.css` | Navbar + hero section |
| `header/hamburger.css` | Botão hamburger animado |
| `header/offcanva.css` | Menu mobile fullscreen |
| `header/switch-button.css` | Toggle dark mode (slider) |
| `about.css` | Seção Sobre |
| `cards.css` | Grid mosaico de tratamentos |
| `results.css` | Carousel + lightbox |
| `plans.css` | Convênios aceitos |
| `rating.css` | Reviews do Google |
| `location.css` | Vídeo + mapa |
| `cta-final.css` | CTA final |
| `faq.css` | FAQ da home |
| `footer.css` | Footer |
| `treatment.css` | Páginas de tratamento (hero, content, FAQ, related, breadcrumb) |
| `micro-interactions.css` | Scroll progress + ripple |
| `compare-slider.css` | Slider antes/depois |

### Adicionando Novo Módulo CSS

1. Criar arquivo em `assets/css/novo-modulo.css`
2. Adicionar import em `assets/css/styles.css`:
   ```css
   @import "./novo-modulo.css";
   ```
3. Rodar `./build-css.sh`
4. Atualizar CSS inline nas páginas afetadas

---

## Testes

### Configuração

- **Runner:** Vitest 2.x
- **Ambiente DOM:** happy-dom
- **Setup:** `tests/setup.js` (mocks globais, cleanup)
- **Config:** `vitest.config.js`

### Executar

```bash
npm test                    # Execução única
npm run test:watch          # Re-executa ao salvar
npm run test:coverage       # Relatório de cobertura (v8)
```

### Thresholds de Cobertura

```javascript
thresholds: {
  statements: 90,
  branches: 85,
  functions: 90,
  lines: 90
}
```

### Estrutura de Testes

```
tests/
├── setup.js                       # Mocks (IO, matchMedia), cleanup
├── mocks/
│   ├── intersection-observer.js   # Mock com triggerIntersection()
│   └── match-media.js             # Mock com setMediaQuery()
├── helpers/
│   ├── dom-utils.js               # Fixtures reutilizáveis
│   └── keyboard-events.js         # pressKey, pressTab, pressEscape, etc.
├── fixtures/
│   └── home.html                  # HTML simplificado para testes
├── unit/                          # Testes unitários do main.js
│   ├── menu-offcanva.test.js      # 58 testes
│   ├── lightbox.test.js           # 15 testes
│   ├── dark-mode.test.js          # 10 testes
│   ├── fade-in.test.js            # 6 testes
│   ├── active-section.test.js     # 5 testes
│   └── reduced-motion.test.js     # 3 testes
└── integration/                   # Validação de HTML e SEO
    ├── html-validation.test.js    # 19 testes
    ├── seo.test.js                # 22 testes
    └── treatment-pages.test.js    # 210 testes (7 páginas × 30 checks)
```

### Adicionando Novos Testes

```javascript
// tests/unit/meu-componente.test.js
import { describe, it, expect, beforeEach } from 'vitest';

describe('Meu Componente', () => {
  beforeEach(() => {
    document.body.innerHTML = `<div id="meu-elemento"></div>`;
  });

  it('deve fazer algo', () => {
    // Importar e executar lógica
    expect(document.getElementById('meu-elemento')).toBeTruthy();
  });
});
```

---

## Convenções de Código

### CSS

#### Variáveis

Todas as cores, sombras e tokens de design são CSS Custom Properties definidas em `:root` (`globalStyle.css`):

```css
color: var(--logo-pallete-velvety-cherry);  /* ✓ */
color: #a25356;                              /* ✗ (exceto marcas externas) */
```

#### Unidades

- **`font-size` base:** `62.5%` no `:root` (1rem = 10px)
- **Tipografia:** sempre `clamp()` para responsividade:
  ```css
  font-size: clamp(1.4rem, 1.2vw, 1.8rem);
  ```
- **Espaçamentos:** `px` para valores fixos
- **Tamanhos de toque:** mínimo 44×44px para acessibilidade

#### Naming

Abordagem BEM-ish (não BEM estrito):

```css
.offcanva { }                    /* Bloco */
.offcanva-identity { }           /* Sub-bloco */
.offcanva-nav--link { }          /* Elemento com duplo-dash */
.offcanva-nav--link.active { }   /* Modificador via classe */
.offcanva.is-open { }            /* Estado via prefixo is- */
```

#### Breakpoints

```css
/* Mobile-first → Desktop override */
@media only screen and (max-width: 1199px) { /* mobile/tablet */ }
@media screen and (min-width: 1200px) { /* desktop */ }

/* Tablet intermediário */
@media screen and (min-width: 600px) and (max-width: 1199px) { }

/* Hover apenas em dispositivos com hover */
@media (hover: hover) { }
```

#### Sombras

```css
box-shadow: var(--shadow-sm);  /* 0 2px 8px rgba(162,83,86,0.08) */
box-shadow: var(--shadow-md);  /* 0 8px 24px rgba(162,83,86,0.12) */
box-shadow: var(--shadow-lg);  /* 0 16px 48px rgba(162,83,86,0.16) */
```

#### Border-radius

- Cards: `16px`
- Botões: `50px` (pill)
- Tags/badges: `20px`
- FAQ details: `12px`

### JavaScript

- Vanilla ES6+ sem transpilação
- IIFEs para módulos auto-contidos (compare slider, scroll progress, ripple)
- Event delegation onde faz sentido (ripple)
- `{ passive: true }` em listeners de scroll/touch
- `defer` no `<script>` — nunca `async` (ordem importa)
- Comentários `// --- Título do Módulo ---` para separação visual

### HTML

- Semântica: `<header>`, `<main>`, `<section>`, `<nav>`, `<footer>`, `<article>`
- IDs para seções linkáveis: `#about`, `#care`, `#results`, `#plans`, `#location`, `#faq`
- `loading="lazy"` em imagens abaixo do fold
- `loading="eager"` apenas no hero
- Imagens com `width` e `height` explícitos (evita CLS)
- Links externos: `target="_blank" rel="noopener noreferrer"`

---

## Checklist de Acessibilidade

Antes de submeter qualquer alteração, verificar:

### Navegação e Foco

- [ ] Skip link (`<a href="#main-content" class="skip-link">`) funcional
- [ ] Focus trap ativo no offcanva quando aberto
- [ ] Focus trap ativo no lightbox quando aberto
- [ ] `inert` no `#main-content` quando offcanva aberto
- [ ] Escape fecha modais/menus
- [ ] Foco retorna ao elemento que disparou a abertura
- [ ] `:focus-visible` com outline visível (3px solid cherry)

### ARIA

- [ ] `aria-expanded` no hamburger (true/false sincronizado)
- [ ] `aria-hidden` no offcanva e backdrop
- [ ] `aria-live="polite"` anuncia abertura/fechamento do menu
- [ ] `role="dialog"` + `aria-modal="true"` no lightbox
- [ ] `role="switch"` + `aria-checked` nos toggles de dark mode
- [ ] `role="button"` + `tabindex="0"` em elementos clicáveis não-nativos
- [ ] `aria-label` em botões/links sem texto (ícones)
- [ ] `aria-label` no vídeo e iframes

### Contraste e Visual

- [ ] Contraste mínimo 4.5:1 em todas as combinações (light e dark mode)
- [ ] `--color-text-muted` light: #6b4a4c (5.8:1) / dark: #b8a8ab (7.0:1)
- [ ] Textos sobre imagens com overlay gradient suficiente

### Media

- [ ] `alt` em todas as imagens (descritivo, não redundante)
- [ ] `prefers-reduced-motion`: animações desabilitadas, vídeos pausados
- [ ] `font-display: swap` na @font-face

### Touch/Mobile

- [ ] Targets ≥ 44×44px
- [ ] `env(safe-area-inset-*)` para notch/home indicator
- [ ] `-webkit-tap-highlight-color: transparent`

---

## Checklist de SEO

Ao criar ou modificar páginas:

### Meta Tags

- [ ] `<title>` único, ≤60 chars, keyword principal no início
- [ ] `<meta name="description">` único, ≤155 chars, com CTA
- [ ] `<meta name="keywords">` relevantes (sem duplicatas)
- [ ] `<link rel="canonical">` com URL completa + trailing slash

### Open Graph / Twitter

- [ ] `og:title`, `og:description`, `og:image`, `og:url`, `og:type`
- [ ] `og:locale="pt_BR"`, `og:site_name`
- [ ] `twitter:card="summary_large_image"`, `twitter:title`, `twitter:description`, `twitter:image`

### Schema.org (JSON-LD)

- [ ] Home: `Dentist` com `aggregateRating`, `geo`, `areaServed`, `sameAs`
- [ ] Home: `FAQPage` (6 perguntas)
- [ ] Home: `BreadcrumbList`
- [ ] Tratamentos: `MedicalProcedure` + `FAQPage` + `BreadcrumbList`
- [ ] Atendimento: `Dentist` com `areaServed` específico
- [ ] Listagem: `ItemList`

### Sitemap e Robots

- [ ] Nova URL adicionada ao `sitemap.xml` com `lastmod` atualizado
- [ ] `robots.txt` permitindo crawl da nova página
- [ ] URL canônica com `www.` e trailing slash `/`

### Performance SEO

- [ ] Heading hierarchy correta (h1 único → h2 → h3)
- [ ] Imagens com `alt`, `width`, `height`
- [ ] Links internos entre páginas relacionadas
- [ ] Breadcrumb estruturado

---

## Deploy

### Fluxo de Deploy

```
develop → merge/PR para main → Vercel auto-deploy (1-2 min)
```

### Branches

| Branch | Propósito |
|--------|-----------|
| `main` | Produção — deploy automático |
| `develop` | Trabalho em andamento |

### Verificações Pré-deploy

1. `npm test` — todos os 348+ testes passam
2. `./build-css.sh` — CSS gerado sem erros
3. CSS inline nas páginas HTML está atualizado (se CSS foi modificado)
4. `sitemap.xml` atualizado (se novas páginas)
5. Schema.org validado (se novo structured data)

### Configuração Vercel

**`vercel.json`** define:

1. **Build command:** `npm run build`
2. **Output directory:** `.` (raiz do projeto)
3. **Redirects 301:**
   - `*.vercel.app` → `www.drajaquelinesayonara.com.br`
   - domínio sem www → com www
4. **Cache imutável (1 ano):**
   - `/assets/css/*`, `/assets/font/*`, `/assets/img/*`, `/assets/js/*`, `/assets/media/*`
5. **Cache de páginas de tratamento:**
   - `max-age=86400` (1 dia browser) + `s-maxage=604800` (1 semana CDN) + `stale-while-revalidate=86400`

### Domínio

- **Produção:** `https://www.drajaquelinesayonara.com.br/`
- **Legacy (redirect):** `https://drajaquelinesayonara.vercel.app/`

Detalhes de configuração DNS: ver `docs/reference/DOMAIN_SETUP.md`.

---

## Troubleshooting

### CSS não atualiza na página

O CSS está inline. Após rodar `./build-css.sh`, copie o conteúdo dos `.min.css` para as tags `<style>` das páginas afetadas.

### Testes falhando após mudança no HTML

Verifique se os seletores nos testes (`tests/helpers/dom-utils.js` e fixtures) correspondem à estrutura atual. Os testes de integração (`treatment-pages.test.js`) leem diretamente os arquivos HTML das páginas.

### Lighthouse score caiu

- Verificar se imagens novas têm `width`/`height` explícitos
- Verificar se `loading="lazy"` está nas imagens abaixo do fold
- Verificar se não adicionou CSS/JS externo bloqueante
- Confirmar que o vídeo usa `data-src` (lazy load)

### Novo tratamento não aparece no Google

1. Verificar se está no `sitemap.xml`
2. Confirmar `<link rel="canonical">` com URL correta
3. Validar Schema.org em https://search.google.com/test/rich-results
4. Submeter URL no Google Search Console
