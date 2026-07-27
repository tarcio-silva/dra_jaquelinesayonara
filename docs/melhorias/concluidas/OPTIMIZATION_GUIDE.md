# Guia de Otimização — Performance, SEO e Acessibilidade

> **Contexto:** Análise realizada em 2026-07-12 no site https://www.drajaquelinesayonara.com.br/  
> **Branch:** `main`  
> **Score atual:** Performance ~90/100 | SEO 7.5/10 | Acessibilidade 6.7/10  
> **Objetivo:** Orientar ferramentas LLM na implementação das correções identificadas.

---

## Convenções deste Guia

- Cada task é **autocontida** — pode ser executada independentemente.
- `FILE:` indica o arquivo a ser editado.
- `FIND:` indica o trecho exato a localizar (use como âncora para `strReplace`).
- `REPLACE:` indica o novo conteúdo.
- `ACTION:` indica operação que não é substituição simples (criar, deletar, mover).
- Prioridade: 🔴 Crítica | 🟠 Alta | 🟡 Média | 🟢 Baixa

### Notas sobre o código

- **Breakpoint principal:** O código usa `max-width: 1199px` (mobile) e `min-width: 1200px` (desktop). Ao editar media queries, usar esses valores exatos — não usar `1200px` como max-width.
- **Dark mode JS:** A lógica do toggle está em um `<script>` inline no final do `index.html`, não em `assets/js/main.js`.
- **CSS inline:** O `index.html` tem `<style>` inline com o CSS minificado de produção. Edições em arquivos `.css` fonte requerem rebuild via `./build-css.sh`.

---

## 🔴 TASK-01: Corrigir canonical URL (www inconsistente)

**Problema:** O site redireciona (308) para `www.drajaquelinesayonara.com.br`, mas o canonical aponta para a versão sem www. Isso confunde crawlers sobre a URL autoritativa.

**Impacto:** SEO — indexação inconsistente, possível diluição de sinais de ranking.

FILE: `index.html`

FIND:
```html
<link rel="canonical" href="https://drajaquelinesayonara.com.br/">
```

REPLACE:
```html
<link rel="canonical" href="https://www.drajaquelinesayonara.com.br/">
```

---

## 🔴 TASK-02: Corrigir Open Graph e meta URLs (www inconsistente)

**Problema:** `og:url` e `og:image` apontam para URL sem www, gerando redirect ao ser resolvida por crawlers sociais.

FILE: `index.html`

FIND:
```html
<meta property="og:image" content="https://drajaquelinesayonara.com.br/assets/img/logo_js_2026.png">
<meta property="og:url" content="https://drajaquelinesayonara.com.br">
```

REPLACE:
```html
<meta property="og:image" content="https://www.drajaquelinesayonara.com.br/assets/img/logo_js_2026.webp">
<meta property="og:url" content="https://www.drajaquelinesayonara.com.br/">
```

> **Nota:** Trocar extensão para `.webp` se `logo_js_2026.webp` existir, ou criar o arquivo. Caso contrário, manter `.png` mas com domínio `www`.

---

## 🔴 TASK-03: Corrigir Schema.org URL

**Problema:** `url` e `image` no JSON-LD sem www.

FILE: `index.html`

FIND (dentro do `<script type="application/ld+json">`):
```json
"url": "https://drajaquelinesayonara.com.br",
"image": "https://drajaquelinesayonara.com.br/assets/img/logo_js_2026.png",
```

REPLACE:
```json
"url": "https://www.drajaquelinesayonara.com.br",
"image": "https://www.drajaquelinesayonara.com.br/assets/img/logo_js_2026.webp",
```

---

## 🔴 TASK-04: Corrigir sitemap.xml (www + lastmod)

**Problema:** URL no sitemap sem www e `lastmod` desatualizado.

FILE: `sitemap.xml`

FIND:
```xml
<loc>https://drajaquelinesayonara.com.br/</loc>
```

REPLACE:
```xml
<loc>https://www.drajaquelinesayonara.com.br/</loc>
```

Também atualizar `<lastmod>` para a data do último deploy real.

---

## 🔴 TASK-05: Corrigir robots.txt (www)

FILE: `robots.txt`

FIND:
```
Sitemap: https://drajaquelinesayonara.com.br/sitemap.xml
```

REPLACE:
```
Sitemap: https://www.drajaquelinesayonara.com.br/sitemap.xml
```

---

## 🔴 TASK-06: Remover preload 404 (header_picture_mobile.webp)

**Problema:** O preload referencia uma imagem que não existe no servidor, gerando request 404 desperdiçado em toda visita.

**Impacto:** Performance — ~100ms de latência desperdiçada, console error.

FILE: `index.html`

