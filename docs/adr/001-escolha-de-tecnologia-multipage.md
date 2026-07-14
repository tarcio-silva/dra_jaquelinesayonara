# ADR-001: Escolha de Tecnologia para Estratégia Multipage

| Campo | Valor |
|-------|-------|
| **Status** | Aceito |
| **Data** | 2026-07-14 |
| **Decisores** | Thiago Silva |
| **Contexto** | Expansão do site para múltiplas páginas de tratamento (SEO local) |

---

## Contexto

O site institucional da Dra. Jaqueline Sayonara é atualmente uma **landing page estática** (HTML5 + CSS3 + JS vanilla) deployada na Vercel, com Lighthouse scores de 97/100 (Performance), 100/100 (Acessibilidade) e 100/100 (SEO).

A estratégia definida no `MULTIPAGE_STRATEGY.md` prevê a criação de **7 páginas individuais de tratamento** para capturar tráfego orgânico de cauda longa (ex: "clareamento dental sapé pb"). Isso requer uma decisão sobre a tecnologia ideal para suportar essa evolução multipage.

### Necessidades identificadas

1. **SEO local**: páginas individuais com keywords, Schema.org (`MedicalProcedure`, `FAQPage`, `BreadcrumbList`), meta tags únicas
2. **Performance**: manter ≥95 Lighthouse em todas as páginas
3. **Manutenção**: header, footer, dark mode e estilos compartilhados entre 8+ páginas
4. **Escalabilidade futura**: possível blog, páginas de localização, A/B testing
5. **Deploy**: manter Vercel com cache imutável e redirects
6. **Acessibilidade**: WCAG AA, focus traps, keyboard navigation, `prefers-reduced-motion`

---

## Opções Avaliadas

### Opção A — Manter HTML Estático (stack atual)

Continuar com HTML5 puro, duplicando header/footer em cada arquivo.

| Critério | Avaliação |
|----------|-----------|
| Performance | ⭐⭐⭐⭐⭐ Zero JS de framework, CSS inline, máxima velocidade |
| SEO | ⭐⭐⭐⭐⭐ Controle total de markup, Schema.org, meta tags |
| Manutenção (8 páginas) | ⭐⭐⭐ Duplicação de header/footer/nav; mudança exige editar 8 arquivos |
| Manutenção (20+ páginas) | ⭐⭐ Insustentável sem templates |
| Curva de aprendizado | ⭐⭐⭐⭐⭐ Stack já dominada pela equipe |
| Tempo de implementação | ⭐⭐⭐⭐⭐ Imediato, sem setup |
| Escalabilidade | ⭐⭐ Limitada sem SSG/templating |
| Dark mode / a11y | ⭐⭐⭐⭐⭐ Já implementado e funcional |

**Prós:**
- Zero refatoração — evolução natural da branch `main`
- Sem dependências de runtime ou build complexo
- TTFB mínimo (HTML puro servido pela CDN)
- Lighthouse scores garantidos
- Deploy automático sem build step adicional

**Contras:**
- Duplicação de código (header, footer, nav, dark mode toggle)
- Qualquer mudança no layout global exige editar todos os arquivos manualmente
- Sem componentes reutilizáveis
- Não escala bem para blog ou 20+ páginas

---

### Opção B — Static Site Generator (Astro, 11ty, ou Hugo)

Migrar para um SSG que gere HTML estático a partir de templates com componentes reutilizáveis.

| Critério | Avaliação |
|----------|-----------|
| Performance | ⭐⭐⭐⭐⭐ Output é HTML puro (zero JS por padrão no Astro/11ty) |
| SEO | ⭐⭐⭐⭐⭐ Mesmo controle que HTML estático |
| Manutenção (8 páginas) | ⭐⭐⭐⭐⭐ Layout único, componentes, slots |
| Manutenção (20+ páginas) | ⭐⭐⭐⭐⭐ Content collections, markdown, geração automática |
| Curva de aprendizado | ⭐⭐⭐ Exige aprender o SSG (Astro ~1-2 dias) |
| Tempo de implementação | ⭐⭐⭐ Migração do CSS/HTML existente: ~2-4 dias |
| Escalabilidade | ⭐⭐⭐⭐⭐ Blog, i18n, content collections, islands |
| Dark mode / a11y | ⭐⭐⭐⭐⭐ Reutiliza JS existente; output idêntico |

**Prós:**
- Output final é HTML estático idêntico ao atual (sem hydration)
- Layouts reutilizáveis (header/footer em 1 arquivo)
- Componentes (.astro/.njk) eliminam duplicação
- Content collections para tratamentos (markdown → HTML)
- Build rápido (~1s para 8 páginas)
- Deploy idêntico na Vercel (mesma configuração)
- Caminho natural para blog futuro

**Contras:**
- Exige migração do HTML/CSS existente para o formato do SSG
- Adiciona dependência de build (`npm run build`)
- Introduz uma ferramenta nova no stack
- Over-engineering para apenas 8 páginas estáticas (curto prazo)

---

### Opção C — SPA com React/Next.js (branch `react-app`)

