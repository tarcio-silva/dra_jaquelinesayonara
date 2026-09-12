# Spec: Reformulação da Navegação (arquitetura de informação)

> **Data:** 2026-09-05
> **Status:** Aprovada (direção) — pronta para implementação
> **Autor:** Tarcio Silva (via agente)
> **Escopo:** repo_site — header (desktop) + offcanva (mobile), todas as ~17 páginas
> **Metodologia:** SDD (`.ai/ARCHITECTURE.md §3`)
> **Pré-requisito de:** `SPEC_BLOG.md` (o link "Blog" depende desta reformulação)

---

## 1. Contexto

### Problema
O menu atual é **idêntico em todas as páginas** e mistura dois modelos de navegação:
- **Âncoras da home** (`/#about`, `/#care`, `/#results`, `/#plans`, `/#location`) — só fazem
  sentido na home;
- **Páginas reais** (`/tratamentos/`, `/blog/`, `/primeira-consulta/`, `/atendimento/*`) —
  algumas nem aparecem no menu.

Consequências (heurísticas de Nielsen violadas):
- **Rótulo mente sobre destino:** "Tratamentos" leva a `/#care` (seção da home), não à página
  `/tratamentos/` que existe e ranqueia.
- **Âncoras fora da home** forçam navegação de página inteira + scroll.
- **Inconsistência desktop×mobile:** mobile tem "Primeira Consulta", desktop não.
- **Páginas órfãs de navegação:** `/atendimento/*` (6 cidades), `/primeira-consulta/`, e agora
  `/blog/` não são alcançáveis pelo menu desktop.

### Decisão de direção (aprovada pelo usuário)
- **Opção A** — navegação global orientada a **páginas reais**; âncoras da home viram
  **sub-navegação** local da home.
- **"Atendimento"** = **dropdown** com as 6 cidades (não há página index de atendimento).
- **Âncoras da home** (Sobre/Resultados/Planos/Localização) = **sub-navegação** (barra
  secundária exibida apenas na home), preservando o scroll-spy.
- **Idioma:** tudo em **PT-BR**.

---

## 2. Arquitetura de Informação proposta

### 2.1 Navegação primária (global — todas as páginas)
Orientada a destinos que são URLs reais:

```
Início  ·  Tratamentos  ·  Blog  ·  Atendimento ▾  ·  Primeira Consulta        [Agendar]
  /        /tratamentos/   /blog/    (dropdown)        /primeira-consulta/       (WhatsApp)
```

- **Início** → `/`
- **Tratamentos** → `/tratamentos/`
- **Blog** → `/blog/`
- **Atendimento ▾** → dropdown com as 6 cidades:
  Mari, Sobrado, Cruz do Espírito Santo, Pilar, Riachão do Poço, Caldas Brandão
  (cada `→ /atendimento/<slug>/`)
- **Primeira Consulta** → `/primeira-consulta/`
- **Agendar** (botão CTA, mantém `btn-header-cta`) → WhatsApp

Rótulos definitivos em PT-BR: `Início`, `Tratamentos`, `Blog`, `Atendimento`,
`Primeira Consulta`, `Agendar`.

### 2.2 Sub-navegação (apenas na home)
As âncoras de seção deixam de poluir o menu global e passam a compor uma **barra de
sub-navegação exibida somente na home**, logo abaixo do header (sticky secundário) OU dentro
do menu apenas quando na home (ver DA-01). Itens (PT-BR):

```
Sobre  ·  Tratamentos  ·  Resultados  ·  Planos  ·  Localização
#about     #care          #results       #plans     #location
```

- Mantém o `IntersectionObserver` de seção ativa (scroll-spy) já existente em `main.js`.
- ⚠️ "Tratamentos" aqui é a **seção** `#care` da home; o item global "Tratamentos" é a
  **página** `/tratamentos/`. Para não repetir rótulo idêntico com destinos diferentes,
  renomear a âncora da home para **"Nossos Serviços"** (`#care`) — desambiguação (EC-03).

### 2.3 Estado "ativo"
- **Primária:** item ativo = página atual (ex.: em `/blog/...`, "Blog" fica `.active`).
  Como é site estático, marcar `.active` no HTML de cada página (server-side manual), não via JS.
- **Sub-nav (home):** item ativo = seção visível (scroll-spy JS, como hoje).

---

## 3. Requisitos Funcionais

- **RF-01:** Menu primário (desktop + offcanva) idêntico em conteúdo entre os dois breakpoints,
  em todas as ~17 páginas, com os itens da §2.1.
