# Componentes

Documentação técnica dos componentes interativos e visuais do site.

---

## Header / Navegação

### Desktop — Navbar Glassmorphism

**Arquivo CSS:** `assets/css/header/header.css`  
**Classe principal:** `.header-nav`

```css
.header-nav {
  position: fixed;
  height: 64px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  z-index: 100;
}
```

**Estrutura:**
- `.header-nav-logo` — Logo 32x32px com link para home
- `.header-nav-links` — Lista de links com indicador de seção ativa
- `.header-nav-actions` — Toggle dark mode + redes sociais + botão CTA "Agendar"

**Indicador de seção ativa:**
- Classe `.active` adicionada via JS (`IntersectionObserver`, `threshold: 0.3`)
- Aplica-se a `.header-link` no desktop e `.offcanva-nav--link` no mobile
- Estilo: `background-color: rgba(162, 83, 86, 0.1)` com `border-radius: 8px`

**Visibilidade:**
- `≥1200px`: navbar completa visível
- `<1200px`: `.header-nav-links` e `.header-nav-actions` ficam `display: none`, hamburger aparece

### Mobile — Hamburger Button

**Arquivo CSS:** `assets/css/header/hamburger.css`  
**Classe:** `.hamburger.hamburger--slider`  
**ID:** `#hamburger-button`

- Posição fixa (`top: 8px`, `right: 16px`, `z-index: 1010`)
- Animação slider: 3 barras → X ao abrir (via `.is-active`)
- `aria-label="Abrir menu"`, `aria-expanded="false"`, `aria-controls="offcanva"`
- Escondido em `≥1200px` (`display: none`)

---

## Menu Offcanva (Mobile)

**Arquivos:**
- CSS: `assets/css/header/offcanva.css`
- JS: `assets/js/main.js` (primeiro módulo)

**Classe:** `.offcanva`  
**ID:** `#offcanva`

### Estrutura Visual

```
.offcanva
├── .offcanva-identity       → Avatar + nome + CRO
├── .offcanva-nav--social    → Links sociais (Instagram, Facebook, WhatsApp) com SVG inline
├── .offcanva-nav            → Links de navegação com ícones SVG
├── .offcanva-dark-mode      → Toggle de tema escuro + label
└── .offcanva-cta            → Botão WhatsApp "Agendar consulta"
```

### Funcionalidades

| Feature | Implementação |
|---------|---------------|
| **Abrir/fechar** | `toggleNav()` → toggle `.is-open` |
| **Focus trap** | `trapFocusInOffcanva(e)` — Tab circular entre focusáveis |
| **Backdrop** | `#offcanva-backdrop` com `.is-visible`, click fecha menu |
| **Swipe para fechar** | Touch events no offcanva, threshold 80px, feedback visual (translateX) |
| **Edge swipe para abrir** | Touch na borda esquerda (20px), swipe horizontal > 80px abre |
| **Inert** | `mainContent.setAttribute("inert", "")` quando aberto |
| **Aria-live** | Region criada dinamicamente, anuncia "Menu de navegação aberto/fechado" |
| **Escape** | `keydown` Escape fecha o menu |
| **Foco inicial** | Primeiro link (`offCanva.querySelector("a")`) recebe foco ao abrir |
| **Restaurar foco** | `hamburgerButton.focus()` ao fechar |

### Classes CSS Relevantes

| Classe | Estado |
|--------|--------|
| `.offcanva` | Menu base (oculto, `transform: translate(-100%)`) |
| `.offcanva.is-open` | Menu visível (`transform: translate(0)`) |
| `.offcanva-backdrop.is-visible` | Backdrop escuro ativo |
| `.hamburger.is-active` | Hamburger animado (X) |
| `.offcanva-nav--link.active` | Link da seção atual em destaque |

### Acessibilidade

- `role="navigation"` + `aria-label="Menu principal"`
- `aria-hidden="true"` quando fechado, `"false"` quando aberto
- Focus trap impede Tab de sair do menu
- `inert` no `#main-content` impede interação com conteúdo atrás
- Backdrop com `aria-hidden`
- Anúncios via `aria-live="polite"` para screen readers

---

## Dark Mode

