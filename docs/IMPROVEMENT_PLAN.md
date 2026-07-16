# Plano de Melhorias — Site Dra. Jaqueline Sayonara

> Documento criado em 15/07/2026  
> Branch base: `feature/multipage-tratamentos`  
> Status atual: 7 páginas de tratamento implementadas, 307 testes passando, Lighthouse 97/100/100

---

## Visão Geral

Este documento organiza as melhorias identificadas para o projeto, priorizadas por impacto e esforço. As tarefas estão agrupadas em 4 fases de implantação, permitindo entregas incrementais.

---

## Fase 1 — Quick Wins (Estimativa: 1 dia)

Melhorias de alto impacto com baixo esforço, que podem ser entregues rapidamente.

### 1.1 Script de Automação de CSS Inline

**Problema:** Atualizar o CSS requer copiar manualmente o bundle minificado para 8 arquivos HTML.

**Solução:** Criar `update-inline-css.sh` que:
1. Executa o build CSS (`lightningcss`)
2. Extrai o conteúdo de `styles.min.css`
3. Substitui o `<style>` inline em todos os HTMLs (home + 7 tratamentos)
4. Reporta quais arquivos foram atualizados

**Critérios de aceite:**
- [ ] Script executável com `./update-inline-css.sh`
- [ ] Atualiza `index.html` e todos os `tratamentos/*/index.html`
- [ ] Idempotente (rodar duas vezes não gera diff)
- [ ] Documentado no README

---

### 1.2 Preload da Hero Image (LCP)

**Problema:** A imagem do hero carrega sem preload hint, adicionando ~300-500ms ao LCP.

**Solução:** Adicionar no `<head>` do `index.html`:
```html
<link rel="preload" as="image" href="./assets/img/header/banner.webp" type="image/webp">
```

**Critérios de aceite:**
- [ ] `<link rel="preload">` presente no `<head>`
- [ ] LCP medido antes/depois com Lighthouse (meta: < 2.0s)
- [ ] Não afeta outras páginas (apenas home)

---

### 1.3 Correção dos Erros nos Testes

**Problema:** 7 `TypeError: Cannot read properties of null` no happy-dom ao tentar carregar scripts via `<script src>` nas páginas de tratamento.

**Solução:** Configurar o happy-dom no teste de integração para não buscar recursos externos:
- Usar `settings: { fetch: { disableScriptExecution: true } }` ou
- Mockar o fetch de scripts no setup do teste

**Critérios de aceite:**
- [ ] `npm test` roda com 0 erros e 0 warnings
- [ ] 307+ testes passando
- [ ] Nenhum `Uncaught Exception` no output

---

### 1.4 Remover Dependência Não Utilizada

**Problema:** `normalize.css` está no `package.json` mas o projeto usa reset customizado em `globalStyle.css`.

**Solução:** `npm uninstall normalize.css`

**Critérios de aceite:**
- [ ] `normalize.css` removido do `package.json`
- [ ] Site funciona normalmente sem a dependência
- [ ] Testes passando

---

### 1.5 Atualizar Sitemap

**Problema:** `lastmod` no `sitemap.xml` está defasado e é atualizado manualmente.

**Solução:**
1. Atualizar `lastmod` para data atual
2. Adicionar URLs das 7 páginas de tratamento ao sitemap
3. Documentar processo de atualização

**Critérios de aceite:**
- [ ] Todas as 8 URLs presentes no sitemap (home + 7 tratamentos)
- [ ] `lastmod` com data do deploy
- [ ] Formato válido (W3C XML Sitemap)

---

## Fase 2 — Performance e SEO (Estimativa: 2-3 dias)

Otimizações que impactam diretamente o ranqueamento e a experiência do usuário.

### 2.1 Lazy-load do Vídeo

**Problema:** O vídeo do consultório (5.8MB) carrega imediatamente, consumindo banda e atrasando o carregamento de conteúdo visível.

**Solução:** Usar Intersection Observer para carregar o `<video>` apenas quando a seção `#location` entrar no viewport:
1. Remover `src` do `<video>` no HTML
2. Adicionar `data-src` com a URL do vídeo
3. No JS, observar a seção e atribuir `src` quando visível

**Critérios de aceite:**
- [ ] Vídeo não carrega no page load (verificar no DevTools Network)
- [ ] Vídeo carrega ao scrollar até a seção de localização
- [ ] `prefers-reduced-motion` continua respeitado (não inicia autoplay)
- [ ] Teste unitário cobrindo o comportamento

---

### 2.2 Tree-shake do CSS nas Páginas de Tratamento

**Problema:** Cada página de tratamento carrega ~34KB de CSS inline, incluindo ~10-12KB de seletores exclusivos da home (`.hero`, `.result-item`, `.lightbox`, `.plans-grid`, `.rating-container`).

**Solução:**
1. Criar build separado para tratamentos (`styles-treatment.min.css`)
2. Incluir apenas: globals, header, dark-theme, treatment, footer
3. Atualizar o script de inline para usar o bundle correto por tipo de página

