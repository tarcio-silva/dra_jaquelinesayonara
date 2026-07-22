# Dra. Jaqueline Sayonara — Site Institucional

Site de divulgação de serviços odontológicos da **Dra. Jaqueline Sayonara**, cirurgiã-dentista especialista em Ortodontia, localizada em Sapé/PB.

🔗 **Produção:** https://www.drajaquelinesayonara.com.br/

## Sobre o Projeto

Landing page institucional com design moderno e performance otimizada, contendo informações sobre a profissional, tratamentos oferecidos, galeria de resultados, planos odontológicos aceitos, vídeo do consultório, localização e avaliações reais de pacientes.

### Lighthouse Scores

| Performance | Acessibilidade | SEO |
|:-----------:|:--------------:|:---:|
| 97/100 | 100/100 | 100/100 |

### Seções

| Seção | ID | Descrição |
|-------|------|-----------|
| Header/Hero | — | Layout split: foto da Dra. (42%) + logo, slogan, badge avaliações, CTA e horários |
| Sobre | `#about` | Apresentação profissional com foto, CRO e botão de ação |
| Tratamentos | `#care` | Grid de 7 cards: aparelho, clareamento, exodontia, facetas, profilaxia, prótese, restauração |
| Resultados | `#results` | Carousel de antes/depois com filtros, lightbox acessível e CTA contextual |
| Compare | `#compare` | Slider interativo antes/depois com arraste (CSS + JS) |
| Planos | `#plans` | Cards dos convênios aceitos (Clin e Unidentis) com links externos |
| Avaliações | — | 5 reviews reais do Google em cards responsivos (grid 1/2/3 colunas) |
| CTA Final | — | Call-to-action "Pronto para transformar seu sorriso?" com botão WhatsApp |
| Localização | `#location` | Vídeo do consultório + Google Maps lado a lado |
| Footer | — | Contato, responsável técnico, redes sociais |

### Funcionalidades

- Layout responsivo (mobile-first, breakpoint `max-width: 1199px` / `min-width: 1200px`)
- Menu off-canvas com backdrop overlay, swipe-to-close interativo, edge swipe para abrir, focus trap, `inert`, `aria-live` announcements, stagger animation e ícones SVG inline (mobile) + navbar glassmorphism com indicador de seção ativa (desktop)
- Dark mode com toggle acessível (`role="switch"`, `aria-checked`) — visível no desktop e mobile (offcanva)
- Fade-in on scroll (Intersection Observer)
- Lightbox acessível para resultados (`role="dialog"`, `aria-modal`, botão fechar, focus trap, keyboard navigation, setas prev/next, swipe mobile)
- Carousel de resultados com scroll-snap, autoplay (4s), filtros por tratamento e CTA contextual
- Avaliações estáticas (5 reviews reais do Google, sem dependência de API)
- Vídeo do consultório (autoplay, muted, loop; pausa automática em `prefers-reduced-motion`)
- Botão flutuante de WhatsApp
- Badge de avaliações no hero (prova social)
- Horários de atendimento visíveis
- SEO completo (Schema.org JSON-LD com aggregateRating, geo, areaServed, sameAs, Open Graph, Twitter Cards, sitemap, robots.txt)
- Acessibilidade WCAG AA (ARIA, skip link → `#main-content`, focus-visible, focus traps, contraste ≥4.5:1, `rel="noopener noreferrer"`)
- Redirect 301 para migração de domínio (via `vercel.json`)
- Persistência de tema (dark/light) via localStorage entre páginas
- Cards de tratamento clicáveis (card inteiro como link)
- Layout mosaico bento grid nos cards de tratamento
- Cache imutável para assets estáticos (font, img, js, css, media)
- Compare slider interativo antes/depois com arraste (CSS puro + JS para controle do handle)
- Scroll progress bar (indicador visual de progresso de rolagem no topo da página)
- Ripple effect nos CTAs (micro-interação de feedback visual ao clicar)

## Stack

| Tecnologia | Uso |
|-----------|-----|
| HTML5 | Estrutura semântica |
| CSS3 | Custom properties, CSS Grid, clamp(), @media (hover: hover) |
| JavaScript (vanilla) | Lógica do cliente (zero dependências) |
| LightningCSS 1.28.2 | Bundling e minificação CSS |
| Vitest 2 + happy-dom | Testes unitários e de integração |
| Vercel | Deploy (domínio custom + redirect 301 + cache headers) |
| Manrope | Fonte variável self-hosted (WOFF2 + TTF fallback) |

