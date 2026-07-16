# Guia de Melhorias — Seção de Resultados

> Criado em: 16/07/2026  
> Branch: `develop`  
> Seção: `#results` (index.html)

---

## Estado Atual

- 6 fotos de antes/depois (clareamento ×2, facetas ×2, restauração ×1, prótese ×1)
- Grid responsivo: 2 colunas (mobile) → 3 colunas (desktop)
- Lightbox acessível com `role="dialog"`, focus trap, keyboard navigation
- Labels com nome do tratamento sobre gradiente
- CTA "Quero transformar meu sorriso" (WhatsApp)
- Hover: zoom 1.05 + label fade-in (apenas em dispositivos com hover)

---

## Melhorias Planejadas

### Fase 1 — Quick Wins (sem dependência externa)

#### 1.1 Labels Descritivos

**Esforço:** Baixo | **Impacto:** Médio | **Arquivos:** `index.html`

Substituir labels genéricos por descrições informativas:

```html
<!-- Antes -->
<div class="result-label"><span>Clareamento</span></div>

<!-- Depois -->
<div class="result-label"><span>Clareamento — 3 sessões</span></div>
```

Mapeamento sugerido:

| Imagem | Label atual | Label proposto |
|--------|-------------|----------------|
| clareamento.webp | Clareamento | Clareamento — 3 sessões |
| clareamentoII.webp | Clareamento | Clareamento a laser |
| facetas.webp | Facetas | Facetas em porcelana — 6 dentes |
| facetasII.webp | Facetas | Facetas em resina — 4 dentes |
| restauracao.webp | Restauração | Restauração direta em resina |
| proteseII.webp | Prótese | Prótese total superior |

> **Nota:** Confirmar com a Dra. Jaqueline os detalhes técnicos de cada caso.

---

#### 1.2 Contador de Resultados (Social Proof)

**Esforço:** Baixo | **Impacto:** Médio | **Arquivos:** `index.html`, `results.css`

Adicionar badge acima do grid:

```html
<p class="results-counter">✨ +150 sorrisos transformados</p>
```

CSS:

```css
.results-counter {
  text-align: center;
  font-size: clamp(1.4rem, 1.2vw, 1.6rem);
  font-weight: 600;
  color: var(--logo-pallete-velvety-cherry);
  margin-bottom: 24px;
}
```

> **Nota:** Atualizar o número periodicamente conforme novos pacientes.

---

#### 1.3 Placeholder Blur (LQIP)

**Esforço:** Baixo | **Impacto:** Baixo (percepção de velocidade) | **Arquivos:** `index.html`, `results.css`

Adicionar background blur inline enquanto a imagem carrega:

```html
<div class="result-item" tabindex="0" role="button"
     style="background: url('data:image/webp;base64,...') center/cover no-repeat">
  <img loading="lazy" src="./assets/img/results/clareamento.webp" alt="...">
  ...
</div>
```

```css
.result-item img {
  /* adicionar */
  background-color: var(--color-surface);
}

.result-item img[loading] {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.result-item img.loaded {
  opacity: 1;
}
```

Script (adicionar ao `main.js`):

```javascript
document.querySelectorAll('.result-item img').forEach(img => {
  if (img.complete) {
    img.classList.add('loaded');
  } else {
    img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
  }
});
```

**Alternativa mais simples:** Usar apenas `background-color` no container sem base64.

---

### Fase 2 — Navegação Avançada no Lightbox

#### 2.1 Setas Anterior/Próximo

**Esforço:** Médio | **Impacto:** Médio | **Arquivos:** `index.html`, `results.css`, `main.js`

Adicionar navegação entre imagens no lightbox:

```html
<div class="lightbox" role="dialog" aria-modal="true" aria-label="Visualização ampliada">
  <button class="lightbox-prev" aria-label="Imagem anterior">‹</button>
  <img src="" alt="">
  <button class="lightbox-next" aria-label="Próxima imagem">›</button>
  <button class="lightbox-close" aria-label="Fechar">×</button>
  <span class="lightbox-counter" aria-live="polite">1 / 6</span>
</div>
```

CSS dos botões de navegação:

```css
.lightbox-prev,
.lightbox-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #fff;
  font-size: 4.8rem;
  cursor: pointer;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.2s;
}

.lightbox-prev { left: 16px; }
.lightbox-next { right: 16px; }

.lightbox-prev:hover,
.lightbox-next:hover {
  background: rgba(255, 255, 255, 0.1);
}

.lightbox-prev:focus-visible,
.lightbox-next:focus-visible {
  outline: 3px solid #fff;
  outline-offset: 2px;
}

.lightbox-counter {
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  font-size: 1.4rem;
  font-weight: 500;
  opacity: 0.8;
}
```

Lógica JS (adicionar ao módulo lightbox em `main.js`):

```javascript
let currentIndex = 0;
const items = document.querySelectorAll('.result-item');

function openLightbox(index) {
  currentIndex = index;
  updateLightboxImage();
  lightbox.classList.add('active');
}

function updateLightboxImage() {
  const img = items[currentIndex].querySelector('img');
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  counter.textContent = `${currentIndex + 1} / ${items.length}`;
}

function navigate(direction) {
  currentIndex = (currentIndex + direction + items.length) % items.length;
  updateLightboxImage();
}

// Keyboard
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'ArrowLeft') navigate(-1);
  if (e.key === 'ArrowRight') navigate(1);
});
```

