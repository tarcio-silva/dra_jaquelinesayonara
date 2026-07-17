# Guia de Template — Fotos Antes/Depois (Canva)

> Para uso no site e redes sociais da Dra. Jaqueline Sayonara  
> Criado em: 16/07/2026

---

## Dimensões do Template

| Propriedade | Valor |
|-------------|-------|
| **Largura total** | 1200 px |
| **Altura** | 630 px |
| **Formato** | PNG (para OG/social) ou WebP (para site) |
| **Resolução** | 72 dpi (web) |

---

## Estrutura do Layout

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│   ┌───────────┐   ┌──────────────┐   ┌───────────┐         │
│   │           │   │              │   │           │         │
│   │           │   │     LOGO     │   │           │         │
│   │   ANTES   │   │              │   │  DEPOIS   │         │
│   │           │   │     @insta   │   │           │         │
│   │  480 px   │   │   240 px     │   │  480 px   │         │
│   │           │   │              │   │           │         │
│   └───────────┘   └──────────────┘   └───────────┘         │
│                                                              │
│   ◄── "ANTES" ──►  ◄── FAIXA ──►  ◄── "DEPOIS" ──►        │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Medidas Exatas

| Elemento | Largura | Altura | Posição X | Posição Y |
|----------|---------|--------|-----------|-----------|
| Canvas total | 1200 px | 630 px | — | — |
| Foto ANTES | 480 px | 630 px | 0 | 0 |
| Faixa central | 240 px | 630 px | 480 | 0 |
| Foto DEPOIS | 480 px | 630 px | 720 | 0 |

---

## Faixa Central — Especificações

### Fundo

| Propriedade | Valor |
|-------------|-------|
| Cor de fundo | `#a25356` (Velvety Cherry) |
| Alternativa light | `#fae7eb` (Petal Rose) com logo escura |

### Conteúdo (de cima para baixo)

| Elemento | Tamanho | Cor | Posição |
|----------|---------|-----|---------|
| Label "ANTES" (opcional) | 14 px, bold | `#ffffff` | Topo esquerdo da faixa |
| Label "DEPOIS" (opcional) | 14 px, bold | `#ffffff` | Topo direito da faixa |
| Logo | ~120 px largura | — | Centro vertical |
| @drajaquelinesayonara | 12 px, medium | `#ffffff` | Abaixo da logo |
| CRO-PB 9833 (opcional) | 10 px, regular | `#ffffff` opacity 80% | Rodapé da faixa |

### Hierarquia visual na faixa

```
        ┌────────────────┐
        │                │
        │                │
        │     [LOGO]     │  ← centralizada verticalmente
        │                │
        │  @drajaqueline │  ← 12px abaixo da logo
        │   sayonara     │
        │                │
        │  CRO-PB 9833   │  ← rodapé, opacidade 80%
        └────────────────┘
```

---

## Cores da Marca (para usar no Canva)

| Nome | Hex | Uso |
|------|-----|-----|
| Velvety Cherry | `#a25356` | Faixa central (fundo escuro) |
| Petal Rose | `#fae7eb` | Variação fundo claro |
| Branco | `#ffffff` | Texto sobre fundo escuro |
| Texto escuro | `#2d2d2d` | Texto sobre fundo claro |

**No Canva:** Menu "Estilos da marca" → adicionar essas cores como paleta personalizada.

---

## Fonte

| Fonte | Peso | Uso |
|-------|------|-----|
| **Manrope** | Bold (700) | Labels "ANTES" / "DEPOIS" |
| **Manrope** | Medium (500) | @instagram |
| **Manrope** | Regular (400) | CRO |

> A fonte Manrope está disponível no Canva (buscar por "Manrope").

---

## Passo a Passo no Canva

### 1. Criar o template

1. **Criar design** → Tamanho personalizado → `1200 × 630 px`
2. Adicionar retângulo na faixa central:
   - Posição X: `480`, Y: `0`
   - Tamanho: `240 × 630`
   - Cor: `#a25356`