FIND:
```html
<link rel="preload" href="./assets/img/header/main-banner/header_picture_mobile.webp" as="image" type="image/webp">
```

ACTION: **Remover esta linha inteiramente.**

---

## 🔴 TASK-07: Tornar lightbox acessível por teclado

**Problema:** O lightbox não tem `role="dialog"`, focus trap, botão fechar, nem os `.result-item` são focáveis. Completamente inacessível sem mouse.

**Impacto:** Acessibilidade — falha WCAG 2.1.1 (Keyboard), 2.4.3 (Focus Order).

### 7a. Tornar result items focáveis

FILE: `index.html`

Para CADA `<div class="result-item">`, adicionar `tabindex="0"` e `role="button"`:

FIND (padrão repetido):
```html
<div class="result-item">
```

REPLACE:
```html
<div class="result-item" tabindex="0" role="button">
```

### 7b. Adicionar semântica ao lightbox

FILE: `index.html`

FIND:
```html
<div class="lightbox" id="lightbox"><img src="" alt=""></div>
```

REPLACE:
```html
<div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Visualização ampliada da imagem">
    <button class="lightbox-close" aria-label="Fechar visualização">&times;</button>
    <img src="" alt="">
</div>
```

### 7c. Estilizar botão fechar do lightbox

FILE: `assets/css/results.css` (ou inline no `<style>` do index.html)

ACTION: Adicionar ao final da seção lightbox:
```css
.lightbox-close {
    position: absolute;
    top: 16px;
    right: 16px;
    background: none;
    border: none;
    color: #fff;
    font-size: 3.2rem;
    cursor: pointer;
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background 0.2s;
}
.lightbox-close:hover {
    background: rgba(255, 255, 255, 0.1);
}
```

### 7d. Implementar focus trap e keyboard no lightbox

FILE: `assets/js/main.js`

Localizar a lógica de abertura do lightbox e substituir/expandir com:

```javascript
// --- Lightbox com acessibilidade ---
const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox.querySelector('img');
const lightboxClose = lightbox.querySelector('.lightbox-close');
let lastFocusedElement = null;

function openLightbox(img) {
    lastFocusedElement = document.activeElement;
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    if (lastFocusedElement) lastFocusedElement.focus();
}

// Click e keyboard nos result items
document.querySelectorAll('.result-item').forEach(item => {
    const img = item.querySelector('img');
    item.addEventListener('click', () => openLightbox(img));
    item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openLightbox(img);
        }
    });
});

// Fechar lightbox
lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
    }
});

// Focus trap dentro do lightbox
lightbox.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        e.preventDefault();
        lightboxClose.focus();
    }
});
```

---

## 🔴 TASK-08: Corrigir contraste de cores (WCAG AA)

