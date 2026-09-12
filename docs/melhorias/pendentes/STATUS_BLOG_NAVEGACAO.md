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
- [x] **N3 — Template — RESOLVIDO (2026-09-11).** `tratamentos/_template.html` e
      `blog/_template.html` receberam o header novo (o header canônico não tem `<h1 sr-only>`,
      então o EC-01 dos 2 H1 foi corrigido).
- [x] **N4 — Propagar — RESOLVIDO (2026-09-11).** Header novo aplicado a 7 páginas de
      tratamento + `tratamentos/index.html`, 6 de atendimento, `primeira-consulta/`, blog
      (listagem + 4 artigos) e os 2 templates. `.active`/`aria-current` por página. Rótulo
      "Início" padronizado (breadcrumb visível + JSON-LD; "Home" some do site). Commit 4795c39.
- [x] **N6 — Testes — RESOLVIDO (2026-09-11).** `tests/integration/navigation.test.js`
      (paridade desktop×mobile, sem âncora no primário, dropdown a11y, `.active` por seção,
      sub-nav só na home, breadcrumb "Início", unicidade de aria-current). Commit fb58f06/50be652.
- [x] **N7 — Review — RESOLVIDO (2026-09-11).** Revisão semântica
      (semantic-review/2026-09-12-161052-pr-nav.md): NEEDS_CHANGES → corrigido. ERRO: duplo
      `aria-current="page"` nas cidades (toggle + link) — corrigido (fix 50be652), só o link da
      cidade fica com aria-current; teste endurecido. 669 testes verdes.
      **Débito registrado (N1, não bloqueante):** dropdown desktop abre só via JS
      (`[aria-expanded="true"]`); sem JS as cidades ficam inacessíveis no header desktop
      (contraria EC-01/RNF-05/CA-03). §13 aceitou click-only; footer/breadcrumb dão rota
      alternativa. Melhoria futura: adicionar `:focus-within` como fallback de teclado.

### Correções pontuais solicitadas
- [x] **Padronizar o rótulo "Início" → RESOLVIDO na N4 (2026-09-11).** Termo único = **"Início"**
      aplicado em massa (breadcrumb visível + `BreadcrumbList` do JSON-LD) em todas as páginas;
      o site não tem mais "Home". O menu novo nem tem item "Início" (o logo leva à home).
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
- [x] T4 3 artigos — RESOLVIDO 2026-09-11. Publicados (1 commit cada):
      clareamento-dental-vale-a-pena, limpeza-dental-importancia-frequencia,
      gengivite-sintomas-tratamento. Cada um: 1 H1, FAQ (4) com FAQPage no Schema,
      "Leia também" com reciprocidade interna. Listagem/ItemList/sitemap atualizados;
      gengivite reusa a imagem de profilaxia (DA-04). 451 testes verdes.
- [x] Referências bibliográficas — ADICIONADAS 2026-09-11 (commit e11029d). Os 3 artigos
      novos receberam citações no texto (autor, ano) + seção "Referências" ao final (CSS
      `.treatment-references`). Conteúdo reescrito pela Dra.; fontes registradas em
      `docs/melhorias/pendentes/referencias-blog/*.txt`.
      > RESOLVIDO 2026-09-11: o artigo `protese-dentaria-autoestima-saude` recebeu citações
      > (Hugo et al. 2007; Locker & Miller 1994; Pegoraro 2014; Sheiham & Steele 2001; Okeson
      > 2013; Cullinan & Seymour 2013) + 6 referências. Os 4 artigos do blog agora têm referências.
- [x] T7 Review (após conteúdo) — CONCLUÍDO 2026-09-11. Revisão semântica
      (semantic-review/2026-09-12-155008-blog.md): APPROVED_WITH_NOTES. Achou 1 ERRO que os
      testes não pegavam — a 1ª seção de cada artigo estava comentada por um comentário-guia
      residual do template (corrigido em fix 9f428d3). Notas aplicadas: disclaimer no artigo de
      prótese; cross-linking enriquecido. Testes de regressão adicionados (4ee8d28). Notas NÃO
      aplicadas (débito): OG images em PNG pesado (>0,6MB) → converter para WebP num passe futuro.
      463/463 testes verdes.

### Débito conhecido
- [x] OG images em PNG pesado — RESOLVIDO (2026-09-11, commit d1b035e). Convertidas para WebP
      (og/care 0,6-1,7 MB → 19-53 KB); refs atualizadas. Junto: heros do blog (imagens
      dedicadas), slides antes/depois e remoção dos icons legado.
- [x] `assets/img/plans/logo-clin.png` era um **AVIF** com extensão `.png` errada — RESOLVIDO
      (2026-09-11, commit f336929). Convertido para WebP via Pillow (decodifica AVIF, ao
      contrário do ImageMagick local), preservando o alpha (logo é silhueta teal). Arquivo
      AVIF removido. Agora 100% das imagens raster do site estão em WebP. Ver BUG-012.
- [ ] Footer com ano hardcoded "2025 ©" (SPEC_BLOG EC-05).
- [ ] Decisão pendente: subnav sempre-fixa (atual) vs aparecer após o hero. Mantido fixo.
- [ ] Commits herdados do artigo (autor `you@example.com`, msg em inglês) — reescrever antes
      de merge para main? (SPEC_BLOG DA-05).
