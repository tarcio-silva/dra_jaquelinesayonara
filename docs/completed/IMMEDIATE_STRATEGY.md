# Estratégia de Implementação — Melhorias Imediatas

> Guia técnico passo-a-passo para implementar cada item do `IMMEDIATE_IMPROVEMENTS.md`.  
> Cada seção inclui: arquivos a criar/modificar, código completo, testes e critérios de aceitação.

**Referência:** [IMMEDIATE_IMPROVEMENTS.md](./IMMEDIATE_IMPROVEMENTS.md)  
**Última atualização:** Julho 2026

---

## Índice

1. [Expandir areaServed no Schema.org](#1-expandir-areaserved-no-schemaorg)
2. [Seção FAQ na Página Principal](#2-seção-faq-na-página-principal)
3. [Breadcrumb Schema.org](#3-breadcrumb-schemaorg)
4. [Página "Primeira Consulta"](#4-página-primeira-consulta)
5. [Conteúdo GEO nas Páginas de Tratamento](#5-conteúdo-geo-nas-páginas-de-tratamento)
6. [Páginas de Área de Atendimento](#6-páginas-de-área-de-atendimento)
7. [Slider Interativo Antes/Depois](#7-slider-interativo-antesdepois)
8. [Página Hub de Tratamentos](#8-página-hub-de-tratamentos)
9. [Micro-interações CSS](#9-micro-interações-css)

---

## 1. Expandir areaServed no Schema.org

### Esforço: 5 minutos | Arquivo: `index.html`

### Passo a passo

1. Abrir `index.html`
2. Localizar o bloco `"areaServed"` no JSON-LD (~linha 78)
3. Substituir o objeto único por array de cidades

### Código atual
```json
"areaServed": {
  "@type": "City",
  "name": "Sapé",
  "containedInPlace": {
    "@type": "State",
    "name": "Paraíba"
  }
}
```

### Código novo
```json
"areaServed": [
  { "@type": "City", "name": "Sapé", "containedInPlace": { "@type": "State", "name": "Paraíba" } },
  { "@type": "City", "name": "Mari", "containedInPlace": { "@type": "State", "name": "Paraíba" } },
  { "@type": "City", "name": "Sobrado", "containedInPlace": { "@type": "State", "name": "Paraíba" } },
  { "@type": "City", "name": "Cruz do Espírito Santo", "containedInPlace": { "@type": "State", "name": "Paraíba" } },
  { "@type": "City", "name": "Riachão do Poço", "containedInPlace": { "@type": "State", "name": "Paraíba" } },
  { "@type": "City", "name": "Pilar", "containedInPlace": { "@type": "State", "name": "Paraíba" } },
  { "@type": "City", "name": "Caldas Brandão", "containedInPlace": { "@type": "State", "name": "Paraíba" } }
]
```

### Validação
- Testar no [Google Rich Results Test](https://search.google.com/test/rich-results)
- Verificar que `npm test` continua passando (teste de SEO valida JSON-LD)

### Critério de aceitação
- [ ] JSON-LD válido sem erros no Rich Results Test
- [ ] Array com 7 cidades no `areaServed`
- [ ] Testes passando

---

## 2. Seção FAQ na Página Principal

### Esforço: 1-2 horas | Arquivos: `index.html`, `assets/css/faq.css` (novo)

### Passo a passo

1. Criar o CSS do FAQ
2. Adicionar a seção HTML antes do CTA final
3. Adicionar Schema.org FAQPage no `<head>`
4. Importar o CSS no bundle

### 2.1. CSS (`assets/css/faq.css`)

```css
#faq {
  padding: 64px 24px;
}

#faq .section-title {
  margin-bottom: 24px;
}

.faq-container {
  max-width: 800px;
  margin: 0 auto;
}

.faq-container details {
  border: 1px solid #a2535614;
  background: var(--color-surface);
  border-radius: 12px;
  margin-bottom: 12px;
  padding: 16px 20px;
  transition: box-shadow 0.2s;
}

.faq-container details[open] {
  box-shadow: var(--shadow-sm);
}

.faq-container summary {
  cursor: pointer;
  color: var(--logo-pallete-velvety-cherry);
  font-size: 1.6rem;
  font-weight: 600;
  list-style: none;
  display: flex;
  align-items: center;
  gap: 12px;
}

.faq-container summary::before {
  content: "+";
  color: var(--color-accent);
  font-size: 2rem;
  font-weight: 300;
  transition: transform 0.2s;
}

.faq-container details[open] summary::before {
  content: "−";
}

.faq-container summary::-webkit-details-marker {
  display: none;
}

.faq-container details p {
  color: var(--color-text-muted);
  margin-top: 12px;
  font-size: 1.5rem;
  line-height: 1.7;
}

@media only screen and (max-width: 1199px) {
  #faq {
    padding: 40px 16px;
  }
}
```

### 2.2. HTML (inserir antes da seção CTA final)

```html
<section id="faq" class="fade-in">
  <div>
    <h2 class="section-title">Perguntas Frequentes</h2>
    <div class="faq-container">
      <details>
        <summary>Quais planos odontológicos são aceitos?</summary>
        <p>Atendemos pelos planos Clin e Unidentis. Também aceitamos particular com pagamento via PIX, cartão de crédito, cartão de débito e dinheiro.</p>
      </details>
      <details>
        <summary>Qual o horário de atendimento?</summary>
        <p>Segunda a sexta das 8h às 12h e das 14h às 18h. Sábados das 8h às 13h. Para emergências fora do horário, entre em contato pelo WhatsApp.</p>
      </details>
      <details>
        <summary>Como agendar uma consulta?</summary>
        <p>Você pode agendar pelo WhatsApp clicando no botão abaixo, ou ligando para (83) 99405-8749. Respondemos em até 2 horas durante o horário comercial.</p>
      </details>
      <details>
        <summary>A Dra. Jaqueline atende crianças?</summary>
        <p>Sim! Atendemos pacientes de todas as idades, desde a primeira consulta do bebê até tratamentos para adultos e idosos.</p>
      </details>
      <details>
        <summary>Quais tratamentos estão disponíveis?</summary>
        <p>Oferecemos ortodontia (aparelhos), clareamento dental, facetas em resina, próteses dentárias, restaurações, profilaxia (limpeza) e exodontia (extrações).</p>
      </details>
      <details>
        <summary>O consultório atende pacientes de outras cidades?</summary>
        <p>Sim! Além de Sapé, atendemos pacientes de Mari, Sobrado, Cruz do Espírito Santo, Riachão do Poço, Pilar e Caldas Brandão.</p>
      </details>
    </div>
  </div>
</section>
```

### 2.3. Schema.org FAQPage (adicionar como segundo `<script type="application/ld+json">`)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Quais planos odontológicos a Dra. Jaqueline aceita?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Atendemos pelos planos Clin e Unidentis. Também aceitamos particular com pagamento via PIX, cartão de crédito, cartão de débito e dinheiro."
      }
    },
    {
      "@type": "Question",
      "name": "Qual o horário de atendimento do consultório em Sapé?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Segunda a sexta das 8h às 12h e das 14h às 18h. Sábados das 8h às 13h."
      }
    },
    {
      "@type": "Question",
      "name": "Como agendar uma consulta com a Dra. Jaqueline Sayonara?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Você pode agendar pelo WhatsApp no número (83) 99405-8749 ou clicando no botão de agendamento no site. Respondemos em até 2 horas durante o horário comercial."
      }
    },
    {
      "@type": "Question",
      "name": "A Dra. Jaqueline atende crianças?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sim! Atendemos pacientes de todas as idades, desde a primeira consulta do bebê até tratamentos para adultos e idosos."
      }
    },
    {
      "@type": "Question",
      "name": "Quais tratamentos odontológicos estão disponíveis em Sapé?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Oferecemos ortodontia (aparelhos), clareamento dental, facetas em resina, próteses dentárias, restaurações, profilaxia (limpeza) e exodontia (extrações)."
      }
    },
    {
      "@type": "Question",
      "name": "O consultório atende pacientes de outras cidades além de Sapé?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sim! Além de Sapé, atendemos pacientes de Mari, Sobrado, Cruz do Espírito Santo, Riachão do Poço, Pilar e Caldas Brandão."
      }
    }
  ]
}
```

### 2.4. Integração no build

Adicionar no `assets/css/styles.css`:
```css
@import "./faq.css";
```

Depois rodar `./build-css.sh` para gerar o bundle minificado.

### Validação
- Google Rich Results Test: verificar FAQPage detectado
- Visual: abrir/fechar cada `<details>` no mobile e desktop
- Acessibilidade: navegar com Tab + Enter/Space
- `npm test` passando

### Critério de aceitação
- [ ] 6 perguntas visíveis na home, acima do CTA final
- [ ] Schema.org FAQPage válido
- [ ] Animação de abertura/fechamento funcional
- [ ] Dark mode compatível (herda variáveis)
- [ ] Responsivo (mobile e desktop)

---

## 3. Breadcrumb Schema.org

### Esforço: 15 minutos | Arquivos: `index.html`, páginas de tratamento

### Passo a passo

Adicionar `BreadcrumbList` Schema.org como um bloco JSON-LD separado.

### Na home (`index.html`)
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Início",
      "item": "https://www.drajaquelinesayonara.com.br/"
    }
  ]
}
```

### Nas páginas de tratamento (ex: `tratamentos/clareamento-dental/index.html`)
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Início",
      "item": "https://www.drajaquelinesayonara.com.br/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Tratamentos",
      "item": "https://www.drajaquelinesayonara.com.br/tratamentos/"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Clareamento Dental",
      "item": "https://www.drajaquelinesayonara.com.br/tratamentos/clareamento-dental/"
    }
  ]
}
```

### Mapeamento de nomes por página

| Página | `name` no breadcrumb |
|--------|---------------------|
| aparelho-ortodontico | Aparelho Ortodôntico |
| clareamento-dental | Clareamento Dental |
| exodontia | Exodontia |
| facetas-dentarias | Facetas Dentárias |
| profilaxia | Profilaxia |
| protese-dentaria | Prótese Dentária |
| restauracao-dentaria | Restauração Dentária |

### Validação
- Rich Results Test: BreadcrumbList detectado
- Verificar que os breadcrumbs visuais (já existentes) correspondem ao Schema

### Critério de aceitação
- [ ] Schema.org BreadcrumbList na home
- [ ] Schema.org BreadcrumbList nas 7 páginas de tratamento
- [ ] URLs corretas e absolutas em cada `item`

---

## 4. Página "Primeira Consulta"

### Esforço: 2-3 horas | Arquivos novos: `primeira-consulta/index.html`

### Passo a passo

1. Criar diretório `primeira-consulta/`
2. Copiar estrutura base das páginas de tratamento (header, footer, CSS inline, dark mode)
3. Adaptar conteúdo específico
4. Adicionar ao sitemap.xml
5. Linkar na navegação (offcanva + desktop)

### Estrutura de diretório
```
primeira-consulta/
└── index.html
```

### Meta tags
```html
<title>Primeira Consulta | Dentista em Sapé PB | Dra. Jaqueline Sayonara</title>
<meta name="description" content="Saiba o que esperar na sua primeira consulta odontológica com a Dra. Jaqueline Sayonara em Sapé/PB. Atendimento humanizado, sem dor. Agende pelo WhatsApp.">
<meta name="keywords" content="primeira consulta dentista sapé, consulta odontológica sapé pb, dentista primeira vez, avaliação dental sapé">
<link rel="canonical" href="https://www.drajaquelinesayonara.com.br/primeira-consulta/">
```

### Estrutura de conteúdo (seções)

```html
<!-- Breadcrumb -->
<nav class="breadcrumb" aria-label="Navegação">
  <ol>
    <li><a href="/">Início</a></li>
    <li><span aria-current="page">Primeira Consulta</span></li>
  </ol>
