# Estratégia Multipage — SEO Local para Tratamentos

> **Projeto:** drajaquelinesayonara.com.br  
> **Objetivo:** Capturar tráfego orgânico de cauda longa para procedimentos odontológicos na região de Sapé/PB  
> **Stack:** HTML5 estático (mesma stack da branch `main`)  
> **Data:** 2026-07-13

---

## 1. Contexto e Justificativa

A landing page atual concentra todos os tratamentos em uma única seção com cards. Isso limita o ranqueamento para buscas específicas como:

- "clareamento dental sapé pb"
- "aparelho ortodôntico sapé paraíba"
- "facetas dentárias joão pessoa região"
- "dentista prótese sapé"

Com páginas individuais por tratamento, cada uma pode:
- Ranquear para sua keyword específica + variações
- Ter meta description e title otimizados
- Conter conteúdo aprofundado (aumenta tempo na página)
- Receber backlinks específicos
- Gerar rich snippets via Schema.org `MedicalProcedure`

---

## 2. Arquitetura de URLs

```
www.drajaquelinesayonara.com.br/
├── tratamentos/
│   ├── aparelho-ortodontico/index.html
│   ├── clareamento-dental/index.html
│   ├── exodontia/index.html
│   ├── facetas-dentarias/index.html
│   ├── profilaxia/index.html
│   ├── protese-dentaria/index.html
│   └── restauracao-dentaria/index.html
└── index.html (home)
```

> **Nota:** Usar `diretório/index.html` para URLs limpas sem extensão (`/tratamentos/clareamento-dental/`).

---

## 3. Mapeamento de Páginas e Keywords

| Página | URL | Keyword principal | Keywords secundárias |
|--------|-----|-------------------|---------------------|
| Aparelho Ortodôntico | `/tratamentos/aparelho-ortodontico/` | aparelho ortodôntico sapé pb | ortodontista sapé, aparelho fixo paraíba, ortodontia sapé |
| Clareamento Dental | `/tratamentos/clareamento-dental/` | clareamento dental sapé pb | clareamento a laser, branqueamento dental, dentes brancos |
| Exodontia | `/tratamentos/exodontia/` | extração de dente sapé pb | exodontia, extração siso, cirurgia dental sapé |
| Facetas Dentárias | `/tratamentos/facetas-dentarias/` | facetas dentárias sapé pb | lentes de contato dental, facetas em resina, facetas porcelana |
| Profilaxia | `/tratamentos/profilaxia/` | limpeza dental sapé pb | profilaxia, limpeza dos dentes, tartarectomia |
| Prótese Dentária | `/tratamentos/protese-dentaria/` | prótese dentária sapé pb | prótese fixa, prótese removível, dentadura |
| Restauração | `/tratamentos/restauracao-dentaria/` | restauração dentária sapé pb | obturação, restauração em resina, tratamento cárie |

---

## 4. Estrutura HTML de Cada Página

### 4.1 Template Base