**Arquivos:**
- CSS: `assets/css/dark-theme.css` + `assets/css/header/switch-button.css`
- JS: `assets/js/main.js` (módulo Dark Mode)

### Toggles (3 instâncias sincronizadas)

| ID/Classe | Localização |
|-----------|-------------|
| `#dark-mode-button` | Desktop navbar (`.header-nav-actions`) |
| `.dark-mode-toggle-mobile` | Offcanva mobile (`.offcanva-dark-mode`) |
| `.dark-mode-toggle-nav` | Header mobile (se existir) |

### Funcionamento

1. **Toggle:** `<input type="checkbox" role="switch" aria-checked="false">`
2. **Ativação:** Adiciona/remove `.dark-theme` no `<body>`
3. **Persistência:** `localStorage.setItem("theme", "dark" | "light")`
4. **Restauração:** No load, lê `localStorage.getItem("theme")` e aplica
5. **Sincronização:** `toggleDarkMode()` atualiza os 3 toggles simultaneamente

### Variáveis Dark Mode

```css
.dark-theme {
  --color-bg: #1a1218;
  --color-surface: #2a1f23;
  --color-text: #f5f0f1;
  --color-text-muted: #b8a8ab;        /* 7.0:1 contraste */
  --logo-pallete-velvety-cherry: #d4888b;
  --logo-pallete-petal-rose: #2a1f23;
  --color-accent: #e09498;
}
```

### Switch CSS

```css
.switch { width: 44px; height: 20px; }
.slider.round { border-radius: 34px; }
input:checked + .slider { background-color: #a25356; }
input:checked + .slider::before { transform: translate(20px); }
```

---

## Lightbox (Galeria de Resultados)

**Arquivos:**
- CSS: `assets/css/results.css` (seção `.lightbox`)
- JS: `assets/js/main.js` (módulo Lightbox)

### Estrutura HTML

```html
<div id="lightbox" class="lightbox" role="dialog" aria-modal="true">
  <button class="lightbox-close">×</button>
  <button class="lightbox-prev">‹</button>
  <button class="lightbox-next">›</button>
  <img src="" alt="">
  <span class="lightbox-counter">1 / 6</span>
  <a class="lightbox-cta" href="...">Quero transformar meu sorriso</a>
</div>
```

### Funcionalidades

| Feature | Implementação |
|---------|---------------|
| **Abrir** | Click ou Enter/Space em `.result-item` → `openLightbox(index)` |
| **Fechar** | Click no X, click no backdrop, Escape |
| **Navegação** | Setas ← → (teclado), botões prev/next, swipe mobile (threshold 50px) |
| **Focus trap** | Tab circular entre botões e link CTA |
| **Contador** | `.lightbox-counter` → "N / total" |
| **CTA contextual** | `data-cta-text` e `data-cta-link` no `.result-item` |
| **Restaurar foco** | `lastFocusedElement.focus()` ao fechar |

### Interação com Filtros

- `getVisibleItems()` retorna apenas itens não ocultos (`.hidden`)
- Navegação prev/next respeita filtro ativo
- Índice relativo aos itens visíveis

---

## Carousel de Resultados

**Arquivos:**
- CSS: `assets/css/results.css` (`.results-carousel`, `.carousel-*`)
- JS: `assets/js/main.js` (módulo Carousel)

### Estrutura

```html
<div class="carousel-wrapper">
  <button class="carousel-prev">‹</button>
  <div class="results-carousel">
    <div class="result-item" data-category="clareamento">
      <img src="..." alt="...">
      <div class="result-label"><span>Clareamento</span></div>
    </div>
    <!-- ... -->
  </div>
  <button class="carousel-next">›</button>
  <div class="carousel-dots"></div>
</div>
```

### Funcionalidades

| Feature | Detalhes |
|---------|----------|
| **Scroll-snap** | `scroll-snap-type: x mandatory` + `scroll-snap-align: start` |
| **Autoplay** | 4000ms intervalo, pausa ao interagir, retoma após 8000ms |
| **Dots** | Gerados dinamicamente via `updateCarouselDots()` |
| **Arrows** | `carousel-prev`/`carousel-next`, desabilitados nos extremos |
| **Items por view** | Calculado dinamicamente: mobile 2, tablet 3, desktop 4 |
| **Resize** | Recalcula dots e estado ao redimensionar |
| **Reduced motion** | Autoplay desabilitado se `prefers-reduced-motion: reduce` |
| **Filtros** | Botões `.filter-btn[data-filter]` ocultam/mostram por `data-category` |

