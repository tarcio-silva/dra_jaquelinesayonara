import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
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

// Cobertura dos artigos individuais (blog/<slug>/index.html), exceto o _template.
const blogDir = resolve(__dirname, '../../blog');
const articleSlugs = readdirSync(blogDir).filter(
  f => !f.startsWith('_') && !f.includes('.')
);

describe.each(articleSlugs)('Blog — artigo (%s)', (slug) => {
  let doc, html, schema;

  beforeAll(() => {
    html = readFileSync(resolve(blogDir, slug, 'index.html'), 'utf-8');
    const parser = new DOMParser();
    doc = parser.parseFromString(html, 'text/html');
    const script = doc.querySelector('script[type="application/ld+json"]');
    schema = JSON.parse(script.textContent);
  });

  describe('Acessibilidade', () => {
    it('skip link aponta para #main-content', () => {
      expect(doc.querySelector('a.skip-link')?.getAttribute('href')).toBe('#main-content');
    });

    it('#main-content existe', () => {
      expect(doc.getElementById('main-content')).not.toBeNull();
    });

    it('apenas um H1 na página', () => {
      expect(doc.querySelectorAll('h1').length).toBe(1);
    });

    it('todas as imagens possuem alt', () => {
      const semAlt = Array.from(doc.querySelectorAll('img')).filter(i => !i.hasAttribute('alt'));
      expect(semAlt).toHaveLength(0);
    });

    it('links target="_blank" com rel noopener noreferrer', () => {
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

    it('hierarquia de headings sem saltos (h1 antes de h2, h2 antes de h3)', () => {
      let foundH1 = false, foundH2 = false;
      for (const h of doc.querySelectorAll('h1, h2, h3')) {
        if (h.tagName === 'H1') foundH1 = true;
        if (h.tagName === 'H2') { expect(foundH1).toBe(true); foundH2 = true; }
        if (h.tagName === 'H3') expect(foundH2).toBe(true);
      }
    });
  });

  describe('SEO', () => {
    it('title ≤60 caracteres', () => {
      expect(doc.querySelector('title').textContent.length).toBeLessThanOrEqual(60);
    });

    it('meta description entre 120-160 caracteres', () => {
      const content = doc.querySelector('meta[name="description"]').getAttribute('content');
      expect(content.length).toBeGreaterThanOrEqual(120);
      expect(content.length).toBeLessThanOrEqual(160);
    });

    it('canonical correta (com www e trailing slash, apontando ao próprio slug)', () => {
      expect(doc.querySelector('link[rel="canonical"]').getAttribute('href')).toBe(
        `https://www.drajaquelinesayonara.com.br/blog/${slug}/`
      );
    });

    it('Open Graph type "article" e completo', () => {
      ['og:title', 'og:description', 'og:image', 'og:url', 'og:type', 'og:locale'].forEach(p => {
        expect(doc.querySelector(`meta[property="${p}"]`)).not.toBeNull();
      });
      expect(doc.querySelector('meta[property="og:type"]').getAttribute('content')).toBe('article');
    });

    it('lang="pt-br"', () => {
      expect(doc.querySelector('html').getAttribute('lang')).toBe('pt-br');
    });
  });

  describe('Schema.org', () => {
    it('contém BlogPosting com headline e datas', () => {
      const post = schema['@graph'].find(i => i['@type'] === 'BlogPosting');
      expect(post).toBeDefined();
      expect(post.headline).toBeTruthy();
      expect(post.datePublished).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(post.dateModified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('contém BreadcrumbList (Home › Blog › artigo)', () => {
      const bc = schema['@graph'].find(i => i['@type'] === 'BreadcrumbList');
      expect(bc).toBeDefined();
      expect(bc.itemListElement).toHaveLength(3);
      expect(bc.itemListElement[2].item).toContain(slug);
    });

    it('contém FAQPage com 3-4 perguntas', () => {
      const faq = schema['@graph'].find(i => i['@type'] === 'FAQPage');
      expect(faq).toBeDefined();
      expect(faq.mainEntity.length).toBeGreaterThanOrEqual(3);
    });

    it('FAQ do Schema e FAQ do HTML têm a mesma contagem (sincronizados)', () => {
      const faq = schema['@graph'].find(i => i['@type'] === 'FAQPage');
      const htmlDetails = doc.querySelectorAll('.treatment-faq details');
      expect(htmlDetails.length).toBe(faq.mainEntity.length);
    });
  });

  describe('Estrutura e Conteúdo', () => {
    it('possui <header>, <main>, <footer>', () => {
      expect(doc.querySelector('header')).not.toBeNull();
      expect(doc.querySelector('main')).not.toBeNull();
      expect(doc.querySelector('footer')).not.toBeNull();
    });

    it('FAQ com ao menos 3 details/summary', () => {
      const details = doc.querySelectorAll('.treatment-faq details');
      expect(details.length).toBeGreaterThanOrEqual(3);
      details.forEach(d => expect(d.querySelector('summary')).not.toBeNull());
    });

    it('corpo do artigo tem ao menos 3 seções <h2> (fora do FAQ) — nada comentado', () => {
      // Regressão: um comentário-guia do template já comentou a 1ª seção silenciosamente.
      const contentH2 = doc.querySelectorAll('.treatment-content > div > h2');
      expect(contentH2.length).toBeGreaterThanOrEqual(3);
    });

    it('não há comentário-guia residual do template', () => {
      const html = readFileSync(resolve(blogDir, slug, 'index.html'), 'utf-8');
      expect(html).not.toContain('CONTEUDO DO ARTIGO');
      expect(html).not.toContain('PLACEHOLDERS a substituir');
    });

    it('aviso "não substitui consulta" presente', () => {
      const html = readFileSync(resolve(blogDir, slug, 'index.html'), 'utf-8');
      expect(html).toContain('não substitui uma consulta');
    });

    it('se houver seção de Referências, está bem-formada (ol com entradas + h2)', () => {
      const refs = doc.querySelector('.treatment-references');
      if (refs) {
        expect(refs.querySelector('h2')).not.toBeNull();
        expect(refs.querySelectorAll('ol li').length).toBeGreaterThanOrEqual(1);
      }
    });

    it('"Leia também" com 3 cards, sem link para si mesmo', () => {
      const related = doc.querySelector('.related-treatments');
      expect(related).not.toBeNull();
      const cards = related.querySelectorAll('a.related-card');
      expect(cards.length).toBe(3);
      expect(related.querySelector(`a[href="/blog/${slug}/"]`)).toBeNull();
    });

    it('CTA WhatsApp e float presentes', () => {
      expect(doc.querySelector('a[href*="wa.me"]')).not.toBeNull();
      expect(doc.querySelector('.whatsapp-float')).not.toBeNull();
    });

    it('CSS inline preenchido (não placeholder)', () => {
      const style = doc.querySelector('style');
      expect(style).not.toBeNull();
      expect(style.textContent.length).toBeGreaterThan(1000);
    });
  });
});
