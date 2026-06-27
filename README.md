# Dra. Jaqueline Sayonara — Site Institucional

Site de divulgação de serviços odontológicos da **Dra. Jaqueline Sayonara**, cirurgiã-dentista especialista em Ortodontia, localizada em Sapé/PB.

🔗 **Produção:** https://drajaquelinesayonara.vercel.app/

## Sobre o Projeto

Landing page institucional com informações sobre a profissional, tratamentos oferecidos, resultados de procedimentos, localização da clínica e avaliações de pacientes via Google Places API.

### Seções

- **Header** — Banner principal com foto, logo e slogan ("Cuidado, Saúde, Autoestima")
- **Sobre** — Apresentação da profissional
- **Tratamentos** — Aparelho ortodôntico, clareamento, exodontia, facetas, profilaxia, prótese, restauração
- **Resultados** — Carrossel de antes/depois dos procedimentos
- **Nosso Espaço / Galeria** — Fotos da clínica
- **Localização** — Mapa integrado (Rua Lourival Lacerda, 06, sl 207, Sapé/PB)
- **Avaliações** — Reviews do Google
- **Footer** — Redes sociais (Instagram, Facebook, WhatsApp)

### Funcionalidades

- Layout responsivo (mobile e desktop)
- Menu off-canvas (mobile) e navbar fixa (desktop)
- Dark mode
- SEO (meta tags, sitemap, robots.txt, verificação Google)

## Branches

| Branch | Descrição | Stack |
|--------|-----------|-------|
| `main` | Branch base do repositório | — |
| `static-app` | Versão estática do site (HTML/CSS/JS puro) | HTML5, CSS3, JavaScript, Owl Carousel, normalize.css |
| `react-app` | Versão SPA em React | React 18, Vite 6, Styled Components, Recoil, React Router, Axios |

## Tecnologias

### static-app

- HTML5 semântico
- CSS3 (custom properties, media queries, flexbox)
- JavaScript vanilla
- Owl Carousel (carrossel de resultados)
- Google Places API (avaliações)
- normalize.css

### react-app

- React 18
- Vite 6 (dev server porta 3000, build target ES2022)
- Styled Components
- Recoil (gerenciamento de estado)
- React Router
- Axios
- ESLint

## Como Executar

### static-app

```bash
git checkout static-app
# Abrir index.html no navegador ou usar um servidor local
npx serve .
```

### react-app

```bash
git checkout react-app
cd react
npm install
npm run dev       # Desenvolvimento (http://localhost:3000)
npm run build     # Build de produção
npm run preview   # Preview do build
```

## Contato

- 📱 WhatsApp: +55 83 99405-8749
- 📷 Instagram: [@drajaquelinesayonara](https://www.instagram.com/drajaquelinesayonara/)
- 📘 Facebook: [Dra Jaqueline Sayonara](https://www.facebook.com/drajaquelinesayonara)