</nav>

<!-- Hero -->
<section class="treatment-hero">
  <div>
    <div>
      <h1>Sua Primeira Consulta</h1>
      <p class="treatment-subtitle">Atendimento acolhedor, sem julgamento. Saiba exatamente o que esperar.</p>
      <a href="https://wa.me/+5583994058749?text=Olá!%20Gostaria%20de%20agendar%20minha%20primeira%20consulta" class="btn-cta">Agendar minha consulta</a>
    </div>
    <img src="/assets/img/about/dra-jaqueline-sayonara-sobre.webp" alt="Dra. Jaqueline Sayonara no consultório" loading="lazy">
  </div>
</section>

<!-- Conteúdo -->
<section class="treatment-content">
  <div>
    <h2>O que esperar</h2>
    <p>A primeira consulta dura aproximadamente 30-40 minutos...</p>
    <ul>
      <li>Conversa inicial sobre suas queixas e expectativas</li>
      <li>Exame clínico completo (indolor)</li>
      <li>Radiografia panorâmica (se necessário)</li>
      <li>Plano de tratamento personalizado</li>
      <li>Esclarecimento de dúvidas sobre valores e prazos</li>
    </ul>

    <h2>O que trazer</h2>
    <ul>
      <li>Documento de identidade (RG ou CNH)</li>
      <li>Carteirinha do plano odontológico (se tiver)</li>
      <li>Exames anteriores ou radiografias (se houver)</li>
      <li>Lista de medicamentos em uso</li>
    </ul>

    <h2>Formas de pagamento</h2>
    <ul>
      <li>PIX (transferência instantânea)</li>
      <li>Cartão de crédito (parcelamento disponível)</li>
      <li>Cartão de débito</li>
      <li>Dinheiro</li>
      <li>Planos: Clin e Unidentis</li>
    </ul>

    <h2>Horários disponíveis</h2>
    <p>Segunda a sexta: 8h às 12h e 14h às 18h<br>
    Sábados: 8h às 13h</p>

    <h2>Localização</h2>
    <p>Rua Lourival Lacerda, 06, Sala 207 — Centro, Sapé/PB<br>
    CEP: 58340-000</p>
    <p><a href="https://www.google.com/maps/dir//Consultório+dra+Jaqueline+Sayonara,+R.+Lourival+Lacerda,+06+-+Centro,+Sapé+-+PB" target="_blank" rel="noopener noreferrer">Como chegar →</a></p>

    <!-- FAQ específico -->
    <div class="treatment-faq">
      <h2>Dúvidas sobre a primeira consulta</h2>
      <details>
        <summary>A primeira consulta dói?</summary>
        <p>Não. A primeira consulta é apenas um exame visual e conversa. Nenhum procedimento invasivo é realizado sem sua autorização prévia.</p>
      </details>
      <details>
        <summary>Preciso estar em jejum?</summary>
        <p>Não é necessário jejum. Apenas evite fazer refeições pesadas imediatamente antes da consulta para maior conforto.</p>
      </details>
      <details>
        <summary>Posso levar acompanhante?</summary>
        <p>Sim! Acompanhantes são bem-vindos, especialmente para pacientes menores de idade.</p>
      </details>
      <details>
        <summary>Quanto custa a primeira consulta?</summary>
        <p>Entre em contato pelo WhatsApp para informações sobre valores. Atendemos particular e pelos planos Clin e Unidentis.</p>
      </details>
    </div>
  </div>
