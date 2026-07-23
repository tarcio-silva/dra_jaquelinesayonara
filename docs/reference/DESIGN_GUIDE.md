# Guia de Refatoração de Design — Site Dra. Jaqueline Sayonara

Guia técnico de melhorias visuais e de UX para tornar o site mais moderno, profissional e alinhado com as tendências de sites de clínicas odontológicas de referência (2025/2026).

---

## ✅ Changelog — Alterações Implementadas (25/06/2026)

### Header / Hero Section — Redesenhado
- **Layout split (space-between):** imagem `header_picture_mobile.webp` à esquerda (50%) e conteúdo à direita (50%)
- **Imagem como elemento `<img>`** com `object-fit: cover` em vez de background CSS
- **Overlay gradiente** de baixo para cima removido (overlay agora `display:none` no layout split)
- **Logo** com cores originais (removido `filter: brightness(0) invert()`) para contraste em fundo claro
- **Slogan** "Cuidado, Saúde, Autoestima" com cor `--logo-pallete-velvety-cherry` (não mais branco)
- **Botão CTA** "Agende sua consulta" com fundo cherry e texto branco
- **Subtítulo** "Ortodontia e Estética Dental — Sapé/PB" removido
- **Responsivo mobile:** empilha verticalmente (imagem em cima 50vh, conteúdo embaixo)

### Seção Sobre — Redesenhada
- **Título** atualizado para "Sobre Mim"
- **Subtítulo** com CRO adicionado: "Dra. Jaqueline Sayonara — CRO-PB 9833"
- **Foto** com `border-radius: 16px` e sombra elegante (`box-shadow`)
- **Botão** "Conheça meu trabalho" com estilo outline (borda cherry) e hover preenchido
- **Espaçamento** generoso com `gap: 32px` (mobile) e `gap: 64px` (desktop)
- **Layout desktop:** side-by-side com imagem à direita (380px × 500px)
- **Dark mode:** cores do about adaptadas (surface, text-muted, botão)

### Dark Mode — Ajustes
- **Nav social media:** adicionado `color: #f5f0f1` para links e SVGs (contraste no fundo escuro)
- **Offcanva:** texto claro no dark mode
- **Hero overlay:** gradiente atualizado para paleta escura

### Navbar
- Mantido glassmorphism com `backdrop-filter: blur(12px)`
- Dark mode com background `#1a1218d9` e borda transparente

---

## Diagnóstico do Design Atual

### Pontos Fortes
- Paleta de cores coerente (rose + cherry) com identidade feminina e acolhedora
- Dark mode implementado
- Conteúdo bem organizado em seções lógicas
- Fonte Manrope (moderna, clean)

### Pontos Fracos
- Layout pouco generoso em espaço em branco (white space)
- Tipografia sem hierarquia visual clara (tamanhos e pesos pouco diferenciados)
- Cards com design genérico (sem hover, sem profundidade)
- Header/banner sem CTA (call-to-action) visível
- Navbar muito simples e sem indicador de seção ativa
- Footer com hierarquia textual pobre (apenas `<p>` empilhados)
- Carrossel de resultados sem controles visuais de navegação
- Ausência de micro-animações e transições que comuniquem qualidade
- Sem botão flutuante de WhatsApp (padrão do mercado brasileiro)

---

## 🎯 Referências de Mercado

Sites de clínicas odontológicas modernas compartilham estes padrões:

| Elemento | Padrão do mercado |
|----------|------------------|
| Hero Section | Imagem de alta qualidade com overlay + headline impactante + CTA "Agende sua consulta" |
| Cores | Tons suaves (pastéis, branco predominante) com 1 cor de destaque para CTAs |
| Tipografia | Tamanhos grandes (`clamp()`), pesos variados, hierarquia clara |
| White space | Generoso — seções com `padding: 80px+` no desktop |
| Cards | Efeito hover (elevação + sombra), border-radius generoso |
| CTA Flutuante | Botão de WhatsApp fixo no canto inferior direito |
| Navbar | Glassmorphism (backdrop-filter), indicador de seção ativa |
| Avaliações | Estrelas + foto + nome em layout de grid moderno |
| Footer | Colunas organizadas, ícones SVG, links rápidos |
| Animações | Fade-in on scroll, hover suave, transições de 300ms |

