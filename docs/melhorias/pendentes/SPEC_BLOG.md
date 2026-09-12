# Spec: Blog de Saúde Bucal (integração + expansão)

> **Data:** 2026-09-05
> **Status:** Proposta (aguardando aprovação)
> **Autor:** Tarcio Silva (via agente)
> **Escopo:** repo_site — nova seção `/blog/`
> **Metodologia:** SDD (Spec-Driven Development) — ver `.ai/ARCHITECTURE.md §3`

---

## 1. Contexto

### Por que essa feature existe?
O site institucional da Dra. Jaqueline Sayonara ranqueia hoje para buscas de **marca**
e **serviço local** (ex.: "dentista Sapé PB", "prótese dentária Sapé"). Falta uma camada
de conteúdo **informacional** que capture buscas de topo/meio de funil ("por que meu dente
dói", "clareamento dental funciona?", "como tratar gengivite"). Esse tráfego:
- é volumoso e recorrente (dúvidas de saúde bucal são pesquisadas o ano todo);
- atrai potenciais pacientes **antes** de decidirem tratar;
- fortalece a autoridade tópica (E-E-A-T) do domínio aos olhos do Google, o que
  também ajuda as páginas de tratamento a ranquearem melhor.

### Qual problema resolve?
1. **Página órfã:** já existe 1 artigo (`/blog/protese-dentaria-autoestima-saude/`) commitado,
   mas **sem listagem `/blog/`, sem link de entrada, sem sitemap** — inacessível por navegação
   e invisível ao Google. O breadcrumb e o Schema.org do artigo já apontam para `/blog/`
   (que não existe) → **link quebrado**.
2. **Ausência de funil de conteúdo:** o site só tem páginas transacionais/locais.

### Quem são os usuários afetados?
- **Visitante/paciente potencial** — busca dúvidas de saúde bucal no Google e chega ao artigo.
- **Dra. Jaqueline** — ganha canal de autoridade e captação; não opera o blog (conteúdo é
  publicado por dev, site estático).
- **Dev (mantenedor)** — precisa de um fluxo simples e repetível para publicar artigos.

---

## 2. Pesquisa de palavras-chave (base de conteúdo)

> ⚠️ **[INCERTEZA] — Dados a validar.** Este ambiente não possui ferramenta de busca web ao
> vivo, então os volumes/dificuldade abaixo são **estimativas qualitativas** baseadas em
> padrões consolidados de intenção de busca em odontologia no Brasil, **não** números medidos.
> **Antes de decisão final de pauta, validar no Google Keyword Planner, Google Search Console
> (relatório de Desempenho → Consultas) e/ou Ubersuggest/SEMrush.** O Search Console é a fonte
> mais valiosa: mostra para o que o próprio site já recebe impressões.

### 2.1 Método recomendado de validação (para o usuário rodar)
1. **Search Console → Desempenho → Consultas** (últimos 12 meses): ver que dúvidas já geram
   impressão sem clique (oportunidade de conteúdo).
2. **Keyword Planner** (segmentado Brasil / região Paraíba): volume + concorrência.
3. **Google autocomplete + "As pessoas também perguntam"** para as sementes abaixo.

### 2.2 Sementes por eixo temático (intenção informacional)
Eixos priorizados por (a) demanda percebida, (b) fit com os tratamentos ofertados, (c) chance
de ranquear (dificuldade menor em cauda longa + reforço local Sapé/PB).

| Eixo | Sementes de busca (cauda curta → longa) | Intenção | Fit com tratamento |
|------|------------------------------------------|----------|--------------------|
| **Clareamento** | clareamento dental; clareamento dental funciona; clareamento dental caseiro é seguro; quanto tempo dura o clareamento; clareamento dental dói | Informacional/comercial | ✅ clareamento-dental |
| **Limpeza / prevenção** | limpeza dental (profilaxia); de quanto em quanto tempo fazer limpeza; limpeza dental dói; tártaro como remover | Informacional | ✅ profilaxia |
| **Doenças bucais** | gengivite; sangramento na gengiva; mau hálito causas; cárie como tratar; periodontite | Informacional (dor/sintoma) | ✅ restauração / profilaxia |
| **Prótese** | prótese dentária (JÁ PUBLICADO); ponte fixa x protocolo; prótese dói | Informacional/comercial | ✅ protese-dentaria |
| **Ortodontia** | aparelho dói; aparelho transparente vale a pena; quanto tempo de aparelho | Informacional/comercial | ✅ aparelho-ortodontico |
| **Estética** | facetas de resina x porcelana; lente de contato dental preço | Comercial | ✅ facetas-dentarias |
| **Siso / extração** | siso precisa arrancar; recuperação extração de siso | Informacional | ✅ exodontia |
| **Hábitos/rotina** | como escovar os dentes corretamente; fio dental antes ou depois de escovar | Informacional (topo) | genérico |

### 2.3 Observações de SEO
- **Cauda longa vence:** perguntas específicas ("clareamento dental caseiro é seguro?") têm
  menos concorrência e casam com blocos FAQ (rich result `FAQPage`).
- **Sinal local:** amarrar cada artigo a "Sapé/PB" e à página de tratamento correspondente
  (link interno) aproveita a autoridade local já existente.
- **Sem canibalização:** o artigo deve responder a **dúvida** (informacional); a página de
  tratamento continua sendo a **transacional**. Linkar um ao outro, não competir.

---

## 3. Proposta de conteúdo inicial — 3 artigos

Critério de escolha: cobrir 3 eixos de alta demanda distintos (não só um), cada um com
dúvida clara (bom para `FAQPage`), fit com tratamento ofertado (link interno) e sem
canibalizar as páginas de tratamento existentes.

| # | Slug proposto | Título de trabalho | Eixo | Palavra-chave alvo (validar) | Tratamento vinculado |
|---|---------------|--------------------|------|------------------------------|----------------------|
| 1 | `clareamento-dental-vale-a-pena` | Clareamento Dental Vale a Pena? Tipos, Duração e Cuidados | Clareamento | "clareamento dental funciona / vale a pena" | clareamento-dental |
| 2 | `limpeza-dental-importancia-frequencia` | Limpeza Dental: Por Que Fazer e De Quanto em Quanto Tempo | Limpeza/prevenção | "limpeza dental / de quanto em quanto tempo" | profilaxia |
| 3 | `gengivite-sintomas-tratamento` | Gengivite: Sintomas, Causas e Como Tratar a Tempo | Doenças bucais | "gengivite / sangramento na gengiva" | profilaxia + restauração |

> Já publicado (a integrar): `protese-dentaria-autoestima-saude` (eixo Prótese).
> Total do blog após esta iteração: **4 artigos + 1 listagem**.

### Estrutura editorial de cada artigo (obrigatória)
- 1 `<h1>` (título) — **apenas um por página** (ver EC-01).
- Parágrafo-resumo (`treatment-summary`).
- 3–5 seções `<h2>` com `<h3>` quando necessário (hierarquia sem pular nível).
- 1 tabela comparativa OU lista de benefícios (quando fizer sentido).
- Bloco **FAQ** (`<details>`) com 3–4 perguntas → alimenta `FAQPage` no Schema.
- CTA WhatsApp + seção "Leia também" (link para a página de tratamento + 2 artigos).
- **Aviso:** conteúdo informativo, não substitui consulta (nota de responsabilidade).
- Tom: acolhedor, linguagem simples, PT-BR, sem promessa de resultado/preço fixo (ética CFO).

---

## 4. Requisitos Funcionais

- **RF-01:** Deve existir a página de listagem `/blog/index.html` acessível, listando todos os
  artigos publicados em cards (padrão visual `related-card`, igual a `/tratamentos/`).
- **RF-02:** Deve existir um template reutilizável `blog/_template.html` com placeholders
  `{{...}}` para novos artigos (espelhando `tratamentos/_template.html`).
- **RF-03:** O blog deve ser alcançável por navegação a partir de qualquer página: link "Blog"
  no menu desktop (`header-nav-links`) e no menu mobile (`offcanva-nav`).
- **RF-04:** O `sitemap.xml` deve incluir `/blog/` e a URL de cada artigo publicado.
- **RF-05:** O pipeline de build (`update-inline-css.sh` e `scripts/build.js`) deve reconhecer
  a pasta `blog/` (inline de CSS + validação de `<style>`).
- **RF-06:** Devem ser criados os 3 artigos da §3, cada um seguindo a estrutura editorial.
- **RF-07:** Cada artigo e a listagem devem ter Schema.org válido:
  listagem = `Blog` + `ItemList` + `BreadcrumbList`; artigo = `BlogPosting` + `BreadcrumbList`
  + `FAQPage` (quando houver FAQ).
- **RF-08:** Data de publicação/atualização visível no artigo (não só no Schema).

## 5. Requisitos Não-Funcionais

- **RNF-01:** Lighthouse ≥ 95 nas 4 categorias em cada página nova (meta do repo; a11y alvo 100).
- **RNF-02:** Zero JavaScript de runtime novo (progressive enhancement — usa o `main.js` atual).
- **RNF-03:** CSS crítico inline (mesmo pipeline); nenhuma classe `!important` nova.
- **RNF-04:** Todas as imagens em WebP, com `width`/`height` explícitos e `loading="lazy"`
  (exceto hero). Hero ≤ 200KB.
- **RNF-05:** Breakpoints exatos do repo: mobile `max-width:1199px`, desktop `min-width:1200px`
  (nunca `1200px` em max-width).
- **RNF-06:** Canonical sempre com `www.`; trailing slash nas URLs.
- **RNF-07:** Nenhuma regressão nos testes existentes (`npm test`).

## 6. Interface (estrutura de arquivos e navegação)

```
blog/
  index.html                                  ← listagem (RF-01)  [bundle: home]
  _template.html                              ← template p/ artigos (RF-02) [bundle: treatment]
  protese-dentaria-autoestima-saude/index.html  (já existe — reprocessar no pipeline)
  clareamento-dental-vale-a-pena/index.html   ← novo (RF-06) [bundle: treatment]
  limpeza-dental-importancia-frequencia/index.html   ← novo (RF-06)
  gengivite-sintomas-tratamento/index.html    ← novo (RF-06)
```

Imagens: reutilizar `assets/img/care/*.webp` quando possível (clareamento, profilaxia);
para gengivite, avaliar imagem existente ou criar `assets/img/blog/<slug>.webp`.

### Decisão de CSS bundle (a confirmar — ver §9)
- **Listagem** `/blog/`: usa **bundle home** (`styles.min.css`), pois não usa componentes
  exclusivos de tratamento além de `related-card` (que está no bundle home também). ⚠️ verificar
  se `related-card` está no bundle home ou só no treatment.
- **Artigos**: usam **bundle treatment** (`styles-treatment.min.css`), pois reaproveitam
  `treatment-hero`, `treatment-content`, `treatment-faq`, `related-treatments`.
- O `update-inline-css.sh` decide o bundle por caminho (`/tratamentos/` → treatment). Precisa
  de regra nova para `/blog/` (artigos → treatment; `blog/index.html` → home).

### Navegação (link "Blog")
- Desktop `header-nav-links`: adicionar `<li><a class="header-link" href="/blog/"><span>Blog</span></a></li>`.
- Mobile `offcanva-nav`: adicionar item com ícone SVG inline (padrão dos demais).
- Aplicar em **todas** as páginas: `index.html`, `tratamentos/index.html`,
  `tratamentos/*/index.html` (7), `atendimento/*/index.html` (6), `primeira-consulta/index.html`,
  `blog/*` — total ~17 arquivos.

---

## 7. Edge Cases

- **EC-01 (dois H1):** o `tratamentos/_template.html` tem `<h1 class="sr-only">` no `<header>`
  **e** `<h1>` no hero → viola "1 H1 por página" e o teste `apenas um H1 na página`.
  O artigo de blog atual (bom) tem **só 1 H1** (no hero). **Decisão:** template do blog terá
  **apenas 1 H1** (no hero). Não copiar o `sr-only` h1 do template de tratamento.
- **EC-02 (link quebrado atual):** `/blog/` referenciado pelo artigo mas inexistente → RF-01
  resolve. Garantir que nenhum link do blog aponte para rota inexistente.
- **EC-03 (canibalização):** artigo "clareamento" x página tratamento "clareamento-dental" →
  intenção diferente (dúvida vs serviço); linkar mutuamente, não repetir title/description.
- **EC-04 (CSS drift):** artigo atual foi colado à mão com bundle treatment; ao entrar no
  pipeline o conteúdo do `<style>` será regenerado — validar que continua idêntico (o
  `update-inline-css.sh` substitui tudo entre `<style>…</style>`).
- **EC-05 (data hardcoded):** rodapé "2025 ©" em todas as páginas; artigo publicado em 2026.
  Fora do escopo corrigir o footer global aqui, mas registrar como débito.
- **EC-06 (JSON-LD inválido):** vírgula sobrando / campo faltando quebra rich result → validar
  cada JSON-LD com `JSON.parse` (teste automatizado, RF-07).
- **EC-07 (meta description fora de faixa):** teste de SEO exige 120–160 chars na home; aplicar
  a mesma faixa aos artigos para consistência (evita truncamento no Google).

## 8. Critérios de Aceite

- [ ] **CA-01:** Dado um visitante em qualquer página, quando clica em "Blog" no menu, então
      chega em `/blog/` com a lista de artigos.
- [ ] **CA-02:** Dada a listagem `/blog/`, quando clica em um card, então abre o artigo correto.
- [ ] **CA-03:** Dado cada artigo, quando abre, então tem exatamente 1 `<h1>`, breadcrumb,
      FAQ, CTA WhatsApp, "Leia também" com link para a página de tratamento, e data visível.
- [ ] **CA-04:** Dado o `sitemap.xml`, então contém `/blog/` + as 4 URLs de artigo, XML válido.
- [ ] **CA-05:** Dado `npm run build`, então o CSS inline das páginas de blog é validado sem erro.
- [ ] **CA-06:** Dado `npm test`, então todos os testes passam (incluindo novos testes de blog).
- [ ] **CA-07:** Dado cada JSON-LD de blog, então é JSON válido e do `@type` esperado.
- [ ] **CA-08:** Dado Lighthouse em `/blog/` e num artigo, então as 4 categorias ficam ≥ 95.
- [ ] **CA-09:** Nenhum link interno do blog aponta para rota 404.

## 9. Decisões em aberto (precisam de confirmação)

- **DA-01 (bundle da listagem):** confirmar se `related-card`/`related-grid` existe no bundle
  **home** — se não, a listagem `/blog/` usa bundle treatment. (Verificação técnica, não de UX.)
- **DA-02 (link no menu global):** adicionar "Blog" em ~17 páginas altera a navegação de todo
  o site. Confirmar rótulo ("Blog" vs "Artigos") e posição no menu.
- **DA-03 (seção "Do blog" na home):** opcional — incluir um teaser de artigos na home
  (aumenta descoberta e linkagem interna). Sim/não nesta iteração?
- **DA-04 (imagens):** reusar `assets/img/care/*` nos artigos de clareamento/limpeza; para
  gengivite, criar imagem nova? (afeta peso e produção de asset).
- **DA-05 (commits pendentes):** os 2 commits do artigo existente têm autor `you@example.com`
  e mensagem em inglês fora do Conventional Commits. Reescrever história local (não pushada)
  antes do push? (seguro, pois não foi publicado).

## 10. Fora de Escopo (desta iteração)

- CMS / geração automática de listagem (site é estático; listagem editada à mão por ora).
- Sistema de categorias/tags, paginação, busca no blog, RSS.
- Comentários, compartilhamento social dinâmico.
- Correção do ano hardcoded no footer global (registrar como débito — EC-05).
- Artigos além dos 3 propostos.

## 11. Plano de tasks (SDD → implementação incremental)

> Ordem: fundação (template/listagem/build) → navegação → conteúdo → SEO → testes → review.
> 1 task = 1 mudança coesa. CI (`npm test` + build) roda ao fim de cada bloco.

- **T1 — Fundação:** criar `blog/_template.html` (1 H1, Schema BlogPosting+Breadcrumb+FAQ) +
  `blog/index.html` (listagem com 1 card do artigo atual, Schema Blog+ItemList).
- **T2 — Build pipeline:** atualizar `update-inline-css.sh` e `scripts/build.js` para conhecer
  `blog/` (regra de bundle: artigos→treatment, listagem→home). Reprocessar o artigo existente.
- **T3 — Navegação:** adicionar link "Blog" ao menu desktop + offcanva em todas as páginas.
- **T4 — Conteúdo (3 artigos):** criar os 3 artigos da §3 a partir do template. 1 commit por
  artigo. Atualizar cards da listagem + "Leia também".
- **T5 — SEO:** atualizar `sitemap.xml` (listagem + 4 artigos); atualizar `INDEXACAO_MANUAL.md`.
- **T6 — Testes:** criar `tests/integration/blog.test.js` (a11y, SEO, JSON-LD, 1 H1, links).
- **T7 — Review + verificação:** rodar `npm test`, build, self-review; multi-agent review
  (>3 arquivos + navegação global). Atualizar docs. Corrigir commits pendentes (DA-05).

## 12. Rastreabilidade

- Steering: `repo-site` skill (breakpoints, bundles, SEO www, Lighthouse ≥95, 1 H1).
- Débito registrado: EC-05 (footer year).
- Relacionado: `INDEXACAO_MANUAL.md` (adicionar novas URLs à fila do Search Console).
