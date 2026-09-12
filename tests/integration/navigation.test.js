import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { resolve, join } from 'path';

const ROOT = resolve(__dirname, '../..');

function parse(rel) {
  const html = readFileSync(resolve(ROOT, rel), 'utf-8');
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return { html, doc };
}

// Coleta as páginas internas (com o header/menu novo propagado — SPEC_NAVEGACAO N4).
const INTERNAL = [
  'tratamentos/index.html',
  ...readdirSync(resolve(ROOT, 'tratamentos'))
    .filter(f => !f.startsWith('_') && !f.includes('.'))
    .map(s => `tratamentos/${s}/index.html`),
  ...readdirSync(resolve(ROOT, 'atendimento'))
    .filter(f => !f.includes('.'))
    .map(s => `atendimento/${s}/index.html`),
  'primeira-consulta/index.html',
  'blog/index.html',
  ...readdirSync(resolve(ROOT, 'blog'))
    .filter(f => !f.startsWith('_') && !f.includes('.'))
    .map(s => `blog/${s}/index.html`),
].filter(p => existsSync(resolve(ROOT, p)));

const PRIMARY_HREFS = ['/tratamentos/', '/blog/', '/primeira-consulta/'];
const CITY_SLUGS = ['mari', 'sobrado', 'cruz-do-espirito-santo', 'pilar', 'riachao-do-poco', 'caldas-brandao'];

describe.each(INTERNAL)('Navegação — %s', (rel) => {
  let doc;
  beforeAll(() => { doc = parse(rel).doc; });

  it('menu primário desktop tem os 3 links de página + dropdown Atendimento', () => {
    const links = [...doc.querySelectorAll('.header-nav-links .header-link')].map(a => a.getAttribute('href'));
    PRIMARY_HREFS.forEach(h => expect(links).toContain(h));
    expect(doc.querySelector('.header-nav-links .header-dropdown-toggle')).not.toBeNull();
  });

  it('não há âncora de seção (/#...) no menu primário', () => {
    const anchors = [...doc.querySelectorAll('.header-nav-links a, .offcanva-nav a')]
      .map(a => a.getAttribute('href') || '');
    expect(anchors.some(h => h.includes('/#'))).toBe(false);
  });

  it('não existe item "Início"/"Home" no menu primário (logo leva à home)', () => {
    const labels = [...doc.querySelectorAll('.header-nav-links .header-link span')]
      .map(s => s.textContent.trim());
    expect(labels).not.toContain('Início');
    expect(labels).not.toContain('Home');
  });

  it('desktop e mobile listam os mesmos destinos de página', () => {
    const desk = [...doc.querySelectorAll('.header-nav-links .header-link')]
      .map(a => a.getAttribute('href')).sort();
    const mob = [...doc.querySelectorAll('.offcanva-nav > ul > li > a.offcanva-nav--link')]
      .map(a => a.getAttribute('href')).sort();
    expect(mob).toEqual(desk);
  });

  it('dropdown "Atendimento" tem as 6 cidades (desktop) com atributos de menu', () => {
    const toggle = doc.querySelector('.header-dropdown-toggle');
    expect(toggle.getAttribute('aria-haspopup')).toBe('true');
    expect(toggle.hasAttribute('aria-expanded')).toBe(true);
    expect(toggle.getAttribute('aria-controls')).toBe('dropdown-atendimento');
    const menu = doc.getElementById('dropdown-atendimento');
    expect(menu.getAttribute('role')).toBe('menu');
    const items = [...menu.querySelectorAll('a[role="menuitem"]')].map(a => a.getAttribute('href'));
    CITY_SLUGS.forEach(s => expect(items).toContain(`/atendimento/${s}/`));
    expect(items).toHaveLength(6);
  });

  it('offcanva usa <details> para Atendimento com as 6 cidades', () => {
    const group = doc.querySelector('.offcanva-group');
    expect(group).not.toBeNull();
    expect(group.tagName.toLowerCase()).toBe('details');
    const items = [...group.querySelectorAll('a')].map(a => a.getAttribute('href'));
    CITY_SLUGS.forEach(s => expect(items).toContain(`/atendimento/${s}/`));
  });

  it('NÃO renderiza a sub-navegação (exclusiva da home)', () => {
    expect(doc.querySelector('.subnav')).toBeNull();
  });

  it('breadcrumb inicia com "Início" (não "Home")', () => {
    const first = doc.querySelector('nav.breadcrumb ol li a');
    if (first) {
      expect(first.textContent.trim()).toBe('Início');
    }
  });

  it('no máximo um aria-current="page" no menu primário desktop e um no offcanva', () => {
    // Regressão: cidades chegaram a marcar o toggle "Atendimento" E o link da cidade.
    const deskNav = doc.querySelector('.header-nav-links');
    const offNav = doc.querySelector('.offcanva-nav');
    const deskCur = deskNav ? deskNav.querySelectorAll('[aria-current="page"]').length : 0;
    const offCur = offNav ? offNav.querySelectorAll('[aria-current="page"]').length : 0;
    expect(deskCur).toBeLessThanOrEqual(1);
    expect(offCur).toBeLessThanOrEqual(1);
  });

  it('o toggle do dropdown "Atendimento" nunca tem aria-current="page" (não é link)', () => {
    const toggle = doc.querySelector('.header-dropdown-toggle');
    expect(toggle.getAttribute('aria-current')).toBeNull();
  });
});