- **RF-02:** "Atendimento" abre um dropdown (desktop) / grupo expansível (offcanva) com as 6
  cidades, cada uma linkando para `/atendimento/<slug>/`.
- **RF-03:** O dropdown deve ser **acessível**: abre por clique/Enter/Espaço, fecha por Esc e
  clique-fora, `aria-expanded`, `aria-controls`, navegação por teclado nos itens, foco visível.
- **RF-04:** O item da página atual recebe estado `.active` (`aria-current="page"`).
- **RF-05:** Na **home**, exibir a sub-navegação (§2.2) com scroll-spy preservado. Fora da home,
  a sub-nav **não** é renderizada.
- **RF-06:** Offcanva mantém focus-trap, backdrop, swipe-to-close, `inert` no main e aria-live
  (comportamento atual de `main.js` não pode regredir).
- **RF-07:** O CTA "Agendar" (WhatsApp) permanece acessível em ambos os breakpoints.

## 4. Requisitos Não-Funcionais

- **RNF-01:** Zero dependência de runtime nova. Dropdown implementado em CSS + JS vanilla
  mínimo, reaproveitando padrões de `main.js`.
- **RNF-02:** Sem regressão de Lighthouse (≥95 nas 4 categorias); a11y alvo 100.
- **RNF-03:** Breakpoints exatos: mobile `max-width:1199px`, desktop `min-width:1200px`.
- **RNF-04:** Sem `!important` novo; CSS nos módulos fonte (`assets/css/`), rebuild via pipeline.
- **RNF-05:** Progressive enhancement — sem JS, o dropdown deve degradar (ver EC-01): os links
  das cidades continuam acessíveis (ex.: `:focus-within`/`:hover` CSS ou fallback de lista).
- **RNF-06:** Marcação idêntica reaplicada às ~17 páginas (consistência; sem drift).

## 5. Interface

### 5.1 Desktop — `header-nav-links` (novo)
```html
<ul class="header-nav-links">
  <li><a class="header-link" href="/"><span>Início</span></a></li>
  <li><a class="header-link" href="/tratamentos/"><span>Tratamentos</span></a></li>
  <li><a class="header-link" href="/blog/"><span>Blog</span></a></li>
  <li class="header-dropdown">
    <button type="button" class="header-link header-dropdown-toggle"
            aria-expanded="false" aria-controls="dropdown-atendimento" aria-haspopup="true">
      <span>Atendimento</span>
      <svg class="chevron" ...></svg>
    </button>
    <ul class="header-dropdown-menu" id="dropdown-atendimento" role="menu">
      <li role="none"><a role="menuitem" href="/atendimento/mari/">Mari</a></li>
      <li role="none"><a role="menuitem" href="/atendimento/sobrado/">Sobrado</a></li>
      <li role="none"><a role="menuitem" href="/atendimento/cruz-do-espirito-santo/">Cruz do Espírito Santo</a></li>
      <li role="none"><a role="menuitem" href="/atendimento/pilar/">Pilar</a></li>
      <li role="none"><a role="menuitem" href="/atendimento/riachao-do-poco/">Riachão do Poço</a></li>
      <li role="none"><a role="menuitem" href="/atendimento/caldas-brandao/">Caldas Brandão</a></li>
    </ul>
  </li>
  <li><a class="header-link" href="/primeira-consulta/"><span>Primeira Consulta</span></a></li>
</ul>
```
(o botão "Agendar" continua em `header-nav-actions`.)

### 5.2 Mobile — `offcanva-nav` (novo)
Mesmos itens; "Atendimento" vira grupo expansível (`<details>`/`<summary>` — zero JS, acessível
por padrão) OU botão com `aria-expanded`. Preferir `<details>` (progressive enhancement nativo).
Ícones SVG inline no padrão dos atuais.

### 5.3 Sub-navegação da home (nova, só em `index.html`)
```html
<nav class="subnav" aria-label="Seções desta página">
  <ul>
    <li><a class="subnav-link" href="#about">Sobre</a></li>
    <li><a class="subnav-link" href="#care">Nossos Serviços</a></li>
    <li><a class="subnav-link" href="#results">Resultados</a></li>
    <li><a class="subnav-link" href="#plans">Planos</a></li>
    <li><a class="subnav-link" href="#location">Localização</a></li>
  </ul>
</nav>
```
`main.js`: o scroll-spy passa a marcar `.subnav-link` (além de/no lugar de `.header-link`
com href de âncora). Ajustar seletores sem quebrar as âncoras.