```html
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{Tratamento} em Sapé/PB | Dra. Jaqueline Sayonara</title>
    <meta name="description" content="{Meta description única ~150 chars}">
    <meta name="keywords" content="{keywords específicas}">
    <link rel="canonical" href="https://www.drajaquelinesayonara.com.br/tratamentos/{slug}/">

    <!-- Open Graph -->
    <meta property="og:title" content="{Tratamento} | Dra. Jaqueline Sayonara">
    <meta property="og:description" content="{Descrição curta}">
    <meta property="og:image" content="https://www.drajaquelinesayonara.com.br/assets/img/tratamentos/{slug}.webp">
    <meta property="og:url" content="https://www.drajaquelinesayonara.com.br/tratamentos/{slug}/">
    <meta property="og:type" content="article">
    <meta property="og:locale" content="pt_BR">
    <meta property="og:site_name" content="Dra. Jaqueline Sayonara">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{Tratamento} em Sapé/PB | Dra. Jaqueline Sayonara">
    <meta name="twitter:description" content="{Descrição curta}">
    <meta name="twitter:image" content="https://www.drajaquelinesayonara.com.br/assets/img/tratamentos/{slug}.webp">

    <!-- Fonte + CSS (mesmo da home) -->
    <link rel="preload" href="/assets/font/Manrope-VariableFont_wght.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="shortcut icon" href="/assets/img/favicon.webp" type="image/x-icon">
    <style>/* CSS inline minificado — mesmo da home */</style>

    <!-- Schema.org -->
    <script type="application/ld+json">
    {Schema JSON-LD — ver seção 5}
    </script>
</head>
<body>
    <!-- Skip link -->
    <a href="#main-content" class="skip-link">Pular para o conteúdo principal</a>

    <!-- Header (mesmo da home — navbar + offcanva) -->
    <header>...</header>

    <main id="main-content">
        <!-- Breadcrumb visual -->
        <nav class="breadcrumb" aria-label="Navegação estrutural">
            <ol>
                <li><a href="/">Home</a></li>
                <li><a href="/#care">Tratamentos</a></li>
                <li aria-current="page">{Nome do Tratamento}</li>
            </ol>
        </nav>

        <!-- Hero do tratamento -->
        <section class="treatment-hero">
            <div>
                <h1>{Nome do Tratamento}</h1>
                <p class="treatment-subtitle">{Subtítulo com keyword}</p>
                <a href="https://wa.me/+5583994058749/?text=..." class="btn-cta">
                    Agendar consulta
                </a>
            </div>
            <img src="/assets/img/tratamentos/{slug}-hero.webp"
                 alt="{Descrição da imagem}"
                 width="600" height="400">
        </section>

        <!-- Conteúdo principal -->
        <section class="treatment-content">
            <div>
                <h2>O que é {tratamento}?</h2>
                <p>{Explicação do procedimento — 2-3 parágrafos}</p>

                <h2>Benefícios</h2>
                <ul>
                    <li>{Benefício 1}</li>
                    <li>{Benefício 2}</li>
                    <li>{Benefício 3}</li>
                </ul>

                <h2>Como funciona o procedimento</h2>
                <p>{Passo a passo simplificado}</p>

                <h2>Para quem é indicado</h2>
                <p>{Indicações}</p>

                <h2>Perguntas frequentes</h2>
                <details>
                    <summary>Quanto tempo dura o tratamento?</summary>
                    <p>{Resposta}</p>
                </details>
                <details>
                    <summary>O procedimento dói?</summary>
                    <p>{Resposta}</p>
                </details>
                <details>
                    <summary>Qual o valor?</summary>
                    <p>O valor varia conforme cada caso. Agende uma avaliação para um orçamento personalizado.</p>
                </details>
            </div>
        </section>

        <!-- CTA -->
        <section class="cta-final fade-in">
            <div>
                <h2 class="section-title">Agende sua avaliação</h2>
                <p class="cta-final-text">Tire suas dúvidas sobre {tratamento} com a Dra. Jaqueline.</p>
                <a href="https://wa.me/+5583994058749/?text=..." class="btn-cta">
                    Falar pelo WhatsApp
                </a>
            </div>
        </section>

        <!-- Outros tratamentos -->
        <section class="related-treatments">
            <div>
                <h2 class="section-title">Outros Tratamentos</h2>
                <div class="cards-container">
                    <!-- Cards dos outros 6 tratamentos (linkando para suas páginas) -->
                </div>
            </div>
        </section>
    </main>

    <!-- Footer (mesmo da home) -->
    <footer>...</footer>

    <!-- WhatsApp flutuante -->
    <a href="..." class="whatsapp-float" ...>...</a>

    <script defer src="/assets/js/main.js"></script>
</body>
</html>
```

---

## 5. Schema.org — Structured Data

### 5.1 JSON-LD por página de tratamento

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "MedicalProcedure",
      "name": "{Nome do Tratamento}",
      "description": "{Descrição do procedimento}",
      "procedureType": "http://schema.org/NoninvasiveProcedure",
      "bodyLocation": "Mouth",
      "indication": {
        "@type": "MedicalIndication",
        "name": "{Indicação principal}"
      },
      "howPerformed": "{Descrição breve de como é feito}",
      "preparation": "{Preparação necessária}",
      "url": "https://www.drajaquelinesayonara.com.br/tratamentos/{slug}/",
      "image": "https://www.drajaquelinesayonara.com.br/assets/img/tratamentos/{slug}.webp",
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
          "name": "{Nome do Tratamento}",
          "item": "https://www.drajaquelinesayonara.com.br/tratamentos/{slug}/"
        }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Quanto tempo dura o tratamento de {tratamento}?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "{Resposta}"
          }
        },
        {
          "@type": "Question",
          "name": "O procedimento de {tratamento} dói?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "{Resposta}"
          }
        }
      ]
    }
  ]
}
```

### 5.2 Atualização da Home

Na home (`index.html`), atualizar os card-links para apontar para as novas páginas:

```html
<!-- ANTES -->
<a href="https://wa.me/..." class="card-link">Saiba mais →</a>

<!-- DEPOIS -->
<a href="/tratamentos/clareamento-dental/" class="card-link">Saiba mais →</a>
```

---

## 6. CSS Específico para Páginas de Tratamento

### 6.1 Novo arquivo: `assets/css/treatment.css`

```css
/* Breadcrumb */
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
  list-style: none;
  padding: 0;
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
}

.breadcrumb [aria-current="page"] {
  color: var(--color-text-muted);
  font-weight: 500;
}

