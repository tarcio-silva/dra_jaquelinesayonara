# Status da sessão — Blog + Reformulação de Navegação

> **Branch:** `feat/blog-e-navegacao`
> **Última atualização:** 2026-09-05
> **Specs:** `SPEC_BLOG.md`, `SPEC_NAVEGACAO.md` (com adendo §13 do refino de layout)

---

## Onde paramos

Reformulação da navegação (Opção A + refino Opção 1) **implementada e validada na home**.
Falta propagar às demais páginas e então executar o blog.

### Concluído
- **N1 — Base CSS/JS** (commit `936ee83`): dropdown desktop (`.header-dropdown*`),
  grupo `<details>` mobile (`.offcanva-group`), `subnav.css`, dark mode, JS do dropdown +
  scroll-spy ampliado.
- **N2 — Home** (commit `11f28eb`): menu primário orientado a páginas reais + sub-navegação.
- **Refino de layout (Opção 1)** — nesta sessão, na home:
  - Logo = Início (removido item "Início" redundante do menu primário; logo leva a `/`).
  - Nav agrupada à direita (`margin-left:auto`) + `[dark]` + `[Agendar]`.
  - Ícones sociais (WhatsApp, Instagram, Facebook) movidos para perto do logo (`gap:16px`).
  - Removido o toggle dark-mode duplicado do header.
  - Subnav alinhada ao padding do header (24px), sem `max-width` próprio.
  - Subnav ganhou item **"Início"** (`#inicio`); hero recebeu `id="inicio"`.
  - Dropdown "Atendimento": posicionamento/tipografia alinhados ao design system,
    click-only (sem `:hover`), affordance = chevron (sem sublinhado de link).
  - Affordance WCAG: links (menu, subnav, itens do dropdown) sublinhados; o toggle
    (botão/disclosure) não.
  - Scroll-spy: "Início" ativo no topo, troca por seção; estado ativo da subnav = mesmo
    padrão do menu (fundo rosado), sem duplo sublinhado.
- Testes unitários do scroll-spy atualizados para o novo contrato (`rootMargin`), 348 verdes.

### Estado do build/CI
- `./update-inline-css.sh` reprocessou home + páginas de tratamento (só o `<style>` inline
  mudou nelas — o CSS do dropdown entrou no bundle treatment; markup do menu delas ainda é o
  ANTIGO, será trocado na N4).
- `npm test`: **348/348** passando.

---

## Pendências (próximas sessões)

### Navegação
- [ ] **N3 — Template:** atualizar `tratamentos/_template.html` com o header novo (sem 2º H1
      `sr-only`, ver SPEC_BLOG EC-01).
- [ ] **N4 — Propagar** o header/menu novo para: 7 páginas de tratamento, `tratamentos/index.html`,
      6 páginas de atendimento, `primeira-consulta/`, e as páginas de blog. Marcar `.active`
      por página. (Hoje só a home tem o menu novo.)
- [ ] **N6 — Testes** de navegação (`tests/integration/navigation.test.js`): itens iguais
      desktop×mobile, sem âncora no menu primário, dropdown a11y, `.active` por página.

### Correções pontuais solicitadas
- [ ] **Padronizar o rótulo "Início" → "Home" em todo o site.** DECIDIDO (2026-09-11): termo
      único = **"Início"** (PT-BR, coerente com o site). ⚠️ A aplicação em massa acontece na
      **N4** (junto da propagação do menu novo), não isoladamente — hoje as páginas ainda usam
      "Home"; trocar só uma criaria inconsistência. Ver DEC-014.
- [x] **Link "Blog" quebrado — RESOLVIDO (2026-09-11).** Criada a listagem `/blog/`
      (SPEC_BLOG T1): `blog/index.html` (bundle treatment, 1 card do artigo atual, Schema
      Blog+ItemList+BreadcrumbList, 1 H1). Pipeline (`update-inline-css.sh` + `scripts/build.js`)
      passou a conhecer `blog/`. `sitemap.xml` ganhou `/blog/` + o artigo (deixa de ser órfão).
      Novo teste `tests/integration/blog.test.js` (19 casos). Build OK (11 arquivos); 367/367
      testes verdes. Menu da listagem = ANTIGO (troca vem na N4). Ver DEC-014.

### Blog (após navegação)
- [x] T1 Fundação (listagem + template) — RESOLVIDO 2026-09-11. `blog/index.html` (listagem)
      + `blog/_template.html` (template com placeholders {{...}}, 1 H1, FAQ, "Leia também",
      Schema BlogPosting+Breadcrumb+FAQPage; NÃO tem o 2º H1 sr-only — EC-01 respeitado).
- [x] T2 Pipeline — `update-inline-css.sh` + `build.js` conhecem `blog/` (bundle treatment).
      `_template.html` fica fora do pipeline (como o de tratamento); seu `<style>` foi
      preenchido uma vez com o bundle treatment.
- [x] T5 Sitemap — `/blog/` + artigo atual adicionados ao `sitemap.xml`.
- [x] T6 Testes — cobertura da listagem em `tests/integration/blog.test.js` (19). Suite
      completo (artigos) quando T4 existir.
- [ ] T4 3 artigos (usar `blog/_template.html`) · T7 Review (após conteúdo).

### Débito conhecido
- [ ] Footer com ano hardcoded "2025 ©" (SPEC_BLOG EC-05).
- [ ] Decisão pendente: subnav sempre-fixa (atual) vs aparecer após o hero. Mantido fixo.
- [ ] Commits herdados do artigo (autor `you@example.com`, msg em inglês) — reescrever antes
      de merge para main? (SPEC_BLOG DA-05).