### Funções JS

- `getVisibleCarouselItems()` — items não `.hidden`
- `getItemsPerView()` — baseado em `clientWidth / itemWidth`
- `getTotalPages()` — `ceil(items / perView)`
- `getCurrentPage()` — baseado em `scrollLeft`
- `scrollToPage(page)` — scroll suave para posição calculada
- `updateCarouselDots()` — regenera dots no DOM
- `updateCarouselState()` — disabled/active states

---

## Compare Slider (Antes/Depois)

**Arquivos:**
- CSS: `assets/css/compare-slider.css`
- JS: `assets/js/main.js` (IIFE `initCompareSliders()`)

### Estrutura HTML

```html
<div class="compare-slider">
  <div class="compare-after"><img src="depois.webp" alt="Depois"></div>
  <div class="compare-before"><img src="antes.webp" alt="Antes"></div>
  <div class="compare-handle">
    <div class="compare-handle-circle"><svg>...</svg></div>
  </div>
  <input type="range" class="compare-range" min="0" max="100" value="50" aria-label="Comparar antes e depois">
  <span class="compare-label compare-label--before">Antes</span>
  <span class="compare-label compare-label--after">Depois</span>
</div>
```

### Funcionamento

1. **CSS `clip-path`:** `before.style.clipPath = inset(0 ${100 - value}% 0 0)`
2. **Range input:** Invisível (`opacity: 0`) mas acessível — `z-index: 10`
3. **Handle visual:** Linha branca + círculo com ícone de setas
4. **Pointer events:** `pointerdown` → `pointermove` → `pointerup` no slider
5. **Acessibilidade:** Range input permite controle via teclado (setas)

### CSS Relevante

```css
.compare-slider {
  aspect-ratio: 4/3;
  max-width: 600px;
  border-radius: 16px;
  touch-action: none;
  user-select: none;
}
.compare-before {
  clip-path: inset(0 50% 0 0);  /* Valor inicial */
  z-index: 2;
}
```

---

## FAQ Accordion

**Arquivos:**
- CSS: `assets/css/faq.css` (home) + `assets/css/treatment.css` (páginas de tratamento)
- HTML: Elementos nativos `<details>` / `<summary>`

### Estrutura

```html
<section class="faq-section fade-in" id="faq">
  <div>
    <h2 class="section-title">Perguntas Frequentes</h2>
    <div class="faq-container">
      <details>
        <summary>Pergunta aqui?</summary>
        <p>Resposta aqui.</p>
      </details>
      <!-- ... -->
    </div>
  </div>
</section>
```

### Estilo

- Ícone `+` / `−` via `summary::before` (CSS puro)
- `summary::-webkit-details-marker { display: none }` — remove marker padrão
- `details[open]` → `box-shadow: var(--shadow-sm)` (elevação sutil)
- Dark mode: background e borda adaptados

### Schema.org

Cada FAQ na home gera structured data `FAQPage` para rich snippets no Google:

```json
{
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "...", "acceptedAnswer": { "@type": "Answer", "text": "..." } }
  ]
}
```

---

## Cards de Tratamentos (Grid Mosaico)

**Arquivo CSS:** `assets/css/cards.css`  
**Classe container:** `.cards-container`

### Layout Responsivo

| Viewport | Colunas | Detalhes |
|----------|---------|----------|
| Mobile (`<600px`) | 2 | Último card ocupa largura total |
| Tablet (`600–1199px`) | 3 | Card 1 e último = span 2 cols |
| Desktop (`≥1200px`) | 4 cols, 2 rows (240px) | Card 1 = span 2x2 (destaque bento) |

### Estrutura de Card

```html
<div class="card-container">
  <a class="card" href="/tratamentos/clareamento-dental/">
    <img src="..." alt="..." loading="lazy">
    <div class="card-description">
      <h3>Clareamento Dental</h3>
      <p>Dentes mais brancos e sorriso radiante...</p>
      <span class="card-link">Saiba mais →</span>
    </div>
  </a>
</div>
```

