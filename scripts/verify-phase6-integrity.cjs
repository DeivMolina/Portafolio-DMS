const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const assert = require('assert/strict');
const root = path.resolve(__dirname,'..');
const before = require('../docs/phase-6/before-source-hashes.json');
const expected = new Set([
  'src/components/Typewriter.jsx','src/components/header/Header.jsx','src/components/header/header.css',
  'src/components/testimonials/Testimonials.jsx','src/components/testimonials/testimonials.css',
  'src/components/about/about.css','src/components/portfolio/portfolio.css',
  'src/styles/tokens.css','src/styles/primitives.css','src/index.css','src/App.navigation.test.jsx',
]);
const expectedNew=['src/hooks/useMediaQuery.js','src/components/Typewriter.test.jsx'];
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex').toUpperCase();
const removed=before.filter(file=>!fs.existsSync(path.join(root,file.path))).map(file=>file.path);
assert.equal(removed.length,0,'Original source removed');
const changed=before.filter(file=>hash(file.path)!==file.sha256).map(file=>file.path);
const unexpected=changed.filter(file=>!expected.has(file));
assert.equal(unexpected.length,0,'Unplanned source change');
const current=[];
function scan(dir) {
  for(const entry of fs.readdirSync(path.join(root,dir),{withFileTypes:true})) {
    const file=dir+'/'+entry.name;
    if(entry.isDirectory()) scan(file); else current.push(file);
  }
}
scan('src');scan('public');current.push('package.json','package-lock.json','.gitignore');
const old=new Set(before.map(file=>file.path));
const added=current.filter(file=>!old.has(file));
assert.deepEqual([...added].sort(),[...expectedNew].sort(),'Unplanned new source');
const results={passed:true,method:'SHA-256 against the persisted start-of-phase-6 snapshot; it matched all 100 phase-5 hashes before edits.',compared:before.length,changed,newSourceFiles:added,unchanged:before.length-changed.length,unexpected,removed,protected:'Project data, images, PDF/CV, packages, URLs, App/Nav logic and the complete Contact component match the beginning of phase 6.'};
fs.writeFileSync(path.join(root,'docs/phase-6/integrity-results.json'),JSON.stringify(results,null,2)+'\n');
fs.writeFileSync(path.join(root,'docs/phase-6/source-hashes.json'),JSON.stringify(current.sort().map(file=>({path:file,sha256:hash(file)})),null,2)+'\n');
console.log(JSON.stringify(results,null,2));
