# Plano de Melhorias — Site Dra. Jaqueline Sayonara

> Documento criado em 15/07/2026  
> Última atualização: 22/07/2026  
> Branch base: `feature/multipage-tratamentos`

---

## Status Geral

| Fase | Status | PR | Branch |
|------|--------|-----|--------|
| Fase 1 — Quick Wins | ✅ Concluída | #25 | `feature/improvement-phase1` |
| Fase 2 — Performance e SEO | ✅ Concluída | #26 | `feature/improvement-phase2` |
| Fase 3 — Analytics e Conversão | ⏸ Aguardando contas externas | — | — |
| Fase 4 — DX e Manutenibilidade | ✅ Concluída | #27 | `feature/improvement-phase4` |

---

## Fase 1 — Quick Wins ✅

### 1.1 Script de Automação de CSS Inline ✅

**PR:** #25 | **Arquivo:** `update-inline-css.sh`

- [x] Script executável com `./update-inline-css.sh`
- [x] Atualiza `index.html`, `tratamentos/index.html` e 7 páginas de tratamento (9 total)
- [x] Idempotente (rodar duas vezes não gera diff)
- [x] Usa Python para substituição segura (preserva `@media`, `@keyframes`)
- [x] Suporta 2 bundles: home (`styles.min.css`) e tratamentos (`styles-treatment.min.css`)

---

### 1.2 Preload da Hero Image (LCP) ✅

**PR:** #25 | **Arquivo:** `index.html`

- [x] `<link rel="preload" as="image">` adicionado no `<head>` do `index.html`
- [x] Aponta para `./assets/img/header/main-banner/dra-jaqueline-sayonara-dentista-sape.webp`
- [x] Tipo `image/webp` especificado
- [x] Apenas na home (não afeta tratamentos)

---

### 1.3 Correção dos Erros nos Testes ✅

**PR:** #25 | **Arquivo:** `tests/setup.js`, `vitest.config.js`

- [x] `npm test` roda com 0 erros e 0 warnings
- [x] 307 testes passando
- [x] Nenhum `Uncaught Exception` no output
- [x] Solução: handlers de `uncaughtException` e `unhandledRejection` no setup que filtram erros de rede do happy-dom (ECONNREFUSED, AbortError, null window)

---

### 1.4 Remover Dependência Não Utilizada ✅

**PR:** #25

- [x] `normalize.css` removido do `package.json`
- [x] Site funciona normalmente (reset é custom em `globalStyle.css`)
- [x] Testes passando

---

### 1.5 Atualizar Sitemap ✅

**PR:** #25 | **Arquivo:** `sitemap.xml`

- [x] `lastmod` atualizado para 2026-07-15
- [x] 9 URLs presentes (home + índice tratamentos + 7 tratamentos individuais)
- [x] Formato válido W3C XML Sitemap

---

## Fase 2 — Performance e SEO ✅

### 2.1 Lazy-load do Vídeo ✅

**PR:** #26 | **Arquivos:** `index.html`, `assets/js/main.js`

- [x] Vídeo (5.8MB) não carrega no page load
- [x] `<source data-src>` + IntersectionObserver com `rootMargin: 200px`
- [x] Carrega e inicia playback ao se aproximar do viewport
- [x] `prefers-reduced-motion` respeitado (não inicia autoplay)

**Impacto:** -5.8MB no network payload inicial

---

### 2.2 Tree-shake do CSS nas Páginas de Tratamento ✅

**PR:** #26 | **Arquivos:** `assets/css/styles-treatment.css`, `build-css.sh`, `update-inline-css.sh`

- [x] Bundle de tratamento: **22,334 bytes** (vs 34,313 home = **-35%**)
- [x] Exclui: `about.css`, `cards.css`, `results.css`, `plans.css`, `rating.css`, `location.css`
- [x] `build-css.sh` gera ambos bundles
- [x] `update-inline-css.sh` aplica bundle correto por tipo de página
- [x] Layout das páginas de tratamento inalterado
- [x] Dark mode funcionando

---

### 2.3 Página Índice de Tratamentos ✅

**PR:** #26 | **Arquivo:** `tratamentos/index.html`

