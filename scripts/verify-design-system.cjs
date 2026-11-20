/* Static design checks using dependencies already installed in the project. */
const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');
const postcss = require('postcss');
const root = path.resolve(__dirname, '..');
const output = path.join(root, process.argv.includes('--phase-9') ? 'docs/phase-9' : process.argv.includes('--phase-8') ? 'docs/phase-8' : process.argv.includes('--phase-7') ? 'docs/phase-7' : process.argv.includes('--phase-6') ? 'docs/phase-6' : process.argv.includes('--phase-5') ? 'docs/phase-5' : 'docs/phase-4');
const files = [];
function scan(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) scan(file);
    else if (file.endsWith('.css')) files.push(file);
  }
}
scan(path.join(root, 'src'));
const tokens = new Map(), refs = [], duplicateTokens = [], badValues = [], leakedSelectors = [], buttonDefinitions = [];
for (const file of files) {
  const sheet = postcss.parse(fs.readFileSync(file, 'utf8'), { from: file });
  sheet.walkDecls(decl => {
    if (decl.prop.startsWith('--')) {
      if (tokens.has(decl.prop)) duplicateTokens.push(decl.prop);
      tokens.set(decl.prop, decl.value);
    }
    for (const match of decl.value.matchAll(/var\((--[\w-]+)/g)) refs.push({ token: match[1], file: path.relative(root, file) });
    if (/\d(?:\.\d+)?var\(/.test(decl.value)) badValues.push({ file, property: decl.prop, value: decl.value });
  });
  sheet.walkRules(rule => {
    if (/^\.btn(?:[\s.:#\[,>\-]|$)/.test(rule.selector.trim())) buttonDefinitions.push(path.relative(root, file).replaceAll('\\', '/'));
    if (file.includes(path.join('src', 'components')) && /^(?:header|footer|form|input|textarea|button|h[1-6])(?:\s|[.#[:>,]|$)/.test(rule.selector.trim())) {
      leakedSelectors.push({ file: path.relative(root, file), selector: rule.selector });
    }
  });
}
function resolve(name, chain = []) {
  assert(!chain.includes(name), 'Cyclic token: ' + [...chain, name].join(' → '));
  assert(tokens.has(name), 'Missing token: ' + name);
  return tokens.get(name).replace(/var\((--[\w-]+)\)/g, (_, key) => resolve(key, [...chain, name]));
}
const missing = refs.filter(ref => !tokens.has(ref.token));
for (const name of tokens.keys()) resolve(name);
function luminance(hex) {
  const rgb = hex.replace('#', '').match(/../g).map(value => parseInt(value, 16) / 255);
  return rgb.map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4)
    .reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
}
function contrast(a, b) {
  const x = luminance(resolve(a)), y = luminance(resolve(b));
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
const contrastResults = [];
for (const foreground of ['--color-text', '--color-text-light', '--color-link']) {
  for (const background of ['--color-bg', '--color-surface', '--color-surface-raised']) {
    contrastResults.push({ foreground, background, ratio: contrast(foreground, background), minimum: 4.5 });
  }
}
for (const background of ['--color-primary', '--color-primary-hover', '--color-primary-active']) {
  contrastResults.push({ foreground: '--color-on-primary', background, ratio: contrast('--color-on-primary', background), minimum: 4.5 });
}
for (const background of ['--color-bg', '--color-surface', '--color-surface-raised']) {
  contrastResults.push({ foreground: '--color-border', background, ratio: contrast('--color-border', background), minimum: 3 });
}
assert.equal(missing.length, 0, 'Undefined custom properties');
assert.equal(duplicateTokens.length, 0, 'Tokens defined more than once');
assert.equal(badValues.length, 0, 'Invalid numeric substitutions');
assert.equal(leakedSelectors.length, 0, 'Component styles leaking to global HTML elements');
assert(contrastResults.every(item => item.ratio >= item.minimum), 'Insufficient semantic-token contrast');
assert.deepEqual([...new Set(buttonDefinitions)], ['src/styles/primitives.css']);
const results = {
  passed: true, cssFiles: files.length, tokens: tokens.size, references: refs.length,
  missingTokens: missing, duplicateTokens, badValues, leakedSelectors,
  buttonDefinitions: [...new Set(buttonDefinitions)],
  contrast: contrastResults.map(item => ({ ...item, ratio: +item.ratio.toFixed(2) })),
  caveat: 'Ratios use solid token colors; not a full rendered-page WCAG certification.'
};
fs.mkdirSync(output, { recursive: true });
fs.writeFileSync(path.join(output, 'system-checks.json'), JSON.stringify(results, null, 2) + '\n');
console.log(JSON.stringify(results, null, 2));
