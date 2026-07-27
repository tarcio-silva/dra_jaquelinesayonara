# Plano de Testes — Dra. Jaqueline Sayonara

Plano completo de testes unitários e de integração para o site institucional da Dra. Jaqueline Sayonara, incluindo a expansão multipage (7 páginas de tratamentos).

---

## Sumário

1. [Stack de Testes Recomendada](#1-stack-de-testes-recomendada)
2. [Setup do Projeto](#2-setup-do-projeto)
3. [Testes Unitários — JavaScript (main.js)](#3-testes-unitários--javascript-mainjs)
4. [Testes de HTML/Markup](#4-testes-de-htmlmarkup)
5. [Testes de CSS (Snapshot/Visual)](#5-testes-de-css-snapshotvisual)
6. [Testes de SEO](#6-testes-de-seo)
7. [Testes Específicos para Páginas de Tratamento (Multipage)](#7-testes-específicos-para-páginas-de-tratamento-multipage)
8. [Exemplos de Testes Completos](#8-exemplos-de-testes-completos)
9. [Métricas de Cobertura](#9-métricas-de-cobertura)
10. [CI/CD Integration](#10-cicd-integration)

---

## 1. Stack de Testes Recomendada

| Ferramenta | Função | Versão |
|-----------|--------|--------|
| **Vitest** | Test runner | ^2.0.0 |
| **happy-dom** | Simulação de DOM | ^15.0.0 |
| **@vitest/coverage-v8** | Cobertura de código | ^2.0.0 |
| **Playwright** *(futuro)* | Testes E2E | ^1.45.0 |

### Justificativas

| Escolha | Motivo |
|---------|--------|
| **Vitest** | Compatível com ESM e CJS, zero config para JS vanilla, API idêntica ao Jest, execução paralela rápida, já possui Node/npm no projeto |
| **happy-dom** | Mais leve e rápido que jsdom (~3x), suporta todas as APIs DOM necessárias (IntersectionObserver, matchMedia, MutationObserver), ideal para testes unitários sem renderização visual |
| **v8 coverage** | Engine nativa do Node, sem overhead de instrumentação (Istanbul), relatórios precisos de branches |
| **Playwright (futuro)** | Cross-browser real (Chromium, Firefox, WebKit), suporta mobile viewports, melhor para testar interações complexas (lightbox, focus trap) em ambiente real |

---

## 2. Setup do Projeto

### 2.1 Dependências (devDependencies)

```bash
npm install -D vitest happy-dom @vitest/coverage-v8
```

### 2.2 Scripts no package.json

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui",
    "build:css": "./build-css.sh",
    "lint:html": "npx html-validate index.html tratamentos/*/index.html"
  }
}
```

### 2.3 vitest.config.js

```js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./tests/setup.js'],
    include: ['tests/**/*.test.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['assets/js/**/*.js'],
      exclude: ['node_modules/', 'tests/'],
      thresholds: {
        statements: 90,
        branches: 85,
        functions: 90,
        lines: 90
      }
    }
  }
});
```

### 2.4 Estrutura de Diretórios

```
tests/
├── setup.js                    # Setup global (DOM mocks, fixtures helper)
├── mocks/
│   ├── intersection-observer.js  # Mock do IntersectionObserver
│   └── match-media.js            # Mock do matchMedia
├── fixtures/
│   ├── home.html                 # Fixture do index.html (simplificada)
│   └── treatment.html            # Fixture de página de tratamento
├── unit/
│   ├── menu-offcanva.test.js     # Testes do menu + focus trap
│   ├── active-section.test.js    # Testes do indicador de seção ativa
│   ├── fade-in.test.js           # Testes do fade-in on scroll
│   ├── lightbox.test.js          # Testes do lightbox acessível
│   ├── dark-mode.test.js         # Testes do dark mode toggle
│   └── reduced-motion.test.js    # Testes do prefers-reduced-motion
├── integration/
│   ├── html-validation.test.js   # Validação de markup e ARIA
│   ├── seo.test.js               # Testes de SEO (meta, schema, sitemap)
│   ├── css-properties.test.js    # Testes de custom properties
│   └── treatment-pages.test.js   # Testes das páginas de tratamento
└── helpers/
    ├── dom-utils.js              # Utilitários para criar/limpar DOM
    └── keyboard-events.js        # Helpers para simular eventos de teclado
```

### 2.5 Setup File (tests/setup.js)

```js
import { beforeEach, afterEach, vi } from 'vitest';
import { mockIntersectionObserver } from './mocks/intersection-observer.js';
import { mockMatchMedia } from './mocks/match-media.js';

// Mock global do IntersectionObserver
beforeEach(() => {
  mockIntersectionObserver();
  mockMatchMedia();
});

// Limpar DOM e mocks após cada teste
afterEach(() => {
  document.body.innerHTML = '';
  document.body.className = '';
  vi.restoreAllMocks();
});
```

### 2.6 Mock do IntersectionObserver (tests/mocks/intersection-observer.js)

```js
import { vi } from 'vitest';

let observerInstances = [];

export function mockIntersectionObserver() {
  observerInstances = [];

  const MockIntersectionObserver = vi.fn((callback, options) => {
    const instance = {
      callback,
      options,
      elements: new Set(),
      observe: vi.fn((el) => instance.elements.add(el)),
      unobserve: vi.fn((el) => instance.elements.delete(el)),
      disconnect: vi.fn(() => instance.elements.clear()),
    };
    observerInstances.push(instance);
    return instance;
  });

  window.IntersectionObserver = MockIntersectionObserver;
  return MockIntersectionObserver;
}

// Helper para simular intersecção
export function triggerIntersection(observerIndex, entries) {
  const instance = observerInstances[observerIndex];
  if (instance) {
    instance.callback(entries, instance);
  }
}

export function getObserverInstances() {
  return observerInstances;
}
```

### 2.7 Mock do matchMedia (tests/mocks/match-media.js)

```js
import { vi } from 'vitest';

let mediaQueryState = { 'prefers-reduced-motion: reduce': false };

export function mockMatchMedia(overrides = {}) {
  mediaQueryState = { ...mediaQueryState, ...overrides };

  window.matchMedia = vi.fn((query) => ({
    matches: mediaQueryState[query] || false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

export function setMediaQuery(query, matches) {
  mediaQueryState[query] = matches;
}
```


---

## 3. Testes Unitários — JavaScript (main.js)

### 3a. Menu Offcanva + Focus Trap

**Arquivo:** `tests/unit/menu-offcanva.test.js`

**DOM Fixture necessária:**

```html
<a href="#main-content" class="skip-link">Pular para conteúdo</a>
<header>
  <button class="hamburger" aria-expanded="false" aria-controls="offcanva">
    <span class="hamburger-line"></span>
  </button>
  <nav id="offcanva" class="offcanva" aria-hidden="true">
    <a href="#about" class="offcanva-link">Sobre</a>
    <a href="#care" class="offcanva-link">Tratamentos</a>
    <a href="#results" class="offcanva-link">Resultados</a>
    <a href="#plans" class="offcanva-link">Planos</a>
    <a href="#location" class="offcanva-link">Localização</a>
    <div class="dark-mode-toggle-mobile">
      <button aria-label="Alternar tema escuro">🌙</button>
    </div>
  </nav>
</header>
```

**Mocks:** Nenhum mock específico além do setup global.

**Test Cases:**

| # | Nome do Teste | Comportamento Esperado |
|---|--------------|----------------------|
| 1 | `toggleNav() abre o menu quando está fechado` | `.offcanva` recebe classe `.active`, `aria-hidden="false"` |
| 2 | `toggleNav() fecha o menu quando está aberto` | `.offcanva` perde classe `.active`, `aria-hidden="true"` |
| 3 | `aria-expanded atualiza no hamburger ao abrir` | `hamburger.getAttribute('aria-expanded') === 'true'` |
| 4 | `aria-expanded atualiza no hamburger ao fechar` | `hamburger.getAttribute('aria-expanded') === 'false'` |
| 5 | `body recebe overflow hidden ao abrir menu` | `document.body.style.overflow === 'hidden'` |
| 6 | `body perde overflow hidden ao fechar menu` | `document.body.style.overflow === ''` |
| 7 | `Escape fecha o menu quando aberto` | Dispatch `keydown` Escape → menu fecha |
| 8 | `Escape não faz nada quando menu está fechado` | Dispatch `keydown` Escape → nenhuma mudança |
| 9 | `Focus vai para primeiro link ao abrir` | `document.activeElement === primeiroLink` |
| 10 | `Focus volta para hamburger ao fechar` | `document.activeElement === hamburgerBtn` |
| 11 | `Focus trap: Tab no último elemento volta ao primeiro` | Simular Tab no último → focus no primeiro |
| 12 | `Focus trap: Shift+Tab no primeiro vai ao último` | Simular Shift+Tab no primeiro → focus no último |
| 13 | `Click em link do offcanva fecha o menu` | Click no link → menu fecha |

**Cobertura esperada:** 100% das linhas de `toggleNav()` e `trapFocusInOffcanva()`

---

### 3b. Active Section Indicator

**Arquivo:** `tests/unit/active-section.test.js`

**DOM Fixture necessária:**

```html
<nav class="header-nav">
  <a href="#about" class="header-link">Sobre</a>
  <a href="#care" class="header-link">Tratamentos</a>
  <a href="#results" class="header-link">Resultados</a>
  <a href="#plans" class="header-link">Planos</a>
  <a href="#location" class="header-link">Localização</a>
</nav>
<main>
  <section id="about"><h2>Sobre</h2></section>
  <section id="care"><h2>Tratamentos</h2></section>
  <section id="results"><h2>Resultados</h2></section>
  <section id="plans"><h2>Planos</h2></section>
  <section id="location"><h2>Localização</h2></section>
</main>
```

**Mocks:** `IntersectionObserver` (do setup global)

**Test Cases:**

| # | Nome do Teste | Comportamento Esperado |
|---|--------------|----------------------|
| 1 | `IntersectionObserver criado com threshold 0.3` | `options.threshold === 0.3` |
| 2 | `Observa todas as seções com ID correspondente aos links` | `.observe()` chamado 5 vezes |
| 3 | `Adiciona .active ao link quando seção entra no viewport` | Trigger intersecção `#about` → link `[href="#about"]` tem `.active` |
| 4 | `Remove .active dos outros links ao ativar um` | Apenas um link com `.active` por vez |
| 5 | `Não adiciona .active quando isIntersecting é false` | Trigger com `isIntersecting: false` → sem mudança |

**Cobertura esperada:** 100% do callback do observer

---

### 3c. Fade-in on Scroll

**Arquivo:** `tests/unit/fade-in.test.js`

**DOM Fixture necessária:**

```html
<main>
  <div class="fade-in">Elemento 1</div>
  <div class="fade-in">Elemento 2</div>
  <div class="fade-in">Elemento 3</div>
  <div class="no-fade">Elemento sem animação</div>
</main>
```

**Mocks:** `IntersectionObserver` (do setup global)

**Test Cases:**

| # | Nome do Teste | Comportamento Esperado |
|---|--------------|----------------------|
| 1 | `IntersectionObserver criado com threshold 0.15` | `options.threshold === 0.15` |
| 2 | `Observa apenas elementos com classe .fade-in` | `.observe()` chamado 3 vezes (não o .no-fade) |
| 3 | `Adiciona .visible quando isIntersecting é true` | Trigger intersecção → elemento tem `.visible` |
| 4 | `Chama unobserve após adicionar .visible` | `observer.unobserve(element)` chamado |
| 5 | `Não adiciona .visible quando isIntersecting é false` | Trigger com false → sem `.visible` |
| 6 | `Não chama unobserve quando isIntersecting é false` | `unobserve` não chamado |
| 7 | `Elemento já com .visible não é re-observado` | Após unobserve, não é processado novamente |

**Cobertura esperada:** 100% do callback do observer + setup


---

### 3d. Lightbox Acessível

**Arquivo:** `tests/unit/lightbox.test.js`

**DOM Fixture necessária:**

```html
<section id="results">
  <div class="results-grid">
    <div class="result-item" role="button" tabindex="0">
      <img src="/assets/img/results/antes-depois-1.webp" alt="Resultado 1">
    </div>
    <div class="result-item" role="button" tabindex="0">
      <img src="/assets/img/results/antes-depois-2.webp" alt="Resultado 2">
    </div>
  </div>
</section>
<div id="lightbox" role="dialog" aria-modal="true" aria-label="Visualizar resultado">
  <div class="lightbox-backdrop"></div>
  <div class="lightbox-content">
    <img class="lightbox-img" src="" alt="">
    <button class="lightbox-close" aria-label="Fechar lightbox">&times;</button>
  </div>
</div>
```

**Mocks:** Nenhum mock específico.

**Test Cases:**

| # | Nome do Teste | Comportamento Esperado |
|---|--------------|----------------------|
| 1 | `openLightbox atualiza src da imagem` | `lightboxImg.src` contém URL da imagem clicada |
| 2 | `openLightbox atualiza alt da imagem` | `lightboxImg.alt` contém o alt da imagem original |
| 3 | `openLightbox adiciona .active ao #lightbox` | `lightbox.classList.contains('active') === true` |
| 4 | `openLightbox define body overflow hidden` | `document.body.style.overflow === 'hidden'` |
| 5 | `closeLightbox remove .active do #lightbox` | `lightbox.classList.contains('active') === false` |
| 6 | `closeLightbox restaura body overflow` | `document.body.style.overflow === ''` |
| 7 | `Escape fecha o lightbox quando aberto` | Dispatch `keydown` Escape → lightbox fecha |
| 8 | `Escape não faz nada quando lightbox está fechado` | Nenhuma mudança no DOM |
| 9 | `Click no backdrop fecha o lightbox` | Click na `.lightbox-backdrop` → lightbox fecha |
| 10 | `Click no botão fechar fecha o lightbox` | Click na `.lightbox-close` → lightbox fecha |
| 11 | `Click na imagem não fecha o lightbox` | Click na `.lightbox-img` → lightbox permanece aberto |
| 12 | `Enter no result-item abre o lightbox` | Dispatch `keydown` Enter → lightbox abre |
| 13 | `Space no result-item abre o lightbox` | Dispatch `keydown` Space → lightbox abre |
| 14 | `Focus vai para botão fechar ao abrir` | `document.activeElement === closeButton` |
| 15 | `Focus volta para elemento original ao fechar` | `document.activeElement === resultItem` |
| 16 | `Focus trap: Tab no close button mantém no close button` | Tab → focus permanece no `.lightbox-close` |
| 17 | `Shift+Tab no close button mantém no close button` | Shift+Tab → focus permanece no `.lightbox-close` |

**Cobertura esperada:** 100% de `openLightbox()`, `closeLightbox()`, event handlers

---

### 3e. Dark Mode Toggle

**Arquivo:** `tests/unit/dark-mode.test.js`

**DOM Fixture necessária:**

```html
<header>
  <div class="dark-mode-toggle-desktop">
    <input type="checkbox" id="dark-mode-button" role="switch" aria-checked="false" aria-label="Alternar tema escuro">
    <label for="dark-mode-button" class="switch-label">
      <span class="switch-slider"></span>
    </label>
  </div>
</header>
<nav class="offcanva">
  <div class="dark-mode-toggle-mobile">
    <input type="checkbox" id="dark-mode-mobile" role="switch" aria-checked="false" aria-label="Alternar tema escuro">
    <label for="dark-mode-mobile" class="switch-label">
      <span class="switch-slider"></span>
    </label>
  </div>
</nav>
```

**Mocks:** `localStorage` (já disponível no happy-dom)

**Test Cases:**

| # | Nome do Teste | Comportamento Esperado |
|---|--------------|----------------------|
| 1 | `Toggle adiciona .dark-theme ao body` | Click no switch → `body.classList.contains('dark-theme') === true` |
| 2 | `Toggle remove .dark-theme do body no segundo click` | Segundo click → `body.classList.contains('dark-theme') === false` |
| 3 | `aria-checked atualiza para "true" ao ativar` | `input.getAttribute('aria-checked') === 'true'` |
| 4 | `aria-checked atualiza para "false" ao desativar` | `input.getAttribute('aria-checked') === 'false'` |
| 5 | `Toggle desktop sincroniza com toggle mobile` | Click no desktop → mobile `checked === true` e `aria-checked === "true"` |
| 6 | `Toggle mobile sincroniza com toggle desktop` | Click no mobile → desktop `checked === true` e `aria-checked === "true"` |
| 7 | `Estado persiste no localStorage` | Após toggle → `localStorage.getItem('theme') === 'dark'` |
| 8 | `Carrega estado do localStorage ao iniciar` | `localStorage.setItem('theme', 'dark')` antes de init → body tem `.dark-theme` |
| 9 | `Sem localStorage, respeita prefers-color-scheme` | `matchMedia('prefers-color-scheme: dark').matches = true` → body tem `.dark-theme` |

**Cobertura esperada:** 100% de `toggleDarkMode()` + inicialização

---

### 3f. Prefers-reduced-motion

**Arquivo:** `tests/unit/reduced-motion.test.js`

**DOM Fixture necessária:**

```html
<main>
  <section id="location">
    <video autoplay muted loop playsinline>
      <source src="/assets/media/location.mp4" type="video/mp4">
    </video>
  </section>
</main>
```

**Mocks:** `matchMedia` (configurável via helper)

**Test Cases:**

| # | Nome do Teste | Comportamento Esperado |
|---|--------------|----------------------|
| 1 | `Vídeos pausados quando prefers-reduced-motion: reduce` | `matchMedia` retorna `matches: true` → `video.pause()` chamado |
| 2 | `Atributo autoplay removido dos vídeos` | `video.hasAttribute('autoplay') === false` |
| 3 | `Nenhuma ação quando prefers-reduced-motion não é reduce` | `matchMedia` retorna `matches: false` → vídeo não é pausado |
| 4 | `Múltiplos vídeos são todos pausados` | 2+ vídeos na fixture → todos pausados |

**Cobertura esperada:** 100% do bloco de prefers-reduced-motion


---

## 4. Testes de HTML/Markup

**Arquivo:** `tests/integration/html-validation.test.js`

Estes testes leem os arquivos HTML reais do projeto e validam a estrutura de markup, atributos ARIA e conformidade com WCAG AA.

**Setup:** Leitura do `index.html` via `fs.readFileSync` + parse com happy-dom.

**Test Cases:**

| # | Nome do Teste | O que Valida |
|---|--------------|-------------|
| 1 | `Skip link está presente e aponta para #main-content` | `a.skip-link[href="#main-content"]` existe |
| 2 | `#main-content existe como destino do skip link` | `document.getElementById('main-content')` não é null |
| 3 | `Hierarquia de headings: apenas um H1 na página` | `document.querySelectorAll('h1').length === 1` |
| 4 | `Hierarquia de headings: H2 não precedido por H3` | Validar sequência h1 → h2 → h3 (sem pular níveis) |
| 5 | `Todas as imagens possuem atributo alt` | Nenhuma `<img>` sem `alt` (pode ser vazio para decorativas) |
| 6 | `Links target="_blank" possuem rel="noopener noreferrer"` | Todos os `a[target="_blank"]` têm o `rel` correto |
| 7 | `Lightbox possui role="dialog" e aria-modal="true"` | `#lightbox` tem ambos os atributos |
| 8 | `Hamburger possui aria-expanded` | `.hamburger[aria-expanded]` existe |
| 9 | `Offcanva possui aria-hidden` | `.offcanva[aria-hidden]` existe |
| 10 | `Dark mode toggle possui role="switch" e aria-checked` | `#dark-mode-button[role="switch"][aria-checked]` existe |
| 11 | `Todas as seções possuem IDs correspondentes aos links do nav` | IDs: about, care, results, plans, location |
| 12 | `Meta title está presente` | `document.querySelector('title')` não é null |
| 13 | `Meta description está presente` | `meta[name="description"]` existe |
| 14 | `Canonical URL está definida` | `link[rel="canonical"]` existe |
| 15 | `Open Graph: og:title, og:description, og:image, og:url` | Todas as 4 meta tags presentes |
| 16 | `Twitter Card: twitter:card, twitter:title, twitter:image` | Todas as 3 meta tags presentes |
| 17 | `Schema.org JSON-LD é JSON válido` | `JSON.parse()` do conteúdo do `<script type="application/ld+json">` não lança erro |
| 18 | `Schema.org contém @type: "Dentist"` | JSON parseado tem `@type === "Dentist"` |
| 19 | `Vídeo possui aria-label` | `video[aria-label]` existe |
| 20 | `Botão WhatsApp possui aria-label` | Link/botão do WhatsApp com `aria-label` |

---

## 5. Testes de CSS (Snapshot/Visual)

**Arquivo:** `tests/integration/css-properties.test.js`

Estes testes leem os arquivos CSS fonte e validam que as variáveis, media queries e regras essenciais estão presentes.

**Setup:** Leitura dos arquivos CSS via `fs.readFileSync` e validação por regex/string matching.

**Test Cases:**

| # | Nome do Teste | O que Valida |
|---|--------------|-------------|
| 1 | `Custom properties definidas em :root` | Verifica presença de `--color-bg`, `--color-surface`, `--color-text`, `--color-text-muted`, `--color-accent`, `--logo-pallete-velvety-cherry` |
| 2 | `.dark-theme override de --color-bg` | `.dark-theme { --color-bg: ...}` presente em `dark-theme.css` |
| 3 | `.dark-theme override de --color-surface` | Variável redefinida no bloco `.dark-theme` |
| 4 | `.dark-theme override de --color-text` | Variável redefinida no bloco `.dark-theme` |
| 5 | `.dark-theme override de --color-text-muted` | Valor `#b8a8ab` presente |
| 6 | `Media query mobile: max-width 1199px presente` | `@media (max-width: 1199px)` existe nos CSS |
| 7 | `Media query desktop: min-width 1200px presente` | `@media (min-width: 1200px)` existe nos CSS |
| 8 | `prefers-reduced-motion desabilita animações` | `@media (prefers-reduced-motion: reduce)` com `animation: none` ou `transition: none` |
| 9 | `Animação fadeUp definida via @keyframes` | `@keyframes fadeUp` existe |
| 10 | `Animação heroZoom definida via @keyframes` | `@keyframes heroZoom` existe |
| 11 | `Font-face Manrope declarada` | `@font-face` com `font-family: 'Manrope'` ou `Manrope` |
| 12 | `font-display: swap declarado` | `font-display: swap` presente na declaração de font |

---

## 6. Testes de SEO

**Arquivo:** `tests/integration/seo.test.js`

Validam aspectos técnicos de SEO usando leitura de arquivos estáticos.

**Setup:** Leitura de `sitemap.xml`, `robots.txt`, `index.html` via `fs.readFileSync`.

**Test Cases:**

| # | Nome do Teste | O que Valida |
|---|--------------|-------------|
| 1 | `sitemap.xml é XML válido` | Parse sem erro |
| 2 | `sitemap.xml contém URL da homepage` | `https://www.drajaquelinesayonara.com.br/` presente |
| 3 | `sitemap.xml contém todas as 8 URLs (homepage + 7 tratamentos)` | 8 `<url>` entries após multipage |
| 4 | `sitemap.xml possui lastmod em todas as URLs` | Cada `<url>` tem `<lastmod>` |
| 5 | `robots.txt permite crawling (sem Disallow: /)` | Não contém `Disallow: /` na raiz |
| 6 | `robots.txt referencia sitemap com URL www` | `Sitemap: https://www.drajaquelinesayonara.com.br/sitemap.xml` |
| 7 | `Canonical URL usa www` | `link[rel="canonical"]` contém `www.drajaquelinesayonara.com.br` |
| 8 | `Schema.org JSON-LD possui aggregateRating` | Campo `aggregateRating` no JSON |
| 9 | `Schema.org aggregateRating tem ratingValue e reviewCount` | Campos obrigatórios presentes |
| 10 | `Schema.org possui geo com latitude e longitude` | `geo.latitude` e `geo.longitude` existem |
| 11 | `Schema.org possui areaServed` | Campo `areaServed` presente |
| 12 | `Open Graph og:type é "website"` | `meta[property="og:type"][content="website"]` |
| 13 | `Open Graph og:locale é "pt_BR"` | `meta[property="og:locale"][content="pt_BR"]` |
| 14 | `Title tem no máximo 60 caracteres` | `document.title.length <= 60` |
| 15 | `Meta description tem no máximo 155 caracteres` | `.content.length <= 155` |
| 16 | `Meta description tem no mínimo 120 caracteres` | `.content.length >= 120` |


---

## 7. Testes Específicos para Páginas de Tratamento (Multipage)

**Arquivo:** `tests/integration/treatment-pages.test.js`

Estes testes validam as 7 páginas de tratamento criadas na expansão multipage. Cada página segue o template definido na estratégia.

**Setup:** Leitura de cada `tratamentos/{slug}/index.html` via `fs.readFileSync`.

**Slugs das páginas:**
- `aparelho-ortodontico`
- `clareamento-dental`
- `exodontia`
- `facetas-dentarias`
- `profilaxia`
- `protese-dentaria`
- `restauracao-dentaria`

**Test Cases (executados para CADA página):**

| # | Nome do Teste | O que Valida |
|---|--------------|-------------|
| 1 | `Página existe e é HTML válido` | Arquivo existe e pode ser parseado |
| 2 | `Título contém keyword do tratamento` | `<title>` contém nome do tratamento |
| 3 | `H1 contém keyword do tratamento` | `<h1>` contém nome do tratamento |
| 4 | `Breadcrumb possui 3 níveis` | Home → Tratamentos → Nome do tratamento |
| 5 | `Breadcrumb: link Home aponta para /` | Primeiro item `href="/"` ou `href="/index.html"` |
| 6 | `Breadcrumb: último item não é link (item atual)` | Último item é `<span>` ou sem `<a>` |
| 7 | `Schema.org MedicalProcedure presente` | JSON-LD com `@type: "MedicalProcedure"` |
| 8 | `Schema.org BreadcrumbList presente` | JSON-LD com `@type: "BreadcrumbList"` |
| 9 | `Schema.org FAQPage presente (se houver FAQ)` | JSON-LD com `@type: "FAQPage"` quando seção FAQ existe |
| 10 | `Schema.org BreadcrumbList tem 3 itemListElement` | Array com 3 itens ordenados por `position` |
| 11 | `Seção "O que é" presente com H2` | `<h2>` contendo "O que é" ou similar |
| 12 | `Seção FAQ usa details/summary` | `<details>` e `<summary>` presentes na seção FAQ |
| 13 | `CTA com link para WhatsApp presente` | Link com `href` contendo `wa.me` |
| 14 | `Seção "Outros Tratamentos" presente` | Seção com links para outros tratamentos |
| 15 | `"Outros Tratamentos" não inclui link para si mesmo` | Nenhum link em "Outros Tratamentos" com href do slug atual |
| 16 | `"Outros Tratamentos" tem exatamente 6 links` | 7 tratamentos - 1 (atual) = 6 |
| 17 | `Meta description presente e ≤155 chars` | `meta[name="description"]` existe e comprimento OK |
| 18 | `Canonical URL aponta para a própria página com www` | `link[rel="canonical"]` correto |
| 19 | `Internal links não estão quebrados` | Todos os links relativos apontam para arquivos existentes |
| 20 | `Open Graph tags presentes` | `og:title`, `og:description`, `og:url` definidos |

**Testes de integração home ↔ tratamentos:**

| # | Nome do Teste | O que Valida |
|---|--------------|-------------|
| 21 | `Homepage linka para todas as 7 páginas de tratamento` | 7 links em `#care` apontando para `/tratamentos/{slug}/` |
| 22 | `Cada página de tratamento linka de volta para homepage` | Link para `/` ou seção `#care` |
| 23 | `Links entre páginas de tratamento são bidirecionais` | Se A linka para B em "Outros Tratamentos", B linka para A |

---

## 8. Exemplos de Testes Completos

### Exemplo 1: Menu Offcanva — Toggle e ARIA

```js
// tests/unit/menu-offcanva.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('Menu Offcanva', () => {
  let hamburger, offcanva, offcanvaLinks;

  beforeEach(() => {
    document.body.innerHTML = `
      <header>
        <button class="hamburger" aria-expanded="false" aria-controls="offcanva">
          <span class="hamburger-line"></span>
        </button>
        <nav id="offcanva" class="offcanva" aria-hidden="true">
          <a href="#about" class="offcanva-link">Sobre</a>
          <a href="#care" class="offcanva-link">Tratamentos</a>
          <a href="#results" class="offcanva-link">Resultados</a>
          <a href="#plans" class="offcanva-link">Planos</a>
          <a href="#location" class="offcanva-link">Localização</a>
        </nav>
      </header>
    `;

    hamburger = document.querySelector('.hamburger');
    offcanva = document.querySelector('.offcanva');
    offcanvaLinks = document.querySelectorAll('.offcanva-link');

    // Importar e inicializar main.js (após DOM estar pronto)
    // Nota: main.js precisa ser refatorado para exportar funções
    // ou usar dynamic import após setup do DOM
  });

  describe('toggleNav()', () => {
    it('abre o menu quando está fechado', () => {
      hamburger.click();

      expect(offcanva.classList.contains('active')).toBe(true);
      expect(offcanva.getAttribute('aria-hidden')).toBe('false');
      expect(hamburger.getAttribute('aria-expanded')).toBe('true');
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('fecha o menu quando está aberto', () => {
      // Abrir primeiro
      hamburger.click();
      // Fechar
      hamburger.click();

      expect(offcanva.classList.contains('active')).toBe(false);
      expect(offcanva.getAttribute('aria-hidden')).toBe('true');
      expect(hamburger.getAttribute('aria-expanded')).toBe('false');
      expect(document.body.style.overflow).toBe('');
    });

    it('Escape fecha o menu quando aberto', () => {
      hamburger.click(); // abrir
      
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

      expect(offcanva.classList.contains('active')).toBe(false);
      expect(hamburger.getAttribute('aria-expanded')).toBe('false');
    });

    it('focus vai para primeiro link ao abrir', () => {
      hamburger.click();

      expect(document.activeElement).toBe(offcanvaLinks[0]);
    });

    it('focus volta para hamburger ao fechar', () => {
      hamburger.click(); // abrir
      hamburger.click(); // fechar

      expect(document.activeElement).toBe(hamburger);
    });
  });

  describe('Focus Trap', () => {
    it('Tab no último link volta para o primeiro', () => {
      hamburger.click();
      offcanvaLinks[offcanvaLinks.length - 1].focus();

      const tabEvent = new KeyboardEvent('keydown', { 
        key: 'Tab', 
        bubbles: true 
      });
      offcanvaLinks[offcanvaLinks.length - 1].dispatchEvent(tabEvent);

      expect(document.activeElement).toBe(offcanvaLinks[0]);
    });

    it('Shift+Tab no primeiro link volta para o último', () => {
      hamburger.click();
      offcanvaLinks[0].focus();

      const shiftTabEvent = new KeyboardEvent('keydown', { 
        key: 'Tab', 
        shiftKey: true, 
        bubbles: true 
      });
      offcanvaLinks[0].dispatchEvent(shiftTabEvent);

      expect(document.activeElement).toBe(offcanvaLinks[offcanvaLinks.length - 1]);
    });
  });
});
```

### Exemplo 2: Lightbox — Abertura e Acessibilidade

```js
// tests/unit/lightbox.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Lightbox Acessível', () => {
  let lightbox, lightboxImg, closeBtn, resultItems;

  beforeEach(() => {
    document.body.innerHTML = `
      <section id="results">
        <div class="results-grid">
          <div class="result-item" role="button" tabindex="0">
            <img src="/assets/img/results/caso-1.webp" alt="Caso 1 - Antes e depois">
          </div>
          <div class="result-item" role="button" tabindex="0">
            <img src="/assets/img/results/caso-2.webp" alt="Caso 2 - Antes e depois">
          </div>
        </div>
      </section>
      <div id="lightbox" role="dialog" aria-modal="true" aria-label="Visualizar resultado">
        <div class="lightbox-backdrop"></div>
        <div class="lightbox-content">
          <img class="lightbox-img" src="" alt="">
          <button class="lightbox-close" aria-label="Fechar lightbox">&times;</button>
        </div>
      </div>
    `;

    lightbox = document.getElementById('lightbox');
    lightboxImg = document.querySelector('.lightbox-img');
    closeBtn = document.querySelector('.lightbox-close');
    resultItems = document.querySelectorAll('.result-item');
  });

  describe('openLightbox()', () => {
    it('atualiza src e alt da imagem no lightbox', () => {
      const img = resultItems[0].querySelector('img');
      resultItems[0].click();

      expect(lightboxImg.src).toContain('caso-1.webp');
      expect(lightboxImg.alt).toBe('Caso 1 - Antes e depois');
    });

    it('adiciona classe .active ao lightbox', () => {
      resultItems[0].click();

      expect(lightbox.classList.contains('active')).toBe(true);
    });

    it('focus vai para botão fechar ao abrir', () => {
      resultItems[0].click();

      expect(document.activeElement).toBe(closeBtn);
    });

    it('Enter no result-item abre o lightbox', () => {
      resultItems[0].dispatchEvent(new KeyboardEvent('keydown', { 
        key: 'Enter', 
        bubbles: true 
      }));

      expect(lightbox.classList.contains('active')).toBe(true);
    });

    it('Space no result-item abre o lightbox', () => {
      resultItems[0].dispatchEvent(new KeyboardEvent('keydown', { 
        key: ' ', 
        bubbles: true 
      }));

      expect(lightbox.classList.contains('active')).toBe(true);
    });
  });

  describe('closeLightbox()', () => {
    it('Escape fecha o lightbox', () => {
      resultItems[0].click(); // abrir
      
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

      expect(lightbox.classList.contains('active')).toBe(false);
    });

    it('click no backdrop fecha o lightbox', () => {
      resultItems[0].click(); // abrir
      
      document.querySelector('.lightbox-backdrop').click();

      expect(lightbox.classList.contains('active')).toBe(false);
    });

    it('focus volta para o elemento que abriu o lightbox', () => {
      resultItems[0].focus();
      resultItems[0].click(); // abrir
      closeBtn.click(); // fechar

      expect(document.activeElement).toBe(resultItems[0]);
    });
  });
});
```

### Exemplo 3: Teste de Integração — Validação HTML/SEO

```js
// tests/integration/html-validation.test.js
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { Window } from 'happy-dom';

describe('Validação HTML - index.html', () => {
  let document;

  beforeAll(() => {
    const html = readFileSync(resolve(__dirname, '../../index.html'), 'utf-8');
    const window = new Window();
    window.document.write(html);
    document = window.document;
  });

  describe('Acessibilidade', () => {
    it('skip link presente e aponta para #main-content', () => {
      const skipLink = document.querySelector('a.skip-link');
      
      expect(skipLink).not.toBeNull();
      expect(skipLink.getAttribute('href')).toBe('#main-content');
    });

    it('#main-content existe como destino do skip link', () => {
      const mainContent = document.getElementById('main-content');
      
      expect(mainContent).not.toBeNull();
    });

    it('apenas um H1 na página', () => {
      const h1s = document.querySelectorAll('h1');
      
      expect(h1s.length).toBe(1);
    });

    it('todas as imagens possuem atributo alt', () => {
      const images = document.querySelectorAll('img');
      const semAlt = Array.from(images).filter(img => !img.hasAttribute('alt'));
      
      expect(semAlt).toHaveLength(0);
    });

    it('links target="_blank" possuem rel="noopener noreferrer"', () => {
      const externalLinks = document.querySelectorAll('a[target="_blank"]');
      
      externalLinks.forEach(link => {
        const rel = link.getAttribute('rel');
        expect(rel).toContain('noopener');
        expect(rel).toContain('noreferrer');
      });
    });
  });

  describe('SEO', () => {
    it('title tem no máximo 60 caracteres', () => {
      const title = document.querySelector('title');
      
      expect(title).not.toBeNull();
      expect(title.textContent.length).toBeLessThanOrEqual(60);
    });

    it('meta description tem entre 120 e 155 caracteres', () => {
      const meta = document.querySelector('meta[name="description"]');
      
      expect(meta).not.toBeNull();
      const content = meta.getAttribute('content');
      expect(content.length).toBeGreaterThanOrEqual(120);
      expect(content.length).toBeLessThanOrEqual(155);
    });

    it('Schema.org JSON-LD é válido e contém @type Dentist', () => {
      const script = document.querySelector('script[type="application/ld+json"]');
      
      expect(script).not.toBeNull();
      
      const schema = JSON.parse(script.textContent);
      expect(schema['@type']).toBe('Dentist');
      expect(schema.aggregateRating).toBeDefined();
      expect(schema.aggregateRating.ratingValue).toBeDefined();
    });

    it('Open Graph tags completas', () => {
      const requiredOG = ['og:title', 'og:description', 'og:image', 'og:url', 'og:type'];
      
      requiredOG.forEach(property => {
        const meta = document.querySelector(`meta[property="${property}"]`);
        expect(meta, `Faltando ${property}`).not.toBeNull();
        expect(meta.getAttribute('content')).not.toBe('');
      });
    });
  });
});
```


---

## 9. Métricas de Cobertura

### Metas de Cobertura

| Escopo | Statements | Branches | Functions | Lines |
|--------|-----------|----------|-----------|-------|
| **main.js (global)** | ≥ 90% | ≥ 85% | ≥ 90% | ≥ 90% |
| **Funções exportáveis** | 100% | 100% | 100% | 100% |
| **Event handlers** | ≥ 95% | ≥ 90% | 100% | ≥ 95% |

### Branches Críticos que DEVEM ser Cobertos

| Módulo | Branch | Justificativa |
|--------|--------|--------------|
| Menu Offcanva | Menu aberto vs. fechado | Acessibilidade - aria states |
| Menu Offcanva | Escape com menu aberto vs. fechado | Prevenção de comportamento inesperado |
| Focus Trap | Tab vs. Shift+Tab | Acessibilidade - navegação por teclado |
| Lightbox | Lightbox aberto vs. fechado ao pressionar Escape | Prevenir fechar outros elementos |
| Lightbox | Click no backdrop vs. click na imagem | UX - não fechar acidentalmente |
| Dark Mode | localStorage disponível vs. indisponível | Graceful degradation |
| Dark Mode | prefers-color-scheme dark vs. light | Respeitar preferência do sistema |
| Reduced Motion | matches: true vs. false | Acessibilidade - respeitar preferência |
| Active Section | isIntersecting: true vs. false | Correção do indicador visual |
| Fade-in | Elemento já visível (unobserve) vs. não visível | Performance - parar de observar |

### Relatórios de Cobertura

```bash
# Gerar relatório no terminal
npm run test:coverage

# Relatório HTML (abre em browser)
# Output: ./coverage/index.html

# Relatório LCOV (para CI/CD integration com codecov/coveralls)
# Output: ./coverage/lcov.info
```

### Threshold de Falha

O `vitest.config.js` já está configurado com thresholds. Se a cobertura cair abaixo dos valores definidos, o comando `npm run test:coverage` falhará com exit code 1, bloqueando o deploy.

---

## 10. CI/CD Integration

### 10.1 Scripts npm Completos

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui",
    "build:css": "./build-css.sh",
    "build": "npm run build:css",
    "lint:html": "npx html-validate index.html",
    "ci": "npm run test:coverage && npm run build:css"
  }
}
```

### 10.2 GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Testes e Validação

on:
  push:
    branches: [main, static-app]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [20.x, 22.x]

    steps:
      - name: Checkout código
        uses: actions/checkout@v4

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Instalar dependências
        run: npm ci

      - name: Rodar testes com cobertura
        run: npm run test:coverage

      - name: Build CSS
        run: npm run build:css

      - name: Upload relatório de cobertura
        if: matrix.node-version == '22.x'
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage/
          retention-days: 5

  validate:
    runs-on: ubuntu-latest
    needs: test
    
    steps:
      - name: Checkout código
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22.x
          cache: 'npm'

      - name: Instalar dependências
        run: npm ci

      - name: Validar HTML
        run: npx html-validate index.html
        continue-on-error: true

      - name: Validar sitemap
        run: |
          echo "Verificando se sitemap.xml é XML válido..."
          xmllint --noout sitemap.xml 2>/dev/null || echo "xmllint não disponível, pulando"

      - name: Verificar links internos
        run: |
          echo "Verificando se arquivos referenciados existem..."
          grep -oP 'href="(/[^"]*)"' index.html | sort -u | while read -r link; do
            path="${link#href=\"}"
            path="${path%\"}"
            if [[ "$path" == /* && ! -f ".${path}" && ! -d ".${path}" ]]; then
              echo "❌ Link quebrado: $path"
              exit 1
            fi
          done
          echo "✅ Todos os links internos válidos"
```

### 10.3 Proteção de Branch (Recomendações)

| Configuração | Valor | Motivo |
|-------------|-------|--------|
| Require status checks | `test` job | Testes devem passar |
| Require branches up to date | Sim | Prevenir conflitos |
| Require PR before merge | Sim | Code review |
| Dismiss stale reviews | Sim | Re-review após push |

### 10.4 Integração com Vercel

A Vercel já faz deploy automático a cada push na `main`. Com o workflow acima:

1. **Push para `static-app`** → Testes rodam no GitHub Actions
2. **PR para `main`** → Testes obrigatórios para merge
3. **Merge na `main`** → Deploy automático na Vercel (somente se testes passaram)

### 10.5 Ordem de Execução no Pipeline

```
┌─────────────────────────────────────────────────┐
│  1. npm ci (instalar dependências)              │
│  2. npm run test:coverage (testes + cobertura)  │
│  3. npm run build:css (build CSS produção)      │
│  4. Validação HTML (opcional, non-blocking)     │
│  5. ✅ Pronto para deploy (Vercel)              │
└─────────────────────────────────────────────────┘
```

---

## Observações Finais

### Refatoração Necessária no main.js

Para permitir testes unitários isolados, o `main.js` precisa de uma pequena refatoração:

1. **Extrair funções para módulos exportáveis:**
   ```js
   // assets/js/modules/menu.js
   export function toggleNav(hamburger, offcanva) { ... }
   export function trapFocusInOffcanva(offcanva) { ... }
   ```

2. **Ou usar padrão IIFE com exposição global para testes:**
   ```js
   // No final do main.js (apenas em dev)
   if (typeof window.__TEST__ !== 'undefined') {
     window.__menuModule = { toggleNav, trapFocusInOffcanva };
     window.__lightboxModule = { openLightbox, closeLightbox };
   }
   ```

3. **Abordagem recomendada:** Refatorar para ES modules com entry point que importa tudo. O bundler final (ou script inline) permanece o mesmo para produção.

### Prioridade de Implementação

| Prioridade | Testes | Justificativa |
|-----------|--------|--------------|
| 🔴 Alta | Lightbox, Menu Offcanva, Focus Trap | Acessibilidade crítica |
| 🟡 Média | Dark Mode, HTML Validation, SEO | Funcionalidade e conformidade |
| 🟢 Normal | Fade-in, CSS Properties, Active Section | Experiência visual |
| 🔵 Futuro | Treatment Pages, E2E com Playwright | Dependem da implementação multipage |

### Estimativa de Esforço

| Fase | Tempo Estimado | Entregável |
|------|---------------|-----------|
| Setup (config, mocks, helpers) | 2-3h | Infraestrutura de testes funcional |
| Testes unitários main.js | 4-6h | 45+ test cases cobrindo todos os módulos |
| Testes HTML/SEO | 2-3h | 20+ validações de markup e meta |
| Testes CSS | 1-2h | 12 validações de variáveis e media queries |
| Testes tratamentos (multipage) | 3-4h | 23+ testes por contexto de página |
| CI/CD workflow | 1h | GitHub Actions configurado |
| **Total** | **13-19h** | **100+ test cases** |