## Estrutura de Arquivos

```
├── index.html                 # Página principal (CSS inline para performance)
├── build-css.sh               # Script de build CSS
├── vitest.config.js           # Configuração dos testes
├── vercel.json                # Cache headers + redirect 301
├── robots.txt                 # Crawl rules + sitemap URL (www)
├── sitemap.xml                # URL canônica com www
├── docs/                      # Documentação do projeto
│   ├── adr/                   # Architecture Decision Records
│   ├── RESTRUCTURE.md         # Histórico de reorganização
│   ├── IMPLEMENTATION_PLAN.md # Plano de implementação multipage
│   ├── TEST_PLAN.md           # Plano de testes unitários
│   ├── MULTIPAGE_STRATEGY.md  # Estratégia SEO multipage
│   ├── OPTIMIZATION_GUIDE.md  # Guia de otimização Lighthouse
│   ├── DOMAIN_SETUP.md        # Configuração do domínio
│   ├── DESIGN_GUIDE.md        # Guia de design e referências
│   └── REFACTORING_GUIDE.md   # Histórico de refatorações
├── tests/                     # Testes unitários e de integração
│   ├── setup.js               # Setup global (mocks, cleanup)
│   ├── mocks/                 # Mocks (IntersectionObserver, matchMedia)
│   ├── helpers/               # Utilitários DOM e keyboard events
│   ├── fixtures/              # HTML fixtures para testes
│   ├── unit/                  # Testes unitários do main.js
│   └── integration/           # Testes de HTML, SEO, acessibilidade
├── assets/
│   ├── css/
│   │   ├── styles.css         # Entry point (importa módulos)
│   │   ├── styles.min.css     # Bundle minificado (produção)
│   │   ├── globalStyle.css    # Variáveis, tipografia, utilitários, hero-rating
│   │   ├── dark-theme.css     # Tema escuro (variáveis + overrides)
│   │   ├── treatment.css      # Estilos das páginas de tratamento
│   │   ├── about.css          # Seção Sobre
│   │   ├── cards.css          # Cards de tratamentos (Grid + hover)
│   │   ├── results.css        # Grid de resultados + lightbox
│   │   ├── plans.css          # Seção Planos Odontológicos
│   │   ├── rating.css         # Avaliações (cards em grid)
│   │   ├── cta-final.css      # Seção CTA final
│   │   ├── compare-slider.css # Slider interativo antes/depois
│   │   ├── micro-interactions.css # Scroll progress bar + ripple effect
│   │   ├── location.css       # Vídeo + mapa (split layout)
│   │   ├── footer.css         # Footer em colunas
│   │   └── header/            # Header, hamburger, offcanva, switch
│   ├── js/
│   │   └── main.js            # Menu (focus trap), lightbox (a11y), dark mode, observers
│   ├── img/
│   │   ├── about/             # Foto da profissional
│   │   ├── care/              # Imagens dos tratamentos
│   │   ├── header/            # Banner principal
│   │   ├── icons/             # Ícones do menu mobile
│   │   ├── plans/             # Logos dos planos (Clin, Unidentis)
│   │   └── results/           # Fotos antes/depois
│   ├── font/                  # Manrope variable font (WOFF2 + TTF)
│   └── media/
│       └── location.mp4       # Vídeo do consultório
└── tratamentos/               # Páginas individuais de tratamento
    ├── _template.html         # Template base (placeholders)
    ├── aparelho-ortodontico/  # (em desenvolvimento)
    ├── clareamento-dental/
    ├── exodontia/
    ├── facetas-dentarias/
    ├── profilaxia/
    ├── protese-dentaria/
    └── restauracao-dentaria/
├── atendimento/               # Páginas de área de atendimento (SEO local)
│   ├── riachao-do-poco/       # Riachão do Poço/PB
│   ├── pilar/                 # Pilar/PB
│   └── caldas-brandao/        # Caldas Brandão/PB
```

## Como Executar

```bash
# Instalar dependências
npm install

# Build CSS (bundle + minificação)
./build-css.sh

# Rodar testes
npm test

# Testes em modo watch
npm run test:watch

# Testes com cobertura
npm run test:coverage

# Servir localmente
npx serve .

# Rodar Lighthouse (opcional)
npx lighthouse http://localhost:3000 --only-categories=performance,accessibility,seo
```

## Testes

Suíte de testes automatizados com **Vitest** + **happy-dom**, cobrindo funcionalidades JavaScript, acessibilidade e SEO.