</section>

<!-- CTA Final -->
<section class="cta-final">
  <h2 class="section-title">Pronto para cuidar do seu sorriso?</h2>
  <p class="cta-final-text">Agende sua primeira consulta. Atendimento acolhedor em Sapé e região.</p>
  <a href="https://wa.me/+5583994058749?text=Olá!%20Gostaria%20de%20agendar%20minha%20primeira%20consulta" class="btn-cta">Agendar pelo WhatsApp</a>
</section>
```

### Schema.org
```json
{
  "@context": "https://schema.org",
  "@type": "MedicalWebPage",
  "name": "Primeira Consulta — Dra. Jaqueline Sayonara",
  "description": "Informações sobre a primeira consulta odontológica com a Dra. Jaqueline Sayonara em Sapé/PB",
  "url": "https://www.drajaquelinesayonara.com.br/primeira-consulta/",
  "about": {
    "@type": "MedicalProcedure",
    "name": "Consulta Odontológica Inicial",
    "procedureType": "http://schema.org/DiagnosticProcedure"
  },
  "mainContentOfPage": {
    "@type": "WebPageElement",
    "cssSelector": ".treatment-content"
  }
}
```

### Atualizar sitemap.xml
```xml
<url>
  <loc>https://www.drajaquelinesayonara.com.br/primeira-consulta/</loc>
  <lastmod>2026-07-18</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

