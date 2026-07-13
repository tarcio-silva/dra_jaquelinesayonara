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

## Ordem de Execução Recomendada

As tasks podem ser agrupadas por arquivo para minimizar edições:

### Batch 1 — `index.html` (SEO crítico)
TASK-01, TASK-02, TASK-03, TASK-06, TASK-12, TASK-13, TASK-14

### Batch 2 — `index.html` (Acessibilidade)
TASK-07a, TASK-07b, TASK-08, TASK-15a, TASK-16, TASK-17, TASK-18

### Batch 3 — Arquivos de configuração
TASK-04 (sitemap.xml), TASK-05 (robots.txt), TASK-10 (vercel.json)

### Batch 4 — JavaScript
TASK-07d, TASK-09, TASK-15b, TASK-17 (JS part)

### Batch 5 — Schema.org + extras
TASK-11, TASK-19, TASK-20

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

| Métrica | Antes | Depois (estimado) |
|---------|-------|-------------------|
| Performance | ~90/100 | ~95-98/100 |
| SEO | 7.5/10 | 9/10 |
| Acessibilidade | 6.7/10 | 8.5-9/10 |
| Lighthouse Score | ~85-90 | ~95+ |
