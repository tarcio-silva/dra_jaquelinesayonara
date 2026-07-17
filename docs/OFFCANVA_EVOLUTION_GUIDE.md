# Guia de Implementação — Evolução do Menu Offcanva Mobile

## Visão Geral

Plano de evolução do menu offcanva mobile para melhorar UX, performance e acessibilidade, mantendo o design system existente (cores, tipografia, border-radius).

**Arquivos impactados:**
- `assets/css/header/offcanva.css`
- `assets/js/main.js`
- `index.html` (seção do offcanva)
- `tratamentos/*/index.html` (replicar estrutura)

---

## Fase 1 — Performance e Interação Base

> Alto impacto, baixo esforço. Foco em fluidez e padrões nativos.

### 1.1 Substituir `left` por `transform` (GPU-accelerated)

**Problema:** Animar `left` causa reflow/repaint a cada frame.  
**Solução:** Usar `transform: translateX()` que roda na GPU compositor layer.

**CSS (`offcanva.css`):**
```css
.offcanva {
  left: 0; /* fixo, não animar */
  transform: translateX(-100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
  visibility: hidden;
}

.offcanva.is-open {
  transform: translateX(0);
  visibility: visible;
}
```

**JS (`main.js`):**
```js
// Substituir manipulação de style.left por toggle de classe
function toggleNav() {
  const isActive = offCanva.classList.contains("is-open");

  if (isActive) {
    offCanva.classList.remove("is-open");
    hamburgerButton.classList.remove("is-active");
    hamburgerButton.setAttribute("aria-expanded", "false");
    offCanva.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    offCanva.removeEventListener("keydown", trapFocusInOffcanva);
    hamburgerButton.focus();
  } else {
    offCanva.classList.add("is-open");
    hamburgerButton.classList.add("is-active");
    hamburgerButton.setAttribute("aria-expanded", "true");
    offCanva.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    const firstLink = offCanva.querySelector("a");
    if (firstLink) firstLink.focus();
    offCanva.addEventListener("keydown", trapFocusInOffcanva);
  }
}
```

**HTML:** Remover `style="left: -120%"` inline do elemento `#offcanva`.

---

### 1.2 Backdrop overlay (fechar ao tocar fora)

**Objetivo:** Escurecer o conteúdo atrás do menu + permitir fechar tocando no backdrop.

**HTML (adicionar antes do `</nav>` do offcanva, ou como sibling):**
```html
<div class="offcanva-backdrop" id="offcanva-backdrop" aria-hidden="true"></div>
```

**CSS:**
```css
.offcanva-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0);
  z-index: 999; /* abaixo do offcanva (1000) */
  pointer-events: none;
  transition: background 0.3s ease;
}

.offcanva-backdrop.is-visible {
  background: rgba(0, 0, 0, 0.5);
  pointer-events: auto;
}

@media screen and (min-width: 1200px) {
  .offcanva-backdrop {
    display: none;
  }
}
```

**JS (adicionar ao toggleNav):**
```js
const backdrop = document.getElementById("offcanva-backdrop");

// Dentro do toggleNav:
// Ao abrir:
backdrop.classList.add("is-visible");
backdrop.setAttribute("aria-hidden", "false");

// Ao fechar:
backdrop.classList.remove("is-visible");
backdrop.setAttribute("aria-hidden", "true");

// Fechar ao clicar no backdrop:
backdrop.addEventListener("click", toggleNav);
```

---

### 1.3 Swipe para fechar (gesture nativo)

**Objetivo:** Deslizar para a esquerda fecha o menu (padrão drawer de apps).

