# Evolução do Menu Offcanva Mobile — Documentação

## Status: Fase 1 e 2 Implementadas ✅

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
| Edge swipe para abrir | ⬜ Pendente | 3 |
| Anúncios `aria-live` | ⬜ Pendente | 3 |

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

// Abrir: .is-open, backdrop .is-visible, inert, focus no primeiro link
// Fechar: remove tudo, retorna foco ao hamburger
// Fechar via: hamburger click, nav links, Escape, backdrop click, swipe left

// Swipe: touchstart registra X, touchend calcula diff, fecha se < -80px
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
     Tests  336 passed (336)
  Duration  ~2s
```

### Cobertura do Menu Offcanva (46 testes)

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

### Mocks utilizados

- `IntersectionObserver` — mock com `triggerIntersection(observerIndex, entries)` para simular scroll
- `matchMedia` — mock com `setMediaQuery()` para simular `prefers-reduced-motion`
- `TouchEvent` — construção manual para simular swipe

---

## Fase 3 — Pendente

Features planejadas mas não implementadas:

### 3.1 Edge swipe para abrir
- Swipe right na borda esquerda (20px) da tela abre o menu
- Risco: conflito com gesture "voltar" do browser
- Requer teste extensivo em dispositivos reais

### 3.2 Anúncios `aria-live`
- Live region anuncia "Menu aberto"/"Menu fechado" para screen readers
- Melhoria incremental sobre o `aria-hidden` já implementado

### 3.3 Swipe interativo com feedback visual
- Menu acompanha o dedo durante o arraste (não apenas no touchend)
- Backdrop escurece proporcionalmente ao progresso do swipe
- Complexidade: precisa desabilitar `transition` durante touchmove

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

---

## Performance

| Métrica | Antes | Depois |
|---------|-------|--------|
| Requisições HTTP (ícones) | 6 PNGs | 0 (SVG inline) |
| Animação de abertura | `left` (reflow) | `transform` (GPU) |
| FPS durante animação | ~30-40 | 60 (compositing) |
| Focus management | Focus trap apenas | Focus trap + `inert` |
| Bundle CSS | +0 KB | ~1.2 KB adicionado |
