#!/usr/bin/env node
/**
 * Build script completo — CSS + inline + validação
 *
 * Executa:
 * 1. Build CSS (ambos bundles: home + treatment)
 * 2. Inline CSS nos HTMLs
 * 3. Valida que todos os HTMLs possuem <style> com conteúdo
 * 4. Reporta tamanhos finais
 */

import { execSync } from 'child_process';
import { readFileSync, statSync, readdirSync } from 'fs';
import { resolve, join } from 'path';

const ROOT = resolve(import.meta.dirname, '..');
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;
const bold = (s) => `\x1b[1m${s}\x1b[0m`;

let hasError = false;

function step(label) {
  console.log(`\n${bold(`▸ ${label}`)}`);
}

function run(cmd) {
  try {
    execSync(cmd, { cwd: ROOT, stdio: 'pipe' });
  } catch (e) {
    console.error(red(`  ✗ Falha: ${cmd}`));
    console.error(e.stderr?.toString() || e.message);
    hasError = true;
  }
}

// --- 1. Build CSS ---
step('Build CSS');
run('./build-css.sh');

const cssHome = resolve(ROOT, 'assets/css/styles.min.css');
const cssTreatment = resolve(ROOT, 'assets/css/styles-treatment.min.css');
const cssHomeSize = statSync(cssHome).size;
const cssTreatmentSize = statSync(cssTreatment).size;
console.log(`  ${green('✓')} styles.min.css (${cssHomeSize.toLocaleString()} bytes)`);
console.log(`  ${green('✓')} styles-treatment.min.css (${cssTreatmentSize.toLocaleString()} bytes)`);

// --- 2. Inline CSS ---
step('Inline CSS nos HTMLs');
run('./update-inline-css.sh');
console.log(`  ${green('✓')} CSS inline atualizado`);

// --- 3. Validação ---
step('Validação');

const htmlFiles = [resolve(ROOT, 'index.html')];

// Página índice de tratamentos
const tratamentosIndex = resolve(ROOT, 'tratamentos/index.html');
try { statSync(tratamentosIndex); htmlFiles.push(tratamentosIndex); } catch {}

// Páginas individuais de tratamento
const tratDir = resolve(ROOT, 'tratamentos');
for (const dir of readdirSync(tratDir)) {
  const f = join(tratDir, dir, 'index.html');
  try { statSync(f); htmlFiles.push(f); } catch {}
}

let validCount = 0;
for (const file of htmlFiles) {
  const content = readFileSync(file, 'utf-8');
  const match = content.match(/<style>([\s\S]*?)<\/style>/);
  const relPath = file.replace(ROOT + '/', '');

  if (!match || match[1].trim().length < 1000) {
    console.error(red(`  ✗ ${relPath} — <style> vazio ou muito pequeno`));
    hasError = true;
  } else {
    validCount++;
  }
}
console.log(`  ${green('✓')} ${validCount}/${htmlFiles.length} arquivos com CSS inline válido`);

// --- 4. Relatório ---
step('Relatório de tamanhos');
console.log('');
console.log('  Arquivo                                     Tamanho');
console.log('  ─────────────────────────────────────────── ───────────');

for (const file of htmlFiles) {
  const size = statSync(file).size;
  const relPath = file.replace(ROOT + '/', '');
  const pad = relPath.padEnd(45);
  console.log(`  ${pad} ${(size / 1024).toFixed(1)} KB`);
}

console.log('');
console.log(`  CSS home:        ${(cssHomeSize / 1024).toFixed(1)} KB`);
console.log(`  CSS tratamentos: ${(cssTreatmentSize / 1024).toFixed(1)} KB`);

// --- Resultado ---
console.log('');
if (hasError) {
  console.error(red(bold('✗ Build finalizado com erros')));
  process.exit(1);
} else {
  console.log(green(bold('✓ Build concluído com sucesso!')));
}