---

## 🔴 Prioridade Alta — Impacto Imediato

### 1. Redesign do Hero/Banner com CTA

**Problema:** O banner não tem chamada para ação. O visitante não sabe o que fazer.

**Solução:**
```html
<section class="hero">
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <h1>Seu sorriso merece cuidado especializado</h1>
    <p>Ortodontia e estética dental em Sapé/PB</p>
    <a href="https://wa.me/+5583994058749/?text=Gostaria%20de%20agendar%20uma%20consulta" class="btn-cta">
      Agende sua consulta
    </a>
  </div>
</section>
```

```css
.hero {
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(162, 83, 86, 0.7), rgba(250, 231, 235, 0.3));
}
.hero-content {
  position: relative;
  text-align: center;
  color: #fff;
  padding: 0 24px;
}
.hero-content h1 {
  font-size: clamp(2.8rem, 5vw, 5.6rem);
  font-weight: 700;
  margin-bottom: 16px;
}
.btn-cta {
  display: inline-block;
  background: #fff;
  color: var(--logo-pallete-velvety-cherry);
  padding: 16px 40px;
  border-radius: 50px;
  font-size: 1.8rem;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.3s, box-shadow 0.3s;
}
.btn-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}
```

**Impacto:** Conversão imediata — transforma visitantes em agendamentos.

---

### 2. Botão Flutuante de WhatsApp

**Problema:** O WhatsApp é o principal canal de agendamento mas só aparece no footer/menu.

**Solução:**
```html
<a href="https://wa.me/+5583994058749/?text=Gostaria%20de%20agendar%20uma%20consulta" 
   class="whatsapp-float" aria-label="Agendar pelo WhatsApp">
  <svg>...</svg>
</a>
```

```css
.whatsapp-float {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  background: #25d366;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 999;
  transition: transform 0.3s;
}
.whatsapp-float:hover {
  transform: scale(1.1);
}
.whatsapp-float svg {
  width: 28px;
  height: 28px;
  fill: #fff;
}
```

**Impacto:** Padrão obrigatório em sites de serviço brasileiro. Aumenta agendamentos significativamente.

---

### 3. Navbar com Glassmorphism e Indicador de Seção Ativa

**Problema:** Navbar opaca, sem feedback visual de localização.

**Solução:**
```css
.header-nav {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(162, 83, 86, 0.1);
  height: 64px;
  padding: 0 32px;
}

.header-link.active > p {
  color: var(--logo-pallete-velvety-cherry);
  border-bottom: 2px solid var(--logo-pallete-velvety-cherry);
}
```

```javascript
// Intersection Observer para seção ativa
const sections = document.querySelectorAll("section[id]");
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll(".header-link").forEach(link => link.classList.remove("active"));
      const active = document.querySelector(`.header-link[href="#${entry.target.id}"]`);
      if (active) active.classList.add("active");
    }
  });
}, { threshold: 0.3 });
sections.forEach(section => observer.observe(section));
```

**Impacto:** Sensação premium, orientação espacial para o usuário.

---

## 🟡 Prioridade Média — Modernização Visual

### 4. Tipografia Responsiva com clamp()

**Problema:** Tamanhos fixos, sem fluidez entre breakpoints.

**Solução:**
```css
:root {
  --fs-hero: clamp(2.8rem, 5vw, 5.6rem);
  --fs-section: clamp(2.2rem, 3.5vw, 5rem);
  --fs-body: clamp(1.4rem, 1.2vw, 1.8rem);
  --fs-small: clamp(1.2rem, 1vw, 1.5rem);
}

.section-title { font-size: var(--fs-section); }
p { font-size: var(--fs-body); }
```

---

### 5. Cards com Hover Moderno e CSS Grid