3. Adicionar a logo no centro da faixa
4. Adicionar texto "@drajaquelinesayonara" abaixo da logo
5. (Opcional) Adicionar "CRO-PB 9833" no rodapé da faixa

### 2. Para cada caso clínico

1. Duplicar o template
2. Inserir foto ANTES:
   - Arrastar para o lado esquerdo
   - Recortar para `480 × 630`
   - Posição X: `0`, Y: `0`
3. Inserir foto DEPOIS:
   - Arrastar para o lado direito
   - Recortar para `480 × 630`
   - Posição X: `720`, Y: `0`
4. Exportar como **PNG** (qualidade máxima)

### 3. Exportar

| Destino | Formato | Qualidade |
|---------|---------|-----------|
| Redes sociais (Instagram, Facebook) | PNG | Máxima |
| Site (seção resultados) | PNG → converter para WebP | — |
| WhatsApp / Compartilhamento | PNG | Máxima |

---

## Dicas para as Fotos

### Captura

- [ ] Mesmo ângulo no antes e depois
- [ ] Mesma iluminação (luz branca neutra)
- [ ] Mesmo enquadramento (zoom similar)
- [ ] Fundo neutro ou cadeira odontológica
- [ ] Usar afastador labial para mostrar os dentes
- [ ] Foto centralizada nos dentes (não rosto inteiro)

### Qualidade

- [ ] Resolução mínima da foto original: 1000 px de largura
- [ ] Evitar fotos com flash muito estourado
- [ ] Sem filtros ou ajustes de cor exagerados
- [ ] Foco nítido nos dentes

### Consentimento

- [ ] Obter autorização por escrito do paciente
- [ ] Preferir fotos que não mostrem o rosto completo (só sorriso)
- [ ] Manter registro do consentimento arquivado

---

## Variações do Template

### Variação A — Fundo escuro (padrão)

```
[ ANTES ] [ #a25356 + logo branca ] [ DEPOIS ]
```

Ideal para: maioria dos casos, posts no Instagram.

### Variação B — Fundo claro

```
[ ANTES ] [ #fae7eb + logo escura ] [ DEPOIS ]
```

Ideal para: stories, posts com estética mais suave.

### Variação C — Com labels

```
┌──────────┬──────────────┬──────────┐
│  ANTES   │              │  DEPOIS  │  ← labels no topo
├──────────┤    LOGO      ├──────────┤
│          │              │          │
│  [foto]  │  @instagram  │  [foto]  │
│          │              │          │
└──────────┴──────────────┴──────────┘
```

Ideal para: posts carrossel, quando o público pode não entender o layout.

---

## Checklist de Produção

Para cada novo resultado:

- [ ] Foto ANTES capturada (boa iluminação, foco, ângulo)
- [ ] Foto DEPOIS capturada (mesmo ângulo e iluminação)
- [ ] Consentimento do paciente obtido
- [ ] Template duplicado no Canva
- [ ] Fotos inseridas e recortadas
- [ ] Exportado como PNG (1200×630)
- [ ] Arquivo nomeado: `{tratamento}-{numero}.png` (ex: `clareamento-03.png`)
- [ ] Enviado para conversão WebP e inclusão no site

---

## Nomenclatura dos Arquivos

```
clareamento-01.webp
clareamento-02.webp
facetas-01.webp
facetas-02.webp
restauracao-01.webp
protese-01.webp
aparelho-01.webp
profilaxia-01.webp
```

Manter no diretório: `/assets/img/results/`

---

## Resumo Rápido

| O quê | Valor |
|-------|-------|
| Tamanho | 1200 × 630 px |
| Faixa central | 240 px, cor `#a25356` |
| Fotos laterais | 480 × 630 px cada |
| Logo | Centralizada na faixa |
| Fonte | Manrope |
| Exportar como | PNG (depois converter para WebP) |
