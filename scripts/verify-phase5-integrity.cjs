/* Compare protected content with the persisted phase-1 inventory.
 * Previous implementation phases are explicitly included in the allowed diff.
 * A phase-5-start snapshot existed only in memory and did not survive restart;
 * this script does not claim an exact before/after comparison for phase 5.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const assert = require('assert/strict');
const root = path.resolve(__dirname, '..');
const baseline = require('../docs/phase-1/baseline.json');
const phase4 = require('../docs/phase-4/integrity-results.json');
const output = path.join(root, 'docs/phase-5');
const expected = new Set([...phase4.changed, 'src/App.jsx', 'src/components/nav/Nav.jsx']);
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex').toUpperCase();
const changed = [], removed = [], protectedFiles = [];
for (const file of baseline.fileHashes) {
  if (!fs.existsSync(path.join(root, file.path))) { removed.push(file.path); continue; }
  const actual = hash(file.path);
  if (actual !== file.sha256.toUpperCase()) changed.push(file.path);
  if (file.path.startsWith('src/assets/') || file.path.startsWith('src/data/') || ['package.json', 'package-lock.json'].includes(file.path) || (file.path.startsWith('public/') && file.path !== 'public/index.html')) {
    protectedFiles.push({path:file.path, unchanged:actual === file.sha256.toUpperCase()});
  }
}
const unexpected = changed.filter(file => !expected.has(file));
assert.equal(removed.length, 0, 'Original file removed');
assert.equal(unexpected.length, 0, 'Unexpected cumulative change');
assert(protectedFiles.every(file => file.unchanged), 'Protected original content changed');
const results = {
  passed:true,
  method:'SHA-256 compared with persisted phase-1 baseline; allowed cumulative changes from phases 2–5. Phase-5 scope is documented separately and regression-tested.',
  limitation:'The in-memory phase-5-start snapshot was lost during session restart; no exact phase-5-only hash comparison is claimed.',
  comparedExistingFiles:baseline.fileHashes.length,
  changedSincePhase1:changed,
  unexpectedCumulativeChanges:unexpected,
  removed,
  protectedFiles,
};
fs.mkdirSync(output, {recursive:true});
fs.writeFileSync(path.join(output,'integrity-results.json'), JSON.stringify(results,null,2)+'\n');
// Persist the current source snapshot so the next phase is independently auditable.
const files=[];
function scan(directory) {
  for (const entry of fs.readdirSync(path.join(root,directory),{withFileTypes:true})) {
    const file=directory+'/'+entry.name;
    if (entry.isDirectory()) scan(file); else files.push(file);
  }
}
scan('src'); scan('public');
files.push('package.json','package-lock.json','.gitignore');
fs.writeFileSync(path.join(output,'source-hashes.json'), JSON.stringify(files.sort().map(file=>({path:file,sha256:hash(file)})),null,2)+'\n');
console.log(JSON.stringify({passed:true,compared:results.comparedExistingFiles,protected:protectedFiles.length,unexpected,removed},null,2));