Utilizar ou evoluir a branch `react-app` (React 18 + Vite) ou migrar para Next.js com SSG/ISR.

| Critério | Avaliação |
|----------|-----------|
| Performance | ⭐⭐⭐ Bundle JS do framework (~40-80KB); hydration cost |
| SEO | ⭐⭐⭐⭐ Bom com Next.js SSG/ISR; ruim com CSR puro (Vite SPA) |
| Manutenção (8 páginas) | ⭐⭐⭐⭐ Componentes React, styled-components |
| Manutenção (20+ páginas) | ⭐⭐⭐⭐ Boa com Next.js; excessiva para site institucional |
| Curva de aprendizado | ⭐⭐ React + Next.js + Styled Components + Recoil |
| Tempo de implementação | ⭐ Reescrita completa desde zero (branch arquivada) |
| Escalabilidade | ⭐⭐⭐⭐⭐ Máxima (API routes, ISR, middleware) |
| Dark mode / a11y | ⭐⭐⭐ Requer reimplementação de focus traps, ARIA, observers |

**Prós:**
- Componentização total
- Ecossistema rico (bibliotecas, tooling)
- ISR para conteúdo dinâmico futuro
- Preparado para funcionalidades complexas (formulários, agendamento online)

**Contras:**
- **Overkill** para site institucional com conteúdo estático
- Performance inferior ao HTML estático puro (JavaScript payload)
- Branch `react-app` está arquivada e desatualizada
- Tempo de implementação ~2-4 semanas (vs. dias)
- Styled Components + Recoil adicionam complexidade desnecessária
- Hydration prejudica LCP em conexões lentas (público local)
- Complexidade de manutenção desproporcional ao benefício
- Não atende melhor as necessidades de SEO local que HTML estático

---

## Decisão

**Opção A — Manter HTML Estático** para a implementação imediata (Fases 1-4 do MULTIPAGE_STRATEGY.md).

**Ponto de reavaliação**: migrar para **Opção B (SSG — preferencialmente Astro)** quando:
- O site ultrapassar 15 páginas, OU
- For adicionado blog com publicações frequentes, OU
- A manutenção de header/footer/nav em múltiplos arquivos se tornar onerosa

---

## Justificativa

### Por que manter estático agora

1. **O problema é de conteúdo, não de tecnologia.** A estratégia multipage visa SEO local — o que importa é ter páginas com conteúdo relevante indexadas. HTML estático entrega isso com zero overhead.

2. **Performance comprovada.** O stack atual já atinge 97/100 em Performance. Qualquer framework adicionaria latência (bundle parsing, hydration) sem benefício funcional.

3. **Escopo controlado: 7 páginas.** Para 8 HTMLs totais, a duplicação de header/footer é gerenciável. Um template mental + search-and-replace resolve mudanças globais.

4. **Zero risco de regressão.** Não há migração, portanto não há chance de quebrar SEO, acessibilidade ou dark mode existentes.

5. **Velocidade de entrega.** O MULTIPAGE_STRATEGY.md prevê implementação em 6-8 dias. Com SSG ou React, o prazo dobraria ou triplicaria pela migração.

6. **Público-alvo.** Pacientes em Sapé/PB, muitos em conexões 4G lentas. Cada KB de JavaScript economizado impacta a experiência real.

### Por que não React/Next.js

- A branch `react-app` foi arquivada por motivos válidos: complexidade excessiva para um site de divulgação
- Styled Components + Recoil são overkill para conteúdo estático
- O custo de hydration (40-80KB JS) não se justifica sem interatividade dinâmica
- SEO local não requer SSR/ISR — o conteúdo muda semestralmente no máximo

### Por que SSG é o próximo passo (não agora)

- Astro gera HTML idêntico ao estático (zero JS por padrão)
- Resolve o problema de manutenção quando o site crescer
- Migração do HTML atual para Astro é incremental e de baixo risco
- O `MULTIPAGE_STRATEGY.md` já prevê essa evolução na seção "Longo prazo (6-12 meses)"

---

## Consequências

### Positivas
- Implementação imediata sem delay de migração
- Performance mantida/melhorada
- SEO scores intactos
- Equipe produtiva no stack conhecido
- Custo de operação zero (Vercel free tier)

### Negativas (aceitas)
- Duplicação de header/footer em 8 arquivos
- Mudanças no layout global exigem editar múltiplos HTMLs
- Dívida técnica que será paga na migração para SSG

### Mitigações para os contras
- Manter comentários de marcação nos HTMLs para facilitar busca/replace
- Documentar estrutura do header/footer como "componente lógico" no README
- Usar `build-css.sh` já existente para manter CSS centralizado
- Revisitar esta ADR em 90 dias ou quando o site atingir 15+ páginas

---

## Referências

- [`MULTIPAGE_STRATEGY.md`](../../MULTIPAGE_STRATEGY.md) — Estratégia completa de expansão
- [`README.md`](../../README.md) — Documentação do projeto e stack atual
- [Astro — Why Astro?](https://docs.astro.build/en/concepts/why-astro/) — Referência futura para migração SSG
- Branch `react-app` — Experiência prévia descartada (over-engineering)
