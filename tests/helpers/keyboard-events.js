/**
 * Helpers para simular eventos de teclado nos testes.
 */

/**
 * Dispara um evento keydown em um elemento.
 * @param {HTMLElement} element - Elemento alvo
 * @param {string} key - Nome da tecla (ex: 'Escape', 'Tab', 'Enter', ' ')
 * @param {object} options - Opções extras (shiftKey, ctrlKey, etc.)
 */
export function pressKey(element, key, options = {}) {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
    ...options,
  });
  element.dispatchEvent(event);
  return event;
}

/**
 * Simula Tab para frente.
 */
export function pressTab(element) {
  return pressKey(element, 'Tab');
}

/**
 * Simula Shift+Tab (navegar para trás).
 */
export function pressShiftTab(element) {
  return pressKey(element, 'Tab', { shiftKey: true });
}

/**
 * Simula Escape.
 */
export function pressEscape(element = document) {
  return pressKey(element, 'Escape');
}

/**
 * Simula Enter.
 */
export function pressEnter(element) {
  return pressKey(element, 'Enter');
}

/**
 * Simula Space.
 */
export function pressSpace(element) {
  return pressKey(element, ' ');
}
