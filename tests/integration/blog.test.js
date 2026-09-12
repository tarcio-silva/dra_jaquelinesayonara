import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Cobertura da listagem /blog/ (SPEC_BLOG T1/T6).
// Os artigos individuais ganham cobertura própria quando o suite completo (T6) for feito.
describe('Blog — listagem (/blog/index.html)', () => {
  let doc, html;

  beforeAll(() => {
    html = readFileSync(resolve(__dirname, '../../blog/index.html'), 'utf-8');
    const parser = new DOMParser();
    doc = parser.parseFromString(html, 'text/html');
  });

  describe('Acessibilidade', () => {
    it('skip link presente e aponta para #main-content', () => {
      const skipLink = doc.querySelector('a.skip-link');
      expect(skipLink).not.toBeNull();
      expect(skipLink.getAttribute('href')).toBe('#main-content');
    });

    it('#main-content existe', () => {
      expect(doc.getElementById('main-content')).not.toBeNull();
    });

    it('apenas um H1 na página', () => {
      expect(doc.querySelectorAll('h1').length).toBe(1);
    });

    it('todas as imagens possuem alt', () => {
      const semAlt = Array.from(doc.querySelectorAll('img')).filter(
        img => !img.hasAttribute('alt')
      );
      expect(semAlt).toHaveLength(0);
    });

    it('links target="_blank" possuem rel="noopener noreferrer"', () => {
      doc.querySelectorAll('a[target="_blank"]').forEach(link => {
        const rel = link.getAttribute('rel') || '';
        expect(rel).toContain('noopener');
        expect(rel).toContain('noreferrer');
      });
    });

    it('breadcrumb com aria-label e aria-current="page"', () => {
      const nav = doc.querySelector('nav.breadcrumb');
      expect(nav).not.toBeNull();
      expect(nav.getAttribute('aria-label')).toBeTruthy();
      expect(nav.querySelector('[aria-current="page"]')).not.toBeNull();
    });
  });

  describe('SEO', () => {
    it('title ≤60 caracteres', () => {
      const title = doc.querySelector('title');
      expect(title).not.toBeNull();
      expect(title.textContent.length).toBeLessThanOrEqual(60);
    });

    it('meta description entre 120-160 caracteres', () => {
      const meta = doc.querySelector('meta[name="description"]');
      expect(meta).not.toBeNull();
      const content = meta.getAttribute('content');
      expect(content.length).toBeGreaterThanOrEqual(120);
      expect(content.length).toBeLessThanOrEqual(160);
    });

    it('canonical correta (com www e trailing slash)', () => {
      const canonical = doc.querySelector('link[rel="canonical"]');
      expect(canonical).not.toBeNull();
      expect(canonical.getAttribute('href')).toBe(
        'https://www.drajaquelinesayonara.com.br/blog/'
      );
    });

    it('Open Graph completo', () => {
      ['og:title', 'og:description', 'og:image', 'og:url', 'og:type', 'og:locale'].forEach(p => {
        expect(doc.querySelector(`meta[property="${p}"]`)).not.toBeNull();
      });
    });

    it('lang="pt-br" no html', () => {
      expect(doc.querySelector('html').getAttribute('lang')).toBe('pt-br');
    });
  });

  describe('Schema.org', () => {
    let schema;

    beforeAll(() => {
      const script = doc.querySelector('script[type="application/ld+json"]');
      expect(script).not.toBeNull();
      schema = JSON.parse(script.textContent); // lança se inválido
    });

    it('contém node Blog', () => {
      const blog = schema['@graph'].find(i => i['@type'] === 'Blog');
      expect(blog).toBeDefined();
      expect(blog.url).toBe('https://www.drajaquelinesayonara.com.br/blog/');
    });

    it('contém ItemList com ao menos 1 artigo', () => {
      const list = schema['@graph'].find(i => i['@type'] === 'ItemList');
      expect(list).toBeDefined();
      expect(list.itemListElement.length).toBeGreaterThanOrEqual(1);
    });

    it('contém BreadcrumbList (Home › Blog)', () => {
      const bc = schema['@graph'].find(i => i['@type'] === 'BreadcrumbList');
      expect(bc).toBeDefined();
      expect(bc.itemListElement).toHaveLength(2);
    });
  });

  describe('Estrutura e Conteúdo', () => {
    it('possui <header>, <main>, <footer>', () => {
      expect(doc.querySelector('header')).not.toBeNull();
      expect(doc.querySelector('main')).not.toBeNull();
      expect(doc.querySelector('footer')).not.toBeNull();
    });

    it('lista ao menos 1 card apontando para um artigo do blog', () => {
      const cards = doc.querySelectorAll('.related-grid a.related-card');
      expect(cards.length).toBeGreaterThanOrEqual(1);
      cards.forEach(card => {
        expect(card.getAttribute('href')).toMatch(/^\/blog\/[^/]+\/$/);
      });
    });

    it('CTA WhatsApp e float presentes', () => {
      expect(doc.querySelector('a[href*="wa.me"]')).not.toBeNull();
      expect(doc.querySelector('.whatsapp-float')).not.toBeNull();
    });

    it('CSS inline presente (não link externo)', () => {
      const style = doc.querySelector('style');
      expect(style).not.toBeNull();
      expect(style.textContent.length).toBeGreaterThan(1000);
    });

    it('JS carregado com defer', () => {
      const script = doc.querySelector('script[src*="main.js"]');
      expect(script).not.toBeNull();
      expect(script.hasAttribute('defer')).toBe(true);
    });
  });
});