/* Treatment Hero */
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
  font-size: 1.6rem;
  line-height: 1.6;
  margin: 16px 0 24px;
}

.treatment-hero img {
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  height: auto;
  object-fit: cover;
}

/* Treatment Content */
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
  font-size: 1.6rem;
  line-height: 1.8;
  margin-bottom: 16px;
}

.treatment-content ul {
  padding-left: 24px;
  margin-bottom: 24px;
}

.treatment-content li {
  font-size: 1.6rem;
  line-height: 1.8;
  margin-bottom: 8px;
  list-style: disc;
}

/* FAQ (details/summary) */
.treatment-content details {
  border: 1px solid var(--shadow-sm);
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 12px;
  transition: box-shadow 0.2s;
}

.treatment-content details[open] {
  box-shadow: var(--shadow-sm);
}

.treatment-content summary {
  font-size: 1.6rem;
  font-weight: 600;
  cursor: pointer;
  color: var(--logo-pallete-velvety-cherry);
}

.treatment-content details p {
  margin-top: 12px;
  font-size: 1.5rem;
}

/* Related treatments */
.related-treatments {
  padding: 64px 24px;
}

.related-treatments > div {
  max-width: 1200px;
  margin: 0 auto;
}

/* Responsive */
@media only screen and (max-width: 1199px) {
  .treatment-hero > div {
    flex-direction: column;
    gap: 24px;
    text-align: center;
  }

  .treatment-hero img {
    max-width: 100%;
    border-radius: 12px;
  }

  .breadcrumb {
    padding: 68px 16px 0;
  }
}
```

---

## 7. Internal Linking — Estratégia

### 7.1 Da Home para as páginas

- Cards de tratamento na seção `#care` → link para `/tratamentos/{slug}/`
- Texto âncora: nome do tratamento (não "Saiba mais")

### 7.2 Das páginas de tratamento para a Home

- Logo no header → `/`
- Breadcrumb → `/` e `/#care`
- Seção "Outros Tratamentos" → links para as demais páginas
- CTA → WhatsApp (conversão)

### 7.3 Entre páginas de tratamento

- Seção "Outros Tratamentos" em cada página lista os 6 restantes
- Contextual links no corpo do texto quando relevante (ex: "Se você busca um sorriso mais branco, conheça também nosso [clareamento dental](/tratamentos/clareamento-dental/)")

### 7.4 Sitemap atualizado

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.drajaquelinesayonara.com.br/</loc>
    <lastmod>2026-07-13</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.drajaquelinesayonara.com.br/tratamentos/aparelho-ortodontico/</loc>
    <lastmod>2026-07-13</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.drajaquelinesayonara.com.br/tratamentos/clareamento-dental/</loc>
    <lastmod>2026-07-13</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.drajaquelinesayonara.com.br/tratamentos/exodontia/</loc>
    <lastmod>2026-07-13</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.drajaquelinesayonara.com.br/tratamentos/facetas-dentarias/</loc>
    <lastmod>2026-07-13</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.drajaquelinesayonara.com.br/tratamentos/profilaxia/</loc>
    <lastmod>2026-07-13</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.drajaquelinesayonara.com.br/tratamentos/protese-dentaria/</loc>
    <lastmod>2026-07-13</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.drajaquelinesayonara.com.br/tratamentos/restauracao-dentaria/</loc>
    <lastmod>2026-07-13</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

---

## 8. Conteúdo por Página — Diretrizes

### Extensão recomendada
- **Mínimo:** 600 palavras por página
- **Ideal:** 800-1200 palavras
- **Máximo:** 1500 palavras (evitar conteúdo fino mas não exagerar)

### Tom de voz
- Profissional mas acolhedor
- Primeira pessoa do plural ("realizamos", "cuidamos")
- Evitar jargão técnico excessivo — explicar termos quando necessário
- Incluir localização naturalmente no texto ("em nosso consultório em Sapé/PB")

### Estrutura de conteúdo por página

| Seção | Propósito SEO |
|-------|---------------|
| H1 + subtítulo | Keyword principal + localização |
| "O que é" | Definição (featured snippet potential) |
| "Benefícios" | Lista (rich snippets) |
| "Como funciona" | Processo (People Also Ask) |
| "Para quem é indicado" | Intenção de busca informacional |
| FAQ | FAQPage Schema + long-tail keywords |
| CTA | Conversão |

### Imagens necessárias por página
- 1 imagem hero (600x400 mínimo, WebP)
- 1-2 imagens ilustrativas no conteúdo (opcional)
- Alt text descritivo com keyword natural

---

## 9. Plano de Implementação — Ordem de Execução

### Fase 1: Infraestrutura (1 dia)