### Resultados

```
 ✓ tests/unit/menu-offcanva.test.js       (58 testes)
 ✓ tests/unit/lightbox.test.js            (15 testes)
 ✓ tests/integration/seo.test.js          (22 testes)
 ✓ tests/integration/html-validation.test.js (14 testes)
 ✓ tests/unit/dark-mode.test.js           (10 testes)
 ✓ tests/unit/fade-in.test.js             (6 testes)
 ✓ tests/unit/active-section.test.js      (5 testes)
 ✓ tests/unit/reduced-motion.test.js      (3 testes)
 ✓ tests/integration/treatment-pages.test.js (210 testes)

 Test Files  9 passed
      Tests  348 passed
   Duration  ~1s
```

### Cobertura por Módulo

| Módulo (main.js) | Testes | Funcionalidades cobertas |
|------------------|--------|--------------------------|
| Menu Offcanva | 58 | toggle, aria-expanded, focus trap, backdrop, swipe interativo, edge swipe, aria-live, inert, stagger, seção ativa mobile |
| Lightbox | 15 | open/close, keyboard (Enter/Space/Escape), backdrop, focus management |
| SEO (integração) | 22 | meta tags, OG, Twitter, Schema.org, sitemap, robots.txt |
| HTML (integração) | 14 | skip link, ARIA, headings, alt, rel, semântica |
| Dark Mode | 10 | toggle, aria-checked, sincronização desktop ↔ mobile, persistência localStorage |
| Fade-in | 6 | IntersectionObserver, .visible, unobserve |
| Active Section | 5 | threshold 0.3, .active, remoção de outros |
| Reduced Motion | 3 | pausa vídeo, remove autoplay |
| Tratamentos (integração) | 210 | acessibilidade, SEO, Schema.org, estrutura, performance (7 páginas × 30 checks) |

### Estrutura de Testes

```
tests/
├── setup.js                       # Setup global: mocks de IO e matchMedia, cleanup
├── mocks/
│   ├── intersection-observer.js   # Mock com triggerIntersection() helper
│   └── match-media.js             # Mock com setMediaQuery() helper
├── helpers/
│   ├── dom-utils.js               # Fixtures reutilizáveis (menu, lightbox, dark-mode, etc.)
│   └── keyboard-events.js         # pressKey, pressTab, pressEscape, pressEnter, pressSpace
├── fixtures/
│   └── home.html                  # Fixture simplificada do index.html
├── unit/                          # Testes unitários do main.js
│   ├── menu-offcanva.test.js
│   ├── lightbox.test.js
│   ├── dark-mode.test.js
│   ├── fade-in.test.js
│   ├── active-section.test.js
│   └── reduced-motion.test.js
└── integration/                   # Testes de validação do HTML e SEO
    ├── html-validation.test.js
    ├── seo.test.js
    └── treatment-pages.test.js
```

### Executando

```bash
npm test                # Roda todos os testes uma vez
npm run test:watch      # Modo watch (re-roda ao salvar)
npm run test:coverage   # Gera relatório de cobertura (v8)
```

Consulte [`TEST_PLAN.md`](./docs/TEST_PLAN.md) para o plano completo com todos os test cases detalhados.

## Deploy

Deploy automático na **Vercel** a cada push na branch `main`.

O `vercel.json` configura:
- **Redirect 301:** Tráfego de `*.vercel.app` → `www.drajaquelinesayonara.com.br`
- **Cache imutável** (1 ano) para: `/assets/css/`, `/assets/font/`, `/assets/img/`, `/assets/js/`, `/assets/media/`

### Configuração do Domínio

Consulte [`DOMAIN_SETUP.md`](./docs/DOMAIN_SETUP.md) para instruções de configuração do domínio `drajaquelinesayonara.com.br` na Vercel e no registrador DNS.

## Design System

```css
:root {
  --logo-pallete-petal-rose: #fae7eb;    /* Background suave */
  --logo-pallete-velvety-cherry: #a25356; /* Cor primária */
  --logo-pallete-light: #fff;             /* Texto sobre fundos escuros */
  --color-bg: #fdfbfc;                    /* Background geral */
  --color-surface: #ffffff;               /* Cards/superfícies */
  --color-text: #2d2d2d;                  /* Texto principal */
  --color-text-muted: #6b4a4c;           /* Texto secundário (5.8:1 WCAG AA) */
  --color-accent: #a85860;               /* Hover/destaque (4.6:1 WCAG AA) */
}
```

