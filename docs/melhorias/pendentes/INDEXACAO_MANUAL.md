# Indexação Manual — Google Search Console

**Data:** 2026-08-02  
**Status:** "Detectada, mas não indexada no momento" (15 URLs)  
**Ação:** Solicitar indexação via "Inspeção de URL" no Search Console

## URLs por ordem de prioridade

| # | URL | Solicitado |
|---|-----|:----------:|
| 1 | `https://www.drajaquelinesayonara.com.br/primeira-consulta/` | ✅ 02/Ago |
| 2 | `https://www.drajaquelinesayonara.com.br/tratamentos/` | ✅ 02/Ago |
| 3 | `https://www.drajaquelinesayonara.com.br/tratamentos/aparelho-ortodontico/` | ✅ 02/Ago |
| 4 | `https://www.drajaquelinesayonara.com.br/tratamentos/clareamento-dental/` | ✅ 02/Ago |
| 5 | `https://www.drajaquelinesayonara.com.br/tratamentos/facetas-dentarias/` | ✅ 02/Ago |
| 6 | `https://www.drajaquelinesayonara.com.br/tratamentos/protese-dentaria/` | ✅ 02/Ago |
| 7 | `https://www.drajaquelinesayonara.com.br/tratamentos/restauracao-dentaria/` | ✅ 02/Ago |
| 8 | `https://www.drajaquelinesayonara.com.br/tratamentos/profilaxia/` | ✅ 02/Ago |
| 9 | `https://www.drajaquelinesayonara.com.br/tratamentos/exodontia/` | ✅ 02/Ago |
| 10 | `https://www.drajaquelinesayonara.com.br/atendimento/mari/` | ✅ 02/Ago |
| 11 | `https://www.drajaquelinesayonara.com.br/atendimento/sobrado/` | ✅ 02/Ago |
| 12 | `https://www.drajaquelinesayonara.com.br/atendimento/cruz-do-espirito-santo/` | ✅ 02/Ago |
| 13 | `https://www.drajaquelinesayonara.com.br/atendimento/pilar/` | ✅ 02/Ago |
| 14 | `https://www.drajaquelinesayonara.com.br/atendimento/riachao-do-poco/` | ⏳ Próximo dia |
| 15 | `https://www.drajaquelinesayonara.com.br/atendimento/caldas-brandao/` | ⏳ Próximo dia |

## Notas

- Limite diário do Search Console: ~10 solicitações/dia
- Tempo estimado para indexação após solicitação: 2–14 dias
- A home (`/`) já está indexada
- Revisitar o relatório de cobertura em 1–2 semanas para confirmar progresso

---

## Blog (novo — adicionar após o deploy do PR #58)

**Data:** 2026-09-12
**Contexto:** seção `/blog/` criada (listagem + 4 artigos). Já estão no `sitemap.xml`.
Solicitar indexação manual acelera (o sitemap sozinho descobre, mas é mais lento).

| # | URL | Solicitado |
|---|-----|:----------:|
| 1 | `https://www.drajaquelinesayonara.com.br/blog/` | ⏳ |
| 2 | `https://www.drajaquelinesayonara.com.br/blog/clareamento-dental-vale-a-pena/` | ⏳ |
| 3 | `https://www.drajaquelinesayonara.com.br/blog/limpeza-dental-importancia-frequencia/` | ⏳ |
| 4 | `https://www.drajaquelinesayonara.com.br/blog/gengivite-sintomas-tratamento/` | ⏳ |
| 5 | `https://www.drajaquelinesayonara.com.br/blog/protese-dentaria-autoestima-saude/` | ⏳ |

**Como solicitar (Search Console):**
1. Só faz sentido **após o merge/deploy** — as URLs precisam responder 200 em produção.
2. Search Console → "Inspeção de URL" → colar a URL → "Solicitar indexação".
3. Reenviar o `sitemap.xml` em Search Console → Sitemaps (força releitura das novas URLs).
4. Prioridade: listagem `/blog/` e os 3 artigos novos primeiro; o de prótese já podia
   estar indexado se foi publicado antes.
