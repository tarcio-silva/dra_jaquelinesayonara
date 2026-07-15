/**
 * Utilitários DOM para testes.
 * Cria fixtures HTML reutilizáveis para os componentes testáveis do main.js.
 */

/**
 * Cria a fixture do menu offcanva (hamburger + nav mobile)
 */
export function createMenuFixture() {
  document.body.innerHTML = `
    <header>
      <button class="hamburger hamburger--slider" id="hamburger-button" type="button"
              aria-label="Abrir menu" aria-expanded="false" aria-controls="offcanva">
        <span class="hamburger-box"><span class="hamburger-inner"></span></span>
      </button>
      <nav class="offcanva" id="offcanva" role="navigation" aria-label="Menu principal"
           aria-hidden="true" style="left: -120%;">
        <img src="/assets/img/favicon.webp" alt="Logo" width="96" height="96">
        <nav class="offcanva-nav">
          <ul>
            <li><a class="offcanva-nav--link" href="#">Home</a></li>
            <li><a class="offcanva-nav--link" href="#about">Sobre</a></li>
            <li><a class="offcanva-nav--link" href="#care">Tratamentos</a></li>
            <li><a class="offcanva-nav--link" href="#results">Resultados</a></li>
            <li><a class="offcanva-nav--link" href="#location">Localização</a></li>
          </ul>
        </nav>
        <div class="offcanva-dark-mode">
          <label class="switch" aria-label="Alternar modo escuro">
            <input class="dark-mode-toggle-mobile" type="checkbox" role="switch" aria-checked="false">
            <span class="slider round"></span>
          </label>
        </div>
      </nav>
    </header>
  `;
}

/**
 * Cria a fixture do lightbox + result items
 */
export function createLightboxFixture() {
  document.body.innerHTML = `
    <section id="results">
      <div class="results-grid">
        <div class="result-item" tabindex="0" role="button">
          <img src="/assets/img/results/clareamento.webp" alt="Antes e depois clareamento">
        </div>
        <div class="result-item" tabindex="0" role="button">
          <img src="/assets/img/results/facetas.webp" alt="Antes e depois facetas">
        </div>
      </div>
    </section>
    <div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Visualização ampliada">
      <button class="lightbox-close" aria-label="Fechar visualização">&times;</button>
      <img src="" alt="">
    </div>
  `;
}

/**
 * Cria a fixture do dark mode (desktop + mobile toggles)
 */
export function createDarkModeFixture() {
  document.body.innerHTML = `
    <nav class="header-nav">
      <div class="header-nav-actions">
        <label class="switch" aria-label="Alternar modo escuro">
          <input id="dark-mode-button" type="checkbox" role="switch" aria-checked="false">
          <span class="slider round"></span>
        </label>
      </div>
    </nav>
    <nav class="offcanva" id="offcanva">
      <div class="offcanva-dark-mode">
        <label class="switch" aria-label="Alternar modo escuro">
          <input class="dark-mode-toggle-mobile" type="checkbox" role="switch" aria-checked="false">
          <span class="slider round"></span>
        </label>
      </div>
    </nav>
  `;
}

/**
 * Cria a fixture de seções com IDs para o active section indicator
 */
export function createSectionsFixture() {
  document.body.innerHTML = `
    <nav class="header-nav">
      <ul class="header-nav-links">
        <li><a class="header-link" href="#about"><span>Sobre</span></a></li>
        <li><a class="header-link" href="#care"><span>Tratamentos</span></a></li>
        <li><a class="header-link" href="#results"><span>Resultados</span></a></li>
      </ul>
    </nav>
    <main id="main-content">
      <section id="about" class="fade-in">Sobre</section>
      <section id="care" class="fade-in">Tratamentos</section>
      <section id="results" class="fade-in">Resultados</section>
    </main>
  `;
}

/**
 * Cria a fixture de vídeos autoplay para prefers-reduced-motion
 */
export function createVideoFixture() {
  document.body.innerHTML = `
    <section class="location-container">
      <video autoplay muted loop playsinline>
        <source src="/assets/media/location.mp4" type="video/mp4">
      </video>
    </section>
  `;
}