- **Fonte:** Manrope (variable, 200-800, `font-display: swap`)
- **Base:** 62.5% (1rem = 10px)
- **Tipografia:** `clamp()` responsiva
- **Sombras:** sm/md/lg com matiz cherry
- **Border-radius:** 16px (cards), 50px (botões)
- **Cores de texto:** Todas via variáveis CSS (exceto marcas externas: Google ★, WhatsApp)
- **Dark mode:** Variáveis override em `.dark-theme` — `--color-text-muted: #b8a8ab` (7.0:1 sobre fundo escuro)

## Acessibilidade

- Skip link para `#main-content`
- Focus trap no menu offcanva (Tab/Shift+Tab circular, Escape para fechar)
- `aria-live` region anuncia abertura/fechamento do menu para screen readers
- `inert` no conteúdo principal quando menu aberto
- Focus trap no lightbox (Tab preso no botão fechar)
- `role="dialog"` + `aria-modal="true"` no lightbox
- `role="switch"` + `aria-checked` no toggle de dark mode
- `role="button"` + `tabindex="0"` nos result-items (keyboard: Enter/Space)
- Contraste mínimo 4.5:1 em todas as combinações de cor (WCAG AA)
- `aria-label` no vídeo, botões e links de redes sociais
- `rel="noopener noreferrer"` em todos os links `target="_blank"`
- `prefers-reduced-motion`: pausa vídeos autoplay, desabilita animações

## SEO

- Canonical URL: `https://www.drajaquelinesayonara.com.br/`
- Schema.org JSON-LD: `Dentist` com aggregateRating (5.0/5, 7 reviews), geo, areaServed, sameAs
- Open Graph completo (title, description, image, url, type, locale, site_name)
- Twitter Cards (summary_large_image com title, description, image)
- Meta description otimizada (152 chars)
- Keywords relevantes sem typos
- Sitemap XML com lastmod atualizado
- Redirect 301 de domínio legado

## Convênios Aceitos

| Plano | Site |
|-------|------|
| Clin | https://planoclin.com.br |
| Unidentis | https://unidentis.com.br |

## Branches

| Branch | Descrição |
|--------|-----------|
| `main` | Produção — deploy automático via Vercel |
| `develop` | Branch de trabalho/desenvolvimento |

**Fluxo:** Trabalho na `develop` → merge/PR para `main` quando pronto para produção.

## Documentação Complementar

- [`OPTIMIZATION_GUIDE.md`](./docs/OPTIMIZATION_GUIDE.md) — Guia de otimização (24 tasks, resultados Lighthouse)
- [`IMPROVEMENT_PLAN.md`](./docs/IMPROVEMENT_PLAN.md) — Plano de melhorias (Fases 1-4)
- [`RESULTS_IMPROVEMENT_GUIDE.md`](./docs/RESULTS_IMPROVEMENT_GUIDE.md) — Melhorias da seção de resultados
- [`RESULTS_TEMPLATE_GUIDE.md`](./docs/RESULTS_TEMPLATE_GUIDE.md) — Template Canva para fotos antes/depois
- [`DOMAIN_SETUP.md`](./docs/DOMAIN_SETUP.md) — Configuração do domínio (Vercel + DNS)
- [`DESIGN_GUIDE.md`](./docs/DESIGN_GUIDE.md) — Guia de design e referências visuais
- [`REFACTORING_GUIDE.md`](./docs/REFACTORING_GUIDE.md) — Histórico de refatorações e melhorias
- [`MULTIPAGE_STRATEGY.md`](./docs/MULTIPAGE_STRATEGY.md) — Estratégia SEO multipage
- [`IMPLEMENTATION_PLAN.md`](./docs/IMPLEMENTATION_PLAN.md) — Plano de implementação multipage
- [`TEST_PLAN.md`](./docs/TEST_PLAN.md) — Plano de testes unitários
- [`OFFCANVA_EVOLUTION_GUIDE.md`](./docs/OFFCANVA_EVOLUTION_GUIDE.md) — Evolução do menu offcanva mobile (Fases 1-3)

## Contato

- 📱 WhatsApp: [(83) 99405-8749](https://wa.me/+5583994058749)
- 📷 Instagram: [@drajaquelinesayonara](https://www.instagram.com/drajaquelinesayonara/)
- 📘 Facebook: [Dra Jaqueline Sayonara](https://www.facebook.com/drajaquelinesayonara)
- 🏥 CRO-PB: 9833