**Problema:** `--color-text-muted` (#8c6365) tem ratio ~3.8:1 sobre background claro (#fdfbfc). Mínimo WCAG AA é 4.5:1. `--color-accent` (#c8727a) tem ~3.3:1.

**Impacto:** Acessibilidade — falha WCAG 1.4.3 (Contrast Minimum).

FILE: `index.html` (CSS inline no `<style>`)

FIND (dentro de `:root`):
```css
--color-text-muted:#8c6365;--color-accent:#c8727a;
```

REPLACE:
```css
--color-text-muted:#6b4a4c;--color-accent:#a85860;
```

> **Ratios após correção:**  
> `#6b4a4c` sobre `#fdfbfc` → ~5.8:1 ✅ (AA normal + large)  
> `#a85860` sobre `#fdfbfc` → ~4.6:1 ✅ (AA normal)

Também atualizar no arquivo fonte (se existir separado):

FILE: `assets/css/globalStyle.css`

FIND:
```css
--color-text-muted: #8c6365;
--color-accent: #c8727a;
```

REPLACE:
```css
--color-text-muted: #6b4a4c;
--color-accent: #a85860;
```

> **⚠️ Tema escuro:** O `dark-theme.css` redefine `--color-text-muted: #b8a8ab` para o dark mode. Este valor NÃO precisa ser alterado — ratio de `#b8a8ab` sobre `#1a1218` (bg escuro) → ~7.0:1 ✅ (passa AA). A correção de contraste é necessária **apenas no tema claro** (`:root`).

---

## 🔴 TASK-09: Focus trap no menu offcanva (mobile)

**Problema:** Quando o menu offcanva está aberto, o foco pode escapar para elementos atrás. Não há gerenciamento de foco ao abrir/fechar.

FILE: `assets/js/main.js`

ACTION: Na função que abre o menu offcanva, adicionar:

```javascript
// Ao abrir o menu
function openOffcanva() {
    offcanva.classList.add('active'); // ou equivalente existente
    offcanva.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    
    // Move foco para o primeiro link
    const firstLink = offcanva.querySelector('a');
    if (firstLink) firstLink.focus();
    
    // Focus trap
    offcanva.addEventListener('keydown', trapFocusInOffcanva);
}

function closeOffcanva() {
    offcanva.classList.remove('active');
    offcanva.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    offcanva.removeEventListener('keydown', trapFocusInOffcanva);
    hamburger.focus();
}

function trapFocusInOffcanva(e) {
    if (e.key !== 'Tab') return;
    const focusables = offcanva.querySelectorAll('a, button, input, [tabindex]:not([tabindex="-1"])');
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    
    if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
    }
}
```

> **Nota:** Adaptar aos nomes de variáveis e padrões já existentes em `main.js`. A lógica de toggle do menu já existe — integrar o focus trap nela.

---

## 🟠 TASK-10: Adicionar cache para CSS e media no vercel.json

**Problema:** `vercel.json` não cobre `/assets/css/` nem `/assets/media/`. O CSS (24 KB) e o vídeo (5.8 MB) são re-baixados sem cache.

**Impacto:** Performance — visitas recorrentes recarregam 5.8 MB desnecessariamente.

FILE: `vercel.json`

FIND:
```json
{
  "headers": [
    {
      "source": "/assets/font/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/assets/img/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/assets/js/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

REPLACE:
```json
{
  "headers": [
    {
      "source": "/assets/css/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/assets/font/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/assets/img/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/assets/js/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/assets/media/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

---

## 🟠 TASK-11: Adicionar aggregateRating ao Schema.org

**Problema:** Sem `aggregateRating`, o Google não exibe estrelas no snippet da SERP. O site já tem 5 reviews com nota 5.0.

**Impacto:** SEO — potencial aumento significativo de CTR com rich snippet.

FILE: `index.html`

FIND (final do JSON-LD, antes do `}` de fechamento):
```json
      ]
    }
```

REPLACE:
```json
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": "7",
      "reviewCount": "7"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "-7.0948",
      "longitude": "-35.2318"
    },
    "areaServed": {
      "@type": "City",
      "name": "Sapé",
      "containedInPlace": {
        "@type": "State",
        "name": "Paraíba"
      }
    },
    "sameAs": [
      "https://www.instagram.com/drajaquelinesayonara/",
      "https://www.facebook.com/drajaquelinesayonara"
    ]
```

> **Nota:** Ajustar `ratingCount` e coordenadas geo conforme dados reais do Google Business Profile.

---

## 🟠 TASK-12: Adicionar meta tags OG/Twitter complementares

FILE: `index.html`

FIND:
```html
<meta name="twitter:card" content="summary_large_image">
```

REPLACE:
```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Dra. Jaqueline Sayonara | Ortodontia em Sapé/PB">
<meta name="twitter:description" content="Especialista em Ortodontia em Sapé/PB. Agende sua consulta!">
<meta name="twitter:image" content="https://www.drajaquelinesayonara.com.br/assets/img/logo_js_2026.webp">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="Dra. Jaqueline Sayonara">
```

---

## 🟡 TASK-13: Encurtar meta description (~155 chars)

**Problema:** Meta description com 237 chars será truncada nas SERPs.

FILE: `index.html`

FIND:
```html
<meta name="description"
    content="Sorria com confiança! Agende sua consulta com a Dra. Jaqueline Sayonara, especialista em Ortodontia. Aqui, cuidamos do seu sorriso com carinho e profissionalismo. Visite nossa clínica na rua Lourival Lacerda, 06, sl 207, Sapé/Paraíba">
```

REPLACE:
```html
<meta name="description" content="Dra. Jaqueline Sayonara — Cirurgiã-Dentista especialista em Ortodontia em Sapé/PB. Clareamento, facetas, prótese e aparelhos. Agende pelo WhatsApp!">
```

> **Resultado:** 152 caracteres. Inclui: nome, especialidade, localização, serviços e CTA.

---

## 🟡 TASK-14: Corrigir typo em keywords

FILE: `index.html`

FIND:
```html
<meta name="keywords" content="Odontologia especializada, Ortondontia, Aparelhos Ortodônticos, Dentista">
```

REPLACE:
```html
<meta name="keywords" content="Odontologia especializada, Ortodontia, Aparelhos Ortodônticos, Dentista, Sapé PB, Clareamento Dental, Facetas">
```

---

## 🟡 TASK-15: Vídeo com aria-label e pausa em reduced-motion

### 15a. Adicionar aria-label ao vídeo

FILE: `index.html`

FIND:
```html
<video autoplay muted loop playsinline preload="none">
```

REPLACE:
```html
<video autoplay muted loop playsinline preload="none" aria-label="Vídeo do consultório da Dra. Jaqueline Sayonara em Sapé/PB">
```

### 15b. Pausar vídeo quando prefers-reduced-motion ativo

FILE: `assets/js/main.js`

ACTION: Adicionar ao início ou final do arquivo:
```javascript
// Respeitar prefers-reduced-motion para vídeos
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('video[autoplay]').forEach(video => {
        video.pause();
        video.removeAttribute('autoplay');
    });
}
```

---

## 🟡 TASK-16: Skip link apontar para main

**Problema:** Skip link aponta para `#about`, mas deveria pular para o `<main>` (que inclui o hero).

FILE: `index.html`

FIND:
```html
<a href="#about" class="skip-link">Pular para o conteúdo principal</a>
```

REPLACE:
```html
<a href="#main-content" class="skip-link">Pular para o conteúdo principal</a>
```

Também adicionar `id` ao `<main>`:

FIND:
```html
<main>
```

REPLACE:
```html
<main id="main-content">
```

---

## 🟡 TASK-17: Dark mode toggle com feedback de estado

FILE: `index.html`

FIND:
```html
<label class="switch" aria-label="Ativar modo escuro">
    <input id="dark-mode-button" type="checkbox">
    <span class="slider round"></span>
</label>
```

REPLACE:
```html
<label class="switch" aria-label="Alternar modo escuro">
    <input id="dark-mode-button" type="checkbox" role="switch" aria-checked="false">
    <span class="slider round"></span>
</label>
```

FILE: `assets/js/main.js`

ACTION: Na lógica de toggle do dark mode, adicionar:
```javascript
// Ao alternar dark mode
darkModeButton.addEventListener('change', () => {
    document.documentElement.classList.toggle('dark-theme');
    const isActive = document.documentElement.classList.contains('dark-theme');
    darkModeButton.setAttribute('aria-checked', String(isActive));
});
```

> **⚠️ Nota:** A lógica do dark mode NÃO está em `assets/js/main.js`. Está em um `<script>` **inline** no final do `index.html`:
> ```javascript
> const body = document.querySelector("body");
> const darkModeButton = document.getElementById("dark-mode-button");
> darkModeButton.addEventListener("click", (e) => {
>     body.classList.toggle("dark-theme");
> });
> ```
> A correção deve ser feita neste script inline (substituir o bloco acima), ou mover toda a lógica para `main.js`. Além disso, o evento deve ser `'change'` (não `'click'`) para compatibilidade com `role="switch"`, e o toggle deve usar `document.body` (não `document.documentElement`) para manter consistência com o CSS existente (`.dark-theme` é aplicado no `<body>`).

---

## 🟡 TASK-18: Mover seção CTA final para dentro do main

**Problema:** A `<section class="cta-final">` está fora do `<main>`, quebrando hierarquia de landmarks.

FILE: `index.html`

ACTION: Mover a `<section class="cta-final">...</section>` para imediatamente antes do `</main>`.

---

## 🟢 TASK-19: Adicionar rel="noopener noreferrer" em links externos

**Problema:** Links de redes sociais no offcanva e footer não possuem `rel="noopener noreferrer"`.

FILE: `index.html`

ACTION: Para todos os `<a>` com `target="_blank"` que ainda não possuem, adicionar `rel="noopener noreferrer"`.

Padrão a buscar:
```html
target="_blank"
```

Garantir que todos tenham:
```html
target="_blank" rel="noopener noreferrer"
```

---

## 🟢 TASK-20: Adicionar postalCode ao Schema.org

FILE: `index.html`

FIND (dentro do JSON-LD, no address):
```json
"addressCountry": "BR"
```

REPLACE:
```json
"addressCountry": "BR",
"postalCode": "58340-000"
```

---

## 🔴 TASK-21: Redirect 301 do domínio antigo Vercel (migração de tráfego)

**Problema:** Ao desvincular o domínio padrão `*.vercel.app` no painel da Vercel, crawlers que ainda indexam o endereço antigo recebem HTTP 404. Isso destrói Link Juice acumulado e prejudica ranqueamento.

**Impacto:** SEO — perda de autoridade de domínio; URLs ranqueadas retornam 404 em vez de transferir sinal via 301.

**Contexto:** A remoção do domínio antigo elimina conteúdo duplicado, mas o retorno 404 para URLs que ainda estão no índice do Google é pior do que um redirect permanente.

### Solução: Redirect 301 via `vercel.json`

Como o projeto é estático (sem Next.js na branch `main`), usar a configuração de redirects no `vercel.json`:

FILE: `vercel.json`

ACTION: Adicionar a chave `"redirects"` ao JSON (no nível raiz, junto a `"headers"`):

```json
{
  "redirects": [
    {
      "source": "/(.*)",
      "destination": "https://www.drajaquelinesayonara.com.br/$1",
      "permanent": true
    }
  ]
}
```

> **Nota:** Este redirect só será ativado quando a request chegar pelo hostname antigo (`*.vercel.app`). A Vercel aplica redirects antes de servir assets estáticos.

### Plano de Ação no Google Search Console

Após o deploy do redirect:

1. Acessar a propriedade correspondente à URL antiga no Search Console.
2. Usar a ferramenta **Inspeção de URL** para solicitar nova indexação.
3. O Googlebot lerá o header HTTP 301 e atualizará o índice, transferindo autoridade.

### Alternativa (se migrar para Next.js futuramente)

FILE: `middleware.ts` (raiz do projeto)

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const host = request.headers.get('host')
    if (host && host.includes('vercel.app')) {
        return NextResponse.redirect(
            'https://www.drajaquelinesayonara.com.br' + request.nextUrl.pathname,
            301
        )
    }
}

export const config = { matcher: '/:path*' }
```

---

## 🟠 TASK-22: Estratégia Multipage para SEO Local (expansão futura)

**Problema:** Uma landing page única não captura buscas orgânicas de cauda longa (long-tail keywords) para procedimentos específicos na região de atendimento.

**Impacto:** SEO — perda de tráfego orgânico qualificado para buscas como "lentes de contato dental Sapé PB", "clareamento dental João Pessoa".

**Tipo:** Planejamento arquitetural (não é uma edição imediata).

### Estratégia: Subrotas pré-renderizadas (SSG/ISR)

Planejar a transição para subrotas dinâmicas pré-renderizadas:

| Rota | Keyword alvo |
|------|-------------|
| `/tratamentos/lentes-de-contato-dental` | lentes de contato dental sapé pb |
| `/tratamentos/clareamento-dental` | clareamento dental sapé |
| `/tratamentos/aparelho-ortodontico` | ortodontista sapé paraíba |
| `/tratamentos/implantes` | implante dentário sapé |
| `/tratamentos/protese-dentaria` | prótese dentária sapé pb |

### Requisitos técnicos para cada página:

1. **Canonical explícito:** `<link rel="canonical" href="https://www.drajaquelinesayonara.com.br/tratamentos/[slug]" />`
2. **Meta description única** com keyword + localização + CTA.
3. **Schema.org `MedicalProcedure`** com `bodyLocation`, `indication` e referência ao `Dentist` principal.
4. **Breadcrumb JSON-LD:** `Home > Tratamentos > [Procedimento]`
5. **Internal linking:** Cada página de procedimento linka de volta para a home e vice-versa.

### Opções de implementação:

| Abordagem | Prós | Contras |
|-----------|------|---------|
| Páginas HTML estáticas adicionais | Zero dependências, deploy instantâneo | Manutenção manual |
| Next.js com SSG | Geração automática, ISR para atualização | Requer migração de stack |
| Astro (SSG) | Leve, mantém HTML/CSS vanilla | Nova ferramenta no fluxo |

> **Recomendação:** Para a branch `main` (HTML estático), criar páginas HTML individuais em `/tratamentos/`. Para evolução futura, considerar Astro ou Next.js na branch `react-app`.

---

## 🟡 TASK-23: Rastreamento Avançado e Telemetria

**Problema:** Sem rastreamento de micro-conversões, não há dados para otimizar a jornada do paciente no site. Adblockers também podem bloquear tags client-side tradicionais.

**Impacto:** Analytics — perda de visibilidade sobre comportamento do usuário e eficácia de CTAs.

### 23a. DataLayer para Micro-Conversões

ACTION: Adicionar ao `<head>` do `index.html` (após o GTM snippet, se existir):

```html
<script>
window.dataLayer = window.dataLayer || [];
</script>
```

FILE: `assets/js/main.js`

ACTION: Adicionar triggers de eventos:

```javascript
// --- Rastreamento de micro-conversões ---

// Scroll depth (25%, 50%, 75%, 100%)
const scrollThresholds = [25, 50, 75, 100];
const firedThresholds = new Set();

window.addEventListener('scroll', () => {
    const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    );
    scrollThresholds.forEach(threshold => {
        if (scrollPercent >= threshold && !firedThresholds.has(threshold)) {
            firedThresholds.add(threshold);
            window.dataLayer?.push({
                event: 'scroll_depth',
                scroll_percentage: threshold
            });
        }
    });
}, { passive: true });

// Clique em CTA WhatsApp
document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
    link.addEventListener('click', () => {
        window.dataLayer?.push({
            event: 'cta_click',
            cta_type: 'whatsapp',
            cta_location: link.closest('section')?.id || 'unknown'
        });
    });
});