### Links internos a adicionar
- Hero da home: link "Conheça nosso atendimento" → `/primeira-consulta/`
- Menu offcanva: item novo (opcional)
- Footer: link "Primeira Consulta"
- Cada página de tratamento: CTA "Primeira vez? Saiba o que esperar →"

### Critério de aceitação
- [ ] Página acessível em `/primeira-consulta/`
- [ ] Schema.org MedicalWebPage + BreadcrumbList + FAQPage
- [ ] Link de WhatsApp com mensagem pré-preenchida
- [ ] FAQ com 4+ perguntas
- [ ] Responsivo (mobile + desktop)
- [ ] Dark mode funcional
- [ ] Adicionado ao sitemap.xml
- [ ] Pelo menos 2 links internos apontando para a página

---

## 5. Conteúdo GEO nas Páginas de Tratamento

### Esforço: 1-2 horas (30min por página) | Arquivos: 7 páginas de tratamento

### Passo a passo

Para cada página de tratamento existente, adicionar/ajustar:

### 5.1. Parágrafo "citável" (logo após o H1)

Adicionar um parágrafo de 2-3 frases que responda diretamente à busca principal. Deve ser o primeiro `<p>` do conteúdo.

| Página | Parágrafo citável sugerido |
|--------|---------------------------|
| aparelho-ortodontico | "O aparelho ortodôntico corrige o posicionamento dos dentes e a mordida, melhorando a estética e a saúde bucal. No consultório da Dra. Jaqueline Sayonara em Sapé/PB, o tratamento ortodôntico é personalizado para cada paciente, com acompanhamento mensal e opções de aparelho metálico e estético." |
| clareamento-dental | "O clareamento dental é um procedimento estético que clareia os dentes em até 3 tons em uma única sessão. No consultório da Dra. Jaqueline Sayonara em Sapé/PB, o procedimento dura aproximadamente 1 hora e utiliza gel à base de peróxido de hidrogênio com ativação por luz LED." |
| exodontia | "A exodontia (extração dentária) é a remoção cirúrgica de um dente que não pode ser restaurado ou que está comprometendo a saúde bucal. A Dra. Jaqueline Sayonara realiza extrações simples e de sisos em Sapé/PB com anestesia local e técnicas minimamente invasivas." |
| facetas-dentarias | "As facetas dentárias em resina composta são lâminas finas aplicadas sobre os dentes para corrigir cor, formato e pequenas imperfeições. No consultório em Sapé/PB, o procedimento é realizado em sessão única pela Dra. Jaqueline Sayonara, sem necessidade de desgaste dental significativo." |
| profilaxia | "A profilaxia dental (limpeza profissional) remove tártaro e placa bacteriana que a escovação não alcança. Recomendada a cada 6 meses, o procedimento é realizado em aproximadamente 40 minutos no consultório da Dra. Jaqueline Sayonara em Sapé/PB." |
| protese-dentaria | "A prótese dentária substitui dentes perdidos, devolvendo a função mastigatória e a estética do sorriso. A Dra. Jaqueline Sayonara em Sapé/PB oferece próteses parciais e totais (dentaduras), com moldagem precisa e material de alta qualidade." |
| restauracao-dentaria | "A restauração dentária reconstrói a estrutura do dente danificada por cárie ou fratura. No consultório da Dra. Jaqueline Sayonara em Sapé/PB, utilizamos resina composta na cor do dente para resultados estéticos e funcionais em sessão única." |

### 5.2. Tabela comparativa (adicionar em cada página onde fizer sentido)

Exemplo para clareamento:
```html
<h2>Tipos de Clareamento</h2>
<table>
  <caption>Comparativo de métodos de clareamento dental</caption>
  <thead>
    <tr>
      <th scope="col">Método</th>
      <th scope="col">Duração</th>
      <th scope="col">Resultado</th>
      <th scope="col">Indicação</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Consultório (LED)</td>
      <td>1 sessão (1h)</td>
      <td>Até 3 tons mais claro</td>
      <td>Resultado imediato</td>
    </tr>
    <tr>
      <td>Caseiro (moldeira)</td>
      <td>2-3 semanas</td>
      <td>Até 2 tons mais claro</td>
      <td>Manutenção gradual</td>
    </tr>
    <tr>
      <td>Combinado</td>
      <td>1 sessão + 2 semanas</td>
      <td>Até 4-5 tons mais claro</td>
      <td>Melhor resultado</td>
    </tr>
  </tbody>
</table>
```

### 5.3. Schema.org MedicalProcedure detalhado

Atualizar o JSON-LD de cada página para incluir mais detalhes:

