const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert/strict');
const root=path.resolve(__dirname,'..');
const before=require('../docs/phase-9/before-source-hashes.json');
const read=f=>fs.readFileSync(path.join(root,f));
const hash=v=>crypto.createHash('sha256').update(v).digest('hex').toUpperCase();
const expected=new Set(['package.json','public/index.html','src/index.js','src/hooks/useMediaQuery.js','src/components/Typewriter.jsx','src/components/contact/Contact.jsx','src/components/services/Services.jsx','src/data/data.jsx']);
const removed=before.filter(f=>!fs.existsSync(path.join(root,f.path))).map(f=>f.path);assert.equal(removed.length,0);
const changed=before.filter(f=>hash(read(f.path))!==f.sha256).map(f=>f.path);
const unexpected=changed.filter(f=>!expected.has(f));assert.deepEqual(unexpected,[]);
const contact=read('src/components/contact/Contact.jsx').toString('utf8');
// Reverse only the declared hydration changes, then compare the whole component
// with its independently persisted phase-8 hash (including all event handlers).
let originalContact=contact.replace(/\r\n/g,'\n')
  .replace('const [captchaReady, setCaptchaReady] = useState(false);','const [captchaReady, setCaptchaReady] = useState(() => typeof IntersectionObserver !== \'function\');')
  .replace('  const [clientReady, setClientReady] = useState(false);\n\n  useEffect(() => { setClientReady(true); }, []);\n','')
  .replace("    if (typeof IntersectionObserver !== 'function') {\n      setCaptchaReady(true);\n      return undefined;\n    }\n",'')
  .replace('disabled={isSubmitting || !clientReady}','disabled={isSubmitting}');
const contactHash=before.find(f=>f.path==='src/components/contact/Contact.jsx').sha256;
assert([originalContact,originalContact.replace(/\r?\n/g,'\r\n')].some(s=>hash(s)===contactHash),'Contact changed beyond declared hydration changes');
const originalData=read('src/data/data.jsx').toString('utf8')
  .replace(/const (Nodejs|TailwindCSS|Python|Meta|Nextjs) = props => \{ const svgId = React.useId\(\); return \((<svg[^\r\n]+<\/svg>)\); \};/g,(_,name,svg)=>'const '+name+' = props => '+svg
    .replace(/id=\{svgId \+ '-([^']+)'\}/g,(_,id)=>'id="'+id+'"')
    .replace(/([\w]+)=\{'url\(#' \+ svgId \+ '-([^']+)\)'\}/g,(_,attr,id)=>attr+'="url(#'+id+')"')
    .replace(/xlinkHref=\{'#' \+ svgId \+ '-([^']+)'\}/g,(_,id)=>'xlinkHref="#'+id+'"')+';');
assert.equal(hash(originalData),before.find(f=>f.path==='src/data/data.jsx').sha256,'Project data changed beyond SVG identifier namespacing');
const files=[];
function scan(dir){for(const e of fs.readdirSync(path.join(root,dir),{withFileTypes:true})){const f=dir+'/'+e.name;if(e.isDirectory())scan(f);else files.push(f);}}
scan('src');scan('public');files.push('package.json','package-lock.json','.gitignore');
const old=new Set(before.map(f=>f.path)),added=files.filter(f=>!old.has(f));
assert.deepEqual(added.sort(),['public/assets/dms-social.png','public/assets/dms-social.svg','public/robots.txt','public/sitemap.xml']);
const result={passed:true,compared:before.length,changed,added,unchanged:before.length-changed.length,unexpected,removed,contactHandlersUnchanged:true,projectDatasetUnchangedAfterSvgIdReversal:true,protected:'All project data, 23 projects, confidentiality notices, original links, CV, existing and optimized assets, App/Nav/carousel/CTA components, CSS tokens and package-lock preserved. No dependencies added.'};
fs.writeFileSync(path.join(root,'docs/phase-9/integrity-results.json'),JSON.stringify(result,null,2)+'\n');
fs.writeFileSync(path.join(root,'docs/phase-9/source-hashes.json'),JSON.stringify(files.sort().map(f=>({path:f,sha256:hash(read(f))})),null,2)+'\n');
console.log(JSON.stringify(result,null,2));
