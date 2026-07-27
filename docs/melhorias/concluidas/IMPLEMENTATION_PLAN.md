# Plano de Implementação — Multipage de Tratamentos

> **Projeto:** drajaquelinesayonara.com.br  
> **Referência:** [MULTIPAGE_STRATEGY.md](./MULTIPAGE_STRATEGY.md)  
> **Decisão Arquitetural:** Manter HTML5 estático (não migrar para React/SSG) — ADR-001  
> **Data:** 2026-07-14  
> **Autor:** Engenharia

---

## Índice

1. [Visão Geral](#1-visão-geral)
2. [Pré-requisitos](#2-pré-requisitos)
3. [Fase 1: Infraestrutura](#3-fase-1-infraestrutura)
4. [Fase 2: Criação das Páginas](#4-fase-2-criação-das-páginas)
5. [Fase 3: Integração com a Home](#5-fase-3-integração-com-a-home)
6. [Fase 4: Validação e QA](#6-fase-4-validação-e-qa)
7. [Estimativa de Esforço](#7-estimativa-de-esforço)
8. [Riscos e Rollback](#8-riscos-e-rollback)

---

## 1. Visão Geral

### O que será implementado

Expansão do site single-page para **8 páginas** (1 home + 7 tratamentos), criando páginas individuais otimizadas para SEO local em `/tratamentos/{slug}/index.html`.

### Decisões já tomadas

| Decisão | Justificativa |
|---------|---------------|
| HTML estático (sem SSG/React) | Zero overhead de build, performance máxima, manutenção simples |
| CSS inline via LightningCSS | Mesmo pipeline atual (`build-css.sh`), CSS crítico no `<head>` |
| URLs com trailing slash (`/tratamentos/{slug}/`) | Clean URLs via `index.html` em diretórios, sem rewrite rules |
| Schema.org por página | `MedicalProcedure` + `BreadcrumbList` + `FAQPage` para rich snippets |
| JS compartilhado (`main.js`) | Mesmo arquivo, módulos auto-detectam elementos disponíveis |
| Dark mode reutilizado | Mesmo CSS inline da home, variáveis `.dark-theme` já cobrem novos elementos |

### Páginas a criar

| # | Tratamento | Slug | URL final |
|---|-----------|------|-----------|
| 1 | Aparelho Ortodôntico | `aparelho-ortodontico` | `/tratamentos/aparelho-ortodontico/` |
| 2 | Clareamento Dental | `clareamento-dental` | `/tratamentos/clareamento-dental/` |
| 3 | Exodontia | `exodontia` | `/tratamentos/exodontia/` |
| 4 | Facetas Dentárias | `facetas-dentarias` | `/tratamentos/facetas-dentarias/` |
| 5 | Profilaxia | `profilaxia` | `/tratamentos/profilaxia/` |
| 6 | Prótese Dentária | `protese-dentaria` | `/tratamentos/protese-dentaria/` |
| 7 | Restauração Dentária | `restauracao-dentaria` | `/tratamentos/restauracao-dentaria/` |

---

## 2. Pré-requisitos

### 2.1 Conteúdo (responsabilidade: profissional/copywriter)

- [ ] Texto para cada página (mínimo 600 palavras, ideal 800-1200)
- [ ] 3-5 perguntas frequentes por tratamento com respostas
- [ ] Revisão técnica pela Dra. Jaqueline (termos corretos, indicações)
- [ ] Aprovação do tom de voz (profissional + acolhedor)

### 2.2 Imagens (responsabilidade: designer/fotógrafo)

| Tipo | Formato | Dimensão mínima | Quantidade |
|------|---------|-----------------|------------|
| Hero por tratamento | WebP | 600×400px | 7 |
| OG Image por tratamento | WebP | 1200×630px | 7 (pode ser o hero redimensionado) |

**Nomenclatura obrigatória:**
```
assets/img/tratamentos/
├── aparelho-ortodontico-hero.webp
├── clareamento-dental-hero.webp
├── exodontia-hero.webp
├── facetas-dentarias-hero.webp
├── profilaxia-hero.webp
├── protese-dentaria-hero.webp
└── restauracao-dentaria-hero.webp
```

### 2.3 Ferramentas (já disponíveis)

| Ferramenta | Versão | Uso |
|-----------|--------|-----|
| `lightningcss-cli` | ^1.28.2 | Bundle + minificação CSS |
| `normalize.css` | ^8.0.1 | Reset (já incluído) |
| Node.js | ≥18 | Execução do build |
| Vercel CLI | latest | Deploy preview |

### 2.4 Acessos necessários

- [ ] Google Search Console (submeter sitemap atualizado)
- [ ] Vercel Dashboard (verificar deploy e headers)
- [ ] Repositório Git (branch `main`)

---

## 3. Fase 1: Infraestrutura

### 3.1 Estrutura de diretórios

Criar a seguinte árvore:

```bash
mkdir -p tratamentos/{aparelho-ortodontico,clareamento-dental,exodontia,facetas-dentarias,profilaxia,protese-dentaria,restauracao-dentaria}
mkdir -p assets/img/tratamentos
```

Resultado esperado:

```
repo_site/
├── tratamentos/
│   ├── aparelho-ortodontico/
│   │   └── index.html
│   ├── clareamento-dental/
│   │   └── index.html
│   ├── exodontia/
│   │   └── index.html
│   ├── facetas-dentarias/
│   │   └── index.html
│   ├── profilaxia/
│   │   └── index.html
│   ├── protese-dentaria/
│   │   └── index.html
│   └── restauracao-dentaria/
│       └── index.html
├── assets/
│   ├── img/
│   │   └── tratamentos/          ← NOVO
│   │       ├── aparelho-ortodontico-hero.webp
│   │       └── ...
│   └── css/
│       ├── treatment.css          ← NOVO
│       └── styles.css             ← ATUALIZAR (novo import)
└── ...
```

### 3.2 Novo arquivo CSS: `assets/css/treatment.css`

**Arquivo completo:**

```css
/* ==========================================================================
   Treatment Pages — Breadcrumb, Hero, Content, FAQ, Related
   ========================================================================== */

/* --- Breadcrumb --- */
.breadcrumb {
  padding: 80px 24px 0;
  max-width: 1200px;
  margin: 0 auto;
}

.breadcrumb ol {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  font-size: 1.3rem;
}

.breadcrumb li + li::before {
  content: "›";
  margin-right: 8px;
  color: var(--color-text-muted);
}

.breadcrumb a {
  color: var(--color-accent);
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb a:hover {
  color: var(--logo-pallete-velvety-cherry);
}

.breadcrumb [aria-current="page"] {
  color: var(--color-text-muted);
  font-weight: 500;
}

/* --- Treatment Hero --- */
.treatment-hero {
  padding: 40px 24px 64px;
}

.treatment-hero > div {
  display: flex;
  align-items: center;
  gap: 48px;
  max-width: 1200px;
  margin: 0 auto;
}

.treatment-hero h1 {
  font-size: clamp(2.8rem, 4vw, 4.8rem);
  font-weight: 700;
  color: var(--logo-pallete-velvety-cherry);
  line-height: 1.2;
}

.treatment-subtitle {
  color: var(--color-text-muted);
  font-size: clamp(1.4rem, 1.4vw, 1.8rem);
  line-height: 1.6;
  margin: 16px 0 24px;
}

.treatment-hero img {
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  height: auto;
  aspect-ratio: 3 / 2;
  object-fit: cover;
}

/* --- Treatment Content --- */
.treatment-content {
  padding: 64px 24px;
  background: var(--color-surface);
}

.treatment-content > div {
  max-width: 800px;
  margin: 0 auto;
}

.treatment-content h2 {
  color: var(--logo-pallete-velvety-cherry);
  font-size: clamp(2rem, 2.5vw, 2.8rem);
  margin: 48px 0 16px;
  font-weight: 700;
}

.treatment-content h2:first-child {
  margin-top: 0;
}

.treatment-content p {
  font-size: clamp(1.4rem, 1.2vw, 1.6rem);
  line-height: 1.8;
  margin-bottom: 16px;
}

.treatment-content ul {
  padding-left: 24px;
  margin-bottom: 24px;
}

.treatment-content li {
  font-size: clamp(1.4rem, 1.2vw, 1.6rem);
  line-height: 1.8;
  margin-bottom: 8px;
  list-style: disc;
  color: var(--color-text-muted);
}

/* --- FAQ (details/summary) --- */
.treatment-faq {
  margin-top: 48px;
}

.treatment-content details {
  border: 1px solid rgba(162, 83, 86, 0.12);
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 12px;
  transition: box-shadow 0.2s;
}

.treatment-content details[open] {
  box-shadow: var(--shadow-sm);
}

.treatment-content summary {
  font-size: clamp(1.4rem, 1.2vw, 1.6rem);
  font-weight: 600;
  cursor: pointer;
  color: var(--logo-pallete-velvety-cherry);
  list-style: none;
}

.treatment-content summary::-webkit-details-marker {
  display: none;
}

.treatment-content summary::before {
  content: "+";
  display: inline-block;
  width: 20px;
  font-weight: 700;
  color: var(--color-accent);
  transition: transform 0.2s;
}

.treatment-content details[open] summary::before {
  content: "−";
}

.treatment-content details p {
  margin-top: 12px;
  font-size: 1.5rem;
  color: var(--color-text-muted);
}

/* --- Related Treatments --- */
.related-treatments {
  padding: 64px 24px;
}

.related-treatments > div {
  max-width: 1200px;
  margin: 0 auto;
}

/* --- Dark mode overrides para treatment pages --- */
.dark-theme .treatment-hero h1 {
  color: var(--color-text);
}

.dark-theme .treatment-content {
  background: var(--color-surface);
}

.dark-theme .treatment-content h2 {
  color: var(--color-text);
}

.dark-theme .treatment-content details {
  border-color: rgba(255, 255, 255, 0.1);
}

.dark-theme .treatment-content summary {
  color: var(--color-text);
}

.dark-theme .breadcrumb [aria-current="page"] {
  color: var(--color-text-muted);
}

/* --- Responsivo: Mobile (≤1199px) --- */
@media only screen and (max-width: 1199px) {
  .breadcrumb {
    padding: 68px 16px 0;
  }

  .treatment-hero {
    padding: 24px 16px 48px;
  }

  .treatment-hero > div {
    flex-direction: column;
    gap: 24px;
    text-align: center;
  }

  .treatment-hero img {
    max-width: 100%;
    border-radius: 12px;
  }

  .treatment-hero .btn-cta {
    animation: none;
  }

  .treatment-content {
    padding: 48px 16px;
  }

  .treatment-content h2 {
    margin: 32px 0 12px;
  }

  .related-treatments {
    padding: 48px 16px;
  }
}

/* --- Desktop (≥1200px) --- */
@media screen and (min-width: 1200px) {
  .treatment-hero > div {
    gap: 64px;
  }

  .treatment-hero img {
    flex-shrink: 0;
    max-width: 480px;
  }
}
```

### 3.3 Integração no build

**Atualizar `assets/css/styles.css`** — adicionar import no final:

```css
@import "./dark-theme.css";
@import "./globalStyle.css";
@import "./header/header.css";
@import "./header/hamburger.css";
@import "./header/offcanva.css";
@import "./header/switch-button.css";
@import "./about.css";
@import "./cards.css";
@import "./results.css";
@import "./plans.css";
@import "./rating.css";
@import "./location.css";
@import "./cta-final.css";
@import "./footer.css";
@import "./treatment.css";  /* ← NOVO */
```

**`build-css.sh`** — nenhuma alteração necessária. O LightningCSS resolve `@import` automaticamente:

```bash
#!/bin/bash
cd "$(dirname "$0")"
npx lightningcss --minify --bundle assets/css/styles.css -o assets/css/styles.min.css
echo "✓ styles.min.css ($(wc -c < assets/css/styles.min.css) bytes)"
```

**Validação:**
```bash
./build-css.sh
# Esperar: ✓ styles.min.css (XXXXX bytes)
# O bundle deve incluir as regras de .breadcrumb, .treatment-hero, etc.
grep -c "treatment-hero" assets/css/styles.min.css  # deve retornar 1+
```

### 3.4 Atualização do `vercel.json`

Adicionar regra de cache para `/tratamentos/` (imagens servidas de `/assets/img/tratamentos/` já são cobertas pela regra existente `/assets/img/(.*)`).

**Diff:**

```json
{
  "redirects": [
    // ... existentes (sem alteração)
  ],
  "headers": [
    // ... regras existentes para /assets/css/, /assets/font/, /assets/img/, /assets/js/, /assets/media/ ...
    {
      "source": "/tratamentos/(.*)/index.html",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=0, must-revalidate" }
      ]
    }
  ]
}
```

> **Nota:** Páginas HTML NÃO recebem cache imutável — devem revalidar sempre para permitir atualizações de conteúdo. Apenas assets estáticos (img, css, font) são cacheados por 1 ano.

### 3.5 Template HTML base completo

O template abaixo deve ser copiado para cada `/tratamentos/{slug}/index.html` e customizado. Campos entre `{chaves}` devem ser preenchidos.

```html
<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <meta name="theme-color" content="#fdfbfc">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="description" content="{META_DESCRIPTION — máx 155 chars, incluir keyword + localização + CTA}">
    <meta name="keywords" content="{KEYWORDS — separadas por vírgula}">
    <meta name="author" content="Dra Jaqueline Sayonara">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="google-site-verification" content="WRMI1dymGszabNbSmDRztNh55jrsNUVTQ1HvYUt7m0o" />
    <meta name="google-site-verification" content="WRWVULbhplzl_a-luvjeo_xQfvUTR4FN6gyUoH5r1Vo" />

    <!-- Open Graph -->
    <meta property="og:title" content="{TRATAMENTO} em Sapé/PB | Dra. Jaqueline Sayonara">
    <meta property="og:description" content="{OG_DESCRIPTION — curta, max 100 chars}">
    <meta property="og:image" content="https://www.drajaquelinesayonara.com.br/assets/img/tratamentos/{SLUG}-hero.webp">
    <meta property="og:url" content="https://www.drajaquelinesayonara.com.br/tratamentos/{SLUG}/">
    <meta property="og:type" content="article">
    <meta property="og:locale" content="pt_BR">
    <meta property="og:site_name" content="Dra. Jaqueline Sayonara">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{TRATAMENTO} em Sapé/PB | Dra. Jaqueline Sayonara">
    <meta name="twitter:description" content="{TWITTER_DESCRIPTION}">
    <meta name="twitter:image" content="https://www.drajaquelinesayonara.com.br/assets/img/tratamentos/{SLUG}-hero.webp">

    <link rel="canonical" href="https://www.drajaquelinesayonara.com.br/tratamentos/{SLUG}/">
    <link rel="preload" href="/assets/font/Manrope-VariableFont_wght.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="shortcut icon" href="/assets/img/favicon.webp" type="image/x-icon">

    <!-- CSS inline (output do build-css.sh) -->
    <style>/* Cole aqui o conteúdo de assets/css/styles.min.css */</style>

    <title>{TRATAMENTO} em Sapé/PB | Dra. Jaqueline Sayonara</title>

    <!-- Schema.org JSON-LD -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "MedicalProcedure",
          "name": "{NOME_TRATAMENTO}",
          "description": "{DESCRICAO_PROCEDIMENTO}",
          "procedureType": "http://schema.org/{PROCEDURE_TYPE}",
          "bodyLocation": "Mouth",
          "indication": {
            "@type": "MedicalIndication",
            "name": "{INDICACAO_PRINCIPAL}"
          },
          "howPerformed": "{COMO_E_FEITO}",
          "preparation": "{PREPARACAO}",
          "url": "https://www.drajaquelinesayonara.com.br/tratamentos/{SLUG}/",
          "image": "https://www.drajaquelinesayonara.com.br/assets/img/tratamentos/{SLUG}-hero.webp",
          "provider": {
            "@type": "Dentist",
            "@id": "https://www.drajaquelinesayonara.com.br/#dentist"
          }
        },
        {
          "@type": "Dentist",
          "@id": "https://www.drajaquelinesayonara.com.br/#dentist",
          "name": "Dra. Jaqueline Sayonara",
          "url": "https://www.drajaquelinesayonara.com.br",
          "telephone": "+5583994058749",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Rua Lourival Lacerda, 06, sl 207",
            "addressLocality": "Sapé",
            "addressRegion": "PB",
            "addressCountry": "BR",
            "postalCode": "58340-000"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": -7.0946,
            "longitude": -35.2281
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "5.0",
            "ratingCount": "7"
          }
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://www.drajaquelinesayonara.com.br/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Tratamentos",
              "item": "https://www.drajaquelinesayonara.com.br/#care"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": "{NOME_TRATAMENTO}",
              "item": "https://www.drajaquelinesayonara.com.br/tratamentos/{SLUG}/"
            }
          ]
        },
        {
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "{PERGUNTA_1}",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "{RESPOSTA_1}"
              }
            },
            {
              "@type": "Question",
              "name": "{PERGUNTA_2}",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "{RESPOSTA_2}"
              }
            },
            {
              "@type": "Question",
              "name": "{PERGUNTA_3}",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "{RESPOSTA_3}"
              }
            }
          ]
        }
      ]
    }
    </script>
</head>

<body>
    <!-- Skip link -->
    <a href="#main-content" class="skip-link">Pular para o conteúdo principal</a>

    <!-- Header (COPIAR EXATAMENTE da home - hamburger + offcanva + header-nav) -->
    <!-- IMPORTANTE: Ajustar hrefs relativos para absolutos (/assets/...) -->
    <header>
        <!-- hamburger button -->
        <button class="hamburger hamburger--slider" id="hamburger-button"
                type="button" aria-label="Menu" aria-expanded="false" aria-controls="offcanva">
            <span class="hamburger-box">
                <span class="hamburger-inner"></span>
            </span>
        </button>

        <!-- Offcanva (mobile) -->
        <nav id="offcanva" class="offcanva" aria-hidden="true" style="left: -120%;">
            <img src="/assets/img/logo_js_2026.webp" alt="Logo Dra. Jaqueline Sayonara" width="96" height="96">
            <div class="offcanva-nav">
                <ul>
                    <li><a href="/#about" class="offcanva-nav--link"><p>Sobre</p></a></li>
                    <li><a href="/#care" class="offcanva-nav--link"><p>Tratamentos</p></a></li>
                    <li><a href="/#results" class="offcanva-nav--link"><p>Resultados</p></a></li>
                    <li><a href="/#plans" class="offcanva-nav--link"><p>Planos</p></a></li>
                    <li><a href="/#location" class="offcanva-nav--link"><p>Localização</p></a></li>
                </ul>
            </div>
            <!-- Dark mode toggle mobile -->
            <div class="offcanva-dark-mode">
                <label class="offcanva-dark-mode-label">
                    Modo escuro
                    <label class="switch">
                        <input type="checkbox" class="dark-mode-toggle-mobile" role="switch" aria-checked="false" aria-label="Alternar modo escuro">
                        <span class="slider round"></span>
                    </label>
                </label>
            </div>
            <div class="offcanva-nav--social">
                <ul>
                    <li><a href="https://www.instagram.com/drajaquelinesayonara/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">📷</a></li>
                    <li><a href="https://www.facebook.com/drajaquelinesayonara" target="_blank" rel="noopener noreferrer" aria-label="Facebook">📘</a></li>
                </ul>
            </div>
        </nav>

        <!-- Desktop nav -->
        <nav class="header-nav">
            <a href="/" class="header-nav-logo">
                <img src="/assets/img/logo_js_2026.webp" alt="Logo" width="32" height="32">
            </a>
            <ul class="header-nav-links">
                <li><a href="/#about" class="header-link"><span>Sobre</span></a></li>
                <li><a href="/#care" class="header-link"><span>Tratamentos</span></a></li>
                <li><a href="/#results" class="header-link"><span>Resultados</span></a></li>
                <li><a href="/#plans" class="header-link"><span>Planos</span></a></li>
                <li><a href="/#location" class="header-link"><span>Localização</span></a></li>
            </ul>
            <div class="header-nav-actions">
                <label class="switch">
                    <input type="checkbox" id="dark-mode-button" role="switch" aria-checked="false" aria-label="Alternar modo escuro">
                    <span class="slider round"></span>
                </label>
                <nav class="nav-social">
                    <a href="https://www.instagram.com/drajaquelinesayonara/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">📷</a>
                    <a href="https://www.facebook.com/drajaquelinesayonara" target="_blank" rel="noopener noreferrer" aria-label="Facebook">📘</a>
                </nav>
                <a href="https://wa.me/+5583994058749" class="btn-header-cta" target="_blank" rel="noopener noreferrer">Agendar</a>
            </div>
        </nav>
    </header>

    <main id="main-content">
        <!-- Breadcrumb -->
        <nav class="breadcrumb" aria-label="Navegação estrutural">
            <ol>
                <li><a href="/">Home</a></li>
                <li><a href="/#care">Tratamentos</a></li>
                <li aria-current="page">{NOME_TRATAMENTO}</li>
            </ol>
        </nav>

        <!-- Hero do tratamento -->
        <section class="treatment-hero fade-in">
            <div>
                <div>
                    <h1>{NOME_TRATAMENTO}</h1>
                    <p class="treatment-subtitle">{SUBTITULO_COM_KEYWORD_E_LOCALIZACAO}</p>
                    <a href="https://wa.me/+5583994058749/?text={WHATSAPP_TEXT_ENCODED}"
                       class="btn-cta" target="_blank" rel="noopener noreferrer">
                        Agendar consulta
                    </a>
                </div>
                <img src="/assets/img/tratamentos/{SLUG}-hero.webp"
                     alt="{ALT_TEXT_DESCRITIVO}"
                     width="600" height="400"
                     loading="eager">
            </div>
        </section>

        <!-- Conteúdo principal -->
        <section class="treatment-content fade-in">
            <div>
                <h2>O que é {tratamento}?</h2>
                <p>{PARAGRAFO_1}</p>
                <p>{PARAGRAFO_2}</p>

                <h2>Benefícios</h2>
                <ul>
                    <li>{BENEFICIO_1}</li>
                    <li>{BENEFICIO_2}</li>
                    <li>{BENEFICIO_3}</li>
                    <li>{BENEFICIO_4}</li>
                </ul>

                <h2>Como funciona o procedimento</h2>
                <p>{EXPLICACAO_PASSO_A_PASSO}</p>

                <h2>Para quem é indicado</h2>
                <p>{INDICACOES}</p>

                <h2>Perguntas frequentes</h2>
                <div class="treatment-faq">
                    <details>
                        <summary>{PERGUNTA_1}</summary>
                        <p>{RESPOSTA_1}</p>
                    </details>
                    <details>
                        <summary>{PERGUNTA_2}</summary>
                        <p>{RESPOSTA_2}</p>
                    </details>
                    <details>
                        <summary>{PERGUNTA_3}</summary>
                        <p>{RESPOSTA_3}</p>
                    </details>
                    <details>
                        <summary>Qual o valor do tratamento?</summary>
                        <p>O valor varia conforme cada caso. Agende uma avaliação para um orçamento personalizado.</p>
                    </details>
                </div>
            </div>
        </section>

        <!-- CTA Final -->
        <section class="cta-final fade-in">
            <div>
                <h2 class="section-title">Agende sua avaliação</h2>
                <p class="cta-final-text">Tire suas dúvidas sobre {tratamento} com a Dra. Jaqueline Sayonara.</p>
                <a href="https://wa.me/+5583994058749/?text={WHATSAPP_TEXT_ENCODED}"
                   class="btn-cta" target="_blank" rel="noopener noreferrer">
                    Falar pelo WhatsApp
                </a>
            </div>
        </section>

        <!-- Outros Tratamentos -->
        <section class="related-treatments fade-in">
            <div>
                <h2 class="section-title">Outros Tratamentos</h2>
                <div class="cards-container">
                    <!-- Incluir os 6 cards restantes (excluir o tratamento atual) -->
                    <!-- Exemplo de card: -->
                    <div class="card-container">
                        <div class="card">
                            <img loading="lazy" src="/assets/img/care/{IMAGEM}.webp" alt="{ALT}">
                            <div class="card-description">
                                <h3 class="care-title">{EMOJI} {Nome}</h3>
                                <p>{Descrição curta}</p>
                                <a href="/tratamentos/{SLUG_OUTRO}/" class="card-link">Saiba mais →</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <!-- Footer (COPIAR EXATAMENTE da home — ajustar paths para absolutos) -->
    <footer>
        <!-- ... conteúdo idêntico ao da home com paths /assets/... -->
    </footer>

    <!-- WhatsApp flutuante -->
    <a href="https://wa.me/+5583994058749" class="whatsapp-float" target="_blank"
       rel="noopener noreferrer" aria-label="Fale conosco pelo WhatsApp">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        </svg>
    </a>

    <!-- JS (mesmo da home — funcionalidades se auto-adaptam) -->
    <script defer src="/assets/js/main.js"></script>
</body>
</html>
```

### 3.6 Notas sobre o Template

| Aspecto | Detalhe |
|---------|---------|
| **Paths** | Todos absolutos (`/assets/...`) — páginas estão em subdiretórios |
| **Header links** | Apontam para `/#section` (navegação de volta à home) |
| **main.js** | Funciona sem alterações: offcanva, dark mode, fade-in funcionam; lightbox e active-section não se aplicam (sem `section[id]` observável) |
| **CSS inline** | Mesmo bundle `styles.min.css` colado no `<style>` — inclui `treatment.css` |
| **Loading da hero img** | `loading="eager"` (LCP da página) |
| **Acessibilidade** | Skip link, breadcrumb com `aria-label`, `aria-current="page"`, focus-visible via CSS |

---

## 4. Fase 2: Criação das Páginas

### 4.1 Checklist de conteúdo por página

Para cada tratamento, preencher **antes** de criar o HTML:

- [ ] **Title tag** — `{Tratamento} em Sapé/PB | Dra. Jaqueline Sayonara` (≤60 chars)
- [ ] **Meta description** — Frase única com keyword + localização + CTA (≤155 chars)
- [ ] **H1** — Nome do tratamento (igual ou variação do title)
- [ ] **Subtítulo** — 1-2 linhas com keyword secundária + localização
- [ ] **"O que é"** — 2-3 parágrafos explicativos (definição do procedimento)
- [ ] **"Benefícios"** — Lista com 4-6 itens
- [ ] **"Como funciona"** — Passo a passo simplificado (1-3 parágrafos)
- [ ] **"Para quem é indicado"** — Indicações clínicas em linguagem acessível
- [ ] **FAQ** — 3-5 perguntas com respostas (incluir "Qual o valor?")
- [ ] **Imagem hero** — WebP, 600×400px mínimo, com alt text descritivo
- [ ] **Schema.org** — Campos `MedicalProcedure` preenchidos
- [ ] **Texto WhatsApp** — Mensagem pré-preenchida URL-encoded

### 4.2 Mapeamento de Keywords e Meta Tags

| Página | Title (≤60 chars) | Meta Description (≤155 chars) | Keywords |
|--------|-------------------|-------------------------------|----------|
| Aparelho Ortodôntico | `Aparelho Ortodôntico em Sapé/PB \| Dra. Jaqueline` | `Aparelho ortodôntico em Sapé/PB. Dra. Jaqueline Sayonara — especialista em Ortodontia. Agende sua avaliação pelo WhatsApp!` | aparelho ortodôntico sapé pb, ortodontista sapé, aparelho fixo paraíba, ortodontia sapé, aparelho dental |
| Clareamento Dental | `Clareamento Dental em Sapé/PB \| Dra. Jaqueline` | `Clareamento dental seguro em Sapé/PB com a Dra. Jaqueline Sayonara. Dentes mais brancos com resultado imediato. Agende!` | clareamento dental sapé pb, clareamento a laser, branqueamento dental, dentes brancos sapé |
| Exodontia | `Extração de Dente em Sapé/PB \| Dra. Jaqueline` | `Extração de dente (exodontia) com segurança em Sapé/PB. Dra. Jaqueline Sayonara — recuperação rápida. Agende sua consulta!` | extração de dente sapé pb, exodontia, extração siso, cirurgia dental sapé |
| Facetas Dentárias | `Facetas Dentárias em Sapé/PB \| Dra. Jaqueline` | `Facetas dentárias em resina e porcelana em Sapé/PB. Transforme seu sorriso com a Dra. Jaqueline Sayonara. Agende!` | facetas dentárias sapé pb, lentes de contato dental, facetas em resina, facetas porcelana |
| Profilaxia | `Limpeza Dental em Sapé/PB \| Dra. Jaqueline` | `Limpeza dental profissional (profilaxia) em Sapé/PB. Previna cáries e tártaro com a Dra. Jaqueline. Agende pelo WhatsApp!` | limpeza dental sapé pb, profilaxia, limpeza dos dentes, tartarectomia, prevenção dental |
| Prótese Dentária | `Prótese Dentária em Sapé/PB \| Dra. Jaqueline` | `Prótese dentária fixa e removível em Sapé/PB. Recupere seu sorriso com a Dra. Jaqueline Sayonara. Agende sua avaliação!` | prótese dentária sapé pb, prótese fixa, prótese removível, dentadura, implante |
| Restauração | `Restauração Dentária em Sapé/PB \| Dra. Jaqueline` | `Restauração dentária em resina em Sapé/PB. Repare dentes com cárie ou danos. Dra. Jaqueline Sayonara. Agende!` | restauração dentária sapé pb, obturação, restauração em resina, tratamento cárie |

### 4.3 Texto pré-preenchido do WhatsApp por tratamento

| Tratamento | Texto (decoded) | URL-encoded |
|-----------|----------------|-------------|
| Aparelho Ortodôntico | `Olá! Gostaria de agendar uma avaliação para aparelho ortodôntico.` | `Ol%C3%A1!%20Gostaria%20de%20agendar%20uma%20avalia%C3%A7%C3%A3o%20para%20aparelho%20ortod%C3%B4ntico.` |
| Clareamento Dental | `Olá! Gostaria de agendar uma avaliação para clareamento dental.` | `Ol%C3%A1!%20Gostaria%20de%20agendar%20uma%20avalia%C3%A7%C3%A3o%20para%20clareamento%20dental.` |
| Exodontia | `Olá! Gostaria de agendar uma avaliação para extração de dente.` | `Ol%C3%A1!%20Gostaria%20de%20agendar%20uma%20avalia%C3%A7%C3%A3o%20para%20extra%C3%A7%C3%A3o%20de%20dente.` |
| Facetas Dentárias | `Olá! Gostaria de agendar uma avaliação para facetas dentárias.` | `Ol%C3%A1!%20Gostaria%20de%20agendar%20uma%20avalia%C3%A7%C3%A3o%20para%20facetas%20dent%C3%A1rias.` |
| Profilaxia | `Olá! Gostaria de agendar uma limpeza dental (profilaxia).` | `Ol%C3%A1!%20Gostaria%20de%20agendar%20uma%20limpeza%20dental%20(profilaxia).` |
| Prótese Dentária | `Olá! Gostaria de agendar uma avaliação para prótese dentária.` | `Ol%C3%A1!%20Gostaria%20de%20agendar%20uma%20avalia%C3%A7%C3%A3o%20para%20pr%C3%B3tese%20dent%C3%A1ria.` |
| Restauração | `Olá! Gostaria de agendar uma avaliação para restauração dentária.` | `Ol%C3%A1!%20Gostaria%20de%20agendar%20uma%20avalia%C3%A7%C3%A3o%20para%20restaura%C3%A7%C3%A3o%20dent%C3%A1ria.` |

**URL completa do CTA:**
```
https://wa.me/+5583994058749/?text={URL_ENCODED_TEXT}
```

### 4.4 Schema.org — Campos específicos por tratamento

| Tratamento | `procedureType` | `indication.name` | `howPerformed` (resumo) |
|-----------|-----------------|-------------------|------------------------|
| Aparelho Ortodôntico | `NoninvasiveProcedure` | Má oclusão, dentes desalinhados | Colagem de bráquetes e fio ortodôntico para movimentação gradual dos dentes |
| Clareamento Dental | `NoninvasiveProcedure` | Escurecimento dental, manchas | Aplicação de gel clareador com ativação em consultório |
| Exodontia | `SurgicalProcedure` | Dente comprometido, siso impactado | Anestesia local seguida de extração com instrumentos cirúrgicos |
| Facetas Dentárias | `NoninvasiveProcedure` | Dentes com alteração de cor, forma ou alinhamento | Preparo mínimo do dente e colagem de lâmina de resina ou porcelana |
| Profilaxia | `NoninvasiveProcedure` | Acúmulo de placa bacteriana e tártaro | Raspagem e polimento profissional com instrumentos ultrassônicos |
| Prótese Dentária | `NoninvasiveProcedure` | Perda de um ou mais dentes | Moldagem, confecção e instalação de prótese fixa ou removível |
| Restauração | `NoninvasiveProcedure` | Cárie, fratura ou desgaste dental | Remoção do tecido cariado e preenchimento com resina composta |

### 4.5 Ordem de implementação (por prioridade)

| # | Página | Justificativa | Dependência |
|---|--------|---------------|-------------|
| 1 | Aparelho Ortodôntico | Especialidade principal, maior volume | Fase 1 completa |
| 2 | Clareamento Dental | Alta demanda, busca frequente | — |
| 3 | Facetas Dentárias | Ticket alto, keyword competitiva | — |
| 4 | Prótese Dentária | Público 40+, alta intenção de busca | — |
| 5 | Restauração Dentária | Volume alto, baixa competição | — |
| 6 | Exodontia | Urgência, busca local forte | — |
| 7 | Profilaxia | Manutenção, recorrência | — |

> **Nota:** Páginas 2-7 são independentes entre si e podem ser implementadas em paralelo. A única dependência é a Fase 1 (infraestrutura) estar completa.

---

## 5. Fase 3: Integração com a Home

### 5.1 Mudanças no `index.html` — Cards de tratamento

**Alteração:** Substituir os `href` dos `.card-link` de WhatsApp para as páginas de tratamento.

**Diff completo dos card-links:**

```diff
- <a href="https://wa.me/+5583994058749/?text=Gostaria%20de%20saber%20mais%20sobre%20aparelho%20ortodôntico" class="card-link">Saiba mais →</a>
+ <a href="/tratamentos/aparelho-ortodontico/" class="card-link">Saiba mais →</a>

- <a href="https://wa.me/+5583994058749/?text=Gostaria%20de%20saber%20mais%20sobre%20clareamento" class="card-link">Saiba mais →</a>
+ <a href="/tratamentos/clareamento-dental/" class="card-link">Saiba mais →</a>

- <a href="https://wa.me/+5583994058749/?text=Gostaria%20de%20saber%20mais%20sobre%20exodontia" class="card-link">Saiba mais →</a>
+ <a href="/tratamentos/exodontia/" class="card-link">Saiba mais →</a>

- <a href="https://wa.me/+5583994058749/?text=Gostaria%20de%20saber%20mais%20sobre%20facetas" class="card-link">Saiba mais →</a>
+ <a href="/tratamentos/facetas-dentarias/" class="card-link">Saiba mais →</a>

- <a href="https://wa.me/+5583994058749/?text=Gostaria%20de%20saber%20mais%20sobre%20profilaxia" class="card-link">Saiba mais →</a>
+ <a href="/tratamentos/profilaxia/" class="card-link">Saiba mais →</a>

- <a href="https://wa.me/+5583994058749/?text=Gostaria%20de%20saber%20mais%20sobre%20prótese" class="card-link">Saiba mais →</a>
+ <a href="/tratamentos/protese-dentaria/" class="card-link">Saiba mais →</a>

- <a href="https://wa.me/+5583994058749/?text=Gostaria%20de%20saber%20mais%20sobre%20restauração" class="card-link">Saiba mais →</a>
+ <a href="/tratamentos/restauracao-dentaria/" class="card-link">Saiba mais →</a>
```

### 5.2 Tornar cards inteiramente clicáveis (opcional, recomendado)

Para melhorar UX, envolver o card inteiro em um `<a>`:

```html
<!-- ANTES -->
<div class="card-container">
    <div class="card">
        <img loading="lazy" src="./assets/img/care/aparelho.webp" alt="Aparelho ortodôntico">
        <div class="card-description">
            <h3 class="care-title">😁 Aparelho Ortodôntico</h3>
            <p>Corrige o alinhamento dos dentes e da mordida para um sorriso saudável e bonito.</p>
            <a href="/tratamentos/aparelho-ortodontico/" class="card-link">Saiba mais →</a>
        </div>
    </div>
</div>

<!-- DEPOIS (card inteiro clicável) -->
<a href="/tratamentos/aparelho-ortodontico/" class="card-container" style="text-decoration:none;">
    <div class="card">
        <img loading="lazy" src="./assets/img/care/aparelho.webp" alt="Aparelho ortodôntico">
        <div class="card-description">
            <h3 class="care-title">😁 Aparelho Ortodôntico</h3>
            <p>Corrige o alinhamento dos dentes e da mordida para um sorriso saudável e bonito.</p>
            <span class="card-link" aria-hidden="true">Saiba mais →</span>
        </div>
    </div>
</a>
```

> **Nota:** Se optar pelo card clicável, adicionar ao CSS:
> ```css
> a.card-container { text-decoration: none; display: block; }
> ```

### 5.3 Atualização do `sitemap.xml`

**Substituir conteúdo completo:**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.drajaquelinesayonara.com.br/</loc>
    <lastmod>2026-07-14</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.drajaquelinesayonara.com.br/tratamentos/aparelho-ortodontico/</loc>
    <lastmod>2026-07-14</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.drajaquelinesayonara.com.br/tratamentos/clareamento-dental/</loc>
    <lastmod>2026-07-14</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.drajaquelinesayonara.com.br/tratamentos/exodontia/</loc>
    <lastmod>2026-07-14</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.drajaquelinesayonara.com.br/tratamentos/facetas-dentarias/</loc>
    <lastmod>2026-07-14</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.drajaquelinesayonara.com.br/tratamentos/profilaxia/</loc>
    <lastmod>2026-07-14</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.drajaquelinesayonara.com.br/tratamentos/protese-dentaria/</loc>
    <lastmod>2026-07-14</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.drajaquelinesayonara.com.br/tratamentos/restauracao-dentaria/</loc>
    <lastmod>2026-07-14</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

### 5.4 Submissão ao Google Search Console

Passos após deploy:

1. Acessar [Google Search Console](https://search.google.com/search-console)
2. Selecionar propriedade `www.drajaquelinesayonara.com.br`
3. Ir em **Sitemaps** → Adicionar: `https://www.drajaquelinesayonara.com.br/sitemap.xml`
4. Clicar "Enviar"
5. Verificar status: deve mostrar "Enviado" e após processamento "Sucesso"
6. Ir em **Inspeção de URL** → inspecionar cada URL nova para forçar indexação:
   - `https://www.drajaquelinesayonara.com.br/tratamentos/aparelho-ortodontico/`
   - (repetir para cada uma)
7. Clicar "Solicitar indexação" em cada URL

### 5.5 Atualização do `robots.txt`

Verificar que `robots.txt` não bloqueia `/tratamentos/`:

```
User-agent: *
Allow: /

Sitemap: https://www.drajaquelinesayonara.com.br/sitemap.xml
```

> O `robots.txt` atual já permite tudo. Nenhuma alteração necessária, apenas confirmar que `/tratamentos/` não está em `Disallow`.

---

## 6. Fase 4: Validação e QA

### 6.1 Checklist Lighthouse por página

Executar para **cada uma das 8 páginas** (home + 7 tratamentos):

```bash
# Servir localmente
npx serve . -l 3000

# Lighthouse por página
npx lighthouse http://localhost:3000/ --only-categories=performance,accessibility,seo --output=json --output-path=./lighthouse/home.json
npx lighthouse http://localhost:3000/tratamentos/aparelho-ortodontico/ --only-categories=performance,accessibility,seo --output=json --output-path=./lighthouse/aparelho.json
npx lighthouse http://localhost:3000/tratamentos/clareamento-dental/ --only-categories=performance,accessibility,seo --output=json --output-path=./lighthouse/clareamento.json
# ... repetir para cada página
```

**Metas obrigatórias:**

| Métrica | Meta | Aceitável |
|---------|------|-----------|
| Performance | ≥95 | ≥90 |
| Acessibilidade | 100 | 100 (sem exceção) |
| SEO | 100 | 100 (sem exceção) |
| LCP | <2.5s | <3.0s |
| CLS | 0 | <0.1 |
| FID/INP | <100ms | <200ms |

**Se Performance < 95, verificar:**
- [ ] Imagem hero tem `width` e `height` explícitos (evita CLS)
- [ ] Imagem hero usa `loading="eager"` (LCP)
- [ ] CSS está inline (não external link)
- [ ] `main.js` tem `defer`
- [ ] Imagens em WebP com compressão adequada (<100KB para hero)
- [ ] Fonte preloaded com `<link rel="preload">`

### 6.2 Validação Schema.org

**Ferramenta 1:** [Schema Markup Validator](https://validator.schema.org/)
- Colar HTML completo de cada página
- Verificar: 0 erros, 0 warnings em `MedicalProcedure`, `BreadcrumbList`, `FAQPage`

**Ferramenta 2:** [Google Rich Results Test](https://search.google.com/test/rich-results)
- URL: `https://www.drajaquelinesayonara.com.br/tratamentos/{slug}/`
- Verificar: "Page is eligible for rich results"
- Tipos esperados: FAQ, Breadcrumb

**Checklist Schema por página:**

- [ ] `MedicalProcedure.name` preenchido corretamente
- [ ] `MedicalProcedure.url` aponta para canonical correto
- [ ] `MedicalProcedure.image` URL acessível (retorna 200)
- [ ] `BreadcrumbList` com 3 itens (Home → Tratamentos → Página)
- [ ] `FAQPage.mainEntity` com ≥3 perguntas
- [ ] `Dentist` com `aggregateRating` consistente com a home
- [ ] Nenhum campo com valor placeholder (`{...}`)

### 6.3 Testes de Dark Mode

Para cada página de tratamento, verificar:

- [ ] Toggle desktop (`#dark-mode-button`) ativa/desativa `.dark-theme`
- [ ] Toggle mobile (`.dark-mode-toggle-mobile`) ativa/desativa `.dark-theme`
- [ ] Sincronização: ativar em um toggle reflete no outro
- [ ] Cores de texto do breadcrumb legíveis (contraste ≥4.5:1)
- [ ] `.treatment-hero h1` muda para `var(--color-text)` no dark
- [ ] `.treatment-content` background muda para `var(--color-surface)` no dark
- [ ] `details` border visível no dark (rgba branco)
- [ ] `summary` texto legível no dark
- [ ] Cards de "Outros Tratamentos" com background correto
- [ ] Footer mantém estilo dark
- [ ] Imagens não ficam com contraste excessivo

**Contraste mínimo (WCAG AA):**

| Elemento | Light mode | Dark mode |
|----------|-----------|-----------|
| `--color-text-muted` sobre `--color-bg` | #6b4a4c sobre #fdfbfc = 5.8:1 ✓ | #b8a8ab sobre #1a1218 = 7.0:1 ✓ |
| `--color-accent` sobre `--color-bg` | #a85860 sobre #fdfbfc = 4.6:1 ✓ | #e09498 sobre #1a1218 = 5.2:1 ✓ |
| Breadcrumb `[aria-current]` | #6b4a4c sobre #fdfbfc = 5.8:1 ✓ | #b8a8ab sobre #1a1218 = 7.0:1 ✓ |

### 6.4 Testes de Responsividade

| Viewport | Verificação |
|----------|-------------|
| 375×667 (iPhone SE) | Hero empilhado (flex-column), breadcrumb wrap, FAQ legível |
| 390×844 (iPhone 14) | Mesma verificação + CTA com touch target ≥44px |
| 768×1024 (iPad) | Cards em grid 2 colunas, hero pode estar empilhado |
| 1200×800 (Desktop) | Hero lado-a-lado, breadcrumb em linha, cards 3 colunas |
| 1440×900 (Desktop L) | Max-width 1200px respeitado, conteúdo centralizado |
| 2560×1440 (Ultrawide) | Mesma verificação, sem stretch |

**Ferramenta:** DevTools → Device Mode em Chrome/Firefox

### 6.5 Testes de Navegação por Teclado

| Ação | Resultado esperado |
|------|-------------------|
| Tab desde o topo | Skip link → hamburger (mobile) OU nav links (desktop) → breadcrumb links → CTA hero → conteúdo → FAQ summaries → CTA final → cards "Outros Tratamentos" → footer → WhatsApp float |
| Enter no skip link | Foco pula para `#main-content` |
| Tab no breadcrumb | Foco percorre Home → Tratamentos → (current não focável) |
| Enter/Space em `<summary>` | Abre/fecha o `<details>` |
| Enter em card-link | Navega para a página do tratamento |
| Escape (offcanva aberto) | Fecha offcanva, retorna foco ao hamburger |
| Tab dentro do offcanva | Focus trap circular (primeiro ↔ último elemento) |
| `focus-visible` | Outline 3px cherry visível em todos os interativos |

### 6.6 Cross-browser Testing

| Navegador | Versão mínima | Plataforma | Verificação |
|-----------|--------------|------------|-------------|
| Chrome | 90+ | Desktop + Mobile | Layout, dark mode, JS |
| Firefox | 90+ | Desktop | Layout, dark mode, `details/summary` |
| Safari | 15+ | macOS + iOS | Layout, `-webkit-` prefixes, `details` |
| Edge | 90+ | Desktop | Compatibilidade geral |
| Samsung Internet | 15+ | Android | Layout, touch |

**Pontos críticos por navegador:**
- **Safari:** `summary::-webkit-details-marker` necessário para ocultar seta padrão
- **Firefox:** `details[open]` animation pode precisar de fallback
- **iOS Safari:** `viewport-fit=cover` + `env(safe-area-inset-*)` para notch

### 6.7 Testes de Regressão na Home

Após integração (Fase 3), verificar que a home não quebrou:

- [ ] Cards de tratamento agora linkam para `/tratamentos/{slug}/` (não WhatsApp)
- [ ] Lightbox de resultados ainda funciona (click + keyboard)
- [ ] Menu offcanva abre/fecha corretamente
- [ ] Dark mode toggle funciona em ambos os breakpoints
- [ ] Active section indicator destaca corretamente ao scroll
- [ ] Fade-in on scroll anima elementos
- [ ] WhatsApp float aparece após 2s
- [ ] Schema.org da home não foi alterado (JSON-LD intacto)
- [ ] Canonical da home permanece `https://www.drajaquelinesayonara.com.br/`
- [ ] Lighthouse da home mantém scores ≥97/100/100
- [ ] Links de redes sociais, planos e footer funcionam
- [ ] Vídeo do consultório toca (autoplay, muted, loop)
- [ ] `prefers-reduced-motion` pausa vídeo e remove animações

### 6.8 Validações adicionais

| Validação | Ferramenta | URL |
|-----------|-----------|-----|
| HTML válido | W3C Validator | https://validator.w3.org/ |
| Links quebrados | Dead Link Checker | https://www.deadlinkchecker.com/ |
| Mobile-friendly | Google Mobile Test | https://search.google.com/test/mobile-friendly |
| Headers HTTP | REDbot | https://redbot.org/ |
| Performance real | WebPageTest | https://www.webpagetest.org/ |

---

## 7. Estimativa de Esforço

### 7.1 Timeline por fase

| Fase | Descrição | Duração | Dependência | Entregáveis |
|------|-----------|---------|-------------|-------------|
| **1** | Infraestrutura | 1 dia | — | Diretórios, `treatment.css`, build atualizado, template HTML, `vercel.json` |
| **2** | Criação das páginas | 3-5 dias | Fase 1 + conteúdo aprovado | 7 arquivos `index.html` completos |
| **3** | Integração com a home | 0.5 dia | Fases 1-2 | `index.html` atualizado, `sitemap.xml`, Search Console |
| **4** | Validação e QA | 1-1.5 dia | Fase 3 | Relatórios Lighthouse, Schema validado, testes passando |
| | **Total** | **5.5-8 dias** | | |

### 7.2 Breakdown detalhado

#### Fase 1: Infraestrutura (1 dia)

| Task | Tempo estimado | Complexidade |
|------|---------------|--------------|
| Criar diretórios | 5min | Trivial |
| Escrever `treatment.css` | 1-2h | Média |
| Atualizar `styles.css` + build | 15min | Trivial |
| Atualizar `vercel.json` | 10min | Trivial |
| Criar template HTML base | 2-3h | Alta |
| Testar build + preview local | 30min | Baixa |

#### Fase 2: Criação das páginas (3-5 dias)

| Task (por página) | Tempo estimado | Multiplicador |
|-------------------|---------------|---------------|
| Preencher conteúdo (texto + FAQ) | 1-2h | ×7 |
| Preparar imagens (WebP, otimizar) | 30min | ×7 |
| Customizar HTML (meta, Schema, cards) | 45min | ×7 |
| Teste rápido local (visual + links) | 15min | ×7 |
| **Total por página** | **~2.5-3.5h** | |
| **Total fase (7 páginas)** | **17-25h (3-5 dias)** | |

> **Otimização:** Após a 1ª página (mais lenta — ~4h), as seguintes são copiar+colar+customizar (~2h cada).

#### Fase 3: Integração (0.5 dia)

| Task | Tempo estimado |
|------|---------------|
| Atualizar card-links no `index.html` | 15min |
| Substituir `sitemap.xml` | 5min |
| Deploy preview (Vercel) | 10min |
| Submeter sitemap no Search Console | 15min |
| Solicitar indexação (7 URLs) | 20min |

#### Fase 4: Validação (1-1.5 dia)

| Task | Tempo estimado |
|------|---------------|
| Lighthouse em 8 páginas | 1h |
| Corrigir issues de performance | 1-2h |
| Validar Schema (8 páginas) | 45min |
| Dark mode test (8 páginas) | 1h |
| Responsividade (6 viewports × 8 páginas) | 2h |
| Keyboard navigation | 30min |
| Cross-browser spot check | 1h |
| Regressão na home | 30min |

### 7.3 Diagrama de dependências

```
Conteúdo aprovado ──┐
                    ├──→ Fase 2 (Páginas) ──→ Fase 3 (Integração) ──→ Fase 4 (QA)
Fase 1 (Infra) ────┘
```

**Caminho crítico:** Conteúdo aprovado → se o texto não estiver pronto, Fase 2 é bloqueada.

**Paralelizável:**
- Fase 1 pode ser feita enquanto conteúdo está sendo escrito
- Imagens podem ser preparadas em paralelo com a escrita

---

## 8. Riscos e Rollback

### 8.1 Riscos identificados

| # | Risco | Probabilidade | Impacto | Mitigação |
|---|-------|--------------|---------|-----------|
| 1 | **Conteúdo não entregue no prazo** | Alta | Bloqueia Fase 2 | Iniciar Fase 1 em paralelo; ter conteúdo mínimo (placeholder) para testar infra |
| 2 | **CSS inline duplicado em 8 páginas** | Certa (by design) | Manutenção mais custosa | Documentar processo de atualização; considerar migration para `<link>` + preload no futuro |
| 3 | **Imagens hero pesadas** | Média | Performance <95 | Limite 100KB/imagem; usar `cwebp -q 80`; definir `width`/`height` |
| 4 | **Dark mode quebrado em nova seção** | Baixa | UX ruim para 10-20% dos usuários | Teste explícito de cada combinação; dark overrides em `treatment.css` |
| 5 | **Schema.org inválido** | Média | Sem rich snippets | Validar ANTES do deploy com Schema Validator |
| 6 | **Canibalização de keywords com home** | Baixa | Diluição de ranking | Home foca "dentista sapé"; páginas focam em procedimentos específicos |
| 7 | **Links quebrados após deploy** | Baixa | 404 para usuários/bots | Verificar com Dead Link Checker pré e pós deploy |
| 8 | **Main.js erro em páginas sem lightbox** | Muito baixa | Console error | JS já usa `if (lightbox)` guard — sem risco |
| 9 | **Cache stale após atualização** | Baixa | Conteúdo desatualizado | HTML sem cache (must-revalidate); apenas assets com cache imutável |
| 10 | **Redirecionamento incorreto** | Baixa | Página 404 ou loop | Testar em preview antes de produção |

### 8.2 Estratégia de Rollback

#### Rollback parcial (uma página com problema)

```bash
# Remover a página problemática
rm -rf tratamentos/{slug-problematico}/

# Reverter card-link na home para WhatsApp (apenas o card afetado)
# Atualizar sitemap removendo a URL

# Deploy
git add -A && git commit -m "rollback: remove {slug} page" && git push
```

#### Rollback completo (reverter toda a expansão)

```bash
# Opção 1: Revert do merge commit
git revert --no-commit <merge-commit-hash>
git commit -m "rollback: revert multipage expansion"
git push

# Opção 2: Se implementado em commits separados
git revert --no-commit <commit-fase3> <commit-fase2> <commit-fase1>
git commit -m "rollback: revert all multipage changes"
git push
```

**Depois do rollback:**
1. Submeter sitemap atualizado (apenas home) no Search Console
2. Verificar que 404s não persistem (Vercel retorna 404 automaticamente para paths inexistentes)
3. Monitorar Search Console por 1-2 semanas para confirmar desindexação

### 8.3 Estratégia de deploy seguro

| Etapa | Ação | Verificação |
|-------|------|-------------|
| 1 | Deploy em branch separada (`feat/multipage`) | Preview URL funcional |
| 2 | QA completo no preview | Lighthouse + Schema + visual |
| 3 | PR para `main` com checklist completo | Code review |
| 4 | Merge → deploy automático (Vercel) | Verificar produção em 5min |
| 5 | Smoke test em produção | Home + 2-3 páginas + dark mode |
| 6 | Submeter sitemap | Search Console OK |
| 7 | Monitorar 24h | Sem 404s, sem erros no console |

### 8.4 Processo de atualização futura

Quando precisar atualizar CSS (ex: novo componente, fix de bug):

```bash
# 1. Editar o CSS fonte (ex: treatment.css)
# 2. Rebuild
./build-css.sh

# 3. Copiar conteúdo de styles.min.css para o <style> de TODAS as páginas
# IMPORTANTE: São 8 arquivos HTML para atualizar (home + 7 tratamentos)

# 4. Script auxiliar (recomendado criar):
```

**Script recomendado: `update-inline-css.sh`**

```bash
#!/bin/bash
# Atualiza o CSS inline em todas as páginas HTML
CSS_CONTENT=$(cat assets/css/styles.min.css)

# Lista de arquivos HTML
HTML_FILES=(
  "index.html"
  "tratamentos/aparelho-ortodontico/index.html"
  "tratamentos/clareamento-dental/index.html"
  "tratamentos/exodontia/index.html"
  "tratamentos/facetas-dentarias/index.html"
  "tratamentos/profilaxia/index.html"
  "tratamentos/protese-dentaria/index.html"
  "tratamentos/restauracao-dentaria/index.html"
)

for file in "${HTML_FILES[@]}"; do
  if [ -f "$file" ]; then
    # Substitui conteúdo entre <style> e </style>
    sed -i "/<style>/,/<\/style>/c\\    <style>${CSS_CONTENT}<\/style>" "$file"
    echo "✓ $file"
  fi
done

echo "Done — CSS inline atualizado em ${#HTML_FILES[@]} arquivos"
```

---

## Apêndice A: Referência rápida de arquivos modificados/criados

| Arquivo | Ação | Fase |
|---------|------|------|
| `assets/css/treatment.css` | **CRIAR** | 1 |
| `assets/css/styles.css` | Adicionar `@import "./treatment.css"` | 1 |
| `assets/css/styles.min.css` | Rebuild (automático) | 1 |
| `tratamentos/*/index.html` (×7) | **CRIAR** | 2 |
| `assets/img/tratamentos/*.webp` (×7) | **CRIAR** | 2 |
| `index.html` | Atualizar card-links | 3 |
| `sitemap.xml` | Substituir conteúdo | 3 |
| `vercel.json` | Adicionar header rule | 1 |
| `update-inline-css.sh` | **CRIAR** (utilitário) | 1 |

## Apêndice B: Comandos úteis

```bash
# Build CSS
./build-css.sh

# Servir localmente
npx serve . -l 3000

# Lighthouse (uma página)
npx lighthouse http://localhost:3000/tratamentos/aparelho-ortodontico/ --only-categories=performance,accessibility,seo

# Verificar tamanho do bundle CSS
wc -c assets/css/styles.min.css

# Verificar se treatment.css foi incluído no bundle
grep "breadcrumb" assets/css/styles.min.css

# Otimizar imagem WebP
cwebp -q 80 -resize 600 400 input.png -o assets/img/tratamentos/slug-hero.webp

# Validar HTML
npx html-validate tratamentos/aparelho-ortodontico/index.html

# Listar todas as páginas
find tratamentos -name "index.html" | sort
```

---

*Documento gerado em 2026-07-14. Manter atualizado conforme execução avança.*