```json
{
  "@type": "MedicalProcedure",
  "name": "Clareamento Dental",
  "procedureType": "http://schema.org/CosmeticProcedure",
  "bodyLocation": "Dentes",
  "howPerformed": "Aplicação de gel clareador à base de peróxido de hidrogênio com ativação por luz LED",
  "preparation": "Avaliação clínica e profilaxia prévia obrigatória",
  "followup": "Evitar alimentos com corantes por 48h. Sensibilidade é normal nas primeiras 24h.",
  "status": "http://schema.org/ActiveNotRecruiting"
}
```

### 5.4. CSS para tabelas (adicionar ao `treatment.css`)

```css
.treatment-content table {
  width: 100%;
  border-collapse: collapse;
  margin: 24px 0;
  font-size: 1.5rem;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.treatment-content caption {
  font-size: 1.3rem;
  color: var(--color-text-muted);
  margin-bottom: 8px;
  text-align: left;
}

.treatment-content th {
  background: var(--logo-pallete-petal-rose);
  color: var(--logo-pallete-velvety-cherry);
  font-weight: 700;
  text-align: left;
  padding: 12px 16px;
}

.treatment-content td {
  padding: 12px 16px;
  border-bottom: 1px solid #a2535614;
  color: var(--color-text);
}

.treatment-content tr:last-child td {
  border-bottom: none;
}

.dark-theme .treatment-content th {
  background: #a2535630;
}

.dark-theme .treatment-content td {
  border-bottom-color: #ffffff0d;
}

@media only screen and (max-width: 599px) {
  .treatment-content table {
    font-size: 1.3rem;
  }
  .treatment-content th,
  .treatment-content td {
    padding: 10px 12px;
  }
}
```

### Critério de aceitação
- [ ] Cada página de tratamento tem um parágrafo citável como primeiro conteúdo
- [ ] Pelo menos 3 páginas têm tabelas comparativas
- [ ] Schema.org MedicalProcedure com campos `howPerformed`, `preparation`, `followup`
- [ ] Tabelas responsivas e acessíveis (`caption`, `scope`, `th`)
- [ ] Dark mode compatível

---

## 6. Páginas de Área de Atendimento

### Esforço: 3-4 horas (30-40min por cidade) | Arquivos novos: 6 páginas

### Passo a passo

1. Criar template base para páginas de área
2. Customizar para cada cidade
3. Adicionar ao sitemap
4. Criar links internos

### Estrutura de diretório
```
atendimento/
├── mari/index.html
├── sobrado/index.html
├── cruz-do-espirito-santo/index.html
├── riachao-do-poco/index.html
├── pilar/index.html
└── caldas-brandao/index.html
```

### Template base (`atendimento/_template.html`)

```html
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <!-- Meta tags padrão -->
    <title>Dentista para {{CIDADE}} | Dra. Jaqueline Sayonara | Sapé PB</title>
    <meta name="description" content="{{META_DESCRIPTION}}">
    <meta name="keywords" content="dentista {{CIDADE_LOWER}}, ortodontista {{CIDADE_LOWER}}, clareamento {{CIDADE_LOWER}}, dentista perto de {{CIDADE_LOWER}}">
    <link rel="canonical" href="https://www.drajaquelinesayonara.com.br/atendimento/{{SLUG}}/">

    <!-- OG + Twitter (mesmo padrão das demais) -->
    <!-- CSS inline (mesmo bundle) -->
    <!-- Schema.org -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Dentist",
      "name": "Dra. Jaqueline Sayonara",
      "url": "https://www.drajaquelinesayonara.com.br/atendimento/{{SLUG}}/",
      "areaServed": {
        "@type": "City",
        "name": "{{CIDADE}}"
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Rua Lourival Lacerda, 06, sl 207",
        "addressLocality": "Sapé",
        "addressRegion": "PB"
      }
    }
    </script>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Início", "item": "https://www.drajaquelinesayonara.com.br/" },
        { "@type": "ListItem", "position": 2, "name": "Atendimento", "item": "https://www.drajaquelinesayonara.com.br/atendimento/" },
        { "@type": "ListItem", "position": 3, "name": "{{CIDADE}}", "item": "https://www.drajaquelinesayonara.com.br/atendimento/{{SLUG}}/" }
      ]
    }
    </script>
</head>
<body>
    <!-- Header + nav (mesmo da home) -->

    <nav class="breadcrumb" aria-label="Navegação">
      <ol>
        <li><a href="/">Início</a></li>
        <li><a href="/atendimento/">Áreas de Atendimento</a></li>
        <li><span aria-current="page">{{CIDADE}}</span></li>
      </ol>
    </nav>

    <section class="treatment-hero">
      <div>
        <div>
          <h1>Dentista para Moradores de {{CIDADE}}</h1>
          <p class="treatment-subtitle">{{DISTANCIA}} de {{CIDADE}}. Atendimento especializado em Ortodontia, Clareamento, Facetas e mais.</p>
          <a href="https://wa.me/+5583994058749?text=Olá!%20Sou%20de%20{{CIDADE_ENCODED}}%20e%20gostaria%20de%20agendar%20uma%20consulta" class="btn-cta">Agendar consulta</a>
        </div>
      </div>
    </section>

    <section class="treatment-content">
      <div>
        <h2>Atendimento Odontológico para {{CIDADE}}</h2>
        <p>{{TEXTO_PERSONALIZADO_CIDADE}}</p>

        <h2>Tratamentos Disponíveis</h2>
        <ul>
          <li><a href="/tratamentos/aparelho-ortodontico/">Aparelho Ortodôntico</a></li>
          <li><a href="/tratamentos/clareamento-dental/">Clareamento Dental</a></li>
          <li><a href="/tratamentos/facetas-dentarias/">Facetas Dentárias</a></li>
          <li><a href="/tratamentos/protese-dentaria/">Prótese Dentária</a></li>
          <li><a href="/tratamentos/profilaxia/">Profilaxia (Limpeza)</a></li>
          <li><a href="/tratamentos/restauracao-dentaria/">Restauração</a></li>
          <li><a href="/tratamentos/exodontia/">Exodontia (Extração)</a></li>
        </ul>

        <h2>Como Chegar</h2>
        <p>O consultório fica na Rua Lourival Lacerda, 06, Sala 207 — Centro de Sapé/PB.</p>
        <p>Distância de {{CIDADE}}: aproximadamente {{DISTANCIA}}.</p>
        <p><a href="https://www.google.com/maps/dir/{{CIDADE_COORDS}}/-7.0948,-35.2318" target="_blank" rel="noopener noreferrer">Ver rota no Google Maps →</a></p>

        <h2>Horário de Atendimento</h2>
        <p>Segunda a sexta: 8h às 12h e 14h às 18h<br>Sábados: 8h às 13h</p>

        <h2>Planos Aceitos</h2>
        <p>Atendemos pelos planos <strong>Clin</strong> e <strong>Unidentis</strong>, além de particular.</p>
      </div>
    </section>

    <!-- CTA + Footer -->
</body>
</html>
```