### 5.4 CSS (módulos a criar/editar em `assets/css/`)
- `header-dropdown`, `header-dropdown-menu`, `header-dropdown-toggle`, `chevron` (rotação).
- `subnav`, `subnav-link`, estado `.active`.
- Dark mode equivalente (`.dark-theme .header-dropdown-menu` etc.).
- Rebuild: `./build-css.sh` + `./update-inline-css.sh` (afeta ambos os bundles).

### 5.5 JS (`assets/js/main.js`)
- Novo bloco: toggle do dropdown desktop (click/Enter/Espaço/Esc/click-fora, `aria-expanded`).
  Incluir dropdown no focus-trap quando aberto; fechar ao navegar.
- Ajustar scroll-spy para `.subnav-link`.
- Nenhuma regressão nos blocos existentes (offcanva, lightbox, carousel, dark mode).

## 6. Edge Cases

- **EC-01 (sem JS):** dropdown desktop deve mostrar as cidades via `:hover`/`:focus-within`
  como fallback; offcanva usa `<details>` (funciona sem JS). Nunca deixar cidades inacessíveis.
- **EC-02 (teclado):** Tab entra no toggle; Enter/Espaço abre; setas ↑↓ opcionais entre itens;
  Esc fecha e devolve foco ao toggle; Tab a partir do último item fecha e segue o fluxo.
- **EC-03 (rótulo duplicado):** "Tratamentos" (página, global) vs seção `#care` da home →
  renomear a âncora da home para **"Nossos Serviços"**.
- **EC-04 (estado ativo estático):** cada página marca seu item `.active`/`aria-current` no HTML
  (ex.: página de tratamento marca "Tratamentos"; artigo/listagem marca "Blog"; cidade marca
  "Atendimento"). Risco de drift entre 17 arquivos → mitigar com teste (RF em SPEC_BLOG T6).
- **EC-05 (offcanva overflow):** com "Atendimento" expandido + 6 cidades, garantir scroll
  interno do offcanva (já tem `overflow-y:auto`).
- **EC-06 (dropdown vs header fixo):** header é `position:fixed` (z-index 100); dropdown-menu
  precisa z-index compatível e não ser cortado.
- **EC-07 (mobile ≠ desktop drift):** os dois menus devem listar os mesmos destinos; teste
  compara itens.

## 7. Critérios de Aceite

- [ ] **CA-01:** Em qualquer página, o menu primário lista Início, Tratamentos, Blog,
      Atendimento (dropdown), Primeira Consulta, e o botão Agendar — igual em desktop e mobile.
- [ ] **CA-02:** Clicar em cada item leva à URL real correta (nenhuma âncora `/#...` no menu
      primário).
- [ ] **CA-03:** Dropdown "Atendimento" abre/fecha por mouse, teclado (Enter/Espaço/Esc) e
      clique-fora; `aria-expanded` reflete o estado; foco visível; sem JS as cidades ainda
      são acessíveis.
- [ ] **CA-04:** Na home, a sub-navegação aparece e o scroll-spy destaca a seção visível;
      fora da home a sub-nav não existe.
- [ ] **CA-05:** O item da página atual está `.active` com `aria-current="page"`.
- [ ] **CA-06:** Offcanva mantém focus-trap, backdrop, swipe-to-close, inert e aria-live.
- [ ] **CA-07:** `npm test` passa (incl. novo teste de navegação); build sem erro.
- [ ] **CA-08:** Lighthouse ≥95 (a11y 100) na home, numa página de tratamento e numa cidade.
- [ ] **CA-09:** axe-core sem violações nas páginas alteradas.

## 8. Decisões em aberto (menores — sigo com recomendação se não houver objeção)

- **DA-01 (sub-nav: barra sticky vs menu-só-na-home):** recomendo **barra de sub-navegação
  sticky abaixo do header, exibida só na home** (mais visível, não infla o menu global). Objeção?
- **DA-02 (posição do Blog):** recomendo ordem `Início · Tratamentos · Blog · Atendimento ·
  Primeira Consulta` (conteúdo antes de localização/conversão). Ok?
- **DA-03 (ícone dropdown mobile):** usar `<details>/<summary>` nativo (a11y grátis) — ok?
- **DA-04 (estado ativo):** marcar `.active` manualmente por página. Alternativa: um pequeno
  script que deduz do `location.pathname`. Recomendo **manual no HTML** (funciona sem JS,
  melhor p/ SEO/estático). Ok?

## 9. Fora de Escopo

- Criar página index `/atendimento/` (dropdown resolve o acesso às cidades).
- Mega-menu, busca no header, breadcrumbs adicionais.
- Redesenho visual do header além do necessário para dropdown + sub-nav.
- Reescrita do footer (o "Redes Sociais"/links do rodapé permanecem).

