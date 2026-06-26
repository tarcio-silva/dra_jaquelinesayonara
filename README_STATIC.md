# Dra. Jaqueline Sayonara — Site Estático (static-app)

Landing page institucional estática para a **Dra. Jaqueline Sayonara**, cirurgiã-dentista especialista em Ortodontia — Sapé/PB.

🔗 **Produção:** https://drajaquelinesayonara.vercel.app/

## Stack

| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| HTML5 | — | Estrutura semântica |
| CSS3 | — | Estilização modular com custom properties + CSS Scroll Snap |
| JavaScript | ES Modules | Lógica do cliente (dark mode, reviews, menu) |
| LightningCSS | 1.28.2 | Bundling e minificação CSS |
| normalize.css | 8.0.1 | Reset CSS cross-browser |
| Google Places API | — | Avaliações de pacientes |
| Vercel | — | Deploy e Serverless Functions |

## Estrutura de Arquivos

```
├── index.html                 # Página principal
├── build-css.sh               # Script de build — gera styles.min.css
├── api/
│   └── get-reviews.js         # Serverless function (Vercel) — Google Places API
├── assets/
│   ├── css/
│   │   ├── styles.css         # Entry point — importa todos os módulos
│   │   ├── styles.min.css     # Bundle minificado (produção)
│   │   ├── globalStyle.css    # Variáveis, tipografia, reset base, utilitários
│   │   ├── dark-theme.css     # Tema escuro
│   │   ├── about.css          # Seção Sobre
│   │   ├── cards.css          # Cards de tratamentos
│   │   ├── results.css        # Seção Resultados (CSS Scroll Snap)
│   │   ├── rating.css         # Seção Avaliações + skeleton loading
│   │   ├── location.css       # Seção Localização (iframe mapa)
│   │   ├── footer.css         # Rodapé
│   │   └── header/
│   │       ├── header.css     # Banner, navbar, logo
│   │       ├── hamburger.css  # Botão hamburger animado
│   │       ├── offcanva.css   # Menu off-canvas mobile
│   │       ├── switch-button.css  # Toggle dark mode
│   │       └── accsessebility-buttons.css
│   ├── js/
│   │   └── main.js            # Lógica principal (reviews, menu, ARIA)
│   ├── img/                   # Imagens (webp, png)
│   └── font/
│       ├── Manrope-VariableFont_wght.woff2  # Fonte principal (55KB)
│       └── Manrope-VariableFont_wght.ttf    # Fallback
├── robots.txt
├── sitemap.xml
├── google962378b089d1b19d.html # Verificação Google Search Console
├── package.json
└── package-lock.json
```

## Seções da Página

| Seção | ID | Descrição |
|-------|------|-----------|
| Header | — | Hero split: foto da Dra. (50%) + logo, slogan e CTA (50%). Layout space-between. |
| Sobre | `#about` | Apresentação da profissional com foto arredondada, CRO e botão "Conheça meu trabalho" |
| Tratamentos | `#care` | 7 cards: aparelho, clareamento, exodontia, facetas, profilaxia, prótese, restauração |
| Resultados | `#results` | Carrossel CSS Scroll Snap com antes/depois |
| Avaliações | — | Reviews do Google com skeleton loading |
| Localização | `#location` | Iframe Google Maps |
| Footer | — | Contato, redes sociais, CRO |

## Funcionalidades

- **Responsividade** — Breakpoint em 1200px (`min-width`); menu hamburger no mobile, navbar fixa no desktop
- **Dark Mode** — Toggle via checkbox com `aria-label`, aplica classe `.dark-theme` no body
- **Avaliações Google** — Serverless function (`/api/get-reviews.js`) consulta Google Places API via variável de ambiente
- **Skeleton Loading** — Placeholder animado enquanto reviews carregam
- **Carrossel** — CSS Scroll Snap com responsividade (1/2/3 itens por breakpoint)
- **SEO** — Meta tags, Open Graph, Twitter Cards, JSON-LD (Schema.org), canonical, robots.txt, sitemap
- **Acessibilidade** — ARIA no menu/toggle, skip link, `:focus-visible`, alt texts descritivos em português, heading hierarchy (`<h1>`)

## Design System

```css
:root {
  --logo-pallete-petal-rose: #fae7eb;
  --logo-pallete-velvety-cherry: #a25356;
  --logo-pallete-light: #fff;
  --logo-pallete--dark: #000;
}
```

- **Fonte:** Manrope (variable font, WOFF2 + TTF fallback, `font-display: swap`)
- **Base font-size:** 62.5% (1rem = 10px)

## Como Executar

```bash
# Instalar dependências
npm install

# Build CSS (bundle + minificação)
./build-css.sh

# Servir localmente
npx serve .
```

> A serverless function `/api/get-reviews.js` funciona apenas no ambiente Vercel.
> Requer variável de ambiente `GOOGLE_PLACES_API_KEY` configurada no painel da Vercel.

## Build CSS

O CSS está atualmente **inline no `<head>`** do `index.html` (tag `<style>`) para performance máxima (zero requests CSS extras). Os arquivos `.css` modulares em `assets/css/` servem como fonte de referência/desenvolvimento.

Para editar estilos, modifique diretamente a tag `<style>` no `index.html` ou edite os módulos e re-gere o inline com LightningCSS:

```bash
npx lightningcss --minify --bundle assets/css/styles.css -o assets/css/styles.min.css
```

Após editar qualquer arquivo `.css`, execute `./build-css.sh` para regenerar o bundle.

## Deploy

O site é deployado automaticamente na **Vercel** a cada push na branch `static-app`.

### Variáveis de Ambiente (Vercel)

| Variável | Descrição |
|----------|-----------|
| `GOOGLE_PLACES_API_KEY` | Chave da Google Places API para buscar avaliações |

## Contato

- 📱 WhatsApp: (83) 99405-8749
- 📷 Instagram: [@drajaquelinesayonara](https://www.instagram.com/drajaquelinesayonara/)
- 📘 Facebook: [Dra Jaqueline Sayonara](https://www.facebook.com/drajaquelinesayonara)
- 🏥 CRO-PB: 9833
