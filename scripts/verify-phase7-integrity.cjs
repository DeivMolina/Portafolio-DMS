const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert/strict');
const root=path.resolve(__dirname,'..');
const before=require('../docs/phase-7/before-source-hashes.json');
const images=require('../src/data/image-manifest.json');
const expected=new Set([
  'public/index.html','src/index.css','src/components/header/Header.jsx','src/components/header/header.css',
  'src/components/about/About.jsx','src/components/portfolio/Portfolio.jsx','src/components/portfolio/portfolio.css',
  'src/components/testimonials/Testimonials.jsx','src/components/contact/Contact.jsx',
  'src/components/contact/contact.css','src/components/contact/Contact.test.jsx',
]);
const expectedNew=['src/components/ui/OptimizedImage.jsx','src/components/ui/ProjectPreview.jsx','src/components/ui/ProjectPreview.test.jsx','src/data/image-manifest.json'];
for(const image of Object.values(images)) {
  for(const variant of image.variants) {
    const file='public'+variant.src;
    expectedNew.push(file);
    assert.equal(fs.statSync(path.join(root,file)).size,variant.bytes,'Variant size drift: '+file);
  }
  if(image.posterFallback) expectedNew.push('public'+image.posterFallback);
}
const hash=file=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex').toUpperCase();
const removed=before.filter(f=>!fs.existsSync(path.join(root,f.path))).map(f=>f.path);
assert.equal(removed.length,0);
const changed=before.filter(f=>hash(f.path)!==f.sha256).map(f=>f.path);
const unexpected=changed.filter(file=>!expected.has(file)); assert.equal(unexpected.length,0);
const files=[];
function scan(dir){for(const e of fs.readdirSync(path.join(root,dir),{withFileTypes:true})){const file=dir+'/'+e.name;if(e.isDirectory())scan(file);else files.push(file);}}
scan('src');scan('public');files.push('package.json','package-lock.json','.gitignore');
const old=new Set(before.map(f=>f.path)),added=files.filter(f=>!old.has(f));
assert.deepEqual([...added].sort(),[...expectedNew].sort());
const imageReport=require('../docs/phase-7/image-optimization.json');
assert.equal(Object.keys(images).length,29);
for(const original of imageReport.files) assert.equal(hash(original.original),original.sha256,'Original modified: '+original.original);
const html=fs.readFileSync(path.join(root,'public/index.html'),'utf8');
assert(!/cdn-uicons|cdn\.jsdelivr|recaptcha\/api\.js/.test(html));
assert(html.includes('family=Geologica:wght@500&family=Poppins:wght@400;500;600&display=swap'));
const contact=fs.readFileSync(path.join(root,'src/components/contact/Contact.jsx'),'utf8');
const newline=contact.includes('\r\n')?'\r\n':'\n';
// Reverse only this phase's loading wrapper, in memory, to verify the complete original form source.
const recovered=contact
  .replace(/\r?\n  const \[captchaReady[\s\S]*?\r?\n  \}, \[captchaReady\]\);\r?\n/,newline)
  .replace(/            onFocusCapture=\{\(\) => setCaptchaReady\(true\)\}\r?\n/,'')
  .replace(/            <div className="contact__captcha-widget">\r?\n            \{captchaReady && <ReCAPTCHA/,'            <ReCAPTCHA')
  .replace(/            \/>\}\r?\n            <\/div>/,'            />');
const restoredHash=crypto.createHash('sha256').update(recovered).digest('hex').toUpperCase();
const formSourceRestored=restoredHash===before.find(f=>f.path==='src/components/contact/Contact.jsx').sha256;
assert(formSourceRestored,'Changes beyond the approved Contact loading wrapper');
const result={passed:true,method:'SHA-256 against the persisted 102-file start-of-phase-7 snapshot, equal to the end of phase 6.',compared:before.length,changed,newCode:added.filter(f=>f.startsWith('src/')),newDeliveryAssets:added.filter(f=>f.startsWith('public/')),unchanged:before.length-changed.length,removed,unexpected,contactOriginalRestoredAfterRemovingLoadingWrapper:formSourceRestored,protected:'All original asset bytes, images/GIF/PDF/CV, project data, URLs, App/Nav/motion logic and package files preserved. New delivery derivatives are additive.'};
fs.writeFileSync(path.join(root,'docs/phase-7/integrity-results.json'),JSON.stringify(result,null,2)+'\n');
fs.writeFileSync(path.join(root,'docs/phase-7/source-hashes.json'),JSON.stringify(files.sort().map(file=>({path:file,sha256:hash(file)})),null,2)+'\n');
console.log(JSON.stringify({passed:true,compared:result.compared,changed:changed.length,newCode:result.newCode.length,newDeliveryAssets:result.newDeliveryAssets.length,contactOriginalRestoredAfterRemovingLoadingWrapper:formSourceRestored,unexpected,removed},null,2));