## 10. Plano de tasks (implementação incremental)

> Ordem: CSS/JS base → home (menu + sub-nav) → propagar às demais páginas → testes → review.
> CI (`npm test` + build) ao fim de cada bloco. Multi-agent review (altera ~17 arquivos).

- **N1 — Base CSS/JS:** criar módulos CSS (dropdown, subnav) + bloco JS do dropdown e ajuste
  do scroll-spy. Rebuild bundles. (nenhum HTML de página ainda)
- **N2 — Home:** aplicar menu primário novo + sub-nav na `index.html`; validar scroll-spy.
- **N3 — Template:** atualizar `tratamentos/_template.html` (menu novo, sem sub-nav, sem 2º H1
  — ver SPEC_BLOG EC-01) para servir de base às páginas internas.
- **N4 — Propagar:** aplicar o menu primário novo nas 7 páginas de tratamento, 6 de atendimento,
  primeira-consulta e blog (listagem + artigo), com `.active` correto por página.
- **N5 — Pipeline:** rodar `update-inline-css.sh`/`build.js` (inclui `blog/` — dep. SPEC_BLOG T2).
- **N6 — Testes:** `tests/integration/navigation.test.js` (itens iguais desktop×mobile, sem
  âncora no menu primário, dropdown a11y attrs, `.active`/`aria-current`, sub-nav só na home).
- **N7 — Review + verificação:** `npm test`, build, axe/Lighthouse spot-check, multi-agent
  review, docs.

## 11. Integração com SPEC_BLOG

- Esta spec é **pré-requisito** do link "Blog". A T3 (navegação) do SPEC_BLOG é **substituída**
  por esta reformulação completa.
- Ordem global sugerida: **NAVEGAÇÃO (N1–N7) → BLOG (T1,T2,T4,T5,T6,T7)** — assim os artigos
  novos já nascem com o menu correto e o template já reformulado.

## 12. Rastreabilidade

- Steering `repo-site`: breakpoints, bundles, 1 H1, Lighthouse, dark mode, offcanva a11y.
- Débito relacionado (SPEC_BLOG EC-05): ano hardcoded no footer — fora de escopo aqui.



---

## 13. Adendo (2026-09-05): Refino de layout do header — Opção 1

> Após implementar N1/N2, a validação no browser revelou problemas de **design**
> (não de bug): item "Início" redundante com o logo, menu principal desalinhado
> verticalmente com a subnav, e extremidades "remendadas" (dark-mode duplicado +
> sociais + CTA). Decisão aprovada: **Opção 1 — navbar clássica logo-esquerda /
> nav+CTA-direita**.

### Mudanças de layout (desktop)
- **Logo = Início:** remover o item "Início" do menu (desktop e offcanva). O logo
  clicável (→ `/`) é o único caminho para a home (convenção universal).
- **Nav agrupada à direita, junto do CTA:** `Tratamentos · Blog · Atendimento▾ ·
  Primeira Consulta` + `[dark] [Agendar]`. Fim do item solto à esquerda.
- **Um único toggle dark-mode:** remover a duplicação (havia um ao lado do logo e
  outro nas ações). Manter só o das ações (à direita), antes do "Agendar".
- **Remover ícones sociais do header desktop:** já existem no footer. Header limpo.
- **Subnav alinhada ao container do header:** mesmo `max-width` e mesmo padding
  lateral, para os eixos baterem (elimina a sensação de "remendo").

### Estrutura desktop resultante
```
[logo]                         [Tratamentos · Blog · Atendimento▾ · Primeira Consulta]  [🌙] [Agendar]
  → /                                    (nav agrupada à direita)                        toggle  CTA
```

### Offcanva (mobile)
- Remover o item "Início" (logo/ხheader já leva à home; manter foco nas seções/páginas).
  Itens: Tratamentos · Blog · Atendimento(grupo) · Primeira Consulta.

### Subnav
- **Decisão:** manter **fixed sempre visível** abaixo do header (recomendação aceita
  via "vai com a recomendação"); alinhada ao container do header.

### Impacto
- Afeta o header de **todas as ~17 páginas** (propagação na N4).
- Remove `.nav-social` e um `.header-nav-dark-mode` do header (CSS pode ficar, mas
  markup sai). Testes de a11y que checavam social no header (se houver) — verificar.
- `aria-current="page"` deixa de existir no menu (não há mais item "Início"); o
  estado de página passa a ser sinalizado só por contexto (logo). Itens de página
  ativos (ex.: "Blog" em /blog/) continuam com `.active`.
