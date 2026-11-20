/* Validate the actual production HTML without executing its JavaScript. */
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const {JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'..'),build=path.join(root,'build');
const html=fs.readFileSync(path.join(build,'index.html'),'utf8');
const doc=new JSDOM(html).window.document;
const checks=[];
function check(name,fn){fn();checks.push(name);}
const content=selector=>doc.querySelector(selector)?.getAttribute('content');
check('Unique Spanish-Mexico identity, canonical and indexable directives',()=>{
  assert.equal(doc.documentElement.lang,'es-MX');
  assert.equal(doc.querySelectorAll('title').length,1);
  assert.equal(doc.title,'Software a medida en México | David Molina · DMS');
  assert.equal(doc.querySelectorAll('meta[name=description]').length,1);
  assert(content('meta[name=description]').includes('David Molina'));
  assert.equal(doc.querySelectorAll('link[rel=canonical]').length,1);
  assert.equal(doc.querySelector('link[rel=canonical]').href,'https://dm-series.com/');
  assert(content('meta[name=robots]').includes('index, follow'));
  assert(!doc.querySelector('meta[name=keywords]'));
  assert.equal(require('../package.json').homepage,'https://dm-series.com/');
});
check('Consistent Open Graph and Twitter metadata with a real 1200x630 PNG',()=>{
  for(const attr of ['og:title','og:description','og:image','og:image:alt','og:url','og:locale','og:site_name']) assert(content(`meta[property="${attr}"]`));
  assert.equal(content('meta[property="og:locale"]'),'es_MX');
  assert.equal(content('meta[property="og:url"]'),'https://dm-series.com/');
  assert.equal(content('meta[name="twitter:title"]'),doc.title);
  const image=content('meta[property="og:image"]');
  assert.equal(image,content('meta[name="twitter:image"]'));
  assert.equal(new URL(image).origin,'https://dm-series.com');
  const png=fs.readFileSync(path.join(build,new URL(image).pathname));
  assert.equal(png.subarray(1,4).toString(),'PNG');
  assert.equal(png.readUInt32BE(16),1200);assert.equal(png.readUInt32BE(20),630);
  assert.equal(content('meta[property="og:image:width"]'),'1200');
  assert.equal(content('meta[property="og:image:height"]'),'630');
});
check('Structured entities use verified identity and Mexico services, without invented local or rating claims',()=>{
  const nodes=doc.querySelectorAll('script[type="application/ld+json"]');assert.equal(nodes.length,1);
  const schema=JSON.parse(nodes[0].textContent);assert.equal(schema['@context'],'https://schema.org');
  const graph=schema['@graph'],ids=new Set(graph.map(n=>n['@id']));assert.equal(ids.size,6);
  const person=graph.find(n=>n['@type']==='Person');
  assert.equal(person.name,'David Molina');assert.equal(person.brand.name,'DMS');
  const links=new Set([...doc.querySelectorAll('a[href]')].map(a=>a.href));
  person.sameAs.forEach(href=>assert(links.has(href)));
  const services=graph.filter(n=>n['@type']==='Service');assert.equal(services.length,3);
  for(const service of services){assert(ids.has(service.provider['@id']));assert.equal(service.areaServed.name,'México');}
  assert(graph.some(n=>n['@type']==='WebSite')&&graph.some(n=>n['@type']==='WebPage'));
  assert(!/aggregateRating|reviewRating|streetAddress|postalCode|foundingDate|yearsExperience/.test(nodes[0].textContent));
});
check('All React content and original links are present before JavaScript runs',()=>{
  assert.equal(doc.querySelectorAll('main').length,1);assert.equal(doc.querySelectorAll('h1').length,1);
  assert.equal(doc.querySelectorAll('.portfolio__feature-item').length,4);
  assert.equal(doc.querySelectorAll('.portfolio__item').length,19);
  assert.equal(doc.querySelectorAll('.project-demo-link').length,23);
  assert.deepEqual([...doc.querySelectorAll('.service__list')].map(n=>n.children.length),[6,5,4]);
  assert.equal(doc.querySelectorAll('.testimonial').length,4);
  assert(doc.querySelector('#services').textContent.includes('software a medida'));
  assert(doc.querySelector('#services').textContent.includes('soluciones empresariales'));
  assert(doc.querySelector('.contact__submit').disabled);
  const ids=[...doc.querySelectorAll('[id]')].map(n=>n.id);assert.equal(new Set(ids).size,ids.length);
  for(const svg of doc.querySelectorAll('svg'))for(const node of svg.querySelectorAll('*'))for(const attr of node.attributes){
    const ref=attr.value.match(/^url\(#([^)]+)\)$/)?.[1] || (attr.name==='xlink:href'&&attr.value.startsWith('#')?attr.value.slice(1):null);
    if(ref)assert.equal(doc.getElementById(ref)?.closest('svg'),svg,'SVG reference must resolve inside its own icon');
  }
  for(const a of doc.querySelectorAll('a[href^="#"]'))assert(doc.getElementById(a.hash.slice(1)));
  for(const img of doc.querySelectorAll('img'))assert(img.hasAttribute('alt'));
  for(const el of doc.querySelectorAll('[src],source[srcset],script[src],link[href]')){
    const values=el.hasAttribute('srcset')?el.getAttribute('srcset').split(',').map(v=>v.trim().split(' ')[0]):[el.getAttribute('src')||el.getAttribute('href')];
    for(const url of values){if(url?.startsWith('/'))assert(fs.existsSync(path.join(build,url)),'Missing built asset '+url);}
  }
  assert(doc.querySelector('a[download]').href.endsWith('.pdf'));
});
check('Robots allows crawling and sitemap contains only the actual canonical homepage',()=>{
  const robots=fs.readFileSync(path.join(build,'robots.txt'),'utf8');
  assert(/User-agent: \*/.test(robots)&&/Allow: \//.test(robots));
  assert(!/Disallow: \/\s/.test(robots));assert(robots.includes('Sitemap: https://dm-series.com/sitemap.xml'));
  const xml=fs.readFileSync(path.join(build,'sitemap.xml'),'utf8');
  const sitemap=new JSDOM(xml,{contentType:'text/xml'}).window.document;
  assert(!sitemap.querySelector('parsererror'));
  assert.equal(sitemap.documentElement.namespaceURI,'http://www.sitemaps.org/schemas/sitemap/0.9');
  assert.deepEqual([...sitemap.querySelectorAll('loc')].map(n=>n.textContent),['https://dm-series.com/']);
  assert(!sitemap.querySelector('lastmod'),'Do not invent a last modification date');
});
const result={passed:true,checks,htmlBytes:Buffer.byteLength(html),markupMethod:'React renderToString at build time, same App hydrated in the browser',scope:'Local production build. Not a Google indexing, rich-result eligibility or live-host certification.'};
fs.writeFileSync(path.join(root,'docs/phase-9/seo-results.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