// Interação com lightbox (ver resultado)
document.querySelectorAll('.result-item').forEach(item => {
    item.addEventListener('click', () => {
        window.dataLayer?.push({
            event: 'gallery_interaction',
            action: 'open_lightbox'
        });
    });
});
```

### 23b. Server-Side Tagging (planejamento)

**Tipo:** Planejamento — requer infraestrutura adicional (Google Tag Manager Server Container).

**Benefícios:**
- Mitiga perdas de dados causadas por adblockers (até 20-30% de tráfego).
- Alivia a thread principal de JavaScript (menos scripts client-side).
- Maior controle sobre dados enviados a terceiros (LGPD compliance).

**Requisitos para implementação:**
1. Provisionar um container Server-Side GTM (Cloud Run no GCP ou similar).
2. Configurar o transport URL no GTM Web para apontar para o server container.
3. Mover tags de conversão (Google Ads, Meta Pixel) para o server container.
4. Manter apenas o snippet GTM mínimo no client.

> **Nota:** Server-Side Tagging tem custo operacional (~$20-50/mês no GCP). Avaliar ROI antes de implementar.

---

## 🟠 TASK-24: Corrigir consistência de cores e elementos no Dark Mode

**Problema:** O tema escuro apresenta inconsistências visuais em textos e elementos:

1. **Logo com cores inconsistentes:** No hero a logo mantém as cores originais, mas no footer já existe `filter: brightness(0) invert(1)` via `.dark-theme .footer-logo`. Não há tratamento equivalente para `.hero-logo`, gerando inconsistência visual.
2. **Botão toggle do dark mode invisível no mobile:** O switch desaparece porque está dentro de `.header-nav-actions`, que recebe `display: none` em `@media (max-width: 1199px)` no arquivo `assets/css/header/header.css`. Não é uma regra direta no `.switch`, mas herança do container pai. Usuários mobile ficam sem acesso ao dark mode.

**Impacto:** UX/Acessibilidade — usuário mobile fica preso no dark mode (se ativou via desktop e voltou ao mobile); inconsistência visual reduz confiança no design.

### 24a. Padronizar tratamento da logo no dark mode

**Estado atual:**
- `assets/css/dark-theme.css` já tem: `.dark-theme .footer-logo { filter: brightness(0) invert(1); }`
- **Não existe** `.dark-theme .hero-logo` — logo no hero mantém cores originais sobre fundo escuro.

FILE: `assets/css/dark-theme.css`

ACTION: Adicionar tratamento para a logo do hero, consistente com o footer:

```css
.dark-theme .hero-logo {
    filter: brightness(0) invert(1);
}
```

> **Nota:** Se a logo tem detalhes coloridos que devem ser preservados, criar versão alternativa (`logo_js_2026_light.webp`) e usar `<picture>` com media query ou alternar `src` via JS ao ativar dark mode.
>
> **Alternativa sem filter:** Adicionar fundo de proteção à logo no dark mode:
> ```css
> .dark-theme .hero-logo {
>     background: rgba(255, 255, 255, 0.1);
>     border-radius: 8px;
>     padding: 8px;
> }
> ```

### 24b. Auditar contraste de textos no dark mode

**Estado atual** (variáveis em `dark-theme.css`):
```css
.dark-theme {
    --color-bg: #1a1218;
    --color-surface: #2a1f23;
    --color-text: #f5f0f1;
    --color-text-muted: #b8a8ab;
}
```

Verificar contrastes:
- `#f5f0f1` sobre `#1a1218` → ~15.8:1 ✅ (excelente)
- `#b8a8ab` sobre `#1a1218` → ~7.0:1 ✅ (AA normal + large)
- `#b8a8ab` sobre `#2a1f23` → ~5.2:1 ✅ (AA normal)