**Problema:** Cards com layout rígido, sem feedback interativo.

**Solução:**
```css
.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 32px;
}

.card-container {
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card-container:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 32px rgba(162, 83, 86, 0.15);
}

.card img {
  transition: transform 0.4s ease;
}

.card:hover img {
  transform: scale(1.05);
}

.card-description {
  padding: 24px;
}
```

---

### 6. Espaçamento Generoso (White Space)

**Problema:** Seções muito juntas, sensação de amontoamento.

**Solução:**
```css
main section {
  padding: 64px 24px;
}

@media (min-width: 1200px) {
  main section {
    padding: 100px 0;
  }
}

.section-title {
  margin-bottom: 48px;
}
```

---

### 7. Seção "Sobre" com Layout Split Moderno

**Problema:** Layout flat, sem impacto visual.

**Solução:**
```css
.about-container div section {
  display: grid;
  grid-template-columns: 1fr;
  gap: 48px;
  align-items: center;
}

@media (min-width: 1200px) {
  .about-container div section {
    grid-template-columns: 1fr 1fr;
  }
}

.about-container div section > img {
  border-radius: 24px;
  box-shadow: 0 16px 48px rgba(162, 83, 86, 0.12);
}
```

---

### 8. Animações de Entrada (Fade-in on Scroll)

**Problema:** Conteúdo aparece abruptamente sem transição.

**Solução:**
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

```javascript
const fadeElements = document.querySelectorAll(".fade-in");
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
fadeElements.forEach(el => fadeObserver.observe(el));
```

---

### 9. Carrossel de Resultados com Controles Visuais

**Problema:** Scroll snap puro sem indicação de que há mais conteúdo ou como navegar.

**Solução:**
```html
<div class="results-carousel">
  <button class="carousel-btn prev" aria-label="Anterior">‹</button>
  <div class="results-track">...</div>
  <button class="carousel-btn next" aria-label="Próximo">›</button>
</div>
```

```css
.results-carousel {
  position: relative;
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  font-size: 2.4rem;
  color: var(--logo-pallete-velvety-cherry);
  cursor: pointer;
  z-index: 10;
  transition: background 0.2s;
}

.carousel-btn:hover {
  background: var(--logo-pallete-velvety-cherry);
  color: #fff;
}

.prev { left: 8px; }
.next { right: 8px; }
```

---

## 🟢 Prioridade Baixa — Refinamento

### 10. Footer Reorganizado em Colunas

**Problema:** Footer é uma lista de `<p>` sem estrutura visual.

**Solução:**
```css
footer {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 48px;
  padding: 64px 24px;
}
```

Estruturar em blocos: Contato | Profissional | Redes Sociais | Logo, cada com heading e itens.

---

### 11. Paleta de Cores Expandida

**Problema:** Apenas 2 cores (rose e cherry) — pouca diferenciação entre elementos.

**Sugestão de expansão:**
```css
:root {
  /* Existentes */
  --color-primary: #a25356;
  --color-primary-light: #fae7eb;

  /* Novos — neutros */
  --color-bg: #fdfbfc;
  --color-surface: #ffffff;
  --color-text: #2d2d2d;
  --color-text-muted: #6b6b6b;

  /* Novos — acentos */
  --color-accent: #c8727a;
  --color-success: #25d366;

  /* Sombras */
  --shadow-sm: 0 2px 8px rgba(162, 83, 86, 0.08);
  --shadow-md: 0 8px 24px rgba(162, 83, 86, 0.12);
  --shadow-lg: 0 16px 48px rgba(162, 83, 86, 0.16);
}
```

---

### 12. Ícones SVG em vez de PNG

**Problema:** Ícones em PNG (redes sociais, menu) ficam pixelados em telas retina e são pesados.

**Solução:** Substituir por SVG inline ou sprite. Usar ícones de bibliotecas como Lucide ou Phosphor Icons.

```html
<!-- Exemplo WhatsApp SVG -->
<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967..."/>
</svg>
```