- [x] Landing page com grid dos 7 tratamentos
- [x] Schema.org `ItemList` + `BreadcrumbList`
- [x] Meta tags completas (OG, Twitter Cards, canonical)
- [x] Usa classes existentes (`.related-grid`, `.related-card`)
- [x] Adicionada ao sitemap (priority 0.9)
- [x] Script de inline atualizado para incluí-la

---

### 2.4 OG Images Específicas por Tratamento ✅

**Status:** Concluído

- [x] Cada página aponta para imagem OG específica (`/assets/img/og/care/{slug}.png`)
- [x] Imagens OG 1200×630 em PNG para todas as 7 páginas + índice
- [x] Imagens do site atualizadas em WebP (quality 82) em `/assets/img/care/`
- [x] og:image, twitter:image e Schema.org image atualizados

---

## Fase 3 — Analytics e Conversão ⏸

**Status:** Aguardando criação de contas externas

| Task | Dependência | Status |
|------|-------------|--------|
| 3.1 GTM + DataLayer | Conta GTM + GA4 | ⏸ Aguardando |
| 3.2 Meta Pixel | Meta Business Manager | ⏸ Aguardando |
| 3.3 Google Search Console | Verificação de propriedade | ⏸ Aguardando |

**Próximos passos:**
1. Criar conta GTM e GA4 (Dra. Jaqueline ou agência)
2. Criar container GTM e obter o ID (GTM-XXXXXX)
3. Implementar snippet GTM + dataLayer events no código
4. Configurar Meta Pixel via GTM
5. Verificar propriedade no Google Search Console e submeter sitemap

---

## Fase 4 — DX e Manutenibilidade ✅

### 4.1 Build Script Completo ✅

**PR:** #27 | **Arquivo:** `scripts/build.js`

- [x] `npm run build` executa todo o pipeline
- [x] Build CSS (2 bundles)
- [x] Inline CSS em 9 HTMLs (bundle correto por tipo)
- [x] Valida que todos os HTMLs possuem `<style>` com conteúdo
- [x] Relatório de tamanhos de cada arquivo
- [x] Exit code ≠ 0 em caso de falha
- [x] `"type": "module"` adicionado ao package.json

---

### 4.2 Pre-commit Hooks ✅

**PR:** #27 | **Arquivos:** `.husky/pre-commit`, `scripts/check-image-size.js`

- [x] Husky 9.1.7 + lint-staged 15.4.3 instalados
- [x] CSS alterado → rebuild automático
- [x] Imagens staged > 100KB → warning (não bloqueia)
- [x] `--no-verify` disponível para bypass explícito

---

### 4.3 Lighthouse CI ✅

**PR:** #27 | **Arquivos:** `.github/workflows/lighthouse.yml`, `.lighthouserc.json`

- [x] GitHub Action roda em PRs para `main`
- [x] Audita: home + 1 página de tratamento (aparelho-ortodontico)
- [x] Assertions: Performance ≥ 90, Accessibility = 100, SEO = 100
- [x] Resultados salvos como artifact (7 dias de retenção)

---

### 4.4 Avaliar Migração para SSG 📋

**Status:** Decisão pendente

Recomendação: Manter vanilla HTML + build scripts enquanto o projeto tiver ≤ 10 páginas. O `npm run build` + `update-inline-css.sh` mitigam o problema de duplicação. Reavaliar se mais páginas forem adicionadas.

---

## Métricas Alcançadas

| Métrica | Antes | Depois | Meta |
|---------|-------|--------|------|
| CSS bundle (tratamentos) | 34KB | 22KB (-35%) | < 22KB ✅ |
| Network payload (home) | ~9.4MB | ~3.6MB (-62%) | < 4MB ✅ |
| Testes passando | 307 | 348 | 307+ ✅ |
| Erros no test runner | 7 | 0 | 0 ✅ |
| URLs no sitemap | 8 | 12 | 9+ ✅ |
| Tempo de build | manual | < 3s automatizado | < 5s ✅ |
| Pre-commit hooks | ❌ | ✅ | ✅ |
| Lighthouse CI | ❌ | ✅ | ✅ |

---

## Arquivos Criados/Modificados