### Dados por cidade

| Cidade | Slug | Distância | Coordenadas (origem) |
|--------|------|-----------|---------------------|
| Mari | `mari` | ~15km (20min) | -7.0600,-35.3200 |
| Sobrado | `sobrado` | ~18km (25min) | -7.1500,-35.2300 |
| Cruz do Espírito Santo | `cruz-do-espirito-santo` | ~12km (15min) | -7.1400,-35.0900 |
| Riachão do Poço | `riachao-do-poco` | ~20km (25min) | -7.1600,-35.2800 |
| Pilar | `pilar` | ~25km (30min) | -7.2700,-35.2600 |
| Caldas Brandão | `caldas-brandao` | ~22km (28min) | -7.1000,-35.3200 |

### Texto personalizado (cada cidade DEVE ter texto único)

**Mari:**
> "Se você mora em Mari e precisa de atendimento odontológico especializado, o consultório da Dra. Jaqueline Sayonara fica a apenas 20 minutos de distância, no centro de Sapé. Muitos pacientes de Mari já confiam nos nossos tratamentos de ortodontia, clareamento e facetas."

**Sobrado:**
> "Moradores de Sobrado contam com atendimento odontológico completo a menos de 25 minutos de distância. A Dra. Jaqueline Sayonara oferece desde consultas de rotina até tratamentos estéticos avançados em seu consultório no centro de Sapé."

(Criar textos similares e únicos para cada cidade)

### Atualizar sitemap.xml
Adicionar todas as 6 URLs com `priority: 0.6` e `changefreq: monthly`.

### Links internos
- Footer: seção "Atendemos em" com lista de cidades linkadas
- Home (FAQ): resposta sobre cidades com links
- Páginas de tratamento: mencionar "Atendemos pacientes de [cidade]" com link

### Critério de aceitação
- [ ] 6 páginas criadas e acessíveis
- [ ] Cada página com texto único (não duplicado)
- [ ] Schema.org Dentist com areaServed por cidade
- [ ] BreadcrumbList Schema.org em cada página
- [ ] Links de Maps com direções parametrizadas
- [ ] WhatsApp com mensagem pré-preenchida mencionando a cidade
- [ ] Sitemap atualizado
- [ ] Pelo menos 3 links internos apontando para cada página

---

## 7. Slider Interativo Antes/Depois

### Esforço: 3-4 horas | Arquivos: `assets/css/compare-slider.css` (novo), `assets/js/main.js` (modificar), `index.html` (modificar)

### Passo a passo

1. Criar CSS do componente
2. Adicionar HTML na seção de resultados (ou no lightbox)
3. Implementar lógica JS (input range + clip-path)
4. Garantir acessibilidade

### 7.1. CSS (`assets/css/compare-slider.css`)

```css
.compare-slider {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  aspect-ratio: 4/3;
  user-select: none;
  touch-action: none;
}

.compare-slider img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.compare-before {
  position: absolute;
  inset: 0;
  overflow: hidden;
  clip-path: inset(0 50% 0 0);
  z-index: 2;
}

.compare-after {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.compare-handle {
  position: absolute;
  top: 0;
  left: 50%;
  width: 4px;
  height: 100%;
  background: var(--logo-pallete-light);
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
  z-index: 3;
  transform: translateX(-50%);
  pointer-events: none;
}

.compare-handle::after {
  content: "⟷";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 44px;
  height: 44px;
  background: var(--logo-pallete-light);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  color: var(--logo-pallete-velvety-cherry);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.compare-input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: col-resize;
  z-index: 4;
  margin: 0;
  padding: 0;
}

.compare-label {
  position: absolute;
  bottom: 12px;
  padding: 6px 12px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 1.2rem;
  font-weight: 600;
  border-radius: 50px;
  z-index: 5;
  pointer-events: none;
}

.compare-label--before {
  left: 12px;
}

.compare-label--after {
  right: 12px;
}

@media only screen and (max-width: 767px) {
  .compare-slider {
    border-radius: 12px;
  }
  .compare-handle::after {
    width: 36px;
    height: 36px;
    font-size: 1.4rem;
  }
}
```

