import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('SEO — index.html', () => {
  let doc, html;

  beforeAll(() => {
    html = readFileSync(resolve(__dirname, '../../index.html'), 'utf-8');
    const parser = new DOMParser();
    doc = parser.parseFromString(html, 'text/html');
  });

  describe('Meta tags', () => {
    it('title tem no máximo 60 caracteres', () => {
      const title = doc.querySelector('title');
      expect(title).not.toBeNull();
      expect(title.textContent.length).toBeLessThanOrEqual(60);
    });

    it('meta description presente e entre 120-160 caracteres', () => {
      const meta = doc.querySelector('meta[name="description"]');
      expect(meta).not.toBeNull();
      const content = meta.getAttribute('content');
      expect(content.length).toBeGreaterThanOrEqual(120);
      expect(content.length).toBeLessThanOrEqual(160);
    });

    it('canonical URL presente e correto', () => {
      const canonical = doc.querySelector('link[rel="canonical"]');
      expect(canonical).not.toBeNull();
      expect(canonical.getAttribute('href')).toBe('https://www.drajaquelinesayonara.com.br/');
    });

    it('lang="pt-br" no html', () => {
      const htmlEl = doc.querySelector('html');
      expect(htmlEl.getAttribute('lang')).toBe('pt-br');
    });
  });

  describe('Open Graph', () => {
    it('og:title presente', () => {
      const og = doc.querySelector('meta[property="og:title"]');
      expect(og).not.toBeNull();
      expect(og.getAttribute('content').length).toBeGreaterThan(0);
    });

    it('og:description presente', () => {
      const og = doc.querySelector('meta[property="og:description"]');
      expect(og).not.toBeNull();
    });

    it('og:image presente e é URL absoluta', () => {
      const og = doc.querySelector('meta[property="og:image"]');
      expect(og).not.toBeNull();
      expect(og.getAttribute('content')).toMatch(/^https?:\/\//);
    });

    it('og:url presente', () => {
      const og = doc.querySelector('meta[property="og:url"]');
      expect(og).not.toBeNull();
    });

    it('og:type é "website"', () => {
      const og = doc.querySelector('meta[property="og:type"]');
      expect(og).not.toBeNull();
      expect(og.getAttribute('content')).toBe('website');
    });

    it('og:locale é "pt_BR"', () => {
      const og = doc.querySelector('meta[property="og:locale"]');
      expect(og).not.toBeNull();
      expect(og.getAttribute('content')).toBe('pt_BR');
    });
  });

  describe('Twitter Cards', () => {
    it('twitter:card é summary_large_image', () => {
      const tc = doc.querySelector('meta[name="twitter:card"]');
      expect(tc).not.toBeNull();
      expect(tc.getAttribute('content')).toBe('summary_large_image');
    });

    it('twitter:title presente', () => {
      const tc = doc.querySelector('meta[name="twitter:title"]');
      expect(tc).not.toBeNull();
    });

    it('twitter:image presente', () => {
      const tc = doc.querySelector('meta[name="twitter:image"]');
      expect(tc).not.toBeNull();
    });
  });

  describe('Schema.org JSON-LD', () => {
    it('contém script type="application/ld+json"', () => {
      const script = doc.querySelector('script[type="application/ld+json"]');
      expect(script).not.toBeNull();
    });

    it('JSON-LD é parseable (JSON válido)', () => {
      const script = doc.querySelector('script[type="application/ld+json"]');
      expect(() => JSON.parse(script.textContent)).not.toThrow();
    });

    it('Schema tem @type "Dentist"', () => {
      const script = doc.querySelector('script[type="application/ld+json"]');
      const schema = JSON.parse(script.textContent);
      expect(schema['@type']).toBe('Dentist');
    });

    it('Schema tem aggregateRating', () => {
      const script = doc.querySelector('script[type="application/ld+json"]');
      const schema = JSON.parse(script.textContent);
      expect(schema.aggregateRating).toBeDefined();
      expect(schema.aggregateRating.ratingValue).toBe('5.0');
    });

    it('Schema tem telephone', () => {
      const script = doc.querySelector('script[type="application/ld+json"]');
      const schema = JSON.parse(script.textContent);
      expect(schema.telephone).toBe('+5583994058749');
    });
  });
});

describe('SEO — sitemap.xml', () => {
  let sitemap;

  beforeAll(() => {
    sitemap = readFileSync(resolve(__dirname, '../../sitemap.xml'), 'utf-8');
  });

  it('sitemap contém URL canônica da home', () => {
    expect(sitemap).toContain('https://www.drajaquelinesayonara.com.br/');
  });

  it('sitemap é XML válido (começa com declaração)', () => {
    expect(sitemap.trim()).toMatch(/^<\?xml/);
  });
});

describe('SEO — robots.txt', () => {
  let robots;

  beforeAll(() => {
    robots = readFileSync(resolve(__dirname, '../../robots.txt'), 'utf-8');
  });

  it('permite crawling (User-agent: *)', () => {
    expect(robots).toContain('User-agent:');
  });

  it('contém referência ao sitemap', () => {
    expect(robots.toLowerCase()).toContain('sitemap');
  });
});
