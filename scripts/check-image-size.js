#!/usr/bin/env node
/**
 * Verifica se imagens staged excedem 100KB.
 * Usado pelo lint-staged no pre-commit.
 */

import { statSync } from 'fs';

const MAX_SIZE = 100 * 1024; // 100KB
const files = process.argv.slice(2);
let hasWarning = false;

for (const file of files) {
  try {
    const size = statSync(file).size;
    if (size > MAX_SIZE) {
      console.warn(`⚠️  ${file} (${(size / 1024).toFixed(0)}KB) excede 100KB`);
      hasWarning = true;
    }
  } catch {}
}

if (hasWarning) {
  console.warn('\n💡 Considere otimizar as imagens antes de commitar.');
  // Não bloqueia o commit, apenas avisa
}