**Benefícios:** Escalável, customizável via CSS (cor, tamanho), sem request HTTP extra.

---

### 13. Seção de Depoimentos Redesenhada

**Problema:** Layout circular com foto grande + card pequeno — pouco legível, desproporcional.

**Sugestão:**
```css
.testimonial-card {
  background: var(--color-surface);
  border-radius: 16px;
  padding: 32px;
  box-shadow: var(--shadow-sm);
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.testimonial-card img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}
```

Layout: Foto pequena à esquerda + nome + estrelas + texto. Grid de 1/2/3 colunas responsivo.

---

### 14. Dark Mode Refinado

**Problema:** Dark mode inverte cores mas não ajusta sombras, contrastes e surface colors.

**Solução:**
```css
.dark-theme {
  --color-bg: #1a1a1a;
  --color-surface: #2d2d2d;
  --color-text: #f0f0f0;
  --color-text-muted: #a0a0a0;
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.4);
}
```

---

### 15. Scroll Padding e Smooth Transitions

```css
html {
  scroll-padding-top: 80px; /* Compensa navbar fixa */
}

* {
  transition: background-color 0.3s ease, color 0.3s ease;
}
```

---

## 📋 Resumo de Prioridades

| # | Item | Esforço | Impacto Visual | Impacto Conversão | Status |
|---|------|---------|----------------|-------------------|--------|
| 1 | Hero com CTA | Médio | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ Concluído |
| 2 | Botão WhatsApp flutuante | Baixo | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ Concluído |
| 3 | Navbar glassmorphism + ativa | Baixo | ⭐⭐⭐⭐ | ⭐⭐ | ✅ Concluído |
| 4 | Tipografia clamp() | Baixo | ⭐⭐⭐⭐ | ⭐ | ✅ Concluído |
| 5 | Cards com hover + Grid | Baixo | ⭐⭐⭐⭐ | ⭐⭐ | ✅ Concluído |
| 6 | White space generoso | Baixo | ⭐⭐⭐⭐⭐ | ⭐⭐ | ✅ Concluído |
| 7 | Seção Sobre split layout | Médio | ⭐⭐⭐⭐ | ⭐ | ✅ Concluído |
| 8 | Animações fade-in | Baixo | ⭐⭐⭐⭐ | ⭐ | ✅ Concluído |
| 9 | Carrossel com controles | Baixo | ⭐⭐⭐ | ⭐⭐ | ✅ Concluído |
| 10 | Footer em colunas | Médio | ⭐⭐⭐ | ⭐ | ✅ Concluído |
| 11 | Paleta expandida | Baixo | ⭐⭐⭐ | ⭐ | ✅ Concluído |
| 12 | Ícones SVG | Médio | ⭐⭐⭐ | ⭐ | ✅ Concluído |
| 13 | Depoimentos redesenhados | Médio | ⭐⭐⭐⭐ | ⭐⭐⭐ | ✅ Concluído |
| 14 | Dark mode refinado | Baixo | ⭐⭐⭐ | ⭐ | ✅ Concluído |
| 15 | Scroll padding + transitions | Mínimo | ⭐⭐ | ⭐ | ✅ Concluído |

---

## Referências Visuais

Sites de odontologia que exemplificam este guia:
- **30 Beaumont Street** — white space, pastéis, tipografia elegante
- **Dntl Bar** — dark mode premium, mobile-first, booking simples
- **Harley Street Dental Studio** — luxury branding, monochrome + gold
- **Pearl Dentistry** — clean, polished, CTA claro
- **Zen Dental Studio** — calma, minimalismo, navegação fluida

---

## Princípios Guia

1. **Menos é mais** — Cada pixel deve ter propósito
2. **Mobile-first** — 70%+ dos acessos são mobile no Brasil
3. **CTA visível** — O visitante deve saber como agendar em até 3 segundos
4. **Confiança** — Fotos reais, avaliações, CRO visível
5. **Velocidade** — Design não pode comprometer performance (manter inline CSS, lazy load)
