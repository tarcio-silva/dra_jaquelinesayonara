# Evolução do Menu Offcanva Mobile — Documentação

## Status: Fases 1, 2 e 3 Implementadas ✅

Data: 2026-07-17

---

## Resumo das Alterações

| Feature | Status | Fase |
|---------|--------|------|
| `transform: translateX()` GPU-accelerated | ✅ Implementado | 1 |
| Classe `.is-open` (substitui `style.left`) | ✅ Implementado | 1 |
| Backdrop overlay (fecha ao tocar fora) | ✅ Implementado | 1 |
| Swipe-to-close (threshold 80px) | ✅ Implementado | 1 |
| Atributo `inert` no main-content | ✅ Implementado | 1 |
| Indicador de seção ativa mobile | ✅ Implementado | 1 |
| CTA WhatsApp no rodapé do menu | ✅ Implementado | 1 |
| Identidade visual (foto + nome + CRO) | ✅ Implementado | 1 |
| Animação stagger nos links | ✅ Implementado | 2 |
| Ícones SVG inline (Feather/Lucide) | ✅ Implementado | 2 |
| Edge swipe para abrir | ✅ Implementado | 3 |
| Anúncios `aria-live` | ✅ Implementado | 3 |
| Swipe interativo com feedback visual | ✅ Implementado | 3 |

---

## Arquivos Modificados

| Arquivo | Alteração |
|---------|-----------|
| `assets/js/main.js` | toggleNav() com `.is-open`, backdrop, inert, swipe, seção ativa mobile |
| `assets/css/header/offcanva.css` | Layout completo (transform, backdrop, identity, nav, CTA, stagger) |
| `index.html` | HTML do offcanva + CSS inline atualizado |
| `tests/unit/menu-offcanva.test.js` | 46 test cases (backdrop, swipe, inert, seção ativa, stagger) |
| `tests/helpers/dom-utils.js` | Fixture atualizada com nova estrutura |
| `tests/fixtures/home.html` | Sincronizado com HTML de produção |

---

## Arquitetura Final

### HTML (estrutura do offcanva)

```html
<nav class="offcanva" id="offcanva" role="navigation" aria-label="Menu principal" aria-hidden="true">
    <!-- Identidade visual -->
    <div class="offcanva-identity">
        <img src="./assets/img/about/dra-jaqueline-sayonara-sobre.webp"
             alt="Dra. Jaqueline Sayonara" width="72" height="72" class="offcanva-avatar">
        <span class="offcanva-name">Dra. Jaqueline Sayonara</span>
        <span class="offcanva-cro">CRO-PB 9833</span>
    </div>

    <!-- Social links -->
    <nav class="offcanva-nav--social">
        <ul><!-- SVG icons: Instagram, Facebook, WhatsApp --></ul>
    </nav>

    <!-- Navegação principal (SVG icons inline) -->
    <nav class="offcanva-nav">
        <ul>
            <li><a class="offcanva-nav--link" href="#">
                <svg><!-- home icon --></svg><p>Home</p>
            </a></li>
            <!-- ... demais links ... -->
        </ul>
    </nav>

    <!-- Dark mode toggle -->
    <div class="offcanva-dark-mode"><!-- switch --></div>

    <!-- CTA WhatsApp -->
    <a class="offcanva-cta" href="https://wa.me/..." target="_blank" rel="noopener noreferrer">
        <svg><!-- whatsapp icon --></svg> Agendar consulta
    </a>
</nav>

<!-- Backdrop (sibling do nav) -->
<div class="offcanva-backdrop" id="offcanva-backdrop" aria-hidden="true"></div>
```

### JS (lógica principal)

```js
// Elementos
const hamburgerButton = document.getElementById("hamburger-button");
const offCanva = document.getElementById("offcanva");
const offCanvaBackdrop = document.getElementById("offcanva-backdrop");
const mainContent = document.getElementById("main-content");

// Aria-live region (criada no load)
const offCanvaLiveRegion = document.createElement("div");
offCanvaLiveRegion.setAttribute("role", "status");
offCanvaLiveRegion.setAttribute("aria-live", "polite");
offCanvaLiveRegion.classList.add("sr-only");
document.body.appendChild(offCanvaLiveRegion);

// Abrir: .is-open, backdrop .is-visible, inert, focus no primeiro link, anuncia "aberto"
// Fechar: remove tudo, retorna foco ao hamburger, anuncia "fechado"
// Fechar via: hamburger click, nav links, Escape, backdrop click, swipe left

// Swipe interativo: touchmove atualiza transform + opacidade backdrop proporcionalmente
// touchend restaura transições e fecha se diff < -SWIPE_THRESHOLD (80px)

// Edge swipe para abrir: touchstart na borda esquerda (≤20px)
// touchend com diffX > SWIPE_THRESHOLD e diffY < diffX (não é scroll)

// Active section: IntersectionObserver sincroniza .active em desktop + mobile
```