**Critérios de aceite:**
- [ ] Bundle de tratamento < 22KB (redução de ~35%)
- [ ] Layout das páginas de tratamento inalterado (visual regression check)
- [ ] Dark mode funcionando nas páginas de tratamento
- [ ] Script de build atualizado para ambos os bundles

---

### 2.3 Página Índice de Tratamentos

**Problema:** Não existe `/tratamentos/index.html` — oportunidade perdida de SEO para a keyword "tratamentos odontológicos em Sapé".

**Solução:** Criar uma landing page listando todos os 7 tratamentos com:
- H1 otimizado para SEO
- Cards com imagem, título, descrição curta e link
- Schema.org `ItemList` + `BreadcrumbList`
- Meta tags (OG, Twitter, description)
- Canonical: `https://www.drajaquelinesayonara.com.br/tratamentos/`

**Critérios de aceite:**
- [ ] Página acessível em `/tratamentos/`
- [ ] Listagem dos 7 tratamentos com links funcionais
- [ ] Schema.org validado (Google Rich Results Test)
- [ ] Adicionada ao sitemap
- [ ] Link da home para a página (breadcrumb ou nav)
- [ ] Testes de integração cobrindo SEO e acessibilidade

---

### 2.4 OG Images Específicas por Tratamento

**Problema:** As OG images dos tratamentos usam imagens genéricas dos cards, reduzindo o impacto visual ao compartilhar nas redes sociais.

**Solução:**
1. Criar imagens OG (1200×630) para cada tratamento
2. Atualizar meta `og:image` e `twitter:image` em cada página
3. Formato WebP com fallback JPG

**Critérios de aceite:**
- [ ] 7 imagens OG criadas (1200×630, < 300KB cada)
- [ ] Meta tags atualizadas em cada página
- [ ] Validação com Facebook Sharing Debugger e Twitter Card Validator

---

## Fase 3 — Analytics e Conversão (Estimativa: 2-3 dias)

Instrumentação para medir resultados e otimizar conversões.

### 3.1 Google Tag Manager + DataLayer

**Problema:** Sem analytics, não é possível medir tráfego, comportamento do usuário ou conversões (cliques no WhatsApp).

**Solução:**
1. Criar container GTM
2. Adicionar snippet GTM no `<head>` e `<body>` de todas as páginas
3. Implementar dataLayer events:

| Evento | Trigger | Dados |
|--------|---------|-------|
| `page_view` | Carregamento | page_path, page_title |
| `whatsapp_click` | Click no botão/float WhatsApp | page_path, button_location |
| `treatment_view` | Página de tratamento | treatment_name, treatment_slug |
| `lightbox_open` | Abrir resultado | result_type |
| `cta_click` | Click em CTA | cta_text, cta_location |
| `phone_click` | Click no telefone | — |

**Critérios de aceite:**
- [ ] GTM instalado em todas as páginas
- [ ] Eventos disparando corretamente (verificar GTM Preview Mode)
- [ ] GA4 recebendo dados
- [ ] Conversão "whatsapp_click" configurada como meta no GA4
- [ ] Sem impacto no Lighthouse Performance (async loading)

---

### 3.2 Meta Pixel (Facebook/Instagram Ads)

**Problema:** Sem pixel, não é possível criar públicos de remarketing ou medir conversões de campanhas no Instagram.

**Solução:**
1. Instalar Meta Pixel via GTM (tag customizada)
2. Eventos: `PageView`, `Contact` (WhatsApp click), `ViewContent` (tratamento)

**Critérios de aceite:**
- [ ] Pixel disparando no Facebook Pixel Helper
- [ ] Eventos de conversão configurados no Meta Events Manager
- [ ] Carregamento não-bloqueante (via GTM)

---

### 3.3 Google Search Console

**Problema:** Sem GSC configurado, não há visibilidade sobre indexação e queries que geram tráfego.

**Solução:**
1. Verificar propriedade `www.drajaquelinesayonara.com.br` no GSC
2. Submeter sitemap atualizado
3. Verificar indexação das 8 páginas

**Critérios de aceite:**
- [ ] Propriedade verificada
- [ ] Sitemap enviado e processado
- [ ] 8 URLs indexadas (home + 7 tratamentos)

---

## Fase 4 — DX e Manutenibilidade (Estimativa: 3-5 dias)

Melhorias na experiência de desenvolvimento para facilitar evolução futura.

### 4.1 Build Script Completo

**Problema:** O processo de build é fragmentado — CSS, inline e deploy são passos manuais separados.

**Solução:** Criar `npm run build` que executa:
1. Build CSS (ambos bundles: home + treatment)
2. Inline CSS nos HTMLs
3. Validar HTML (opcional)
4. Reportar tamanhos finais

**Critérios de aceite:**
- [ ] `npm run build` executa todo o pipeline
- [ ] Output mostra tamanhos de cada arquivo
- [ ] Erro se algum passo falhar (exit code ≠ 0)
- [ ] Documentado no README

---

### 4.2 Pre-commit Hooks