**Acessibilidade:**
- `aria-live="polite"` no counter para anunciar mudanças
- Focus trap atualizado para incluir botões prev/next
- ArrowLeft/ArrowRight para navegação por teclado

---

#### 2.2 Swipe em Mobile

**Esforço:** Médio | **Impacto:** Médio | **Arquivos:** `main.js`

Implementar gestos touch no lightbox:

```javascript
let touchStartX = 0;
let touchEndX = 0;
const SWIPE_THRESHOLD = 50;

lightbox.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

lightbox.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  const diff = touchStartX - touchEndX;

  if (Math.abs(diff) > SWIPE_THRESHOLD) {
    if (diff > 0) navigate(1);  // swipe left → próxima
    else navigate(-1);           // swipe right → anterior
  }
});
```

**Considerações:**
- `{ passive: true }` para não bloquear scroll
- Threshold de 50px para evitar swipes acidentais
- Não interfere com o tap para fechar

---

### Fase 3 — Slider Antes/Depois

#### 3.1 Componente de Comparação

**Esforço:** Médio-Alto | **Impacto:** Alto | **Arquivos:** `index.html`, `results.css`, `main.js`

Substituir a imagem composta por um slider interativo:

```html
<div class="result-item result-compare" tabindex="0" role="button">
  <div class="compare-container">
    <img class="compare-after" src="./assets/img/results/clareamento-depois.webp" alt="Depois do clareamento dental">
    <div class="compare-before-wrapper">
      <img class="compare-before" src="./assets/img/results/clareamento-antes.webp" alt="Antes do clareamento dental">
    </div>
    <input type="range" class="compare-slider" min="0" max="100" value="50" aria-label="Deslize para comparar antes e depois">
    <div class="compare-handle"></div>
  </div>
  <div class="result-label"><span>Clareamento — 3 sessões</span></div>
</div>
```

CSS:

```css
.compare-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.compare-after {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.compare-before-wrapper {
  position: absolute;
  inset: 0;
  width: 50%; /* controlado via JS */
  overflow: hidden;
}

.compare-before {
  width: 200%; /* para compensar o clip */
  height: 100%;
  object-fit: cover;
  display: block;
}

.compare-slider {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: ew-resize;
  z-index: 3;
  margin: 0;
}

.compare-handle {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%; /* controlado via JS */
  width: 3px;
  background: #fff;
  z-index: 2;
  pointer-events: none;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
}

.compare-handle::before {
  content: '◄ ►';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  color: var(--logo-pallete-velvety-cherry);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}
```

JS:

```javascript
document.querySelectorAll('.compare-slider').forEach(slider => {
  const container = slider.closest('.compare-container');
  const beforeWrapper = container.querySelector('.compare-before-wrapper');
  const handle = container.querySelector('.compare-handle');

  slider.addEventListener('input', () => {
    const value = slider.value + '%';
    beforeWrapper.style.width = value;
    handle.style.left = value;
  });
});
```

**Dependências de conteúdo:**
- Requer imagens separadas: `{tratamento}-antes.webp` e `{tratamento}-depois.webp`
- Ambas devem ter a mesma dimensão e ângulo
- Solicitar à Dra. fotos individuais (antes e depois separados)

**Alternativa gradual:**
Manter o grid atual com fotos compostas e implementar o slider apenas em novos resultados onde se tenha fotos separadas.

---

### Fase 4 — Filtros por Tratamento

#### 4.1 Botões de Filtro

**Esforço:** Médio | **Impacto:** Médio | **Arquivos:** `index.html`, `results.css`, `main.js`

> **Quando implementar:** A partir de 10+ resultados no grid.

```html
<div class="results-filters" role="group" aria-label="Filtrar resultados por tratamento">
  <button class="filter-btn active" data-filter="all">Todos</button>
  <button class="filter-btn" data-filter="clareamento">Clareamento</button>
  <button class="filter-btn" data-filter="facetas">Facetas</button>
  <button class="filter-btn" data-filter="restauracao">Restauração</button>
  <button class="filter-btn" data-filter="protese">Prótese</button>
  <button class="filter-btn" data-filter="aparelho">Aparelho</button>
</div>
```

Cada `result-item` recebe `data-category`:

```html
<div class="result-item" data-category="clareamento" tabindex="0" role="button">
```

CSS:

```css
.results-filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-bottom: 24px;
}

.filter-btn {
  padding: 8px 16px;
  border: 1.5px solid var(--logo-pallete-velvety-cherry);
  border-radius: 50px;
  background: transparent;
  color: var(--logo-pallete-velvety-cherry);
  font-size: 1.3rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn.active,
.filter-btn:hover {
  background: var(--logo-pallete-velvety-cherry);
  color: var(--logo-pallete-light);
}

.filter-btn:focus-visible {
  outline: 3px solid var(--color-accent);
  outline-offset: 2px;
}

.result-item.hidden {
  display: none;
}
```

