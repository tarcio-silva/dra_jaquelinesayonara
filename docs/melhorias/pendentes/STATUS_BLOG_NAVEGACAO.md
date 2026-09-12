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
- [ ] **Padronizar o rótulo "Início" → "Home" em todo o site.** Decisão de nomenclatura:
      unificar para **"Home"** (ou "Início") de forma consistente em todas as páginas
      (menu, subnav, aria-labels, offcanva). Definir o termo único e aplicar em massa.
      > Nota: nesta sessão a home usa "Início" (subnav + aria-label do logo). Padronizar.
- [ ] **Verificar o link "Blog" quebrado.** O menu aponta para `/blog/`, mas a **listagem
      `/blog/` ainda NÃO existe** (só o artigo `/blog/protese-dentaria-autoestima-saude/`).
      Enquanto a listagem não for criada (SPEC_BLOG T1), o link "Blog" leva a 404.
      → Criar `blog/index.html` (SPEC_BLOG T1) OU apontar temporariamente o link para o artigo.

### Blog (após navegação)
- [ ] T1 Fundação (listagem + template) · T2 Pipeline · T4 3 artigos · T5 Sitemap · T6 Testes · T7 Review.

### Débito conhecido
- [ ] Footer com ano hardcoded "2025 ©" (SPEC_BLOG EC-05).
- [ ] Decisão pendente: subnav sempre-fixa (atual) vs aparecer após o hero. Mantido fixo.
- [ ] Commits herdados do artigo (autor `you@example.com`, msg em inglês) — reescrever antes
      de merge para main? (SPEC_BLOG DA-05).