**JS:**
```js
let touchStartX = 0;
let touchCurrentX = 0;
let isSwiping = false;
const SWIPE_THRESHOLD = 80;

offCanva.addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX;
  isSwiping = true;
}, { passive: true });

offCanva.addEventListener("touchmove", (e) => {
  if (!isSwiping) return;
  touchCurrentX = e.touches[0].clientX;
  const diff = touchCurrentX - touchStartX;

  // Só permitir arrastar para a esquerda (fechar)
  if (diff < 0) {
    const translateX = Math.max(diff, -window.innerWidth);
    offCanva.style.transition = "none";
    offCanva.style.transform = `translateX(${translateX}px)`;

    // Atualizar opacidade do backdrop proporcionalmente
    const progress = Math.abs(diff) / window.innerWidth;
    backdrop.style.background = `rgba(0, 0, 0, ${0.5 * (1 - progress)})`;
  }
}, { passive: true });

offCanva.addEventListener("touchend", () => {
  if (!isSwiping) return;
  isSwiping = false;

  const diff = touchCurrentX - touchStartX;
  offCanva.style.transition = "";
  offCanva.style.transform = "";
  backdrop.style.background = "";

  if (diff < -SWIPE_THRESHOLD) {
    toggleNav(); // Fechar
  }
}, { passive: true });
```

---

### 1.4 Indicador de seção ativa no menu mobile

**Objetivo:** Destacar no offcanva qual seção está visível na página.

**CSS:**
```css
.offcanva-nav--link.active {
  background-color: var(--logo-pallete-velvety-cherry);
  color: var(--logo-pallete-light);
  border-radius: 8px;
  padding: 8px 12px;
}

.offcanva-nav--link.active img {
  filter: brightness(0) invert(1);
}
```

**JS (modificar o navObserver existente):**
```js
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Desktop
      document.querySelectorAll(".header-link").forEach(l => l.classList.remove("active"));
      const activeDesktop = document.querySelector(`.header-link[href="#${entry.target.id}"]`);
      if (activeDesktop) activeDesktop.classList.add("active");

      // Mobile offcanva
      document.querySelectorAll(".offcanva-nav--link").forEach(l => l.classList.remove("active"));
      const activeMobile = document.querySelector(`.offcanva-nav--link[href="#${entry.target.id}"]`);
      if (activeMobile) activeMobile.classList.add("active");
    }
  });
}, { threshold: 0.3 });
```

---

## Fase 2 — Visual e Conteúdo

> Médio esforço. Foco em identidade visual e conversão.

### 2.1 Animação escalonada (stagger) nos links

**CSS:**
```css
.offcanva-nav li {
  opacity: 0;
  transform: translateX(-20px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.offcanva.is-open .offcanva-nav li {
  opacity: 1;
  transform: translateX(0);
}

.offcanva.is-open .offcanva-nav li:nth-child(1) { transition-delay: 0.05s; }
.offcanva.is-open .offcanva-nav li:nth-child(2) { transition-delay: 0.10s; }
.offcanva.is-open .offcanva-nav li:nth-child(3) { transition-delay: 0.15s; }
.offcanva.is-open .offcanva-nav li:nth-child(4) { transition-delay: 0.20s; }
.offcanva.is-open .offcanva-nav li:nth-child(5) { transition-delay: 0.25s; }
.offcanva.is-open .offcanva-nav li:nth-child(6) { transition-delay: 0.30s; }

/* Respeitar prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  .offcanva-nav li {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
```

---

### 2.2 Botão de fechar explícito (✕)

**HTML (primeiro filho dentro do `.offcanva`):**
```html
<button class="offcanva-close" aria-label="Fechar menu" type="button">
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
</button>
```

**CSS:**
```css
.offcanva-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  color: var(--logo-pallete-velvety-cherry);
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background 0.2s;
}

.offcanva-close:hover,
.offcanva-close:focus-visible {
  background: rgba(162, 83, 86, 0.1);
}
```

**JS:**
```js
const offcanvaClose = document.querySelector(".offcanva-close");
if (offcanvaClose) {
  offcanvaClose.addEventListener("click", toggleNav);
}
```

---

### 2.3 CTA WhatsApp fixo no rodapé do menu

**HTML (após `.offcanva-dark-mode`, antes do `</nav>`):**
```html
<a class="offcanva-cta" href="https://wa.me/+5583994058749/?text=Gostaria%20de%20agendar%20uma%20consulta" target="_blank" rel="noopener noreferrer">
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
  Agendar consulta
</a>
```

