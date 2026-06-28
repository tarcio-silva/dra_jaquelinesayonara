# Documentação Técnica — Site Dra. Jaqueline Sayonara

Documentação técnica completa da landing page institucional.

🔗 **Produção:** https://drajaquelinesayonara.vercel.app/

---

## Arquitetura

O site é uma **single-page estática** com CSS inline para performance máxima (zero requests CSS extras). Os módulos CSS em `assets/css/` são a fonte de desenvolvimento — o build gera o bundle minificado que é copiado para o inline do `<head>`.

### Fluxo de build

```
assets/css/*.css  →  LightningCSS (bundle + minify)  →  styles.min.css  →  inline no <style>
```

### Módulos CSS

| Arquivo | Responsabilidade |
|---------|-----------------|
| `globalStyle.css` | Variáveis, tipografia (`clamp()`), reset, utilitários (`.sr-only`, `.skip-link`, `.fade-in`, `.whatsapp-float`) |
| `dark-theme.css` | Overrides de cores para `.dark-theme` (bg, surface, text, sombras) |
| `header/header.css` | Navbar glassmorphism, hero split, logo, CTA, responsividade |
| `header/hamburger.css` | Botão hamburger animado (slider) |
| `header/offcanva.css` | Menu off-canvas mobile |
| `header/switch-button.css` | Toggle dark mode (checkbox + slider) |
| `header/accsessebility-buttons.css` | Botões de acessibilidade |
| `about.css` | Seção Sobre (card, foto, layout split desktop) |
| `cards.css` | Cards de tratamentos (Grid, hover com elevação, zoom na imagem) |
| `results.css` | Grid de resultados (2/3 colunas), hover reveal com label, lightbox |
| `rating.css` | Cards de avaliações (grid responsivo, skeleton loading) |
| `location.css` | Layout split vídeo + mapa (grid 1fr 1fr) |
| `footer.css` | Footer em colunas (grid 1/3), bottom bar, logo |

---

## JavaScript (`assets/js/main.js`)

Zero dependências. Funcionalidades:

| Funcionalidade | Implementação |
|----------------|---------------|
| Menu off-canvas | Toggle de classe + ARIA (`aria-expanded`, `aria-hidden`) |
| Avaliações Google | `fetch('/api/get-reviews')` → renderiza cards ou mantém skeletons |
| Seção ativa (navbar) | `IntersectionObserver` nas `section[id]` → classe `.active` no link |
| Fade-in on scroll | `IntersectionObserver` em `.fade-in` → adiciona `.visible` |
| Lightbox | Click em `.result-item` → overlay com imagem ampliada |

---

## Serverless Function (`api/get-reviews.js`)

```javascript
// Vercel Serverless — busca reviews do Google Places API
export default async function handler(req, res) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = "ChIJG2ynEABZrAcRE0WvmWTIAgk";
  // Retorna array de reviews com: author_name, profile_photo_url, rating, text
}
```

**Requisitos:**
- Variável `GOOGLE_PLACES_API_KEY` no painel Vercel
- Chave restrita ao domínio no Google Cloud Console

---

## SEO

| Recurso | Implementação |
|---------|---------------|
| Schema.org | JSON-LD `Dentist` no `<head>` |
| Open Graph | `og:title`, `og:description`, `og:image`, `og:url` |
| Twitter Cards | `summary_large_image` |
| Canonical | `<link rel="canonical">` |
| Sitemap | `sitemap.xml` |
| Robots | `robots.txt` |
| Heading hierarchy | `<h1>` (sr-only) → `<h2>` por seção |
| Google Verification | `google962378b089d1b19d.html` |

---

## Acessibilidade

- **Skip link** — "Pular para o conteúdo principal"
- **ARIA** — `aria-expanded`, `aria-hidden`, `aria-label` no menu e botões
- **Focus visible** — Outline cherry com offset de 2px
- **Alt texts** — Em português, descritivos por procedimento
- **Dark mode** — Toggle acessível via `<input type="checkbox">`
- **Fonte legível** — Manrope variable, tamanhos com `clamp()`

---

## Performance

| Otimização | Detalhes |
|-----------|----------|
| CSS inline | Zero requests CSS (tudo no `<style>`) |
| Font preload | WOFF2 com `<link rel="preload">` |
| Preconnect | Google Maps e Google APIs |
| Lazy loading | `loading="lazy"` em imagens e iframe |
| Video | `preload="none"` + autoplay/muted/loop |
| Imagens WebP | Todas otimizadas em formato WebP |
| Zero JS libs | Vanilla JS, sem dependências |

---

## Dark Mode

Ativado via checkbox que togla `.dark-theme` no `<body>`. Override de variáveis:

```css
.dark-theme {
  --color-bg: #1a1218;
  --color-surface: #2a1f23;
  --color-text: #f5f0f1;
  --color-text-muted: #b8a8ab;
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.3);
}
```

Componentes com estilos específicos no dark: navbar, hero overlay, about, cards, reviews, footer.

---

## Responsividade

| Breakpoint | Comportamento |
|-----------|---------------|
| `< 768px` | Grid 1-2 colunas, menu hamburger, hero empilhado |
| `768px – 1199px` | Grid 2-3 colunas, transição |
| `≥ 1200px` | Navbar com links visíveis, hero split 42%/58%, layouts side-by-side |

Mobile-first com `min-width` media queries. Safe area insets para dispositivos com notch.

---

## Como Contribuir

1. Editar os módulos CSS em `assets/css/`
2. Rodar `./build-css.sh` para gerar `styles.min.css`
3. Atualizar o inline no `index.html` (copiar conteúdo do min para a tag `<style>`)
4. Testar com `npx serve .`

> **Dica:** Para desenvolvimento rápido, referencie `styles.min.css` via `<link>` temporariamente em vez do inline.