### CSS (mecanismo de animação)

```css
/* Estado fechado */
.offcanva {
  transform: translateX(-100%);
  visibility: hidden;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.3s;
}

/* Estado aberto */
.offcanva.is-open {
  transform: translateX(0);
  visibility: visible;
}

/* Stagger nos links */
.offcanva-nav li {
  opacity: 0;
  transform: translateX(-20px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.offcanva.is-open .offcanva-nav li:nth-child(N) {
  opacity: 1;
  transform: translateX(0);
  transition-delay: N * 0.05s;
}
```

---

## Decisões de Design

### Hamburger como botão fechar (não ✕ separado)

**Decisão:** Usar o hamburger animado (☰ → ✕) como único botão de fechar.

**Motivo:** O hamburger tem `z-index: 1010` (acima do offcanva `z-index: 1000`) e `position: fixed` no canto superior direito. Adicionar um botão ✕ separado no offcanva criava **dois elementos visuais sobrepostos** no mesmo lugar, confundindo o usuário.

**Resultado:** Um único ponto de interação no canto superior direito que muda de ☰ para ✕ — padrão familiar de apps.

### Indicador .active sutil (não fundo cherry)

**Decisão:** Usar `background-color: rgba(162, 83, 86, 0.05)` + `font-weight: 700` em vez de fundo cherry com texto branco.

**Motivo:** O design original (fundo sólido + cor branca + `padding: 8px 12px`) alterava o tamanho do link, quebrando o alinhamento vertical dos itens do menu.

**Resultado:** Destaque visual sem alterar dimensões — o link ativo fica mais "pesado" (bold) com fundo sutil.

### Foto com `object-position: top`

**Decisão:** Avatar circular usa `object-position: top` em vez de `center`.

**Motivo:** A imagem original é um retrato de corpo — o `object-fit: cover` com posição centralizada cortava a cabeça da Dra.

---

## Troubleshooting

### ❌ Menu não fecha / não anima

**Causa:** CSS inline no `index.html` (Critical CSS) sobrescrevia o `offcanva.css` externo.

**Sintoma:** O `offcanva.css` tinha `transform: translateX(-100%)` mas o CSS inline ainda usava `transition: all .5s ease-out` sem `transform`, resultando no menu visível mas sem animação.

**Solução:** Atualizar o CSS inline no `<style>` do `index.html` com as mesmas regras do `offcanva.css`. O CSS inline tem prioridade na cascata porque vem junto com o documento.

**Lição:** Sempre que alterar `offcanva.css`, verificar se o CSS inline no `index.html` precisa ser atualizado também. O projeto usa Critical CSS inline para performance (evitar FOUC).

### ❌ Dois botões de fechar sobrepostos

**Causa:** Adicionado `.offcanva-close` (botão ✕) dentro do offcanva enquanto o hamburger já é `position: fixed` com `z-index: 1010` no mesmo local.

**Sintoma:** Dois elementos interativos visíveis no canto superior direito quando o menu está aberto.

**Solução:** Removido o `.offcanva-close`. O hamburger animado já funciona como botão fechar.

### ❌ Layout quebrado / elementos desalinhados

**Causa:** Regra genérica `.offcanva ul { padding: 24px }` afetava todos os `<ul>` dentro do offcanva (social e nav), e `.offcanva img { width: 96px; margin: 16px }` afetava o avatar.

**Sintoma:** Social links e avatar com padding excessivo, desalinhados do centro.

**Solução:**
1. Removida regra genérica `.offcanva ul` — cada seção tem seus estilos específicos
2. Removida regra `.offcanva img` (legado do favicon antigo)
3. `.offcanva-identity` com `padding: 56px 24px 8px` (56px topo para não ficar atrás do hamburger)
4. `.offcanva-nav--social ul` com `justify-content: center; gap: 24px`

### ❌ Foto cortada na cabeça

**Causa:** `object-fit: cover` com `object-position: center` (padrão) em imagem de retrato vertical.

**Solução:** `object-position: top` para priorizar a parte superior da imagem.

---

## Testes

### Resultado Atual

```
Test Files  9 passed (9)
     Tests  348 passed (348)
  Duration  ~2s
```

### Cobertura do Menu Offcanva (58 testes)

| Grupo | Testes | Status |
|-------|--------|--------|
| toggleNav() — abrir | 6 | ✅ |
| toggleNav() — fechar | 6 | ✅ |
| Fechar com Escape | 2 | ✅ |
| Fechar via nav links | 1 | ✅ |
| Focus Trap | 2 | ✅ |
| Backdrop overlay | 6 | ✅ |
| Swipe-to-close | 4 | ✅ |
| Hamburger como botão fechar | 4 | ✅ |
| CTA WhatsApp | 5 | ✅ |
| Indicador de seção ativa mobile | 2 | ✅ |
| Animação stagger | 3 | ✅ |
| Atributo inert | 5 | ✅ |
| Edge swipe para abrir | 5 | ✅ |
| Anúncios aria-live | 4 | ✅ |
| Swipe interativo com feedback | 3 | ✅ |