### Interações

- **Hover (desktop):** `transform: translateY(-6px)` + `box-shadow: var(--shadow-lg)` + imagem `scale(1.08)`
- **Active (mobile/tablet):** `transform: scale(0.97)` com `transition: 0.1s`
- **Card inteiro é link:** `<a class="card">` envolve todo o conteúdo
- **Overlay gradient:** `linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 70%)`
- **Link "Saiba mais":** aparece com `opacity: 0 → 1` e `translateY(8px → 0)` no hover (desktop)

---

## Micro-Interações

**Arquivo CSS:** `assets/css/micro-interactions.css`  
**JS:** IIFEs `initScrollProgress()` e `initRipple()` em `main.js`

### Scroll Progress Bar

```css
.scroll-progress {
  position: fixed;
  top: 64px;         /* Abaixo da navbar (52px em mobile) */
  left: 0;
  height: 3px;
  background: var(--logo-pallete-velvety-cherry);
  z-index: 101;
  width: 0%;
}
```

**JS:** Calcula `(scrollY / (docHeight - windowHeight)) * 100` e aplica como `width`.

### Ripple Effect nos CTAs

```css
.btn-cta .ripple {
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  transform: scale(0);
  animation: ripple-animation 0.6s linear;
}
```

**JS:** Event delegation em `document` → `e.target.closest('.btn-cta')` → cria `<span class="ripple">` posicionado no ponto do click → remove após `animationend`.

### Reduced Motion

Ambos verificam `prefers-reduced-motion: reduce` e retornam sem inicializar:
```javascript
if (prefersReduced) return;
```

CSS complementar:
```css
@media (prefers-reduced-motion: reduce) {
  .scroll-progress { display: none; }
  .btn-cta .ripple { display: none; }
}
```

---

## Botão Flutuante WhatsApp

**Arquivo CSS:** `assets/css/globalStyle.css`  
**Classe:** `.whatsapp-float`

```html
<a href="https://wa.me/+5583994058749/?text=..." class="whatsapp-float"
   aria-label="Agendar pelo WhatsApp" target="_blank" rel="noopener noreferrer">
  <svg>...</svg>
</a>
```

### Estilo

- Posição fixa: `bottom: 24px; right: 24px` (+ `safe-area-inset-bottom` em mobile)
- Background: `#25d366` (verde WhatsApp)
- Tamanho: 56x56px, border-radius 50%
- Hover: `transform: scale(1.1)`
- Animação de entrada: `floatIn` com delay de 2s (fade + scale + translateY)
- `z-index: 999`

---

## Fade-in on Scroll

**Arquivo CSS:** `assets/css/globalStyle.css` (classes `.fade-in` e `.fade-in.visible`)  
**JS:** `assets/js/main.js` (módulo Fade-in)

### CSS

```css
.fade-in {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}
```

### JS

```javascript
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("visible");
      fadeObserver.unobserve(e.target);  // Dispara apenas uma vez
    }
  });
}, { threshold: 0.05 });
```

### Uso

Adicionar `class="fade-in"` em qualquer `<section>` ou elemento que deve animar ao entrar no viewport.

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .fade-in { opacity: 1; transform: none; }
}
```

---

## Avaliações (Reviews)

**Arquivo CSS:** `assets/css/rating.css`

### Características

- 5 reviews reais do Google (estáticos, sem API)
- Grid responsivo: 1 col (mobile) → 2 cols (tablet) → 3 cols (desktop)
- Cards com nome, nota em estrelas (★), texto do review
- Classe `.review-card` com background `var(--color-surface)`

---

## Seção Localização

**Arquivo CSS:** `assets/css/location.css`

### Estrutura

- Layout split: vídeo do consultório (esquerda) + Google Maps embed (direita)
- Vídeo com lazy load via `data-src` (evita download de ~5.8MB no carregamento)
- `autoplay`, `muted`, `loop` — pausado se `prefers-reduced-motion`
- CTA com link para Google Maps

---

## Planos Odontológicos

**Arquivo CSS:** `assets/css/plans.css`

- Cards dos convênios: Clin e Unidentis
- Logo do plano + nome + link externo
- `.plan-card-name` para o título do plano
