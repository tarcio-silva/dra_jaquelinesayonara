# Guia de Refatoração — Site Estático (static-app)

Guia técnico com melhorias priorizadas para tornar o site mais profissional, performático e acessível.

---

## 🔴 Crítico (Segurança)

### 1. API Key exposta no client-side

**Problema:** A chave da Google Places API está hardcoded tanto em `assets/js/service.js` quanto em `api/get-reviews.js`.

**Impacto:** Qualquer pessoa pode copiar a chave e consumir sua cota de requisições, gerando custos.

**Solução:**
```javascript
// api/get-reviews.js — usar variável de ambiente
const apiKey = process.env.GOOGLE_PLACES_API_KEY;
```
- Remover `assets/js/service.js` completamente (código legado)
- Configurar a variável `GOOGLE_PLACES_API_KEY` no painel da Vercel
- Restringir a chave no Google Cloud Console (apenas Places API, apenas o domínio)

---

## 🟡 SEO

### 2. Corrigir nome do sitemap

**Problema:** O arquivo está nomeado `sistemap.xml` (typo).

**Solução:** Renomear para `sitemap.xml` e atualizar a referência no `robots.txt`.

### 3. Adicionar dados estruturados (Schema.org)

**Problema:** Sem structured data, o Google não exibe rich snippets (estrelas, endereço, horário).

**Solução:** Adicionar JSON-LD no `<head>`:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Dentist",
  "name": "Dra. Jaqueline Sayonara",
  "description": "Cirurgiã-dentista especialista em Ortodontia",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Rua Lourival Lacerda, 06, sl 207",
    "addressLocality": "Sapé",
    "addressRegion": "PB",
    "addressCountry": "BR"
  },
  "telephone": "+5583994058749",
  "url": "https://drajaquelinesayonara.vercel.app",
  "image": "./assets/img/logo_js_2026.png",
  "priceRange": "$$"
}
</script>
```

### 4. Adicionar Open Graph e Twitter Cards

**Problema:** Sem meta tags sociais, links compartilhados não exibem preview.

**Solução:**
```html
<meta property="og:title" content="Dra. Jaqueline Sayonara | Ortodontia">
<meta property="og:description" content="Especialista em Ortodontia em Sapé/PB. Agende sua consulta!">
<meta property="og:image" content="https://drajaquelinesayonara.vercel.app/assets/img/og-image.webp">
<meta property="og:url" content="https://drajaquelinesayonara.vercel.app">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
```

### 5. Melhorar heading hierarchy

**Problema:** Não há `<h1>` explícito na página. Os headings começam em `<h2>`.

**Solução:** Adicionar um `<h1>` no header (pode ser visualmente escondido ou incorporado ao banner):
```html
<h1 class="sr-only">Dra. Jaqueline Sayonara — Cirurgiã-Dentista Especialista em Ortodontia</h1>
```

---

## 🟢 Performance

### 6. Remover jQuery — usar vanilla JS

**Problema:** jQuery (87KB minificado) é carregado apenas para inicializar o Owl Carousel.

**Solução:**
- Substituir Owl Carousel por **Swiper** (vanilla JS, tree-shakeable) ou **CSS Scroll Snap** puro
- O dark mode e o menu já são vanilla JS — não dependem do jQuery

**Impacto estimado:** -90KB no bundle, TBT reduzido significativamente.

### 7. Consolidar CSS em um único arquivo

**Problema:** 12+ requisições CSS separadas (render-blocking).

**Solução:**
- Usar um build step com ferramentas como `postcss-cli` ou `lightningcss`:
```bash
npx lightningcss --minify --bundle assets/css/globalStyle.css -o dist/styles.min.css
```
- Ou pelo menos combinar em 1 arquivo e minificar
- Inline o CSS crítico (above-the-fold) no `<head>`

### 8. Otimizar carregamento de fontes

**Problema:** A fonte Manrope é carregada via `@font-face` com path absoluto (`/assets/font/`), sem `font-display`.

**Solução:**
```css
@font-face {
  font-family: 'Manrope';
  src: url('./assets/font/Manrope-VariableFont_wght.ttf') format('truetype');
  font-display: swap;
  font-weight: 200 800;
}
```
- Considerar usar formato `.woff2` (30-50% menor)
- Adicionar `<link rel="preload">` para a fonte

### 9. Lazy loading no iframe do Google Maps

**Problema:** O iframe do Google Maps já tem `loading="lazy"`, mas está visível no viewport em desktop.

**Solução:** Adicionar `loading="lazy"` condicionalmente ou usar Intersection Observer para carregar apenas quando visível.

### 10. Preconnect para origens externas

**Solução:** Adicionar no `<head>`:
```html
<link rel="preconnect" href="https://maps.googleapis.com">
<link rel="preconnect" href="https://www.google.com">
```

---

## 🔵 Acessibilidade

### 11. Substituir `min-device-width` nas media queries

**Problema:** Todas as media queries usam `min-device-width` que é **deprecated** e ignorada por muitos navegadores modernos.

**Solução:** Substituir em todos os 12+ arquivos CSS:
```css
/* ❌ Antes */
@media screen and (min-device-width: 1200px) { ... }