**Problema:** Sem validações pré-commit, é possível commitar HTML inválido, JSON-LD quebrado ou imagens pesadas.

**Solução:** Configurar hooks com `husky` + `lint-staged`:
- Validar JSON-LD (parse check)
- Verificar `alt` em `<img>` (regex ou lint)
- Alertar se imagens > 100KB forem adicionadas
- Rodar testes unitários afetados

**Critérios de aceite:**
- [ ] Hook bloqueia commit com JSON-LD inválido
- [ ] Hook avisa sobre imagens pesadas
- [ ] `--no-verify` disponível para bypass explícito
- [ ] Documentado no README

---

### 4.3 Lighthouse CI

**Problema:** Sem CI, regressões de performance só são descobertas manualmente.

**Solução:** Configurar GitHub Action que roda Lighthouse em cada PR:
- Assertions: Performance ≥ 90, Accessibility = 100, SEO = 100
- Testar home + 1 página de tratamento (representativa)
- Postar resultado como comment no PR

**Critérios de aceite:**
- [ ] Action roda em PRs para `main`
- [ ] Bloqueia merge se performance < 90
- [ ] Resultado visível no PR como check ou comment
- [ ] Tempo de execução < 3 minutos

---

### 4.4 Avaliar Migração para SSG

**Problema:** 8 arquivos HTML com header, footer, meta tags e CSS duplicados manualmente. Qualquer mudança global requer editar todos os arquivos.

**Avaliação de opções:**

| Opção | Prós | Contras |
|-------|------|---------|
| **Astro** | Zero JS por padrão, componentes, build rápido | Nova ferramenta, curva de aprendizado |
| **11ty** | Simples, templates com includes, data cascade | Menos ecosistema de componentes |
| **Shell includes** | Zero dependência, `cat` partials | Frágil, sem hot-reload, limitado |
| **Manter vanilla** | Sem complexidade extra | Manutenção manual, propenso a erros |

**Decisão:** Avaliar na Fase 4. Se o projeto crescer além de 10 páginas, SSG se justifica. Até lá, o build script (4.1) mitiga o problema.

**Critérios de decisão:**
- [ ] Avaliar se o esforço de migração compensa vs manter scripts de build
- [ ] Prototipar com a opção escolhida (1 página)
- [ ] Medir impacto no tempo de build e deploy
- [ ] Decisão documentada em ADR

---

## Cronograma Sugerido

```
Semana 1  ─── Fase 1 (Quick Wins)
              ├── 1.1 Script inline CSS
              ├── 1.2 Preload hero
              ├── 1.3 Fix testes
              ├── 1.4 Remover normalize.css
              └── 1.5 Atualizar sitemap

Semana 2  ─── Fase 2 (Performance + SEO)
              ├── 2.1 Lazy-load vídeo
              ├── 2.2 Tree-shake CSS tratamentos
              └── 2.3 Página índice tratamentos

Semana 3  ─── Fase 2 (cont.) + Fase 3
              ├── 2.4 OG images tratamentos
              ├── 3.1 GTM + DataLayer
              ├── 3.2 Meta Pixel
              └── 3.3 Google Search Console

Semana 4  ─── Fase 4 (DX)
              ├── 4.1 Build script completo
              ├── 4.2 Pre-commit hooks
              ├── 4.3 Lighthouse CI
              └── 4.4 Avaliar SSG (decisão)
```

---

## Métricas de Sucesso

| Métrica | Atual | Meta |
|---------|-------|------|
| Lighthouse Performance | 97 | ≥ 98 |
| Lighthouse Accessibility | 100 | 100 (manter) |
| Lighthouse SEO | 100 | 100 (manter) |
| LCP (home) | ~2.6s | < 2.0s |
| Network payload (home) | ~3.6MB | < 1.5MB (com lazy video) |
| CSS bundle (tratamentos) | ~34KB | < 22KB |
| Testes passando | 307 | 320+ (novos testes) |
| Erros no test runner | 7 | 0 |
| URLs indexadas | 1 | 9 (home + índice + 7 tratamentos) |
| Tempo de build | manual | < 5s automatizado |

---

## Dependências Externas

| Item | Responsável | Necessário para |
|------|-------------|-----------------|
| Conta GTM | Dra. Jaqueline / Agência | Fase 3.1 |
| Conta GA4 | Dra. Jaqueline / Agência | Fase 3.1 |
| Meta Business Manager | Dra. Jaqueline / Agência | Fase 3.2 |
| Google Search Console | Dev (verificação via DNS/HTML) | Fase 3.3 |
| Imagens OG dos tratamentos | Designer / IA generativa | Fase 2.4 |

---

## Notas

- Cada fase é independente e pode ser implementada em branches separadas
- Manter cobertura de testes para cada nova funcionalidade
- Rodar Lighthouse manualmente ao final de cada fase para validar impacto
- PRs devem ser revisados antes do merge em `main`
- O merge da branch `feature/multipage-tratamentos` em `main` é pré-requisito para as fases seguintes