JS:

```javascript
const filterBtns = document.querySelectorAll('.filter-btn');
const resultItems = document.querySelectorAll('.result-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;

    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    resultItems.forEach(item => {
      if (filter === 'all' || item.dataset.category === filter) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  });
});
```

**Acessibilidade:**
- `role="group"` + `aria-label` no container dos filtros
- `aria-pressed` nos botões (alternativa a `.active`)
- Foco permanece no botão após filtrar

---

### Fase 5 — CTA Contextual no Lightbox

#### 5.1 Botão Contextual

**Esforço:** Médio | **Impacto:** Médio | **Arquivos:** `index.html`, `results.css`, `main.js`

Adicionar CTA no lightbox que varia conforme o resultado visualizado:

```html
<div class="lightbox" role="dialog" aria-modal="true">
  <!-- ... img, botões ... -->
  <a class="lightbox-cta" href="#" target="_blank" rel="noopener noreferrer">
    Quero fazer clareamento
  </a>
</div>
```

Cada `result-item` recebe `data-cta-text` e `data-cta-link`:

```html
<div class="result-item" 
     data-category="clareamento"
     data-cta-text="Quero fazer clareamento"
     data-cta-link="https://wa.me/+5583994058749/?text=Gostaria%20de%20fazer%20clareamento%20dental"
     tabindex="0" role="button">
```

CSS:

```css
.lightbox-cta {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--logo-pallete-velvety-cherry);
  color: var(--logo-pallete-light);
  padding: 12px 24px;
  border-radius: 50px;
  font-size: 1.4rem;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s, transform 0.2s;
  white-space: nowrap;
}

.lightbox-cta:hover {
  background: var(--color-accent);
  transform: translateX(-50%) scale(1.05);
}
```

JS (ao abrir/navegar no lightbox):

```javascript
function updateLightboxCTA() {
  const item = items[currentIndex];
  const ctaText = item.dataset.ctaText || 'Quero transformar meu sorriso';
  const ctaLink = item.dataset.ctaLink || 'https://wa.me/+5583994058749/?text=Gostaria%20de%20transformar%20meu%20sorriso';
  
  lightboxCTA.textContent = ctaText;
  lightboxCTA.href = ctaLink;
}
```

---

## Conteúdo Necessário (Dependência da Dra.)

| Item | Descrição | Status |
|------|-----------|--------|
| Fotos aparelho ortodôntico | Antes/depois de caso ortodôntico | ⏸ Aguardando |
| Fotos profilaxia | Antes/depois limpeza com tártaro | ⏸ Aguardando |
| Fotos exodontia + prótese | Caso completo | ⏸ Aguardando |
| Detalhes dos cases | Nº sessões, material, tipo | ⏸ Aguardando |
| Número total de pacientes | Para o contador "sorrisos transformados" | ⏸ Aguardando |
| Fotos separadas (antes/depois) | Para slider de comparação (Fase 3) | ⏸ Aguardando |

---

## Ordem de Implementação Recomendada

```
Fase 1 (sem dependência)
  ├── 1.1 Labels descritivos ← confirmar com Dra.
  ├── 1.2 Contador de resultados ← confirmar número
  └── 1.3 Placeholder blur ← pode fazer agora

Fase 2 (JS puro, sem conteúdo novo)
  ├── 2.1 Setas no lightbox
  └── 2.2 Swipe mobile

Fase 3 (requer conteúdo novo)
  └── 3.1 Slider antes/depois ← precisa de fotos separadas

Fase 4 (quando houver +10 resultados)
  └── 4.1 Filtros por tratamento

Fase 5 (após Fase 2)
  └── 5.1 CTA contextual no lightbox
```

---

## Checklist de Testes

Para cada fase implementada, adicionar/atualizar testes:

- [ ] Lightbox: navegação prev/next (keyboard + click)
- [ ] Lightbox: counter atualiza corretamente
- [ ] Lightbox: swipe (touch events mock)
- [ ] Filtros: filtragem por categoria
- [ ] Filtros: "Todos" mostra todos
- [ ] Filtros: acessibilidade (aria-pressed, focus)
- [ ] Slider: input range atualiza clip
- [ ] Slider: acessibilidade (aria-label, keyboard)
- [ ] CTA contextual: texto e link corretos por resultado

---

## Métricas de Sucesso

| Métrica | Baseline | Meta |
|---------|----------|------|
| Cliques no CTA da seção | — | +20% vs atual |
| Tempo na seção (scroll depth) | — | +30% |
| Interações com lightbox | — | +50% (com navegação) |
| Lighthouse Performance | 97 | ≥ 95 (após imagens extras) |
| Lighthouse Accessibility | 100 | 100 |

> **Nota:** Métricas dependem da implementação da Fase 3 do IMPROVEMENT_PLAN (GTM + GA4).

---

## Referências

- [Web.dev — Image comparison slider](https://web.dev/patterns/components/image-compare/)
- [WCAG 2.1 — Carousel Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/)
- [Open Graph — Best practices for images](https://ogp.me/)
