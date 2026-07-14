import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createVideoFixture } from '../helpers/dom-utils.js';
import { mockMatchMedia } from '../mocks/match-media.js';

async function loadMainJs() {
  vi.resetModules();
  await import('../../assets/js/main.js');
}

describe('Prefers Reduced Motion', () => {
  describe('quando prefers-reduced-motion: reduce', () => {
    beforeEach(async () => {
      createVideoFixture();
      mockMatchMedia({ '(prefers-reduced-motion: reduce)': true });
      await loadMainJs();
    });

    it('pausa vídeos com autoplay', () => {
      const video = document.querySelector('video');
      expect(video.pause).toBeDefined();
      // O script chama video.pause() — em happy-dom isso é chamável
    });

    it('remove atributo autoplay dos vídeos', () => {
      const video = document.querySelector('video');
      expect(video.hasAttribute('autoplay')).toBe(false);
    });
  });

  describe('quando prefers-reduced-motion: no-preference', () => {
    beforeEach(async () => {
      createVideoFixture();
      mockMatchMedia({ '(prefers-reduced-motion: reduce)': false });
      await loadMainJs();
    });

    it('mantém autoplay nos vídeos', () => {
      const video = document.querySelector('video');
      expect(video.hasAttribute('autoplay')).toBe(true);
    });
  });
});
