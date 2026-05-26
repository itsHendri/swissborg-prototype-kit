#!/usr/bin/env node
/**
 * Post-clone sanity check. Runs from `prestart`.
 *
 * Warns (non-fatal) if any of these still look like the template defaults:
 *   - package.json `name` === "swissborg-prototype-kit"
 *   - app.json     `expo.name` === "Prototype Kit"
 *   - app.json     `expo.slug` === "swissborg-prototype-kit"
 *   - app.json     `expo.extra.eas.projectId` missing
 *
 * Silent on a properly-renamed fork. Exits 0 in all cases — never blocks
 * `expo start`.
 */

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const PKG  = path.join(ROOT, 'package.json');
const APP  = path.join(ROOT, 'app.json');
const MARKER = path.join(ROOT, '.kit-template');

const KIT_NAME = 'swissborg-prototype-kit';
const KIT_LABEL = 'Prototype Kit';

// Skip the check when running inside the kit itself. Forks created via
// "Use this template" inherit `.kit-template`; the README's "After
// cloning" step instructs the user to delete it as part of the rename.
if (fs.existsSync(MARKER)) process.exit(0);

function read(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch { return null; }
}

const pkg = read(PKG);
const app = read(APP);
const warnings = [];

if (pkg && pkg.name === KIT_NAME) {
  warnings.push(`package.json \`name\` is still "${KIT_NAME}". Rename it to your prototype's slug.`);
}
if (app?.expo?.name === KIT_LABEL) {
  warnings.push(`app.json \`expo.name\` is still "${KIT_LABEL}". Rename it (this is what shows under the icon).`);
}
if (app?.expo?.slug === KIT_NAME) {
  warnings.push(`app.json \`expo.slug\` is still "${KIT_NAME}". Rename it (used for EAS + URL slug).`);
}
if (!app?.expo?.extra?.eas?.projectId) {
  warnings.push(`app.json \`expo.extra.eas.projectId\` is missing. Run \`npx eas project:init\` once before \`eas update\`.`);
}

if (warnings.length === 0) process.exit(0);

const Y = '\x1b[33m';
const D = '\x1b[2m';
const R = '\x1b[0m';
const B = '\x1b[1m';

console.log('');
console.log(`${Y}${B}⚠  Prototype kit setup checks${R}`);
warnings.forEach(w => console.log(`${Y}   • ${R}${w}`));
console.log(`${D}   (non-fatal — Metro will boot anyway. Fix these so deploys/links work.)${R}`);
console.log('');

process.exit(0);
