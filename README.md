# Dra. Jaqueline Sayonara — Site Estático (static-app)

Landing page institucional estática para a **Dra. Jaqueline Sayonara**, cirurgiã-dentista especialista em Ortodontia — Sapé/PB.

🔗 **Produção:** https://drajaquelinesayonara.vercel.app/

## Stack

| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| HTML5 | — | Estrutura semântica |
| CSS3 | — | Estilização modular com custom properties |
| JavaScript | ES Modules | Lógica do cliente (dark mode, reviews, menu) |
| jQuery | 3.7.1 | Manipulação DOM para carrossel |
| Owl Carousel | 2.3.4 | Carrossel de resultados |
| normalize.css | 8.0.1 | Reset CSS cross-browser |
| Google Places API | — | Avaliações de pacientes |
| Vercel | — | Deploy e Serverless Functions |

## Estrutura de Arquivos

```
├── index.html                 # Página principal
├── api/
│   ├── get-reviews.js         # Serverless function (Vercel) — Google Places API
│   └── service.js             # Serviço client-side (legado)
├── assets/
│   ├── css/
│   │   ├── globalStyle.css    # Variáveis, tipografia, reset base
│   │   ├── dark-theme.css     # Tema escuro
│   │   ├── about.css          # Seção Sobre
│   │   ├── cards.css          # Cards de tratamentos
│   │   ├── results.css        # Seção Resultados
│   │   ├── rating.css         # Seção Avaliações + skeleton loading
│   │   ├── location.css       # Seção Localização (iframe mapa)
│   │   ├── footer.css         # Rodapé
│   │   ├── header/
│   │   │   ├── header.css     # Banner, navbar, logo
│   │   │   ├── hamburger.css  # Botão hamburger animado
│   │   │   ├── offcanva.css   # Menu off-canvas mobile
│   │   │   ├── switch-button.css  # Toggle dark mode
│   │   │   └── accsessebility-buttons.css
│   │   └── owl/
│   │       ├── owl.carousel.min.css
│   │       └── owl.theme.default.min.css
│   ├── js/
│   │   ├── main.js            # Lógica principal (reviews, skeleton, menu)
│   │   ├── jquery.min.js      # jQuery 3.7.1
│   │   └── owl.carousel.min.js
│   ├── img/                   # Imagens (webp, png)
│   └── font/
│       └── Manrope-VariableFont_wght.ttf
├── robots.txt
├── sistemap.xml               # Sitemap (typo no nome)
├── google962378b089d1b19d.html # Verificação Google Search Console
├── package.json
└── package-lock.json
```

## Seções da Página

| Seção | ID | Descrição |
|-------|------|-----------|
| Header | `#home` | Banner com foto, logo, slogan "Cuidado, Saúde, Autoestima" |
| Sobre | `#about` | Apresentação da profissional |
| Tratamentos | `#care` | 7 cards: aparelho, clareamento, exodontia, facetas, profilaxia, prótese, restauração |
| Resultados | `#results` | Carrossel Owl Carousel com antes/depois |
| Avaliações | — | Reviews do Google com skeleton loading |
| Localização | `#location` | Iframe Google Maps |
| Footer | — | Contato, redes sociais, CRO |

## Funcionalidades

- **Responsividade** — Breakpoint em 1200px (min-device-width); menu hamburger no mobile, navbar fixa no desktop
- **Dark Mode** — Toggle via checkbox que aplica classe `.dark-theme` no body
- **Avaliações Google** — Serverless function (`/api/get-reviews.js`) consulta Google Places API e renderiza no client
- **Skeleton Loading** — Placeholder animado enquanto reviews carregam
- **Carrossel** — Owl Carousel com autoplay, loop e responsividade (1/2/3 itens)
- **SEO** — Meta tags, canonical, robots.txt, sitemap, Google Search Console

## Design System

```css
:root {
  --logo-pallete-petal-rose: #fae7eb;
  --logo-pallete-velvety-cherry: #a25356;
  --logo-pallete-light: #fff;
  --logo-pallete--dark: #000;
}
```

- **Fonte:** Manrope (variable font, local)
- **Base font-size:** 62.5% (1rem = 10px)

## Como Executar

```bash
# Instalar dependência (normalize.css)
npm install

# Servir localmente
npx serve .
```

> A serverless function `/api/get-reviews.js` funciona apenas no ambiente Vercel.

## Deploy

O site é deployado automaticamente na **Vercel** a cada push na branch `static-app`.

## Contato

- 📱 WhatsApp: (83) 99405-8749
- 📷 Instagram: [@drajaquelinesayonara](https://www.instagram.com/drajaquelinesayonara/)
- 📘 Facebook: [Dra Jaqueline Sayonara](https://www.facebook.com/drajaquelinesayonara)
- 🏥 CRO-PB: 9833