### 7.2. HTML do componente

```html
<div class="compare-slider" role="figure" aria-label="Comparação antes e depois de clareamento dental">
  <div class="compare-before">
    <img src="/assets/img/results/clareamento-antes.webp" alt="Antes do clareamento dental">
  </div>
  <div class="compare-after">
    <img src="/assets/img/results/clareamento-depois.webp" alt="Depois do clareamento dental">
  </div>
  <div class="compare-handle" aria-hidden="true"></div>
  <input type="range" min="0" max="100" value="50" class="compare-input"
         aria-label="Arraste para comparar antes e depois do clareamento dental">
  <span class="compare-label compare-label--before">Antes</span>
  <span class="compare-label compare-label--after">Depois</span>
</div>
```

### 7.3. JavaScript (`assets/js/main.js` — adicionar função)

```javascript
// Compare Slider (Before/After)
function initCompareSliders() {
  const sliders = document.querySelectorAll('.compare-slider');

  sliders.forEach(slider => {
    const input = slider.querySelector('.compare-input');
    const before = slider.querySelector('.compare-before');
    const handle = slider.querySelector('.compare-handle');

    if (!input || !before || !handle) return;

    function updateSlider(value) {
      const percent = value + '%';
      before.style.clipPath = `inset(0 ${100 - value}% 0 0)`;
      handle.style.left = percent;
    }

    // Input range (keyboard accessible)
    input.addEventListener('input', (e) => {
      updateSlider(e.target.value);
    });

    // Pointer events (mouse + touch)
    let isDragging = false;

    slider.addEventListener('pointerdown', (e) => {
      isDragging = true;
      slider.setPointerCapture(e.pointerId);
      updateFromPointer(e);
    });

    slider.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      updateFromPointer(e);
    });

    slider.addEventListener('pointerup', (e) => {
      isDragging = false;
      slider.releasePointerCapture(e.pointerId);
    });

    function updateFromPointer(e) {
      const rect = slider.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const percent = (x / rect.width) * 100;
      input.value = percent;
      updateSlider(percent);
    }

    // Initial state
    updateSlider(50);
  });
}

// Chamar no DOMContentLoaded junto com as demais inicializações
// initCompareSliders();
```

### 7.4. Onde integrar

**Opção A — Dentro do lightbox** (recomendado):
- Quando o usuário abre uma foto de resultado no lightbox, mostrar o slider em vez de imagem estática
- Requer ter pares de imagens antes/depois separados

**Opção B — Seção standalone na home:**
- Adicionar 1-2 sliders abaixo do carousel de resultados como destaque
- Mais visível, gera curiosidade imediata

**Opção C — Nas páginas de tratamento:**
- Cada página de tratamento pode ter um slider relevante (ex: clareamento antes/depois)

### Requisitos de imagens
- Pares de imagens DEVEM ter mesma dimensão e ângulo
- Formato WebP, máximo 800px de largura
- Naming: `{tratamento}-antes.webp` / `{tratamento}-depois.webp`

### Critério de aceitação
- [ ] Slider funcional com mouse e touch
- [ ] Acessível por teclado (input range com Tab + setas)
- [ ] Labels "Antes" e "Depois" visíveis
- [ ] `aria-label` descritivo
- [ ] Responsivo (mobile + desktop)
- [ ] Performance: sem jank durante arraste (pointer events)
- [ ] Dark mode: visual adequado
- [ ] `prefers-reduced-motion`: desativar animações (handle estático ok)

---

## 8. Página Hub de Tratamentos

### Esforço: 1-2 horas | Arquivo: `tratamentos/index.html` (modificar)

### Passo a passo

A página `/tratamentos/index.html` já existe. Precisa ser aprimorada como hub de conteúdo.

### Conteúdo mínimo

```html
<section class="treatment-content">
  <div>
    <h1>Tratamentos Odontológicos em Sapé/PB</h1>
    <p class="treatment-subtitle">Conheça todos os procedimentos oferecidos pela Dra. Jaqueline Sayonara. Clique em cada tratamento para saber mais.</p>

    <!-- Cards ou lista linkada para cada tratamento -->
    <div class="related-grid">
      <a href="/tratamentos/aparelho-ortodontico/" class="related-card">
        <span class="related-card-icon">🦷</span>
        <div class="related-card-content">
          <h2 class="related-card-title">Aparelho Ortodôntico</h2>
          <p class="related-card-desc">Correção do posicionamento dos dentes e mordida. Opções metálica e estética.</p>
        </div>
        <span class="related-card-arrow">›</span>
      </a>
      <!-- Repetir para os 6 demais tratamentos -->
    </div>
  </div>
</section>
```

### Schema.org ItemList

