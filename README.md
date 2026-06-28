# Dra. Jaqueline Sayonara — Site Institucional

Site de divulgação de serviços odontológicos da **Dra. Jaqueline Sayonara**, cirurgiã-dentista especialista em Ortodontia, localizada em Sapé/PB.

🔗 **Produção:** https://drajaquelinesayonara.vercel.app/

## Sobre o Projeto

Landing page institucional com design moderno e performance otimizada, contendo informações sobre a profissional, tratamentos oferecidos, galeria de resultados, vídeo do consultório, localização e avaliações de pacientes via Google Places API.

### Seções

| Seção | ID | Descrição |
|-------|------|-----------|
| Header/Hero | — | Layout split: foto da Dra. (42%) + logo, slogan e CTA "Agende sua consulta" |
| Sobre | `#about` | Apresentação profissional com foto, CRO e botão de ação |
| Tratamentos | `#care` | Grid de 7 cards: aparelho, clareamento, exodontia, facetas, profilaxia, prótese, restauração |
| Resultados | `#results` | Grid de antes/depois com lightbox zoom e hover reveal |
| Avaliações | — | Reviews do Google em cards responsivos (grid 1/2/3 colunas) |
| Localização | `#location` | Vídeo do consultório + Google Maps lado a lado |
| Footer | — | Contato, responsável técnico, redes sociais |

### Funcionalidades

- Layout responsivo (mobile-first, breakpoint 1200px)
- Menu off-canvas animado (mobile) + navbar glassmorphism com indicador de seção ativa (desktop)
- Dark mode com toggle acessível
- Fade-in on scroll (Intersection Observer)
- Lightbox para imagens de resultados
- Avaliações do Google via serverless function (skeleton loading)
- Vídeo do consultório (autoplay, muted, loop)
- Botão flutuante de WhatsApp
- SEO completo (Schema.org JSON-LD, Open Graph, Twitter Cards, sitemap, robots.txt)
- Acessibilidade (ARIA, skip link, focus-visible, alt texts em português)

## Stack

| Tecnologia | Uso |
|-----------|-----|
| HTML5 | Estrutura semântica |
| CSS3 | Custom properties, CSS Grid, clamp(), scroll-snap |
| JavaScript ES Modules | Lógica do cliente (vanilla, zero dependências) |
| LightningCSS 1.28.2 | Bundling e minificação CSS |
| Google Places API | Avaliações de pacientes (serverless) |
| Vercel | Deploy + Serverless Functions |
| Manrope | Fonte variável (WOFF2 + TTF fallback) |

## Estrutura de Arquivos

```
├── index.html                 # Página principal (CSS inline para performance)
├── build-css.sh               # Script de build CSS
├── api/
│   └── get-reviews.js         # Serverless function — Google Places API
├── assets/
│   ├── css/
│   │   ├── styles.css         # Entry point (importa módulos)
│   │   ├── styles.min.css     # Bundle minificado (produção)
│   │   ├── globalStyle.css    # Variáveis, tipografia, utilitários
│   │   ├── dark-theme.css     # Tema escuro
│   │   ├── about.css          # Seção Sobre
│   │   ├── cards.css          # Cards de tratamentos (Grid + hover)
│   │   ├── results.css        # Grid de resultados + lightbox
│   │   ├── rating.css         # Avaliações (cards em grid + skeleton)
│   │   ├── location.css       # Vídeo + mapa (split layout)
│   │   ├── footer.css         # Footer em colunas
│   │   └── header/            # Header, hamburger, offcanva, switch, a11y
│   ├── js/
│   │   └── main.js            # Lógica: menu, reviews, observers, lightbox
│   ├── img/                   # Imagens (WebP otimizadas)
│   ├── font/                  # Manrope variable font
│   └── media/
│       └── location.mp4       # Vídeo do consultório
├── robots.txt
├── sitemap.xml
└── vercel.json
```

## Como Executar

```bash
# Instalar dependências
npm install

# Build CSS (bundle + minificação)
./build-css.sh

# Servir localmente
npx serve .
```

> A serverless function `/api/get-reviews` requer variável `GOOGLE_PLACES_API_KEY` configurada na Vercel.

## Deploy

Deploy automático na **Vercel** a cada push. Variável de ambiente necessária:

| Variável | Descrição |
|----------|-----------|
| `GOOGLE_PLACES_API_KEY` | Chave da Google Places API (restrita ao domínio) |

## Design System

```css
:root {
  --logo-pallete-petal-rose: #fae7eb;    /* Background suave */
  --logo-pallete-velvety-cherry: #a25356; /* Cor primária */
  --color-bg: #fdfbfc;                    /* Background geral */
  --color-surface: #ffffff;               /* Cards/superfícies */
  --color-text: #2d2d2d;                  /* Texto principal */
  --color-text-muted: #6b6b6b;           /* Texto secundário */
  --color-accent: #c8727a;               /* Hover/destaque */
}
```

- **Fonte:** Manrope (variable, 200-800, `font-display: swap`)
- **Base:** 62.5% (1rem = 10px)
- **Tipografia:** `clamp()` responsiva
- **Sombras:** sm/md/lg com matiz cherry
- **Border-radius:** 16px (cards), 50px (botões)

## Branches

| Branch | Descrição | Stack |
|--------|-----------|-------|
| `main` | Versão atual em produção | HTML5, CSS3, JS vanilla, LightningCSS |
| `static-app` | Versão legada estática | HTML5, CSS3, jQuery, Owl Carousel |
| `react-app` | Versão SPA em React | React 18, Vite 6, Styled Components, Recoil |

## Documentação Complementar

- [`README_STATIC.md`](./README_STATIC.md) — Documentação técnica detalhada
- [`DESIGN_GUIDE.md`](./DESIGN_GUIDE.md) — Guia de design e referências visuais
- [`REFACTORING_GUIDE.md`](./REFACTORING_GUIDE.md) — Histórico de refatorações e melhorias

## Contato

- 📱 WhatsApp: [(83) 99405-8749](https://wa.me/+5583994058749)
- 📷 Instagram: [@drajaquelinesayonara](https://www.instagram.com/drajaquelinesayonara/)
- 📘 Facebook: [Dra Jaqueline Sayonara](https://www.facebook.com/drajaquelinesayonara)
- 🏥 CRO-PB: 9833