### Novos
- `update-inline-css.sh` — Script de automação inline CSS
- `assets/css/styles-treatment.css` — Entry point CSS tratamentos
- `assets/css/styles-treatment.min.css` — Bundle minificado tratamentos
- `tratamentos/index.html` — Página índice de tratamentos
- `scripts/build.js` — Build script completo
- `scripts/check-image-size.js` — Verificador de tamanho de imagens
- `.husky/pre-commit` — Hook pre-commit
- `.github/workflows/lighthouse.yml` — Lighthouse CI
- `.lighthouserc.json` — Config Lighthouse

### Modificados
- `package.json` — type:module, scripts, devDependencies (husky, lint-staged)
- `build-css.sh` — Gera 2 bundles
- `index.html` — Preload hero image, lazy-load vídeo
- `assets/js/main.js` — Lazy-load video, dark mode toggle nav sync
- `tests/setup.js` — Supressão de erros happy-dom
- `vitest.config.js` — Ajuste configuração
- `sitemap.xml` — lastmod + URL tratamentos/
- `tratamentos/*/index.html` — CSS tree-shaked

---

## Próximos Passos

1. ~~**Merge das branches** na ordem: `multipage-tratamentos` → `improvement-phase1` → `phase2` → `phase4` → `main`~~ ✅ Consolidado na `develop`
2. **Fase 3:** Criar contas GTM/GA4 e implementar tracking
3. ~~**OG Images:** Produzir imagens 1200×630 para tratamentos~~ ✅ Concluído
4. **Monitorar:** Lighthouse CI nos próximos PRs
5. **Resultados:** Seção convertida em carousel com filtros, lightbox navegável e CTA contextual (ver `RESULTS_IMPROVEMENT_GUIDE.md`)
6. **Fase 5:** Ações derivadas da análise competitiva (ver abaixo)

---

## Análise Competitiva (21/07/2026)

### Concorrente Direto: Dr. Raphael Galvão (drraphaelgalvao.com.br)

Dentista generalista em Sapé/PB, **mesma rua** (R. Lourival Lacerda, 52). Site feito pela agência Leadmais.

#### Onde o Dr. Raphael nos supera

| Aspecto | Ele | Nós | Gap |
|---------|-----|-----|-----|
| Avaliações Google | +100 reviews (5.0) | 7 reviews (5.0) | 🔴 Crítico |
| Serviços oferecidos | 8 (inclui Implantes, Harmonização, Canal) | 7 | 🟡 Médio |
| Tracking de CTAs | `?source=hero`, `?source=servico&page=X` | Sem tracking | 🟡 Médio |
| Galeria do consultório | Carousel de fotos | 1 vídeo | 🟡 Médio |
| Experiência declarada | "+10 anos, UFCG" | Apenas CRO | 🟢 Baixo |

#### Onde nós superamos

| Aspecto | Nós | Ele | Vantagem |
|---------|-----|-----|----------|
| Conteúdo por tratamento | 800-1500 palavras + FAQ + tabela | 50-80 palavras + 2 FAQs curtas | 🟢 10-20x mais conteúdo |
| Schema.org | Dentist + FAQPage + BreadcrumbList + MedicalProcedure enriquecido | Básico ou inexistente | 🟢 Rich snippets |
| SEO local (cidades) | 3 páginas de área + areaServed 7 cidades | Nenhuma | 🟢 Exclusivo |
| Performance Lighthouse | 97/100 | Estimado 70-85 (builder) | 🟢 CWV melhor |
| Acessibilidade | 100/100 WCAG AA | Estimado 80-90 | 🟢 Compliance |
| GEO (AI-ready) | Parágrafos citáveis + tabelas + Schema | Nada | 🟢 Futuro |
| Dark mode | Sim | Não | 🟢 UX |
| Resultados antes/depois | Carousel + filtros + lightbox | Não tem | 🟢 Prova visual |
| FAQ na home | 6 perguntas + FAQPage Schema | Não tem | 🟢 Rich snippet |
| Página Primeira Consulta | Sim | Não | 🟢 Conversão |

#### Conclusão