```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Tratamentos Odontológicos — Dra. Jaqueline Sayonara",
  "description": "Lista de tratamentos odontológicos disponíveis no consultório da Dra. Jaqueline Sayonara em Sapé/PB",
  "numberOfItems": 7,
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Aparelho Ortodôntico",
      "url": "https://www.drajaquelinesayonara.com.br/tratamentos/aparelho-ortodontico/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Clareamento Dental",
      "url": "https://www.drajaquelinesayonara.com.br/tratamentos/clareamento-dental/"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Exodontia",
      "url": "https://www.drajaquelinesayonara.com.br/tratamentos/exodontia/"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "Facetas Dentárias",
      "url": "https://www.drajaquelinesayonara.com.br/tratamentos/facetas-dentarias/"
    },
    {
      "@type": "ListItem",
      "position": 5,
      "name": "Profilaxia",
      "url": "https://www.drajaquelinesayonara.com.br/tratamentos/profilaxia/"
    },
    {
      "@type": "ListItem",
      "position": 6,
      "name": "Prótese Dentária",
      "url": "https://www.drajaquelinesayonara.com.br/tratamentos/protese-dentaria/"
    },
    {
      "@type": "ListItem",
      "position": 7,
      "name": "Restauração Dentária",
      "url": "https://www.drajaquelinesayonara.com.br/tratamentos/restauracao-dentaria/"
    }
  ]
}
```

### Meta tags
```html
<title>Tratamentos Odontológicos em Sapé PB | Dra. Jaqueline Sayonara</title>
<meta name="description" content="Conheça todos os tratamentos odontológicos disponíveis: ortodontia, clareamento, facetas, próteses, restaurações e mais. Agende em Sapé/PB.">
```

### Critério de aceitação
- [ ] Página lista todos os 7 tratamentos com link para cada
- [ ] Breve descrição de 1-2 linhas para cada tratamento
- [ ] Schema.org ItemList válido
- [ ] BreadcrumbList Schema.org (Home > Tratamentos)
- [ ] H1 com keyword local
- [ ] Design consistente com o site (usar `related-card` pattern)

---

## 9. Micro-interações CSS

### Esforço: 1-2 horas | Arquivos: `assets/css/globalStyle.css`, `assets/js/main.js`

### 9.1. Scroll Progress Bar

**CSS:**
```css
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: var(--logo-pallete-velvety-cherry);
  z-index: 10000;
  width: 0%;
  transition: width 50ms linear;
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  .scroll-progress {
    display: none;
  }
}
```

**HTML (adicionar como primeiro elemento do `<body>`):**
```html
<div class="scroll-progress" aria-hidden="true"></div>
```

**JS:**
```javascript
function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress');
  if (!bar) return;

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = progress + '%';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}
```

### 9.2. Animação de contagem no hero

**JS:**
```javascript
function initCounterAnimation() {
  const ratingText = document.querySelector('.hero-rating-text');
  if (!ratingText) return;

  // Só anima se visível pela primeira vez
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateText(ratingText);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  observer.observe(ratingText);
}

function animateText(el) {
  const target = 7; // número de avaliações
  const original = el.textContent;
  let current = 0;

  const interval = setInterval(() => {
    current++;
    if (current >= target) {
      clearInterval(interval);
      el.textContent = original; // restaura texto completo
      return;
    }
    el.textContent = `5.0 · ${current} avaliações no Google`;
  }, 100);
}
```

### 9.3. Efeito hover com elevação nos cards de tratamento

Já existente parcialmente. Aprimorar com:

```css
@media (hover: hover) {
  .card-container {
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
                box-shadow 0.3s ease;
  }

  .card-container:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(162, 83, 86, 0.15);
  }
}
```

### 9.4. Botão WhatsApp com pulse sutil

```css
@keyframes whatsappPulse {
  0%, 100% { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); }
  50% { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2), 0 0 0 8px rgba(37, 211, 102, 0.15); }
}

.whatsapp-float {
  animation: floatIn 0.6s ease-out 2s both, whatsappPulse 3s ease-in-out 4s infinite;
}

@media (prefers-reduced-motion: reduce) {
  .whatsapp-float {
    animation: none;
  }
}
```

### Critério de aceitação
- [ ] Scroll progress bar visível no topo durante scroll
- [ ] Escondido quando `prefers-reduced-motion: reduce`
- [ ] `aria-hidden="true"` na barra (decorativo)
- [ ] WhatsApp pulse não é intrusivo (sutil)
- [ ] Performance: event listener com `{ passive: true }`
- [ ] Nenhuma animação bloqueia interação

---

## Checklist Final de Implementação

```
Semana 1 (Quick wins):
  □ #1 — Expandir areaServed (5 min)
  □ #2 — FAQ na home + Schema (2h)
  □ #3 — Breadcrumb Schema.org (15 min)
  □ Rodar npm test → todos passando
  □ Build CSS → validar visual
  □ Commit + deploy

Semana 2:
  □ #4 — Página Primeira Consulta (3h)
  □ Atualizar sitemap.xml
  □ Adicionar links internos
  □ Commit + deploy

Semana 3:
  □ #5 — Conteúdo GEO (2-3h, 3-4 páginas)
  □ #8 — Hub de tratamentos (1-2h)
  □ Commit + deploy

Semana 4:
  □ #6 — Páginas de área (3-4h, 3 cidades)
  □ Atualizar sitemap.xml
  □ Commit + deploy

Semana 5:
  □ #6 — Páginas de área (restante 3 cidades)
  □ #7 — Slider antes/depois (3-4h)
  □ Commit + deploy

Semana 6:
  □ #5 — Conteúdo GEO (restante das páginas)
  □ #9 — Micro-interações (1-2h)
  □ Revisão geral + deploy final
  □ Validar tudo no Rich Results Test
```