// Estado ativo correto por seção
describe('Navegação — estado ativo por seção', () => {
  it('páginas de tratamento marcam "Tratamentos"', () => {
    const { doc } = parse('tratamentos/clareamento-dental/index.html');
    const active = doc.querySelector('.header-nav-links .header-link.active[href="/tratamentos/"]')
      || doc.querySelector('.header-nav-links .header-link[href="/tratamentos/"][aria-current="page"]');
    expect(active).not.toBeNull();
  });

  it('artigos de blog marcam "Blog"', () => {
    const { doc } = parse('blog/clareamento-dental-vale-a-pena/index.html');
    const active = doc.querySelector('.header-nav-links .header-link[href="/blog/"][aria-current="page"]')
      || doc.querySelector('.header-nav-links .header-link.active[href="/blog/"]');
    expect(active).not.toBeNull();
  });

  it('páginas de atendimento marcam o dropdown "Atendimento" (.active) e a cidade atual', () => {
    const { doc } = parse('atendimento/mari/index.html');
    const toggle = doc.querySelector('.header-dropdown-toggle.active');
    expect(toggle).not.toBeNull();
    expect(toggle.getAttribute('aria-current')).toBeNull(); // toggle não é link
    const cityActive = doc.querySelector('#dropdown-atendimento a[href="/atendimento/mari/"][aria-current="page"]');
    expect(cityActive).not.toBeNull();
  });

  it('primeira-consulta marca "Primeira Consulta"', () => {
    const { doc } = parse('primeira-consulta/index.html');
    const active = doc.querySelector('.header-nav-links .header-link[href="/primeira-consulta/"][aria-current="page"]')
      || doc.querySelector('.header-nav-links .header-link.active[href="/primeira-consulta/"]');
    expect(active).not.toBeNull();
  });
});

// A home mantém a sub-navegação
describe('Navegação — home', () => {
  let doc;
  beforeAll(() => { doc = parse('index.html').doc; });

  it('home renderiza a sub-navegação com scroll-spy', () => {
    const subnav = doc.querySelector('.subnav');
    expect(subnav).not.toBeNull();
    expect(subnav.querySelectorAll('.subnav-link').length).toBeGreaterThanOrEqual(4);
  });

  it('home tem o mesmo menu primário (Tratamentos, Blog, Atendimento, Primeira Consulta)', () => {
    const links = [...doc.querySelectorAll('.header-nav-links .header-link')].map(a => a.getAttribute('href'));
    PRIMARY_HREFS.forEach(h => expect(links).toContain(h));
    expect(doc.querySelector('.header-nav-links .header-dropdown-toggle')).not.toBeNull();
  });
});
