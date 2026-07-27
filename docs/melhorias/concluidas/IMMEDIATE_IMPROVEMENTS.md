# Guia de Melhorias Imediatas (Sem Dependências Externas)

> Implementações que podem ser feitas diretamente no código, sem necessidade de serviços de terceiros, APIs pagas ou ferramentas externas.

**Custo:** R$ 0  
**Stack:** HTML/CSS/JS vanilla (mesma do projeto)  
**Última atualização:** 21 de Julho 2026

---

## Resumo

| # | Melhoria | Impacto | Esforço | Status | Seção |
|---|----------|---------|---------|--------|-------|
| 1 | Página "Primeira Consulta" | 🔴 Alto | Baixo | ✅ Concluído | [→](#1-página-primeira-consulta) |
| 2 | Páginas de área de atendimento | 🔴 Alto | Médio | ✅ Concluído (6/6) | [→](#2-páginas-de-área-de-atendimento) |
| 3 | Expandir areaServed no Schema.org | 🟡 Médio | Baixo | ✅ Concluído | [→](#3-expandir-areaserved-no-schemaorg) |
| 4 | Seção FAQ na página principal | 🟡 Médio | Baixo | ✅ Concluído | [→](#4-seção-faq-na-página-principal) |
| 5 | Slider interativo antes/depois | 🟡 Médio | Médio | ✅ Concluído | [→](#5-slider-interativo-antesdepois) |
| 6 | Conteúdo otimizado para AI (GEO) | 🟡 Médio | Médio | ✅ Concluído | [→](#6-conteúdo-otimizado-para-ai-geo) |
| 7 | Página de listagem de tratamentos | 🟢 Baixo | Baixo | ✅ Concluído | [→](#7-página-de-listagem-de-tratamentos) |
| 8 | Breadcrumb Schema.org na home | 🟢 Baixo | Baixo | ✅ Concluído | [→](#8-breadcrumb-schemaorg-na-home) |
| 9 | Micro-interações CSS | 🟢 Baixo | Baixo | ✅ Concluído | [→](#9-micro-interações-css) |

---

## 1. Página "Primeira Consulta"

### Por que importa
A ansiedade pré-visita é o maior "killer invisível" de conversão em odontologia. Pacientes que nunca foram ao consultório querem saber o que esperar. Uma página dedicada reduz fricção e aumenta agendamentos.

### O que implementar
Criar `/primeira-consulta/index.html` com:

- **O que esperar** — duração, etapas da consulta, se há dor
- **O que trazer** — documentos, exames anteriores, carteirinha do plano
- **Como funciona o atendimento** — humanizado, sem julgamento
- **Formas de pagamento** — PIX, cartão, planos (Clin/Unidentis)
- **Horários disponíveis** — seg-sex 8h-12h/14h-18h, sáb 8h-13h
- **CTA final** — botão WhatsApp para agendar

### Schema.org sugerido
```json
{
  "@type": "MedicalWebPage",
  "name": "Primeira Consulta — Dra. Jaqueline Sayonara",
  "about": { "@type": "MedicalProcedure", "name": "Consulta Odontológica" },
  "mainContentOfPage": { "@type": "WebPageElement", "cssSelector": ".treatment-content" }
}
```

### SEO
- Title: `Primeira Consulta | Dentista em Sapé PB | Dra. Jaqueline Sayonara`
- Meta description: `Saiba o que esperar na sua primeira consulta odontológica com a Dra. Jaqueline Sayonara em Sapé/PB. Atendimento humanizado, sem dor. Agende pelo WhatsApp.`
- URL: `/primeira-consulta/`

---

## 2. Páginas de Área de Atendimento

### Por que importa
Captura buscas como "dentista em Mari", "ortodontista Cruz do Espírito Santo", "clareamento dental Sobrado". Cada página é uma porta de entrada orgânica nova.

### Cidades prioritárias (raio de ~30km de Sapé)
1. **Mari** (~15km)
2. **Sobrado** (~18km)
3. **Cruz do Espírito Santo** (~12km)
4. **Riachão do Poço** (~20km)
5. **Pilar** (~25km)
6. **Caldas Brandão** (~22km)

### Estrutura de cada página
Criar `/atendimento/[cidade]/index.html` com:

```
├── atendimento/
│   ├── mari/index.html
│   ├── sobrado/index.html
│   ├── cruz-do-espirito-santo/index.html
│   ├── riachao-do-poco/index.html
│   ├── pilar/index.html
│   └── caldas-brandao/index.html
```

### Conteúdo de cada página
- H1: `Dentista para moradores de [Cidade] — Dra. Jaqueline Sayonara`
- Texto sobre distância e facilidade de acesso
- Menção aos tratamentos disponíveis
- Informações de como chegar (com link Google Maps)
- Depoimento de paciente da cidade (se houver)
- CTA WhatsApp

### Schema.org
```json
{
  "@type": "Dentist",
  "areaServed": {
    "@type": "City",
    "name": "[Cidade]",
    "containedInPlace": { "@type": "State", "name": "Paraíba" }
  }
}
```

### Importante
- NÃO usar conteúdo duplicado — cada página deve ter texto único
- Incluir no sitemap.xml
- Linkar internamente a partir da home e páginas de tratamento

---

## 3. Expandir areaServed no Schema.org

### Estado atual
```json
"areaServed": {
  "@type": "City",
  "name": "Sapé",
  "containedInPlace": { "@type": "State", "name": "Paraíba" }
}
```

### Implementação sugerida
```json
"areaServed": [
  { "@type": "City", "name": "Sapé" },
  { "@type": "City", "name": "Mari" },
  { "@type": "City", "name": "Sobrado" },
  { "@type": "City", "name": "Cruz do Espírito Santo" },
  { "@type": "City", "name": "Riachão do Poço" },
  { "@type": "City", "name": "Pilar" },
  { "@type": "City", "name": "Caldas Brandão" }
]
```

### Esforço
Alteração de ~10 linhas no `index.html`. Pode ser feita em 5 minutos.

---

## 4. Seção FAQ na Página Principal

### Por que importa
FAQ com Schema.org na home page gera rich snippets no Google e é priorizado por AI Overviews (ChatGPT, Perplexity, Google AI). As páginas de tratamento já têm FAQ — falta na home.

### Perguntas sugeridas (baseadas em buscas reais)
1. "Quais planos odontológicos a Dra. Jaqueline aceita?"
2. "Qual o horário de atendimento do consultório em Sapé?"
3. "A Dra. Jaqueline atende emergências?"
4. "Como agendar uma consulta?"
5. "Quais tratamentos estão disponíveis?"
6. "O consultório atende crianças?"

### Implementação HTML
```html
<section id="faq" class="fade-in">
  <div>
    <h2 class="section-title">Perguntas Frequentes</h2>
    <div class="faq-container">
      <details>
        <summary>Quais planos odontológicos são aceitos?</summary>
        <p>Atendemos pelos planos Clin e Unidentis. Também aceitamos particular com pagamento via PIX, cartão de crédito/débito e dinheiro.</p>
      </details>
      <!-- demais perguntas -->
    </div>
  </div>
</section>
```

### Schema.org (adicionar ao JSON-LD existente ou como bloco separado)
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Quais planos odontológicos a Dra. Jaqueline aceita?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Atendemos pelos planos Clin e Unidentis. Também aceitamos particular com pagamento via PIX, cartão de crédito/débito e dinheiro."
      }
    }
  ]
}
```

---

## 5. Slider Interativo Antes/Depois

### Por que importa
Sliders antes/depois geram 3-5x mais engagement que carrossel estático em serviços estéticos. O usuário interage arrastando para comparar os resultados.

### Implementação (CSS + JS vanilla)
Usar `<input type="range">` sobre duas imagens sobrepostas:

```html
<div class="compare-slider" role="img" aria-label="Comparação antes e depois de clareamento dental">
  <div class="compare-before">
    <img src="antes.webp" alt="Antes do clareamento">
  </div>
  <div class="compare-after">
    <img src="depois.webp" alt="Depois do clareamento">
  </div>
  <input type="range" min="0" max="100" value="50" class="compare-handle"
         aria-label="Arraste para comparar antes e depois">
</div>
```

```css
.compare-slider {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
}
.compare-before {
  position: absolute;
  inset: 0;
  clip-path: inset(0 50% 0 0); /* controlado via JS */
}
.compare-handle {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: col-resize;
  z-index: 10;
}
```

### Onde usar
- Substituir ou complementar o carousel na seção de resultados
- Pode coexistir: carousel para navegar entre casos, slider para comparar um caso específico (no lightbox)

### Acessibilidade
- `role="img"` + `aria-label` descritivo
- Input range acessível por teclado
- Labels "Antes" e "Depois" visíveis

---

## 6. Conteúdo Otimizado para AI (GEO)

### Por que importa
Google AI Overviews, ChatGPT e Perplexity estão respondendo cada vez mais buscas de saúde. Sites com conteúdo bem estruturado são citados como fonte. Isso é chamado de **Generative Engine Optimization (GEO)**.

### Técnicas a implementar (sem dependência externa)

#### 6.1. Parágrafos "citáveis"
Cada página de tratamento deve ter um parágrafo de 2-3 frases que responda diretamente à busca principal:

```html
<!-- Bom para AI citation -->
<p class="treatment-summary">
  O clareamento dental é um procedimento estético que clareia os dentes em até 3 tons 
  em uma única sessão. No consultório da Dra. Jaqueline Sayonara em Sapé/PB, o 
  procedimento dura aproximadamente 1 hora e utiliza gel à base de peróxido de hidrogênio 
  com ativação por luz LED.
</p>
```

#### 6.2. Dados estruturados de procedimento
Adicionar `MedicalProcedure` mais detalhado:
```json
{
  "@type": "MedicalProcedure",
  "name": "Clareamento Dental",
  "procedureType": "http://schema.org/CosmeticProcedure",
  "howPerformed": "Aplicação de gel clareador com ativação por luz LED",
  "preparation": "Avaliação clínica e profilaxia prévia",
  "followup": "Evitar alimentos com corantes por 48h"
}
```

#### 6.3. Tabelas comparativas
AI engines adoram tabelas — fáceis de parsear e citar:
```html
<table>
  <caption>Comparativo de tipos de clareamento</caption>
  <thead>
    <tr><th>Tipo</th><th>Duração</th><th>Resultados</th></tr>
  </thead>
  <tbody>
    <tr><td>Consultório (LED)</td><td>1 sessão (1h)</td><td>Até 3 tons</td></tr>
    <tr><td>Caseiro (moldeira)</td><td>2-3 semanas</td><td>Até 2 tons</td></tr>
  </tbody>
</table>
```

---

## 7. Página de Listagem de Tratamentos

### Estado atual
Existe `/tratamentos/index.html` mas precisa funcionar como hub de conteúdo.

### Melhorias
- Adicionar Schema.org `ItemList` com os 7 tratamentos
- Incluir breve descrição de cada (2-3 linhas)
- Linkar para cada página individual
- Adicionar breadcrumb: Home > Tratamentos

### Schema.org
```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Tratamentos Odontológicos — Dra. Jaqueline Sayonara",
  "numberOfItems": 7,
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "url": "/tratamentos/aparelho-ortodontico/" },
    { "@type": "ListItem", "position": 2, "url": "/tratamentos/clareamento-dental/" }
  ]
}
```

---

## 8. Breadcrumb Schema.org na Home

### Estado atual
Breadcrumbs estão implementados nas páginas de tratamento. Falta o Schema.org `BreadcrumbList` na home.

### Implementação
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Início", "item": "https://www.drajaquelinesayonara.com.br/" }
  ]
}
```

Nas páginas de tratamento:
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Início", "item": "https://www.drajaquelinesayonara.com.br/" },
    { "@type": "ListItem", "position": 2, "name": "Tratamentos", "item": "https://www.drajaquelinesayonara.com.br/tratamentos/" },
    { "@type": "ListItem", "position": 3, "name": "Clareamento Dental", "item": "https://www.drajaquelinesayonara.com.br/tratamentos/clareamento-dental/" }
  ]
}
```

---

## 9. Micro-interações CSS

### Pequenos detalhes que elevam a percepção de qualidade

#### 9.1. Scroll progress bar
```css
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: var(--logo-pallete-velvety-cherry);
  z-index: 9999;
  width: 0%;
  transition: width 100ms;
}
```

#### 9.2. Animação de contagem no hero (avaliações)
```js
// Contador animado: "5.0 · 7 avaliações" com contagem progressiva
function animateCounter(el, target) {
  let current = 0;
  const step = target / 30;
  const interval = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(interval); }
    el.textContent = Math.floor(current);
  }, 50);
}
```

#### 9.3. Hover com ripple nos botões CTA
Efeito de onda ao clicar — melhora feedback tátil em mobile.

---

## Ordem de Implementação Recomendada

```
Semana 1:  ✅ #3 (areaServed) + #4 (FAQ home) + #8 (Breadcrumb Schema)
Semana 2:  ✅ #1 (Página Primeira Consulta)
Semana 3:  ✅ #6 (Conteúdo GEO nas páginas existentes)
Semana 4:  ✅ #2 (Páginas de área - Mari, Sobrado, Cruz do Espírito Santo)
Semana 5:  ✅ #5 (Slider antes/depois)
Semana 6:  ✅ #2 (Páginas de área - Riachão do Poço, Pilar, Caldas Brandão) + #7 (Listagem) + #9 (Micro-interações)
```

---

## Histórico de Implementação

### 22/07/2026 — Semanas 5 e 6 implementadas (PLANO COMPLETO ✅)

**Semana 5 — Slider Antes/Depois:**
- Componente `compare-slider` com CSS puro + JS vanilla
- Drag via pointer events (touch + mouse), input range como fallback acessível
- Labels "Antes"/"Depois" visíveis, `role="img"` + `aria-label`
- Respeita `prefers-reduced-motion`
- Seção inserida entre Resultados e Planos na home
- CSS em `/assets/css/compare-slider.css`

**Semana 6 — Páginas de área + Listagem + Micro-interações:**
- `/atendimento/riachao-do-poco/` — 20km, ~20min, PB-041 via Sobrado
- `/atendimento/pilar/` — 25km, ~25min, PB-041/PB-030
- `/atendimento/caldas-brandao/` — 22km, ~22min, PB-054/PB-041
- Cada página com conteúdo único, Schema.org, direções, links internos
- `/tratamentos/index.html` melhorada com descrições em cada card + ItemList Schema.org
- Micro-interações: scroll progress bar (3px fixa no topo), ripple effect nos CTAs
- CSS em `/assets/css/micro-interactions.css`
- URLs adicionadas ao sitemap.xml

**Páginas indexáveis adicionadas:** 3 (cidades restantes)
**Total de páginas indexáveis:** ~17

---

### 21/07/2026 — Semanas 1 a 4 implementadas

**Semana 1 — Schema.org + FAQ + Breadcrumb:**
- `areaServed` expandido para 7 cidades no JSON-LD da home
- Seção FAQ com 6 perguntas + FAQPage Schema.org (rich snippets)
- BreadcrumbList Schema.org na home

**Semana 2 — Página Primeira Consulta:**
- `/primeira-consulta/index.html` criada com conteúdo completo
- Schema.org MedicalWebPage + BreadcrumbList + FAQPage
- Imagem profissional da Dra. em atendimento (WebP, 56KB)
- Link interno no CTA final da home
- URL adicionada ao sitemap.xml

**Semana 3 — Conteúdo GEO (7 páginas de tratamento):**
- Parágrafo `.treatment-summary` citável em cada página
- MedicalProcedure enriquecido com `howPerformed`, `preparation`, `followup`
- Tabela comparativa em cada página (fácil de parsear por AI)
- CSS para `.treatment-summary` e `table` (light/dark mode)

**Semana 4 — Páginas de área (3 cidades):**
- `/atendimento/mari/` — 15km, ~15min
- `/atendimento/sobrado/` — 18km, ~20min
- `/atendimento/cruz-do-espirito-santo/` — 12km, ~12min
- Cada página com conteúdo único, Schema.org, direções, links internos para tratamentos
- Footer da home atualizado com coluna "Atendemos em"
- URLs adicionadas ao sitemap.xml

**Páginas indexáveis adicionadas:** 4 (primeira-consulta + 3 cidades)  
**Total estimado de páginas indexáveis:** ~14 (era ~10)

---

## Métricas de Sucesso

| Métrica | Antes | Atual (jul/2026) | Meta (3 meses) |
|---------|-------|-------------------|-----------------|
| Páginas indexadas | ~10 | ~17 | 18-20 |
| Palavras-chave ranqueadas | ~5-10 | aguardando indexação | 30-50 |
| Impressões Google (Search Console) | baseline | aguardando dados | +100% |
| Cliques orgânicos | baseline | aguardando dados | +50% |
| Rich snippets ativos | 1 (Dentist) | 4 (Dentist, FAQ, Breadcrumb, ItemList) | 4+ |
| Citações em AI (ChatGPT/Perplexity) | 0 | aguardando dados | 2-3 buscas locais |

---

## Contexto Competitivo (21/07/2026)

> Análise completa em [`IMPROVEMENT_PLAN.md`](./IMPROVEMENT_PLAN.md#análise-competitiva-21072026)

**Concorrente direto:** Dr. Raphael Galvão (drraphaelgalvao.com.br) — mesma rua em Sapé.

### Nosso site vs. Dr. Raphael

| Critério | Resultado |
|----------|-----------|
| Conteúdo por tratamento | 🏆 Nós (10-20x mais conteúdo) |
| Schema.org | 🏆 Nós (5+ tipos vs. básico) |
| SEO local (cidades) | 🏆 Nós (3 páginas, ele 0) |
| Performance | 🏆 Nós (97 vs. ~75 estimado) |
| Acessibilidade | 🏆 Nós (100/100) |
| Avaliações Google | ❌ Ele (100+ vs. 7) |
| Tracking de conversão | ❌ Ele (utm params nos CTAs) |
| Nº de serviços | ❌ Ele (8 vs. 7) |

**Prioridade derivada:** Coletar avaliações Google é a ação de maior impacto imediato para competir no Local Pack. Detalhes no IMPROVEMENT_PLAN.md Fase 5.
