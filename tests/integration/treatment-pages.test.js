import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { resolve } from 'path';

const treatmentsDir = resolve(__dirname, '../../tratamentos');
const slugs = readdirSync(treatmentsDir).filter(
  f => !f.startsWith('_') && !f.includes('.')
);

describe.each(slugs)('Página de Tratamento — %s', (slug) => {
  let doc, html;

  beforeAll(() => {
    const filePath = resolve(treatmentsDir, slug, 'index.html');
    html = readFileSync(filePath, 'utf-8');
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
      const h1s = doc.querySelectorAll('h1');
      expect(h1s.length).toBe(1);
    });

    it('todas as imagens possuem alt', () => {
      const images = doc.querySelectorAll('img');
      const semAlt = Array.from(images).filter(img => !img.hasAttribute('alt'));
      expect(semAlt).toHaveLength(0);
    });

    it('links target="_blank" possuem rel="noopener noreferrer"', () => {
      const links = doc.querySelectorAll('a[target="_blank"]');
      links.forEach(link => {
        const rel = link.getAttribute('rel') || '';
        expect(rel).toContain('noopener');
        expect(rel).toContain('noreferrer');
      });
    });

    it('breadcrumb com aria-label e aria-current="page"', () => {
      const nav = doc.querySelector('nav.breadcrumb');
      expect(nav).not.toBeNull();
      expect(nav.getAttribute('aria-label')).toBeTruthy();
      const current = nav.querySelector('[aria-current="page"]');
      expect(current).not.toBeNull();
    });

    it('dark mode toggles têm role="switch" e aria-checked', () => {
      const toggle = doc.getElementById('dark-mode-button');
      expect(toggle).not.toBeNull();
      expect(toggle.getAttribute('role')).toBe('switch');
      expect(toggle.hasAttribute('aria-checked')).toBe(true);
    });

    it('hamburger tem aria-expanded e aria-controls', () => {
      const btn = doc.getElementById('hamburger-button');
      expect(btn).not.toBeNull();
      expect(btn.hasAttribute('aria-expanded')).toBe(true);
      expect(btn.getAttribute('aria-controls')).toBe('offcanva');
    });
  });

  describe('SEO', () => {
    it('title ≤60 caracteres', () => {
      const title = doc.querySelector('title');
      expect(title).not.toBeNull();
      expect(title.textContent.length).toBeLessThanOrEqual(60);
    });

    it('meta description entre 100-160 caracteres', () => {
      const meta = doc.querySelector('meta[name="description"]');
      expect(meta).not.toBeNull();
      const content = meta.getAttribute('content');
      expect(content.length).toBeGreaterThanOrEqual(100);
      expect(content.length).toBeLessThanOrEqual(160);
    });

    it('canonical URL correta com slug', () => {
      const canonical = doc.querySelector('link[rel="canonical"]');
      expect(canonical).not.toBeNull();
      expect(canonical.getAttribute('href')).toBe(
        `https://www.drajaquelinesayonara.com.br/tratamentos/${slug}/`
      );
    });

    it('Open Graph completo', () => {
      expect(doc.querySelector('meta[property="og:title"]')).not.toBeNull();
      expect(doc.querySelector('meta[property="og:description"]')).not.toBeNull();
      expect(doc.querySelector('meta[property="og:image"]')).not.toBeNull();
      expect(doc.querySelector('meta[property="og:url"]')).not.toBeNull();
      expect(doc.querySelector('meta[property="og:type"]')).not.toBeNull();
      expect(doc.querySelector('meta[property="og:locale"]')).not.toBeNull();
    });

    it('Twitter Cards completo', () => {
      expect(doc.querySelector('meta[name="twitter:card"]')).not.toBeNull();
      expect(doc.querySelector('meta[name="twitter:title"]')).not.toBeNull();
      expect(doc.querySelector('meta[name="twitter:image"]')).not.toBeNull();
    });

    it('lang="pt-br" no html', () => {
      const htmlEl = doc.querySelector('html');
      expect(htmlEl.getAttribute('lang')).toBe('pt-br');
    });
  });

  describe('Schema.org', () => {
    it('JSON-LD presente e válido', () => {
      const script = doc.querySelector('script[type="application/ld+json"]');
      expect(script).not.toBeNull();
      expect(() => JSON.parse(script.textContent)).not.toThrow();
    });

    it('contém MedicalProcedure', () => {
      const script = doc.querySelector('script[type="application/ld+json"]');
      const schema = JSON.parse(script.textContent);
      const procedure = schema['@graph'].find(i => i['@type'] === 'MedicalProcedure');
      expect(procedure).toBeDefined();
      expect(procedure.name).toBeTruthy();
      expect(procedure.url).toContain(slug);
    });

    it('contém BreadcrumbList com 3 itens', () => {
      const script = doc.querySelector('script[type="application/ld+json"]');
      const schema = JSON.parse(script.textContent);
      const breadcrumb = schema['@graph'].find(i => i['@type'] === 'BreadcrumbList');
      expect(breadcrumb).toBeDefined();
      expect(breadcrumb.itemListElement).toHaveLength(3);
    });

    it('contém FAQPage com perguntas', () => {
      const script = doc.querySelector('script[type="application/ld+json"]');
      const schema = JSON.parse(script.textContent);
      const faq = schema['@graph'].find(i => i['@type'] === 'FAQPage');
      expect(faq).toBeDefined();
      expect(faq.mainEntity.length).toBeGreaterThanOrEqual(3);
    });

    it('contém Dentist com aggregateRating', () => {
      const script = doc.querySelector('script[type="application/ld+json"]');
      const schema = JSON.parse(script.textContent);
      const dentist = schema['@graph'].find(i => i['@type'] === 'Dentist');
      expect(dentist).toBeDefined();
      expect(dentist.aggregateRating.ratingValue).toBe('5.0');
    });
  });

  describe('Estrutura e Conteúdo', () => {
    it('possui <header>, <main>, <footer>', () => {
      expect(doc.querySelector('header')).not.toBeNull();
      expect(doc.querySelector('main')).not.toBeNull();
      expect(doc.querySelector('footer')).not.toBeNull();
    });

    it('hierarquia H1 > H2 correta (sem saltos)', () => {
      const headings = doc.querySelectorAll('h1, h2, h3');
      let foundH1 = false;
      let foundH2 = false;
      for (const h of headings) {
        if (h.tagName === 'H1') foundH1 = true;
        if (h.tagName === 'H2') {
          expect(foundH1).toBe(true);
          foundH2 = true;
        }
        if (h.tagName === 'H3') {
          expect(foundH2).toBe(true);
        }
      }
    });

    it('FAQ presente com ao menos 3 details/summary', () => {
      const details = doc.querySelectorAll('.treatment-content details');
      expect(details.length).toBeGreaterThanOrEqual(3);
      details.forEach(d => {
        expect(d.querySelector('summary')).not.toBeNull();
      });
    });

    it('seção "Outros Tratamentos" com 6 links internos', () => {
      const related = doc.querySelector('.related-treatments');
      expect(related).not.toBeNull();
      const links = related.querySelectorAll('a[href^="/tratamentos/"]');
      expect(links.length).toBe(6);
    });

    it('"Outros Tratamentos" não contém link para si mesmo', () => {
      const related = doc.querySelector('.related-treatments');
      const selfLink = related.querySelector(`a[href="/tratamentos/${slug}/"]`);
      expect(selfLink).toBeNull();
    });

    it('CTA WhatsApp presente', () => {
      const whatsapp = doc.querySelector('a[href*="wa.me"]');
      expect(whatsapp).not.toBeNull();
    });

    it('WhatsApp float presente', () => {
      const float = doc.querySelector('.whatsapp-float');
      expect(float).not.toBeNull();
    });
  });

  describe('Performance', () => {
    it('imagem hero com loading="eager"', () => {
      const heroImg = doc.querySelector('.treatment-hero img');
      expect(heroImg).not.toBeNull();
      expect(heroImg.getAttribute('loading')).toBe('eager');
    });

    it('font preload presente', () => {
      const preload = doc.querySelector('link[rel="preload"][as="font"]');
      expect(preload).not.toBeNull();
      expect(preload.getAttribute('href')).toContain('Manrope');
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