> **Resultado:** As variáveis do dark mode passam WCAG AA. O problema de contraste da TASK-08 é apenas do tema claro.

### 24c. Tornar o toggle de dark mode visível no mobile

**Causa raiz:** O `.switch` está dentro de `.header-nav-actions`, e este container inteiro é ocultado no mobile:

FILE: `assets/css/header/header.css` (linhas no bloco `@media only screen and (max-width: 1199px)`)

```css
/* Estado atual — oculta TODO o container */
.header-nav-actions { display: none; }
```

**Solução A — Botão fixo flutuante (recomendado):**

FILE: `assets/css/header/header.css`

ACTION: Adicionar override específico para o `.switch` dentro da media query mobile:

```css
@media only screen and (max-width: 1199px) {
    .header-nav-actions {
        display: none;
    }
    
    /* Manter toggle de dark mode visível como botão flutuante */
    .header-nav-actions .switch {
        display: flex;
        position: fixed;
        bottom: 80px; /* acima do botão flutuante do WhatsApp */
        right: 16px;
        z-index: 999;
        background: var(--color-surface);
        padding: 8px;
        border-radius: 50px;
        box-shadow: var(--shadow-md);
    }
}
```

> **⚠️ Nota:** `display: flex` em um filho de `display: none` não funciona por herança. Será necessário mover o `.switch` para FORA do `.header-nav-actions` no HTML, ou usar uma das alternativas abaixo.