O site da Dra. Jaqueline é **tecnicamente superior** (SEO, performance, conteúdo, acessibilidade). A principal ameaça do Dr. Raphael é o **volume de avaliações no Google** (100+ vs. 7), que impacta diretamente o posicionamento no Local Pack (mapa do Google). A segunda ameaça é o **tracking de conversão**, que permite otimizar campanhas.

---

### Posicionamento Regional e Nacional

| Nível | Status |
|-------|--------|
| **Sapé e cidades vizinhas** | 🥇 Melhor site da região (único com SEO avançado) |
| **João Pessoa / PB** | 🥈 Tecnicamente superior, menos autoridade de domínio |
| **Nacional (clínicas premium SP/BSB)** | Competitive em técnica; gap em volume de conteúdo (blog) e autoridade |

---

## Fase 5 — Ações Competitivas (derivadas da análise)

> Prioridade definida pelo impacto no ranking local e conversão.

| # | Ação | Impacto | Esforço | Status |
|---|------|---------|---------|--------|
| 5.1 | Estratégia de coleta de avaliações Google (QR code, pós-consulta, WhatsApp follow-up) | 🔴 Crítico | Operacional (não técnico) | ⏳ |
| 5.2 | Tracking de CTAs com parâmetros `?source=` nos links WhatsApp | 🔴 Alto | Baixo | ⏳ |
| 5.3 | Adicionar serviços: Tratamento de Canal, Harmonização Facial | 🟡 Médio | Médio (conteúdo) | ⏳ |
| 5.4 | Galeria de fotos do consultório (carousel) | 🟡 Médio | Baixo | ⏳ |
| 5.5 | Destacar formação e experiência na seção Sobre | 🟡 Médio | Baixo | ⏳ |
| 5.6 | Completar 3 cidades restantes (Riachão, Pilar, Caldas Brandão) | 🟡 Médio | Baixo | ✅ Concluído |
| 5.7 | Otimizar Google Business Profile com links para tratamentos | 🔴 Alto | Baixo (operacional) | ⏳ |
| 5.8 | Blog com 2-3 artigos/mês (capturar long-tail) | 🟡 Médio | Alto (contínuo) | ⏳ |
| 5.9 | Cadastro em Doctoralia/iDent para backlinks de saúde | 🟡 Médio | Baixo | ⏳ |
| 5.10 | Slider interativo antes/depois (já planejado, IMMEDIATE_IMPROVEMENTS #5) | 🟢 Baixo | Médio | ✅ Concluído |

### 5.1 Estratégia de Coleta de Avaliações

**Por que é prioridade #1:** O Dr. Raphael tem 100+ reviews. Isso domina o Local Pack do Google Maps. Sem reviews, mesmo com SEO perfeito, o concorrente aparece primeiro no mapa.

**Ações sugeridas (operacionais, não técnicas):**
- Criar QR code que direciona para página de avaliação do Google
- Imprimir e colocar na recepção e na mesa de atendimento
- Enviar mensagem WhatsApp pós-consulta: "Obrigada pela visita! Sua avaliação nos ajuda muito: [link]"
- Meta: 5 reviews/mês → 30 em 6 meses → 60 em 1 ano

### 5.2 Tracking de CTAs

**O que o Dr. Raphael faz:**
```
/whatsapp?source=hero
/whatsapp?source=navbar
/whatsapp?source=servico&page=ortodontia
```

**O que implementar (sem backend, apenas UTM no WhatsApp):**
```
wa.me/+5583994058749?text=...&utm_source=site&utm_medium=hero
wa.me/+5583994058749?text=...&utm_source=site&utm_medium=faq
wa.me/+5583994058749?text=...&utm_source=site&utm_medium=tratamento_clareamento
```

Ou usar textos distintos no WhatsApp para identificar a origem:
- Hero: "Gostaria de agendar uma consulta"
- FAQ: "Tenho uma dúvida sobre..."
- Tratamento: "Gostaria de saber mais sobre [tratamento]"

### 5.7 Google Business Profile

**Ações:**
- Atualizar descrição com keywords
- Adicionar link para `/primeira-consulta/`
- Postar 1 update/semana (fotos do consultório, dicas, resultados)
- Adicionar todos os serviços com links para as páginas de tratamento
- Responder todas as avaliações (positivas e negativas)