**CSS:**
```css
.offcanva-cta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: calc(100% - 48px);
  margin: auto 24px 24px;
  padding: 14px 24px;
  background-color: #25d366;
  color: #fff;
  font-size: 1.5rem;
  font-weight: 600;
  text-decoration: none;
  border-radius: 50px;
  transition: background 0.2s, transform 0.1s;
}

.offcanva-cta:active {
  transform: scale(0.97);
}

.offcanva-cta:focus-visible {
  outline: 3px solid #25d366;
  outline-offset: 2px;
}
```

---

### 2.4 Identidade visual no topo (foto + nome)

**HTML (substituir o `<img>` do favicon):**
```html
<div class="offcanva-identity">
  <img src="./assets/img/about/dra-jaqueline.webp" alt="Dra. Jaqueline Sayonara" width="72" height="72" class="offcanva-avatar">
  <span class="offcanva-name">Dra. Jaqueline Sayonara</span>
  <span class="offcanva-cro">CRO-PB 9833</span>
</div>
```

**CSS:**
```css
.offcanva-identity {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 32px 24px 16px;
}

.offcanva-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--logo-pallete-velvety-cherry);
}

.offcanva-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--logo-pallete-velvety-cherry);
}

.offcanva-cro {
  font-size: 1.2rem;
  color: var(--color-text-muted);
}
```

---

## Fase 3 — Refinamento e Acessibilidade Avançada

> Maior esforço. Polish final e robustez.

### 3.1 Swipe na borda para abrir (edge gesture)

**JS:**
```js
const EDGE_WIDTH = 20; // px da borda esquerda
let edgeTouchStartX = 0;

document.addEventListener("touchstart", (e) => {
  const touch = e.touches[0];
  if (touch.clientX <= EDGE_WIDTH && !offCanva.classList.contains("is-open")) {
    edgeTouchStartX = touch.clientX;
  }
}, { passive: true });

document.addEventListener("touchend", (e) => {
  if (edgeTouchStartX === 0) return;
  const touchEndX = e.changedTouches[0].clientX;
  const diff = touchEndX - edgeTouchStartX;
  edgeTouchStartX = 0;

  if (diff > SWIPE_THRESHOLD) {
    toggleNav(); // Abrir
  }
});
```

**Nota:** Testar em devices reais — evitar conflito com gestos do navegador (voltar página).

---

### 3.2 Atributo `inert` no conteúdo principal

**Objetivo:** Mais robusto que focus trap — impede qualquer interação com conteúdo fora do menu.

**JS:**
```js
const mainContent = document.getElementById("main-content");
const headerNav = document.querySelector(".header-nav");

// Ao abrir:
if (mainContent) mainContent.setAttribute("inert", "");
if (headerNav) headerNav.setAttribute("inert", "");

// Ao fechar:
if (mainContent) mainContent.removeAttribute("inert");
if (headerNav) headerNav.removeAttribute("inert");
```

**Compatibilidade:** `inert` tem suporte em todos os browsers modernos (Chrome 102+, Safari 15.5+, Firefox 112+). Manter o focus trap como fallback para browsers antigos.

---

### 3.3 Ícones SVG inline (substituir PNGs)

**Objetivo:** Eliminar requests HTTP para ícones, permitir colorir via CSS, suportar dark mode.

**Exemplo (Home):**
```html
<li>
  <a class="offcanva-nav--link" href="#">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
    <p>Home</p>
  </a>
</li>
```

**CSS (ajuste):**
```css
.offcanva-nav--link svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  color: var(--logo-pallete-velvety-cherry);
  transition: color 0.2s;
}

.offcanva-nav--link.active svg {
  color: var(--logo-pallete-light);
}
```

**Ícones sugeridos (Feather/Lucide icons):**
| Seção | Ícone |
|-------|-------|
| Home | `home` |
| Sobre | `user` |
| Tratamentos | `heart` |
| Resultados | `image` |
| Planos | `shield` |
| Localização | `map-pin` |