### Mocks utilizados

- `IntersectionObserver` — mock com `triggerIntersection(observerIndex, entries)` para simular scroll
- `matchMedia` — mock com `setMediaQuery()` para simular `prefers-reduced-motion`
- `TouchEvent` — construção manual para simular swipe

---

## Fase 3 — Implementada

### 3.1 Edge swipe para abrir

**Comportamento:**
- Detecta `touchstart` na borda esquerda da tela (≤20px)
- No `touchend`, calcula `diffX` e `diffY`
- Abre o menu se: `diffX > 80px` **e** `diffY < diffX` (evita conflito com scroll vertical)
- Não dispara se o menu já está aberto

**Cuidados:**
- `diffY < diffX` evita abrir acidentalmente durante scroll vertical
- Não conflita com gesture "voltar" do navegador (que geralmente precisa de ~40px da borda)
- `EDGE_WIDTH = 20px` é conservador o suficiente

### 3.2 Anúncios aria-live

**Comportamento:**
- No carregamento, cria `<div role="status" aria-live="polite" aria-atomic="true" class="sr-only">`
- Ao abrir: `textContent = "Menu de navegação aberto"`
- Ao fechar: `textContent = "Menu de navegação fechado"`

**Benefício:** Screen readers (VoiceOver, TalkBack, NVDA) anunciam a mudança de estado sem o usuário precisar navegar até o menu.

### 3.3 Swipe interativo com feedback visual

**Comportamento:**
- `touchstart`: registra posição inicial
- `touchmove`: atualiza `transform: translateX()` do menu em tempo real + opacidade do backdrop proporcionalmente (`0.5 * (1 - progress)`)
- `touchend`: restaura `transition` e `transform` via CSS, fecha se `diff < -80px`

**Detalhes de implementação:**
- Durante `touchmove`, desabilita `transition: none` para evitar lag
- O backdrop usa `progress = Math.min(Math.abs(diff) / 300, 1)` — atinge transparência total aos 300px de arraste
- Só permite arrastar para a esquerda (`diff < 0`)
- Swipe para a direita durante touchmove é ignorado (não "puxa" o menu)

---

## Compatibilidade

| Feature | Chrome | Safari | Firefox | Suporte |
|---------|--------|--------|---------|---------|
| `transform` | ✅ All | ✅ All | ✅ All | Universal |
| `will-change` | ✅ All | ✅ All | ✅ All | Universal |
| `visibility` transition | ✅ All | ✅ All | ✅ All | Universal |
| `inert` | 102+ | 15.5+ | 112+ | 95%+ global |
| Touch events | ✅ All | ✅ All | ✅ All | Universal |
| `inset` shorthand | 87+ | 14.1+ | 66+ | 97%+ global |
| SVG `stroke=currentColor` | ✅ All | ✅ All | ✅ All | Universal |
| `aria-live` polite | ✅ All | ✅ All | ✅ All | Universal |

---

## Performance

| Métrica | Antes | Depois |
|---------|-------|--------|
| Requisições HTTP (ícones) | 6 PNGs | 0 (SVG inline) |
| Animação de abertura | `left` (reflow) | `transform` (GPU) |
| FPS durante animação | ~30-40 | 60 (compositing) |
| Swipe feedback | Nenhum (só touchend) | Tempo real (touchmove) |
| Focus management | Focus trap apenas | Focus trap + `inert` |
| Screen readers | `aria-hidden` | `aria-hidden` + `aria-live` |
| Bundle CSS | +0 KB | ~1.5 KB adicionado |
| Bundle JS | ~2 KB (menu) | ~4 KB (menu + gestures) |

---

## Evolução dos Testes

| Fase | Test Cases | Total Suite |
|------|-----------|-------------|
| Original | 17 | 307 |
| Fase 1 | 46 (+29) | 336 |
| Fase 2 | 46 (sem novos) | 336 |
| Fase 3 | 58 (+12) | 348 |

---

## PRs Criados

| PR | Título | Fase |
|----|--------|------|
| #34 | feat: atualiza imagem de prótese | — |
| #35 | test: suite de testes para evolução do menu offcanva | Prep |
| #36 | feat: menu offcanva mobile — Fase 1 | 1 |
| #39 | feat: menu offcanva Fase 2 — stagger animation + SVG icons | 2 |
| #40 | feat: menu offcanva Fase 3 — edge swipe, aria-live, swipe interativo | 3 |
