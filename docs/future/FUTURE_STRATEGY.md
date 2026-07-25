# Estratégia de Implementação — Melhorias Futuras

> Guia operacional passo-a-passo para implementar cada item do `FUTURE_IMPROVEMENTS.md`.  
> Cada seção inclui: ferramentas, configuração, fluxos, textos prontos e métricas de acompanhamento.

**Referência:** [FUTURE_IMPROVEMENTS.md](./FUTURE_IMPROVEMENTS.md)  
**Última atualização:** Julho 2026

---

## Índice

1. [Coleta de Avaliações Google](#1-coleta-de-avaliações-google)
2. [Chatbot WhatsApp](#2-chatbot-whatsapp)
3. [Google Business Profile](#3-google-business-profile)
4. [Agendamento Online](#4-agendamento-online)
5. [Depoimentos em Vídeo](#5-depoimentos-em-vídeo)
6. [Blog com Astro + Markdown](#6-blog-com-astro--markdown)
7. [WhatsApp Business API](#7-whatsapp-business-api)
8. [Analytics e Rastreamento](#8-analytics-e-rastreamento)
9. [Google Ads Local](#9-google-ads-local)
10. [Teleconsulta](#10-teleconsulta)
11. [Tour Virtual 360°](#11-tour-virtual-360)
12. [Formulário de Contato](#12-formulário-de-contato)

---

## 1. Coleta de Avaliações Google

### Dependência: Google Business Profile verificado
### Prazo: Configurar em 1 dia, colher resultados em 3 meses
### Custo: R$ 0

### Passo 1 — Obter o link de avaliação

1. Acessar [Google Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id)
2. Buscar "Consultório Dra Jaqueline Sayonara Sapé"
3. Copiar o Place ID (formato: `ChIJ...`)
4. Montar o link:
```
https://search.google.com/local/writereview?placeid=SEU_PLACE_ID
```

### Passo 2 — Criar QR Code

1. Acessar [QR Code Generator](https://www.qrcode-monkey.com/) (gratuito)
2. Colar o link de avaliação
3. Customizar cores (usar `#a25356` como cor principal)
4. Baixar em PNG alta resolução (300dpi para impressão)

### Passo 3 — Materiais físicos para o consultório

**Plaquinha para balcão (texto sugerido):**
```
┌─────────────────────────────────┐
│  ⭐ Gostou do atendimento?      │
│                                 │
│  Sua avaliação no Google        │
│  nos ajuda muito!               │
│                                 │
│       [QR CODE AQUI]            │
│                                 │
│  Aponte a câmera do celular     │
└─────────────────────────────────┘
```

**Locais para posicionar:**
- Balcão da recepção (principal)
- Sala de espera (mesa de centro)
- Espelho do banheiro (na saída)

### Passo 4 — Mensagem pós-consulta (WhatsApp)

**Template — enviar 24h após o atendimento:**
```
Olá, {NOME}! 😊

Esperamos que esteja tudo bem após sua consulta de ontem.

Se puder deixar sua avaliação no Google, nos ajuda demais a ajudar outros pacientes a nos encontrar:

👉 {LINK_AVALIAÇÃO}

Leva menos de 1 minuto! Agradecemos de coração 💛

— Equipe Dra. Jaqueline Sayonara
```

**Template para pacientes antigos (reativar):**
```
Olá, {NOME}! Tudo bem? 😊

Aqui é da Dra. Jaqueline Sayonara. Você já fez tratamento conosco e gostaríamos de saber: como está seu sorriso?

Se teve uma boa experiência, sua avaliação no Google ajuda outros pacientes da região:

👉 {LINK_AVALIAÇÃO}

Obrigada! Qualquer necessidade, estamos à disposição 🦷

— Equipe Dra. Jaqueline Sayonara
```

### Passo 5 — Processo operacional

| Quando | Ação | Responsável |
|--------|------|-------------|
| Dia da consulta | Oferecer verbalmente: "Se puder avaliar no Google, ajuda muito!" | Dra. / Recepcionista |
| 24h após | Enviar mensagem WhatsApp com link | Recepcionista |
| Semanal | Verificar novas avaliações, responder TODAS | Dra. Jaqueline |
| Mensal | Revisar taxa de conversão (msgs enviadas vs. avaliações recebidas) | Gestão |

### Passo 6 — Respostas às avaliações (templates)

**Avaliação positiva (5 estrelas):**
```
Muito obrigada pela confiança, {NOME}! 😊 
Ficamos felizes que sua experiência tenha sido positiva. 
Estamos sempre aqui quando precisar. Um abraço!
— Dra. Jaqueline Sayonara
```

**Avaliação com crítica construtiva (3-4 estrelas):**
```
Obrigada pelo feedback, {NOME}. Levamos sua observação a sério 
e vamos trabalhar para melhorar. Se quiser conversar diretamente, 
estamos disponíveis pelo WhatsApp. Agradecemos! 🙏
— Dra. Jaqueline Sayonara
```

### Metas

| Período | Meta | Ação principal |
|---------|------|----------------|
| Mês 1 | 12-15 avaliações (de 7) | Mensagem para todos os pacientes do mês |
| Mês 2 | 20-25 avaliações | Mensagem para pacientes antigos (reativação) |
| Mês 3 | 30+ avaliações | Manter processo + QR code no consultório |

### Métricas de acompanhamento
- Taxa de conversão: mensagens enviadas ÷ avaliações recebidas (meta: 20-30%)
- Nota média (manter 4.8+)
- Posição no Google Maps para "dentista sapé"

---

## 2. Chatbot WhatsApp

### Dependência: ManyChat (ou similar)
### Prazo: 1-2 semanas para configurar
### Custo: R$ 0-300/mês

### Estratégia recomendada: ManyChat Free → Pro

### Passo 1 — Criar conta ManyChat

1. Acessar [manychat.com](https://manychat.com)
2. Conectar número de WhatsApp Business
3. Verificar número (SMS ou ligação)

### Passo 2 — Configurar fluxo principal

**Fluxo de boas-vindas (trigger: primeira mensagem):**

```
┌─ TRIGGER: Mensagem recebida
│
├─ RESPOSTA AUTOMÁTICA (imediata):
│  "Olá! 👋 Bem-vindo(a) ao consultório da Dra. Jaqueline Sayonara.
│   Como posso ajudar?"
│
│   [Botão] Agendar consulta
│   [Botão] Horários de atendimento
│   [Botão] Tratamentos disponíveis
│   [Botão] Valores e planos
│   [Botão] Falar com atendente
│
├─ SE "Agendar consulta":
│  "Ótimo! Para agendar, preciso de algumas informações:
│   📋 Nome completo
│   📱 Melhor horário para contato
│   🦷 Qual tratamento deseja?
│   
│   Nossa equipe retornará em até 2h (horário comercial)."
│
├─ SE "Horários":
│  "🕐 Nossos horários:
│   Seg-Sex: 8h às 12h | 14h às 18h
│   Sáb: 8h às 13h
│   
│   Deseja agendar? [Sim] [Não]"
│
├─ SE "Tratamentos":
│  "Oferecemos:
│   🦷 Aparelho ortodôntico
│   ✨ Clareamento dental
│   💎 Facetas em resina
│   🔧 Prótese dentária
│   🧹 Profilaxia (limpeza)
│   🪥 Restauração
│   🏥 Exodontia (extração)
│   
│   Qual te interessa? Posso enviar mais informações!"
│
├─ SE "Valores e planos":
│  "Aceitamos:
│   ✅ Plano Clin
│   ✅ Plano Unidentis
│   ✅ Particular (PIX, cartão, dinheiro)
│   
│   Para valores específicos, nossa equipe retornará 
│   com orçamento personalizado.
│   
│   [Botão] Solicitar orçamento"
│
└─ SE "Falar com atendente":
   "Certo! Vou encaminhar para nossa equipe. 
    Retornaremos em breve. 😊"
   → TAG: "Atendimento humano"
   → Notificação para a recepcionista
```

### Passo 3 — Fluxo fora do horário

```
┌─ CONDITION: Horário fora de seg-sex 8-18h / sab 8-13h
│
└─ RESPOSTA:
   "Olá! No momento estamos fora do horário de atendimento. 🕐
    
    Nosso horário:
    Seg-Sex: 8h-12h | 14h-18h
    Sáb: 8h-13h
    
    Sua mensagem foi registrada e retornaremos 
    assim que possível! 😊
    
    [Botão] Ver tratamentos
    [Botão] Ver localização"
```

### Passo 4 — Configurar tags e segmentação

| Tag | Quando aplicar |
|-----|----------------|
| `novo_paciente` | Primeira interação |
| `retorno` | Paciente que já veio |
| `interesse_ortodontia` | Perguntou sobre aparelho |
| `interesse_estetica` | Perguntou sobre clareamento/facetas |
| `atendimento_humano` | Solicitou falar com pessoa |
| `agendado` | Confirmou agendamento |

### Passo 5 — Métricas para acompanhar

| Métrica | Meta |
|---------|------|
| Taxa de resposta automática | >90% das primeiras mensagens |
| Tempo até atendimento humano | <2h (horário comercial) |
| Taxa de agendamento via bot | >15% das conversas |
| Satisfação (NPS via mensagem) | >8/10 |

---

## 3. Google Business Profile

### Dependência: Acesso admin ao perfil
### Prazo: Otimização inicial em 1 dia, manutenção contínua
### Custo: R$ 0

### Passo 1 — Auditoria do perfil atual

Verificar no [Google Business Profile Manager](https://business.google.com/):

| Item | Verificar | Status |
|------|-----------|--------|
| Nome | "Dra. Jaqueline Sayonara" ou "Consultório Dra. Jaqueline Sayonara" | □ |
| Categoria principal | Dentista | □ |
| Categorias secundárias | Ortodontista, Clínica Odontológica | □ |
| Endereço | Rua Lourival Lacerda, 06, sl 207 - Centro, Sapé/PB | □ |
| Telefone | (83) 99405-8749 | □ |
| Site | https://www.drajaquelinesayonara.com.br | □ |
| Horários | Seg-Sex 8-12, 14-18 / Sab 8-13 | □ |
| Descrição | Preenchida (até 750 chars) | □ |
| Serviços | 7 tratamentos listados | □ |
| Fotos | 10+ fotos de qualidade | □ |
| Logo | Logo atualizado | □ |

### Passo 2 — Descrição otimizada (750 caracteres)

```
Dra. Jaqueline Sayonara — Cirurgiã-Dentista especialista em Ortodontia (CRO-PB 9833). 
Consultório localizado no Centro de Sapé/PB, atendendo também pacientes de Mari, 
Sobrado, Cruz do Espírito Santo e região.

Tratamentos: Aparelhos ortodônticos, Clareamento dental, Facetas em resina, 
Próteses dentárias, Restaurações, Profilaxia e Exodontia.

Atendimento humanizado para todas as idades. Aceitamos os planos Clin e Unidentis, 
além de particular (PIX, cartão e dinheiro).

Agende sua consulta pelo WhatsApp: (83) 99405-8749.
```

### Passo 3 — Serviços a cadastrar

| Serviço | Categoria |
|---------|-----------|
| Consulta Odontológica | Serviços gerais |
| Aparelho Ortodôntico Metálico | Ortodontia |
| Aparelho Ortodôntico Estético | Ortodontia |
| Clareamento Dental a LED | Estética dental |
| Clareamento Caseiro | Estética dental |
| Facetas em Resina | Estética dental |
| Prótese Parcial Removível | Prótese |
| Prótese Total (Dentadura) | Prótese |
| Restauração em Resina | Dentística |
| Profilaxia (Limpeza) | Prevenção |
| Extração Simples | Cirurgia |
| Extração de Siso | Cirurgia |

### Passo 4 — Calendário de posts

**Frequência:** 2 posts por semana (terça e sexta)

| Semana | Terça (educativo) | Sexta (social proof) |
|--------|-------------------|----------------------|
| 1 | "5 sinais de que você precisa de limpeza dental" | Foto do consultório |
| 2 | "Clareamento dental: mitos e verdades" | Resultado antes/depois (com autorização) |
| 3 | "Quando levar a criança ao dentista pela 1ª vez" | Depoimento de paciente |
| 4 | "Dicas para manter o aparelho limpo" | Foto da equipe |

**Template de post:**
```
📋 Título: [Tema]
📝 Texto: 100-300 palavras com dica útil
📸 Foto: Imagem relevante (consultório, resultado, equipe)
🔗 Botão: "Agendar" → link do WhatsApp
```

### Passo 5 — Rotina de manutenção

| Frequência | Ação |
|-----------|------|
| Diário | Verificar e responder avaliações novas |
| 2x/semana | Publicar post no perfil |
| Semanal | Adicionar 1-2 fotos novas |
| Mensal | Atualizar horários especiais (feriados) |
| Trimestral | Revisar descrição e serviços |

### Métricas (disponíveis no painel do Google Business)

| Métrica | Meta mensal |
|---------|-------------|
| Visualizações do perfil | +20% mês a mês |
| Cliques em "Ligar" | >30/mês |
| Cliques em "Site" | >50/mês |
| Solicitações de rota | >20/mês |
| Fotos visualizadas | >500/mês |

---

## 4. Agendamento Online

### Dependência: Calendly / Doctoralia
### Prazo: 1-2 dias para configurar
### Custo: R$ 0-500/mês

### Estratégia recomendada: Calendly Free → avaliar Doctoralia depois

### Passo 1 — Configurar Calendly

1. Criar conta em [calendly.com](https://calendly.com)
2. Definir tipo de evento: "Consulta Odontológica — 40min"
3. Configurar disponibilidade:
   - Seg-Sex: 8h-12h, 14h-18h
   - Sáb: 8h-13h
   - Buffer entre consultas: 10min
4. Adicionar perguntas ao formulário:
   - Nome completo (obrigatório)
   - Telefone (obrigatório)
   - "Qual tratamento deseja?" (dropdown)
   - "Possui plano odontológico?" (sim/não)
   - "Já é paciente?" (sim/não)

### Passo 2 — Integrar no site

**Opção A — Botão popup (menos invasivo):**
```html
<!-- Adicionar no <head> -->
<link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet">

<!-- Botão que abre popup -->
<a href="#" onclick="Calendly.initPopupWidget({url: 'https://calendly.com/drajaquelinesayonara/consulta'});return false;" class="btn-cta">
  Agendar online
</a>

<!-- Antes do </body> -->
<script src="https://assets.calendly.com/assets/external/widget.js" async></script>
```

**Opção B — Embed na página Primeira Consulta:**
```html
<div class="calendly-inline-widget"
     data-url="https://calendly.com/drajaquelinesayonara/consulta"
     style="min-width:320px;height:680px;">
</div>
<script src="https://assets.calendly.com/assets/external/widget.js" async></script>
```

### Passo 3 — Configurar notificações

| Evento | Notificação |
|--------|-------------|
| Agendamento criado | Email + WhatsApp para recepcionista |
| 24h antes | Lembrete por email para paciente |
| 2h antes | Lembrete por WhatsApp (manual ou via integração) |
| Cancelamento | Notificação imediata para reagendar |

### Passo 4 — Fluxo de confirmação

```
Paciente agenda no Calendly
    ↓
Recebe email de confirmação (automático)
    ↓
Recepcionista recebe notificação
    ↓
Recepcionista envia WhatsApp de confirmação (personalizado):
  "Olá, {NOME}! Confirmamos sua consulta para {DATA} às {HORA}.
   Endereço: Rua Lourival Lacerda, 06, sl 207 — Centro, Sapé/PB.
   Qualquer dúvida, estamos aqui! 😊"
    ↓
24h antes: lembrete automático
    ↓
Consulta realizada
    ↓
24h depois: mensagem de avaliação (link Google Reviews)
```

### Quando migrar para Doctoralia

Considerar se:
- Volume > 50 agendamentos/mês pelo site
- Deseja aparecer no marketplace Doctoralia (pacientes buscam lá)
- Precisa de gestão de prontuário integrada

### Métricas

| Métrica | Meta |
|---------|------|
| Agendamentos via site/mês | >10 (início), >30 (3 meses) |
| Taxa de no-show | <15% |
| Conversão visitante → agendamento | 3-5% |

---

## 5. Depoimentos em Vídeo

### Dependência: Produção audiovisual (mínimo: celular bom + tripé)
### Prazo: 2-4 semanas (produção + edição)
### Custo: R$ 0-1.000

### Passo 1 — Selecionar pacientes

**Critérios:**
- Tratamento concluído com resultado visível
- Paciente comunicativo e disposto
- Variedade de tratamentos (1 ortodontia, 1 clareamento, 1 facetas, etc.)
- Autorização por escrito (LGPD)

**Meta:** 3-5 depoimentos iniciais

### Passo 2 — Roteiro de perguntas (guia, não script)

```
1. "Como era sua situação antes do tratamento?"
2. "O que te motivou a procurar a Dra. Jaqueline?"
3. "Como foi a experiência durante o tratamento?"
4. "Qual foi o resultado? Como se sentiu?"
5. "Recomendaria para alguém?"
```

**Duração ideal:** 30-60 segundos por vídeo (máximo 90s)

### Passo 3 — Produção

**Kit mínimo:**
- Celular com câmera boa (iPhone 12+ / Samsung S21+)
- Tripé de celular (~R$ 50)
- Ring light (~R$ 80) ou janela com luz natural
- Microfone de lapela (~R$ 40) — ESSENCIAL para áudio limpo
- Fundo neutro (parede clara do consultório)

**Configurações de gravação:**
- Resolução: 1080p (Full HD)
- Formato: Horizontal (16:9) para site, Vertical (9:16) para Reels
- Iluminação: luz frontal no rosto do paciente
- Áudio: microfone lapela, ambiente silencioso

### Passo 4 — Edição

**Ferramentas gratuitas:**
- CapCut (mobile, fácil)
- DaVinci Resolve (desktop, profissional)

**Estrutura do vídeo editado:**
```
[0-3s]  Logo + nome do paciente (lower third)
[3-45s] Depoimento (cortes nos melhores trechos)
[45-55s] Resultado visual (foto antes/depois ou sorriso)
[55-60s] CTA: "Agende sua consulta" + logo
```

### Passo 5 — Implementação no site

**HTML:**
```html
<section class="testimonials-video fade-in">
  <div>
    <h2 class="section-title">Depoimentos em Vídeo</h2>
    <div class="video-grid">
      <div class="video-card">
        <video controls preload="none" poster="/assets/media/depoimentos/maria-thumb.webp"
               aria-label="Depoimento de Maria sobre clareamento dental">
          <source src="/assets/media/depoimentos/maria-clareamento.mp4" type="video/mp4">
        </video>
        <p class="video-caption">Maria S. — Clareamento Dental</p>
      </div>
      <!-- mais vídeos -->
    </div>
  </div>
</section>
```

**CSS sugerido:**
```css
.video-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

.video-card video {
  width: 100%;
  border-radius: 16px;
  aspect-ratio: 16/9;
  object-fit: cover;
  background: var(--color-surface);
}

.video-caption {
  text-align: center;
  margin-top: 8px;
  font-size: 1.4rem;
  font-weight: 600;
}

@media screen and (min-width: 768px) {
  .video-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media screen and (min-width: 1200px) {
  .video-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### Passo 6 — Otimização

- Comprimir vídeos para <10MB cada (HandBrake, codec H.265)
- Gerar thumbnail WebP para `poster`
- `preload="none"` para não impactar performance
- Hospedar na própria Vercel (cache imutável) ou YouTube embed se >30s

### Termo de autorização (LGPD)

```
AUTORIZAÇÃO DE USO DE IMAGEM E DEPOIMENTO

Eu, _________________________, CPF _______________,
autorizo a Dra. Jaqueline Sayonara (CRO-PB 9833) a utilizar
minha imagem e depoimento em vídeo para fins de divulgação
de serviços odontológicos em website e redes sociais.

Esta autorização é concedida a título gratuito e por prazo
indeterminado, podendo ser revogada a qualquer momento
mediante comunicação por escrito.

Data: ___/___/______
Assinatura: _______________________
```

---

## 6. Blog com Astro + Markdown

### Dependência: Node.js, Astro framework
### Prazo: 1 semana (setup) + contínuo (conteúdo)
### Custo: R$ 0 (técnico) | R$ 300-500/mês se terceirizar conteúdo

### Estratégia: Manter site principal vanilla, blog como subprojeto Astro

### Passo 1 — Setup técnico

```bash
# Na raiz do repositório, criar subdiretório para o blog
mkdir blog && cd blog
npm create astro@latest -- --template blog
```

**Estrutura:**
```
blog/
├── src/
│   ├── content/
│   │   └── posts/         # Artigos em Markdown
│   │       ├── clareamento-dental-sape.md
│   │       └── aparelho-ortodontico-adultos.md
│   ├── layouts/
│   │   └── PostLayout.astro
│   └── pages/
│       ├── index.astro     # Listagem de posts
│       └── [slug].astro    # Página do post
├── astro.config.mjs
└── package.json
```

### Passo 2 — Configuração Astro

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.drajaquelinesayonara.com.br',
  base: '/blog',
  build: {
    format: 'directory'
  }
});
```

### Passo 3 — Template de post

```markdown
---
title: "Clareamento Dental em Sapé: Preço, Duração e Cuidados"
description: "Tudo sobre clareamento dental em Sapé/PB. Tipos, preços médios, duração e cuidados pós-procedimento com a Dra. Jaqueline Sayonara."
pubDate: 2026-07-20
author: "Dra. Jaqueline Sayonara"
image: "/assets/img/blog/clareamento-hero.webp"
tags: ["clareamento", "estética", "sapé"]
---

# Clareamento Dental em Sapé: Guia Completo

O clareamento dental é um dos procedimentos estéticos mais procurados...

## Tipos de Clareamento

### Clareamento no Consultório (LED)
...

### Clareamento Caseiro (Moldeira)
...

## Quanto Custa em Sapé/PB?
...

## Cuidados Após o Procedimento
...

## Perguntas Frequentes
...
```

### Passo 4 — Deploy no Vercel

O blog Astro pode ser deployado como subpath `/blog/` no mesmo projeto Vercel usando rewrites:

```json
// vercel.json (adicionar)
{
  "rewrites": [
    { "source": "/blog/:path*", "destination": "/blog/:path*" }
  ]
}
```

Ou como projeto separado com domínio `www.drajaquelinesayonara.com.br/blog/`.

### Passo 5 — Calendário editorial (primeiros 12 artigos)

| Semana | Artigo | Keywords alvo |
|--------|--------|---------------|
| 1 | Clareamento dental em Sapé: preço e cuidados | clareamento dental sapé, preço clareamento |
| 2 | Aparelho ortodôntico para adultos: vale a pena? | aparelho adulto, ortodontia adulto |
| 3 | Facetas em resina vs. porcelana: qual escolher? | facetas resina, facetas porcelana |
| 4 | Dentista em Sapé que aceita plano Clin | dentista plano clin sapé |
| 5 | Extração de siso: quando é necessário? | extração siso, tirar siso |
| 6 | Como clarear os dentes com segurança | clarear dentes em casa |
| 7 | Prótese dentária: tipos e manutenção | prótese dentária tipos |
| 8 | Primeiro dentista do bebê: quando levar? | dentista bebê, primeira consulta criança |
| 9 | Gengivite: sintomas e tratamento | gengivite tratamento |
| 10 | Quanto custa tratamento ortodôntico na PB | preço aparelho paraíba |
| 11 | Plano Unidentis: o que cobre? | unidentis cobertura |
| 12 | Dor de dente à noite: o que fazer? | dor dente noite, emergência dental |

### Passo 6 — SEO de cada artigo

**Checklist por post:**
- [ ] Title tag com keyword principal + localização
- [ ] Meta description com 150-160 caracteres
- [ ] H1 = title do post
- [ ] H2 para cada seção principal
- [ ] Alt text em todas as imagens
- [ ] Link interno para página de tratamento relevante
- [ ] Link interno para "Primeira Consulta"
- [ ] CTA WhatsApp no final
- [ ] Schema.org Article com author, datePublished

### Métricas

| Métrica | Meta (6 meses) |
|---------|----------------|
| Artigos publicados | 12 |
| Tráfego orgânico do blog | >200 visitas/mês |
| Keywords ranqueadas (top 10) | >15 |
| Conversões blog → WhatsApp | >5/mês |

---

## 7. WhatsApp Business API

### Dependência: Meta Cloud API / 360dialog
### Prazo: 2-4 semanas (aprovação + setup)
### Custo: R$ 200-500/mês
### Quando: Volume > 50 conversas/mês ou necessidade de multi-atendente

### Passo 1 — Avaliar se é o momento

**Migrar quando:**
- [ ] Volume > 50 conversas/mês via WhatsApp
- [ ] Mais de 1 pessoa precisa responder mensagens
- [ ] Perda mensurável de pacientes por demora na resposta
- [ ] Deseja enviar mensagens em massa (lembretes, promoções)

**NÃO migrar se:**
- Volume < 30 conversas/mês (ManyChat free resolve)
- Apenas 1 pessoa atende
- Orçamento não comporta custo fixo mensal

### Passo 2 — Escolher provedor

| Provedor | Setup | Custo mensal | Mensagem | Painel |
|----------|-------|-------------|----------|--------|
| **Meta Cloud API** (direto) | Complexo (developer) | R$ 0 | ~R$ 0,25/msg | Sem painel (precisa construir) |
| **360dialog** | Médio | R$ 200 | ~R$ 0,15/msg | Painel básico |
| **Twilio** | Fácil | USD 15 | USD 0,005/msg | Dashboard completo |
| **WATI** | Fácil | R$ 250 | Incluído no plano | Dashboard + chatbot |

**Recomendação:** WATI para dentista solo (mais fácil, painel completo, chatbot incluído).

### Passo 3 — Fluxos automatizados com API

**Templates de mensagem (precisam aprovação da Meta):**

Template 1 — Confirmação de agendamento:
```
Olá {{1}}! 😊

Sua consulta com a Dra. Jaqueline Sayonara está confirmada:

📅 Data: {{2}}
🕐 Horário: {{3}}
📍 Local: Rua Lourival Lacerda, 06, sl 207 — Centro, Sapé/PB

Caso precise reagendar, responda esta mensagem.

Até lá! 🦷
```

Template 2 — Lembrete 24h:
```
Olá {{1}}! Lembrando que sua consulta é amanhã:

📅 {{2}} às {{3}}
📍 Rua Lourival Lacerda, 06, sl 207

Precisa reagendar? Responda aqui.
Até amanhã! 😊
```

Template 3 — Pós-consulta (avaliação):
```
Olá {{1}}! Esperamos que esteja tudo bem após sua consulta.

Se puder, sua avaliação no Google nos ajuda muito:
👉 {{2}}

Agradecemos de coração! 💛
```

### Passo 4 — Métricas da API

| Métrica | Meta |
|---------|------|
| Taxa de entrega | >95% |
| Taxa de leitura | >80% |
| Tempo de primeira resposta | <30min (horário comercial) |
| Taxa de no-show (com lembrete) | <10% |
| Custo por agendamento | <R$ 5 |

---

## 8. Analytics e Rastreamento

### Dependência: Plausible / Vercel Analytics / Google Search Console
### Prazo: 30 minutos (Search Console) + 1 hora (analytics)
### Custo: R$ 0-9/mês

### Estratégia: Search Console (imediato) + Plausible (quando priorizar dados de comportamento)

### Passo 1 — Google Search Console (FAZER PRIMEIRO — R$ 0)

1. Acessar [search.google.com/search-console](https://search.google.com/search-console)
2. Adicionar propriedade: `https://www.drajaquelinesayonara.com.br`
3. Verificar via:
   - **Recomendado:** arquivo HTML (já existe `google962378b089d1b19d.html` no projeto!)
   - Alternativa: meta tag no `<head>`
4. Submeter sitemap: `https://www.drajaquelinesayonara.com.br/sitemap.xml`

**O que monitorar:**
- Queries que geram impressões (descobrir keywords orgânicas)
- Posição média por keyword
- CTR por página
- Erros de indexação
- Core Web Vitals (dados reais de campo)

### Passo 2 — Plausible Analytics (R$ 9/mês)

**Por que Plausible:**
- Não usa cookies → NÃO precisa de banner LGPD
- Script de 1KB → impacto zero no Lighthouse
- Dashboard simples e claro
- Dados na UE (GDPR compliant)

**Instalação:**
```html
<!-- Adicionar antes do </head> -->
<script defer data-domain="drajaquelinesayonara.com.br"
        src="https://plausible.io/js/script.js"></script>
```

**Eventos customizados a rastrear:**
```html
<!-- Clique no WhatsApp (todos os botões) -->
<a href="https://wa.me/..." class="btn-cta"
   onclick="plausible('WhatsApp Click', {props: {page: 'home', button: 'hero'}})">
  Agendar consulta
</a>

<!-- Abertura do lightbox -->
<!-- No main.js, adicionar: -->
if (window.plausible) plausible('Lightbox Open', {props: {image: imgSrc}});

<!-- Clique em "Ver todas no Google" -->
<a href="..." onclick="plausible('Google Reviews Click')">Ver todas no Google →</a>
```

### Passo 3 — Alternativa gratuita: Vercel Web Analytics

Se já está na Vercel (está!), pode ativar o Vercel Analytics no painel:
1. Dashboard Vercel → projeto → Analytics → Enable
2. Adiciona automaticamente, sem script manual
3. Limitação: dados menos granulares que Plausible

### Passo 4 — Dashboard de acompanhamento

**Revisão semanal (15 min):**
- Top 5 páginas mais acessadas
- Top 5 queries no Search Console
- Cliques em WhatsApp (se Plausible ativo)
- Erros de indexação

**Revisão mensal (30 min):**
- Crescimento de tráfego orgânico (% vs mês anterior)
- Novas keywords ranqueadas
- Páginas com alto impression mas baixo CTR (otimizar title/description)
- Core Web Vitals (manter verde)

---

## 9. Google Ads Local

### Dependência: Conta Google Ads + cartão de crédito
### Prazo: 2-3 dias (setup + aprovação)
### Custo: R$ 500-2.000/mês
### Quando: Deseja resultados imediatos enquanto SEO orgânico amadurece

### Passo 1 — Criar conta e vincular

1. Criar conta em [ads.google.com](https://ads.google.com)
2. Vincular Google Business Profile (para extensão de local)
3. Vincular Search Console (para dados de keywords)
4. Configurar conversão: clique no botão WhatsApp

### Passo 2 — Campanha de busca local

**Configuração:**
- Tipo: Campanha de busca (Search)
- Objetivo: Leads (ligações + mensagens)
- Localização: Sapé/PB + raio de 30km
- Idioma: Português
- Orçamento diário: R$ 30-50 (início)
- Estratégia de lance: Maximizar conversões

### Passo 3 — Grupos de anúncios e keywords

**Grupo 1 — Genérico (dentista)**
```
Keywords:
- dentista sapé
- dentista sapé pb
- clinica odontologica sapé
- dentista perto de mim (com geo)
- consultorio dentario sapé

Anúncio:
Título 1: Dentista em Sapé PB | Dra. Jaqueline
Título 2: Agende Pelo WhatsApp Agora
Título 3: Nota 5.0 no Google ⭐
Descrição: Cirurgiã-dentista especialista em Ortodontia. Clareamento, facetas, próteses. Aceitamos Clin e Unidentis. Agende hoje!
```

**Grupo 2 — Ortodontia**
```
Keywords:
- ortodontista sapé
- aparelho dentario sapé
- ortodontia sapé pb
- aparelho ortodontico preço paraiba

Anúncio:
Título 1: Aparelho Ortodôntico em Sapé PB
Título 2: Especialista em Ortodontia | CRO 9833
Título 3: Agende Sua Avaliação Gratuita
Descrição: Dra. Jaqueline Sayonara — Especialista em Ortodontia. Aparelhos metálico e estético. Parcelamento no cartão. Agende pelo WhatsApp!
```

**Grupo 3 — Estética**
```
Keywords:
- clareamento dental sapé
- facetas dentarias sapé
- lente de contato dental sapé
- clareamento a laser sapé

Anúncio:
Título 1: Clareamento Dental em Sapé PB
Título 2: Resultado em 1 Sessão | Agende Hoje
Título 3: Dra. Jaqueline Sayonara ⭐ 5.0
Descrição: Clareamento dental com LED e facetas em resina. Dentes mais brancos em 1 hora. Consultório no Centro de Sapé. WhatsApp: Agende agora!
```

### Passo 4 — Extensões do anúncio

| Extensão | Configuração |
|----------|-------------|
| Local | Endereço do Google Business Profile |
| Ligação | (83) 99405-8749 |
| Sitelinks | "Clareamento", "Ortodontia", "Primeira Consulta", "Planos Aceitos" |
| Frase de destaque | "Aceitamos Clin e Unidentis", "Nota 5.0 no Google", "Parcelamos no cartão" |
| Preço | "Consulta a partir de R$ X" (se aplicável) |

### Passo 5 — Landing page por campanha

Cada grupo de anúncio deve levar para a página mais relevante:
- Genérico → Home ou Primeira Consulta
- Ortodontia → `/tratamentos/aparelho-ortodontico/`
- Estética → `/tratamentos/clareamento-dental/`

### Passo 6 — Otimização contínua

| Frequência | Ação |
|-----------|------|
| Diário (1ª semana) | Verificar gastos, pausar keywords caras sem conversão |
| Semanal | Adicionar keywords negativas, ajustar lances |
| Quinzenal | Testar novos textos de anúncio (A/B) |
| Mensal | Relatório de ROI, ajustar orçamento |

### Métricas

| Métrica | Meta |
|---------|------|
| CPC médio | <R$ 3 |
| CTR | >5% |
| Taxa de conversão (clique→WhatsApp) | >10% |
| Custo por lead | <R$ 30 |
| ROAS | >5x |

---

## 10. Teleconsulta

### Dependência: Google Meet / Zoom
### Prazo: 1 dia
### Custo: R$ 0

### Quando usar
- Triagem inicial para pacientes de cidades distantes
- Acompanhamento pós-procedimento (verificar cicatrização)
- Consultoria estética (paciente quer saber opções antes de ir presencialmente)

### Passo 1 — Configurar sala fixa no Google Meet

1. Criar uma sala recorrente no Google Calendar
2. Gerar link fixo (não expira): `https://meet.google.com/xxx-yyyy-zzz`
3. Reservar horários específicos para teleconsulta (ex: sexta 16h-18h)

### Passo 2 — Fluxo de agendamento

```
Paciente solicita via WhatsApp
    ↓
Recepcionista verifica agenda e confirma horário
    ↓
Envia link do Google Meet + instruções:
  "Olá! Sua avaliação virtual está marcada para {DATA} às {HORA}.
   Acesse pelo link: {LINK_MEET}
   Dicas: ambiente bem iluminado, câmera frontal, mostre a região
   que deseja tratar."
    ↓
Consulta realizada (15-20min)
    ↓
Orientação: "Para prosseguir, precisaremos de consulta presencial
para exame completo e radiografia."
    ↓
Agendar presencial
```

### Passo 3 — Implementação no site

```html
<!-- Na página Primeira Consulta ou como seção separada -->
<div class="teleconsulta-cta">
  <h3>Mora longe? Faça uma avaliação virtual</h3>
  <p>Consulta inicial de 15 minutos por vídeo, sem sair de casa.</p>
  <a href="https://wa.me/+5583994058749?text=Olá!%20Gostaria%20de%20agendar%20uma%20avaliação%20virtual" class="btn-about">
    Agendar avaliação virtual
  </a>
</div>
```

### Limitações legais
- Teleconsulta NÃO substitui consulta presencial para diagnóstico
- Usar como triagem/orientação, não como diagnóstico definitivo
- Documentar no prontuário

### Métricas

| Métrica | Meta |
|---------|------|
| Teleconsultas/mês | 3-5 (início) |
| Conversão tele → presencial | >50% |
| Satisfação | >4/5 |

---

## 11. Tour Virtual 360°

### Dependência: Fotógrafo Google certificado ou câmera 360°
### Prazo: 1-2 semanas (agendamento + publicação)
### Custo: R$ 500-1.500 (único)

### Passo 1 — Contratar fotógrafo Google Street View

1. Buscar "fotógrafo google street view paraíba" ou "trusted photographer google paraíba"
2. Solicitar orçamento para tour virtual de consultório (~5-8 fotos 360°)
3. Agendar sessão em dia que o consultório esteja impecável

**Ambientes a fotografar:**
- Recepção/sala de espera
- Sala de atendimento principal
- Sala de raio-X (se houver)
- Corredor/visão geral
- Fachada do prédio

### Passo 2 — Publicação

O fotógrafo publica diretamente no Google Business Profile. Aparece:
- Na ficha do Google Maps (seção "Ver por dentro")
- Na busca do Google quando clicam na empresa
- Pode ser embedado no site

### Passo 3 — Embed no site

```html
<!-- Na seção de Localização ou página Primeira Consulta -->
<div class="virtual-tour">
  <h3>Conheça nosso espaço</h3>
  <iframe src="https://www.google.com/maps/embed?pb=!4v...!6m1!1e1"
          width="100%" height="400" style="border:0; border-radius: 16px;"
          allowfullscreen loading="lazy"
          title="Tour virtual do consultório da Dra. Jaqueline Sayonara">
  </iframe>
</div>
```

### Alternativa DIY (câmera 360°)

Se preferir fazer internamente:
1. Câmera Ricoh Theta SC2 (~R$ 2.000) ou alugar
2. App Google Street View para publicar
3. Qualidade inferior à profissional, mas funcional

### Métricas

| Métrica | Verificação |
|---------|-------------|
| Tour publicado no Google | Visível no Maps |
| Visualizações do tour | Painel Google Business |
| Impacto em conversão | Comparar agendamentos antes/depois |

---

## 12. Formulário de Contato

### Dependência: Formspree / Web3Forms
### Prazo: 1-2 horas
### Custo: R$ 0

### Quando usar
- Canal alternativo para quem não quer usar WhatsApp
- Pacientes corporativos que preferem email
- Captura de dados estruturados (nome, tratamento, horário)

### Passo 1 — Criar conta Formspree

1. Acessar [formspree.io](https://formspree.io)
2. Criar formulário (free: 50 envios/mês)
3. Copiar endpoint: `https://formspree.io/f/SEU_ID`
4. Configurar email de notificação (email da recepcionista)

### Passo 2 — HTML do formulário

```html
<section id="contato" class="fade-in">
  <div>
    <h2 class="section-title">Entre em Contato</h2>
    <p class="contact-subtitle">Prefere não usar WhatsApp? Envie uma mensagem por aqui.</p>

    <form action="https://formspree.io/f/SEU_ID" method="POST" class="contact-form">
      <!-- Honeypot anti-spam -->
      <input type="text" name="_gotcha" style="display:none">

      <div class="form-group">
        <label for="name">Nome completo *</label>
        <input type="text" id="name" name="name" required autocomplete="name"
               placeholder="Seu nome">
      </div>

      <div class="form-group">
        <label for="phone">Telefone *</label>
        <input type="tel" id="phone" name="phone" required autocomplete="tel"
               placeholder="(83) 99999-9999">
      </div>

      <div class="form-group">
        <label for="email">Email (opcional)</label>
        <input type="email" id="email" name="email" autocomplete="email"
               placeholder="seu@email.com">
      </div>

      <div class="form-group">
        <label for="service">Qual tratamento?</label>
        <select id="service" name="service">
          <option value="">Selecione...</option>
          <option value="ortodontia">Aparelho Ortodôntico</option>
          <option value="clareamento">Clareamento Dental</option>
          <option value="facetas">Facetas Dentárias</option>
          <option value="protese">Prótese Dentária</option>
          <option value="restauracao">Restauração</option>
          <option value="profilaxia">Profilaxia (Limpeza)</option>
          <option value="exodontia">Exodontia (Extração)</option>
          <option value="outro">Outro</option>
        </select>
      </div>

      <div class="form-group">
        <label for="message">Mensagem (opcional)</label>
        <textarea id="message" name="message" rows="4"
                  placeholder="Descreva brevemente sua necessidade..."></textarea>
      </div>

      <button type="submit" class="btn-cta">Enviar mensagem</button>
    </form>
  </div>
</section>
```

### Passo 3 — CSS do formulário

```css
.contact-form {
  max-width: 600px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--logo-pallete-velvety-cherry);
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1.5px solid #a2535633;
  border-radius: 12px;
  font-family: inherit;
  font-size: 1.5rem;
  background: var(--color-surface);
  color: var(--color-text);
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--logo-pallete-velvety-cherry);
  box-shadow: 0 0 0 3px #a2535620;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.contact-subtitle {
  text-align: center;
  color: var(--color-text-muted);
  margin-bottom: 32px;
  font-size: 1.5rem;
}

.contact-form .btn-cta {
  width: 100%;
  border: none;
  cursor: pointer;
  font-family: inherit;
  animation: none;
}
```

### Passo 4 — Página de agradecimento

Configurar no Formspree: redirecionar para `/obrigado/` após envio.

```html
<!-- obrigado/index.html -->
<section class="cta-final">
  <h1 class="section-title">Mensagem enviada! ✓</h1>
  <p class="cta-final-text">Recebemos seu contato e retornaremos em até 24h úteis.</p>
  <a href="/" class="btn-cta">Voltar ao site</a>
</section>
```

### Passo 5 — Onde posicionar no site

- **Opção A:** Seção no footer da home (abaixo do CTA final)
- **Opção B:** Página dedicada `/contato/`
- **Opção C:** Na página "Primeira Consulta" como alternativa ao WhatsApp

### Métricas

| Métrica | Meta |
|---------|------|
| Envios/mês | 5-10 (canal secundário) |
| Tempo de resposta | <24h úteis |
| Taxa de conversão form → paciente | >30% |

---

## Checklist de Implementação por Mês

### Mês 1 — Fundação (R$ 0)

```
□ Verificar Google Search Console (30 min)
□ Submeter sitemap no Search Console (5 min)
□ Auditar e otimizar Google Business Profile (2h)
□ Criar link de avaliação + QR Code (30 min)
□ Posicionar QR no consultório (material impresso)
□ Iniciar envio de mensagens pós-consulta (processo)
□ Definir rotina de posts no Google Business (calendário)
□ Publicar primeiro post no Google Business
```

### Mês 2 — Automação (R$ 0-100/mês)

```
□ Configurar ManyChat free (chatbot WhatsApp básico)
□ Testar fluxo de boas-vindas
□ Configurar fluxo fora do horário
□ Avaliar Plausible ou Vercel Analytics
□ Instalar analytics (se decidir)
□ Agendar gravação de 2-3 depoimentos em vídeo
□ Gravar depoimentos
□ Continuar coleta de avaliações (meta: 15-20 total)
```

### Mês 3 — Conversão (R$ 50-200/mês)

```
□ Configurar Calendly free (agendamento online)
□ Integrar Calendly no site (embed ou popup)
□ Editar e publicar vídeos de depoimento
□ Adicionar vídeos ao site
□ Analisar dados do Search Console (keywords, oportunidades)
□ Decidir sobre Google Ads (baseado em dados)
□ Se Ads: criar campanha inicial com R$ 500/mês
□ Meta de avaliações: 25-30 total
```

### Mês 4-6 — Escala

```
□ Iniciar blog (setup Astro ou páginas estáticas)
□ Publicar 4-6 artigos
□ Avaliar migração para WhatsApp Business API
□ Tour virtual 360° (se budget permitir)
□ Formulário de contato (se demanda justificar)
□ Teleconsulta (testar com 3-5 pacientes)
□ Otimizar Google Ads (se ativo)
□ Meta de avaliações: 40-50 total
```

---

## Resumo de Investimento por Fase

| Fase | Custo/mês | ROI esperado |
|------|-----------|-------------|
| Mês 1 (Fundação) | R$ 0 | Baseline + 20% visibilidade |
| Mês 2 (Automação) | R$ 0-100 | +30% captura de leads |
| Mês 3 (Conversão) | R$ 50-200 | +50% agendamentos |
| Mês 4-6 (Escala) | R$ 200-2.000 | +100% tráfego orgânico |

**Princípio fundamental:** Medir antes de gastar. Cada investimento deve ser baseado em dados do período anterior, não em suposição.