---

### 3.4 Anúncio para screen readers

**JS:**
```js
// Criar live region (uma vez no load)
const liveRegion = document.createElement("div");
liveRegion.setAttribute("role", "status");
liveRegion.setAttribute("aria-live", "polite");
liveRegion.setAttribute("aria-atomic", "true");
liveRegion.classList.add("sr-only"); /* visually-hidden */
document.body.appendChild(liveRegion);

// No toggleNav:
// Ao abrir:
liveRegion.textContent = "Menu de navegação aberto";

// Ao fechar:
liveRegion.textContent = "Menu de navegação fechado";
```

---

## Checklist de Implementação

### Fase 1
- [ ] Remover `style="left: -120%"` inline do HTML
- [ ] Substituir animação `left` por `transform: translateX`
- [ ] Usar classe `.is-open` em vez de manipular `style.left`
- [ ] Adicionar backdrop overlay com fade
- [ ] Implementar fechar ao tocar no backdrop
- [ ] Implementar swipe-to-close no offcanva
- [ ] Adicionar indicador de seção ativa nos links mobile
- [ ] Atualizar testes unitários (`menu-offcanva.test.js`)
- [ ] Testar em dispositivos reais (iOS Safari, Android Chrome)

### Fase 2
- [ ] Adicionar animação stagger nos links
- [ ] Adicionar botão de fechar (✕) no canto superior direito
- [ ] Adicionar CTA WhatsApp fixo no rodapé
- [ ] Substituir favicon por identidade visual (foto + nome + CRO)
- [ ] Respeitar `prefers-reduced-motion` nas animações novas
- [ ] Atualizar focus trap para incluir novos elementos focáveis

### Fase 3
- [ ] Implementar edge swipe para abrir
- [ ] Adicionar atributo `inert` no conteúdo principal
- [ ] Migrar ícones PNG para SVG inline
- [ ] Adicionar anúncios via `aria-live` region
- [ ] Atualizar fixture de testes (`home.html`)
- [ ] Rodar suite completa e garantir 0 regressões

---

## Testes a Atualizar

| Arquivo | Ajustes necessários |
|---------|-------------------|
| `tests/unit/menu-offcanva.test.js` | Trocar verificações de `style.left` por verificação de classe `.is-open`; adicionar testes para backdrop, swipe, botão fechar |
| `tests/helpers/dom-utils.js` | Atualizar fixture do offcanva (backdrop, botão fechar, CTA) |
| `tests/fixtures/home.html` | Sincronizar com nova estrutura HTML |

**Novos test cases sugeridos:**
```
- backdrop aparece ao abrir menu
- clicar no backdrop fecha o menu
- swipe left no offcanva fecha o menu
- botão fechar (✕) fecha o menu e retorna foco
- CTA WhatsApp tem href correto e target _blank
- indicador de seção ativa sincroniza com scroll
- animação stagger desabilitada com prefers-reduced-motion
- inert é adicionado/removido do main-content
```

---

## Compatibilidade

| Feature | Chrome | Safari | Firefox | Fallback |
|---------|--------|--------|---------|----------|
| `transform` | ✅ | ✅ | ✅ | — |
| `will-change` | ✅ | ✅ | ✅ | — |
| `inert` | 102+ | 15.5+ | 112+ | Focus trap existente |
| Touch events | ✅ | ✅ | ✅ | — |
| `prefers-reduced-motion` | ✅ | ✅ | ✅ | — |
| CSS `inset` | 87+ | 14.1+ | 66+ | `top/right/bottom/left: 0` |

---

## Métricas de Sucesso

- **Performance:** Lighthouse Performance ≥ 97 (sem regressão)
- **Acessibilidade:** Lighthouse Accessibility = 100
- **Testes:** Todos passando (suite completa)
- **Gestos:** Swipe funcional em iOS Safari + Android Chrome
- **Animação:** 60fps consistente (verificar via DevTools Performance tab)
- **Bundle:** Aumento máximo de ~1KB no CSS minificado