/* ✅ Depois */
@media screen and (min-width: 1200px) { ... }
```

### 12. Adicionar atributos ARIA e roles

**Problema:** Menu off-canvas sem indicação de estado, botões sem labels acessíveis.

**Solução:**
```html
<!-- Hamburger -->
<button class="hamburger" aria-label="Abrir menu" aria-expanded="false" aria-controls="offcanva">

<!-- Off-canvas -->
<nav class="offcanva" id="offcanva" role="navigation" aria-label="Menu principal" aria-hidden="true">

<!-- Dark mode -->
<label class="switch">
  <input id="dark-mode-button" type="checkbox" aria-label="Ativar modo escuro">
  <span class="slider round"></span>
</label>
```
- Atualizar `aria-expanded` e `aria-hidden` via JavaScript ao abrir/fechar o menu

### 13. Melhorar textos alternativos

**Problema:** Vários `alt` estão em inglês ("orthodontic appliances") enquanto o site é em português. Imagens de tratamento diferentes compartilham o mesmo alt.

**Solução:**
```html
<!-- ❌ Antes -->
<img src="./assets/img/care/clareamento.webp" alt="orthodontic appliances">

<!-- ✅ Depois -->
<img src="./assets/img/care/clareamento.webp" alt="Procedimento de clareamento dental">
```

### 14. Garantir contraste de cores

**Problema:** Textos em `#a25356` sobre backgrounds claros podem não atingir ratio 4.5:1 WCAG AA.

**Solução:**
- Verificar com ferramenta (ex: axe DevTools)
- Escurecer para `#8c3e41` se necessário nos textos menores
- O dark mode precisa de verificação separada

### 15. Skip navigation link

**Solução:** Adicionar como primeiro elemento do `<body>`:
```html
<a href="#about" class="skip-link">Pular para o conteúdo principal</a>
```
```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  padding: 8px 16px;
  background: var(--logo-pallete-velvety-cherry);
  color: #fff;
  z-index: 9999;
}
.skip-link:focus { top: 0; }
```

### 16. Focus visible nos links

**Problema:** O reset global (`* { border: 0 }`) remove o outline de foco padrão.

**Solução:**
```css
:focus-visible {
  outline: 3px solid var(--logo-pallete-velvety-cherry);
  outline-offset: 2px;
}
```

---

## 🎨 Design / UX Moderno

### 17. Adicionar transições e micro-animações

```css
.card-container {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.card-container:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(162, 83, 86, 0.15);
}
```

### 18. Melhorar tipografia responsiva com clamp()

```css
.section-title {
  font-size: clamp(2rem, 4vw, 5rem);
}
p {
  font-size: clamp(1.4rem, 1.5vw, 2rem);
}
```

### 19. Usar CSS Grid no layout dos cards

```css
.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}
```

### 20. Scroll suave com indicador visual de seção ativa

- Usar Intersection Observer para destacar o item de menu da seção visível
- Adicionar `scroll-padding-top` para compensar a navbar fixa

---

## 📋 Resumo de Prioridades

| Prioridade | Item | Esforço | Impacto | Status |
|-----------|------|---------|---------|--------|
| 🔴 Crítico | API Key exposta | Baixo | Segurança | ✅ Concluído |
| 🟡 Alto | Corrigir sitemap.xml | Mínimo | SEO | ✅ Concluído |
| 🟡 Alto | Schema.org + OG tags | Baixo | SEO | ✅ Concluído |
| 🟡 Alto | Heading hierarchy (h1) | Mínimo | SEO | ✅ Concluído |
| 🟢 Alto | Remover jQuery | Médio | -132KB, performance | ✅ Concluído |
| 🟢 Alto | Consolidar CSS | Médio | 1 request (era 13) | ✅ Concluído |
| 🟢 Médio | font-display: swap + woff2 | Baixo | LCP | ✅ Concluído |
| 🔵 Alto | Corrigir min-device-width | Baixo | Compatibilidade | ✅ Concluído |
| 🔵 Alto | ARIA no menu/toggle | Baixo | Acessibilidade | ✅ Concluído |
| 🔵 Médio | Alt texts em português | Baixo | Acessibilidade | ✅ Concluído |
| 🔵 Médio | Skip link + focus visible | Baixo | Acessibilidade | ✅ Concluído |
| 🎨 Médio | Hover animations + clamp() | Baixo | UX moderna | ✅ Concluído |
| 🎨 Baixo | CSS Grid nos cards | Baixo | Layout responsivo | ✅ Concluído |

---

## Ferramentas de Validação Recomendadas

- **Lighthouse** (Chrome DevTools) — Performance, SEO, Acessibilidade
- **axe DevTools** — Acessibilidade detalhada
- **PageSpeed Insights** — Core Web Vitals reais
- **Schema Markup Validator** — Structured data
- **WAVE** — Contraste e acessibilidade visual