1. Criar estrutura de diretórios `/tratamentos/{slug}/`
2. Criar `assets/css/treatment.css` com estilos específicos
3. Importar no `styles.css` e rebuild
4. Criar template HTML base reutilizável
5. Atualizar `vercel.json` (cache para novas páginas)

### Fase 2: Páginas prioritárias (3-5 dias)

Ordem por volume de busca estimado:

| # | Página | Justificativa |
|---|--------|---------------|
| 1 | Aparelho Ortodôntico | Especialidade principal da Dra. |
| 2 | Clareamento Dental | Alta demanda, busca frequente |
| 3 | Facetas Dentárias | Ticket alto, keyword competitiva |
| 4 | Prótese Dentária | Público 40+, alta intenção |
| 5 | Restauração | Volume alto, baixa competição |
| 6 | Exodontia | Urgência, busca local forte |
| 7 | Profilaxia | Manutenção, recorrência |

### Fase 3: Integração (1 dia)

1. Atualizar cards na home (`index.html`) para linkar às páginas
2. Atualizar `sitemap.xml` com todas as novas URLs
3. Submeter novo sitemap no Google Search Console
4. Testar internal linking e navegação

### Fase 4: Validação (1 dia)

1. Lighthouse em cada página (meta: 95+ perf, 100 a11y, 100 SEO)
2. Validar Schema.org no [Schema Markup Validator](https://validator.schema.org/)
3. Testar rich snippets no [Rich Results Test](https://search.google.com/test/rich-results)
4. Verificar mobile rendering
5. Confirmar dark mode funciona em todas as páginas
6. Testar navegação por teclado (focus, breadcrumb, CTA)

---

## 10. Métricas de Sucesso

### KPIs (medir após 30/60/90 dias)

| Métrica | Baseline | Meta 90 dias |
|---------|----------|--------------|
| Páginas indexadas | 1 | 8 |
| Impressões orgânicas (Search Console) | ~X/mês | +50% |
| Cliques orgânicos | ~X/mês | +30% |
| Keywords ranqueando (top 20) | ~5 | ~25 |
| CTR médio | ~X% | +1-2 pp |
| Conversões WhatsApp (via UTM) | ~X/mês | +20% |

### Ferramentas de monitoramento
- Google Search Console (impressões, cliques, posição por página)
- Google Analytics 4 (pageviews, conversões por landing page)
- Ahrefs/SEMrush (tracking de keywords — opcional)

---

## 11. Riscos e Mitigações

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| Conteúdo duplicado entre páginas | Penalização SEO | Conteúdo único por página; canonical explícito |
| Canibalização de keywords com a home | Diluição de ranking | Home foca em "dentista sapé"; páginas focam em procedimentos |
| Thin content (pouco texto) | Não ranquear | Mínimo 600 palavras; FAQ expande conteúdo |
| Manutenção de múltiplas páginas | Inconsistência | Usar header/footer compartilhados; componentes reutilizáveis |
| Imagens pesadas | Performance | WebP, lazy loading, width/height explícitos |
| Dark mode quebrado nas novas páginas | UX | Usar mesmo CSS inline da home; testar cada página |

---

## 12. Checklist de Lançamento

Para cada página de tratamento, antes de publicar:

- [ ] Title tag com keyword + localização (≤60 chars)
- [ ] Meta description única (≤155 chars) com CTA
- [ ] Canonical URL correto
- [ ] Open Graph completo (title, description, image, url)
- [ ] Twitter Card completo
- [ ] Schema.org `MedicalProcedure` + `BreadcrumbList` + `FAQPage`
- [ ] H1 único com keyword principal
- [ ] Hierarquia de headings correta (H1 > H2 > H3)
- [ ] Conteúdo ≥600 palavras
- [ ] Imagens com alt text descritivo + width/height
- [ ] Internal links para home e outros tratamentos
- [ ] CTA WhatsApp com texto pré-preenchido correto
- [ ] Breadcrumb visual e acessível
- [ ] Dark mode funcionando
- [ ] Responsivo (mobile + desktop)
- [ ] Lighthouse: ≥95 perf, 100 a11y, 100 SEO
- [ ] Schema validado (sem erros)
- [ ] URL adicionada ao sitemap.xml

---

## 13. Evolução Futura

### Curto prazo (pós-lançamento)
- Monitorar Search Console por 30 dias
- Ajustar títulos/descriptions com base em CTR
- Adicionar mais FAQs baseado em "People Also Ask"

### Médio prazo (3-6 meses)
- Blog com artigos educativos (ex: "Como saber se preciso de aparelho?")
- Páginas de localização (ex: `/dentista-sape-pb/`)
- Google Business Profile otimizado com links para as páginas

### Longo prazo (6-12 meses)
- Migração para Astro ou Next.js (SSG) se manutenção manual se tornar onerosa
- Implementação de ISR para atualização automática de conteúdo
- A/B testing de CTAs por página