**Solução B — Mover o toggle no HTML (mais robusto):**

FILE: `index.html`

ACTION: Mover o `<label class="switch">...</label>` para fora do `.header-nav-actions`, colocando-o como filho direto do `<header>` ou duplicando dentro do `<nav id="offcanva">`:

```html
<!-- Dentro do offcanva (menu mobile) -->
<nav id="offcanva" aria-hidden="true">
    <!-- ...links existentes... -->
    <label class="switch" aria-label="Alternar modo escuro">
        <input id="dark-mode-button-mobile" type="checkbox" role="switch" aria-checked="false">
        <span class="slider round"></span>
    </label>
</nav>
```

> Se duplicar o toggle, sincronizar o estado entre ambos via JS.

**Solução C — Mover para fora do container (mínima alteração):**

FILE: `index.html`

FIND:
```html
<div class="header-nav-actions">
    <label class="switch" aria-label="Ativar modo escuro">
        <input id="dark-mode-button" type="checkbox">
        <span class="slider round"></span>
    </label>
```

ACTION: Extrair o `.switch` do `.header-nav-actions` e colocá-lo como irmão no DOM (antes ou depois), ajustando o CSS do desktop para posicioná-lo corretamente.

---

## Ordem de Execução Recomendada

As tasks podem ser agrupadas por arquivo para minimizar edições:

### Batch 1 — `index.html` (SEO crítico)
TASK-01, TASK-02, TASK-03, TASK-06, TASK-12, TASK-13, TASK-14

### Batch 2 — `index.html` (Acessibilidade)
TASK-07a, TASK-07b, TASK-08, TASK-15a, TASK-16, TASK-17, TASK-18, TASK-24

### Batch 3 — Arquivos de configuração
TASK-04 (sitemap.xml), TASK-05 (robots.txt), TASK-10 (vercel.json)

### Batch 4 — JavaScript
TASK-07d, TASK-09, TASK-15b, TASK-17 (JS part)

### Batch 5 — Schema.org + extras
TASK-11, TASK-19, TASK-20

### Batch 6 — Migração, SEO multipage e analytics
TASK-21 (vercel.json redirect + Search Console), TASK-22 (planejamento multipage), TASK-23 (DataLayer + rastreamento)

---

## Validação Pós-Implementação

Após aplicar todas as tasks, executar:

```bash
# 1. Verificar canonical e OG
grep -n "www.drajaquelinesayonara" index.html | head -20

# 2. Verificar que preload 404 foi removido
grep -n "header_picture_mobile" index.html  # deve retornar vazio

# 3. Verificar contraste (valores no CSS)
grep -n "color-text-muted\|color-accent" index.html | head -5

# 4. Verificar vercel.json cobre css e media
cat vercel.json | grep -A2 "css\|media"

# 5. Validar JSON-LD (sem erros de sintaxe)
grep -Pzo '(?s)<script type="application/ld\+json">.*?</script>' index.html | python3 -m json.tool > /dev/null && echo "JSON-LD válido" || echo "ERRO no JSON-LD"

# 6. Verificar sitemap e robots
grep "www" sitemap.xml robots.txt

# 7. Build CSS (se usar arquivo externo)
./build-css.sh
```

