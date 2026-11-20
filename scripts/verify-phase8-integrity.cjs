const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert/strict');
const root=path.resolve(__dirname,'..');
const before=require('../docs/phase-8/before-source-hashes.json');
const protectedLogic=require('../docs/phase-8/protected-logic.json');
const hash=text=>crypto.createHash('sha256').update(text).digest('hex').toUpperCase();
const read=file=>fs.readFileSync(path.join(root,file));
const expected=new Set([
  'src/components/header/Header.jsx','src/components/about/About.jsx','src/components/services/Services.jsx',
  'src/components/testimonials/Testimonials.jsx','src/components/contact/Contact.jsx','src/components/footer/Footer.jsx',
  'src/components/portfolio/Portfolio.jsx','src/components/portfolio/portfolio.css','src/index.css','src/data/data.jsx',
  'src/App.navigation.test.jsx','src/components/contact/Contact.test.jsx',
]);
const expectedNew=['src/components/ui/ProjectDemoLink.jsx','src/utils/contactLinks.js','src/utils/contactLinks.test.js'];
const removed=before.filter(f=>!fs.existsSync(path.join(root,f.path))).map(f=>f.path);assert.equal(removed.length,0);
const changed=before.filter(f=>hash(read(f.path))!==f.sha256).map(f=>f.path);
const unexpected=changed.filter(f=>!expected.has(f));assert.equal(unexpected.length,0);
const contact=read('src/components/contact/Contact.jsx').toString('utf8');
assert.equal(hash(contact.slice(contact.indexOf('const Contact ='),contact.indexOf('\n  return ('))),protectedLogic.contact,'Contact logic changed');
let data=read('src/data/data.jsx').toString('utf8');
const reversals=[
  ['Aplicación personalizada para importar reportes técnicos mediante QR y manejar un control administrativo en diferentes regiones.','Aplicación personalizada para importar reportes tecnicos mediante QR y manejar un control administrativo en diferentes regiones.'],
  ['Plataformas de impartición de talleres para capacitar a los usuarios a nivel técnico sobre los requerimientos de sus productos e incentivar ventas en la compañía.','Plataformas de imparticion de talleres, para capacitar a los usuarios a nivel tecnico los requerimientos de sus productos para incentivar ventas en la compañia.'],
  ['Aplicación personalizada para gestionar procesos en el área de cobranza, evaluar resultados y optimizar procesos con la propuesta de diferentes módulos (SMS, WhatsApp y correo electrónico).','Aplicación personalizada para gestionar diferentes procesos en el area de cobranza, evaluar resultados, y optimizar procesos con la propuesta de diferentes modulos (SMS, WhatsApp, Email)'],
  ['Sitio web en desarrollo para una agencia de marketing, con una experiencia de usuario basada en una historia, easter eggs y más.','Sitio Web en desarrollo para una agencia de Marketing, donde buscamos llevar la experencia de usuario a otro nivel, dejando una historia de por medio, easter-eggs y mucho mas'],
  ['puedes hacerlo por WhatsApp o mediante el formulario de contacto.','por favor completa el formulario de contacto. '],
];
for(const [now,old] of reversals){assert(data.includes(now));data=data.split(now).join(old);}
assert.equal(hash(data),before.find(f=>f.path==='src/data/data.jsx').sha256,'Unapproved project-data change');
let testimonials=read('src/components/testimonials/Testimonials.jsx').toString('utf8');
const newline=testimonials.includes('\r\n')?'\r\n':'\n';
testimonials=testimonials.replace('      <h2 id="testimonials-title">','      <p className="section__intro">Opinión de los clientes</p>'+newline+'      <h2 id="testimonials-title">');
assert.equal(hash(testimonials),before.find(f=>f.path==='src/components/testimonials/Testimonials.jsx').sha256,'Testimonial content or logic changed');
const files=[];
function scan(dir){for(const e of fs.readdirSync(path.join(root,dir),{withFileTypes:true})){const f=dir+'/'+e.name;if(e.isDirectory())scan(f);else files.push(f);}}
scan('src');scan('public');files.push('package.json','package-lock.json','.gitignore');
const old=new Set(before.map(f=>f.path)),added=files.filter(f=>!old.has(f));
assert.deepEqual([...added].sort(),[...expectedNew].sort());
const result={passed:true,method:'SHA-256 against 179 files persisted at the beginning of phase 8, matching the end of phase 7.',compared:before.length,changed,newSourceFiles:added,unchanged:before.length-changed.length,unexpected,removed,contactLogicUnchanged:true,projectDatasetRestoresExactlyAfterCopyReversal:true,testimonialContentAndLogicUnchanged:true,protected:'All original and optimized assets, PDF/CV, packages, public/index.html (SEO reserved for phase 9), App/Nav/motion and delivery components preserved.'};
fs.writeFileSync(path.join(root,'docs/phase-8/integrity-results.json'),JSON.stringify(result,null,2)+'\n');
const snapshot=files.sort().map(f=>({path:f,sha256:hash(read(f))}));
fs.writeFileSync(path.join(root,'docs/phase-8/source-hashes.json'),JSON.stringify(snapshot,null,2)+'\n');
console.log(JSON.stringify({passed:true,compared:before.length,changed:changed.length,newSourceFiles:added,unchanged:result.unchanged,unexpected,removed},null,2));