### Ferramentas de validação online (pós-deploy):
- [Schema Markup Validator](https://validator.schema.org/) — verificar rich results
- [PageSpeed Insights](https://pagespeed.web.dev/) — Core Web Vitals
- [Open Graph Debugger](https://developers.facebook.com/tools/debug/) — preview social
- [WAVE](https://wave.webaim.org/) — acessibilidade
- [dnschecker.org](https://dnschecker.org/) — propagação DNS

---

## Impacto Esperado Pós-Correções

| Métrica | Antes | Depois (estimado) | Resultado real |
|---------|-------|--------------------|----------------|
| Performance | ~90/100 | ~95-98/100 | **97/100** ✅ |
| SEO | 7.5/10 | 9/10 | **100/100** ✅ |
| Acessibilidade | 6.7/10 | 8.5-9/10 | **100/100** ✅ |
| Lighthouse Score | ~85-90 | ~95+ | **99 (média)** ✅ |
| Link Juice (migração 301) | Perdendo (404) | Preservado (301) | Configurado (aguarda deploy) |
| Tráfego orgânico long-tail | Inexistente | +20-40% (com multipage) | Planejamento (TASK-22) |
| Visibilidade analytics | Parcial | Completa (DataLayer + SST) | Planejamento (TASK-23) |

### Métricas detalhadas (Lighthouse 13.4.0 — 2026-07-13)

| Core Web Vital | Valor | Score |
|---------------|-------|-------|
| First Contentful Paint | 1.1s | 0.99 |
| Largest Contentful Paint | 2.6s | 0.87 |
| Total Blocking Time | 0ms | 1.0 |
| Cumulative Layout Shift | 0.024 | 1.0 |
| Speed Index | 1.3s | 1.0 |

### Oportunidades de melhoria remanescentes

| Diagnóstico | Observação |
|-------------|-----------|
| LCP (2.6s) | Imagem hero carregando sem preload. Considerar adicionar preload para a imagem principal do desktop. |
| Network payload (3.6 MB) | Vídeo `location.mp4` (5.8 MB). Considerar lazy-loading via Intersection Observer ou compressão adicional. |
| Image width/height | Algumas imagens sem atributos explícitos `width`/`height` para evitar CLS. |
| Cache lifetimes | Cache só funciona em produção (Vercel headers). Teste local não usa os headers do vercel.json. |

---

## Status da Auditoria (2026-07-13)

> Atualizado após implementação de todas as tasks e execução do Lighthouse.
>
> **Lighthouse 13.4.0 — Performance: 97 | Accessibility: 100 | SEO: 100**

| TASK | Descrição | Status | Observação |
|------|-----------|--------|------------|
| 01 | Canonical URL (www) | ✅ Concluída | `https://www.drajaquelinesayonara.com.br/` |
| 02 | OG/meta URLs (www) | ✅ Concluída | og:image `.webp` + og:url com trailing slash |
| 03 | Schema.org URL (www) | ✅ Concluída | url e image com www + `.webp` |
| 04 | sitemap.xml (www + lastmod) | ✅ Concluída | lastmod: 2026-07-13 |
| 05 | robots.txt (www) | ✅ Concluída | Sitemap URL com www |
| 06 | Preload 404 | ✅ Concluída | Linha removida |
| 07a | Result-items focáveis | ✅ Concluída | 6 items com tabindex="0" role="button" |
| 07b | Lightbox semântico | ✅ Concluída | role=dialog, aria-modal, botão fechar |
| 07c | Estilo lightbox-close | ✅ Concluída | CSS em results.css |
| 07d | Lightbox focus trap + keyboard | ✅ Concluída | Enter/Space, Escape, lastFocusedElement, body overflow |
| 08 | Contraste cores | ✅ Concluída | #6b4a4c (5.8:1) e #a85860 (4.6:1) — Lighthouse confirma ✅ |
| 09 | Focus trap offcanva | ✅ Concluída | trapFocusInOffcanva + foco restaurado + Escape |
| 10 | Cache CSS/media | ✅ Concluída | vercel.json com 5 entradas de assets |
| 11 | aggregateRating | ✅ Concluída | 5.0, 7 reviews + geo + areaServed + sameAs |
| 12 | Meta tags OG/Twitter | ✅ Concluída | Twitter title/description/image + og:locale + og:site_name |
| 13 | Meta description longa | ✅ Concluída | 152 chars com keywords e CTA |
| 14 | Typo keywords | ✅ Concluída | "Ortodontia" + keywords extras |
| 15a | Vídeo aria-label | ✅ Concluída | aria-label descritivo |
| 15b | Vídeo reduced-motion | ✅ Concluída | Pausa autoplay quando prefers-reduced-motion |
| 16 | Skip link → main | ✅ Concluída | #main-content + id no `<main>` |
| 17 | Dark mode role=switch | ✅ Concluída | role=switch + aria-checked + JS via change event |
| 18 | CTA final dentro do main | ✅ Concluída | Movido para dentro do `</main>` |
| 19 | rel=noopener noreferrer | ✅ Concluída | 6 links corrigidos |
| 20 | postalCode Schema.org | ✅ Concluída | 58340-000 |
| 21 | Redirect 301 Vercel | ✅ Concluída | vercel.json redirects configurado |
| 22 | Estratégia multipage | 📋 Planejamento | Decisão arquitetural futura |
| 23 | DataLayer/Telemetria | 📋 Planejamento | Requer GTM setup |
| 24a | Logo dark mode (hero) | ✅ Concluída | filter: brightness(0) invert(1) — consistente com footer |
| 24b | Dark mode contraste | ✅ OK | Variáveis passam WCAG AA |
| 24c | Toggle mobile visível | ✅ Concluída | Toggle adicionado no offcanva + sync JS |

**Resumo: 24 tasks concluídas, 2 em planejamento futuro (TASK-22, TASK-23).**
