const assert=require('assert/strict');
const baseline=require('../docs/phase-1/baseline.json');
const confidential=new Set(baseline.inventory.projects.filter(p=>p.confidential).map(p=>p.name));

async function inspect(evaluate) {
  return evaluate('('+(()=>{
    const cards=[...document.querySelectorAll('.portfolio__feature-item,.portfolio__item')].map(card=>{
      const title=card.querySelector('h3').textContent.trim();
      const links=[...card.querySelectorAll('.project-demo-link')];
      const link=links[0],url=new URL(link.href),r=link.getBoundingClientRect();
      return {title,count:links.length,href:link.href,host:url.hostname,phone:url.pathname,message:url.searchParams.get('text'),params:[...url.searchParams.keys()],target:link.target,rel:link.rel,name:link.getAttribute('aria-label'),label:link.textContent.trim(),height:r.height,overflow:link.scrollWidth>link.clientWidth+1||link.scrollHeight>link.clientHeight+1,primary:link.classList.contains('btn-primary'),primaryCount:card.querySelectorAll('.btn-primary').length,notice:card.querySelector('.portfolio__feature-subdescription')?.textContent||''};
    });
    return {width:innerWidth,font:getComputedStyle(document.documentElement).fontSize,cards,services:[...document.querySelectorAll('.service__list')].map(list=>list.children.length),serviceNames:[...document.querySelectorAll('.service__head h3')].map(h=>h.textContent),documentWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth};
  }).toString()+')()');
}
function validate(state) {
  assert.equal(state.cards.length,23);
  assert(state.documentWidth<=state.clientWidth+1);
  assert.deepEqual(state.services,[6,5,4]);
  assert.deepEqual(state.serviceNames,['Diseño UI/UX','Desarrollo web','Creación de contenido']);
  assert.equal(new Set(state.cards.map(c=>c.message)).size,23);
  for(const card of state.cards) {
    assert.equal(card.count,1); assert.equal(card.host,'wa.me'); assert.equal(card.phone,'/525540613200');
    assert.deepEqual(card.params,['text']); assert.equal(card.target,'_blank');
    assert(card.rel.includes('noopener')&&card.rel.includes('noreferrer'));
    assert.equal(card.name,`Solicitar demo de ${card.title} por WhatsApp`);
    assert.equal(card.label,'Solicitar demo'); assert(card.primary && card.primaryCount===1);
    assert(card.height>=44 && !card.overflow,'Clipped/small demo control: '+card.title+' at '+state.width);
    const expected=confidential.has(card.title)
      ? `Hola David, me interesa "${card.title}" de DMS. Quisiera consultar la posibilidad de una demo privada, respetando la confidencialidad del proyecto.`
      : `Hola David, me interesa "${card.title}" de DMS. Me gustaría solicitar una demo y conocer más sobre este proyecto.`;
    assert.equal(card.message,expected);
    if(confidential.has(card.title)) assert(card.notice.includes('no está disponible para presentación pública'));
  }
}
exports.verify=async({send,evaluate,navigate,screenshot,results})=>{
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await send('Emulation.setTouchEmulationEnabled',{enabled:false});
  results.polish={views:[],outboundRequestsSent:false};
  for(const [width,height] of [[320,844],[390,844],[768,1024],[1440,1000]]) {
    await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
    await navigate();
    const state=await inspect(evaluate); validate(state); results.polish.views.push(state);
    for(const id of ['portfolio','otros-proyectos']) {
      await evaluate('document.getElementById('+JSON.stringify(id)+').scrollIntoView({block:"start",behavior:"instant"})');
      await screenshot('polish-'+id+'-'+width);
    }
  }
  results.checks.push('polish:23-personalized-demo-links','polish:private-requests-use-public-titles-only','polish:correct-number-and-safe-external-links','polish:one-primary-action-per-project','polish:service-categories-and-15-items-preserved');
  for(const width of [320,768]) {
    await send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:false});
    await navigate(); await evaluate('document.documentElement.style.fontSize="200%"');
    const state=await inspect(evaluate);validate(state);results.polish.views.push(state);
    await evaluate('document.getElementById("portfolio").scrollIntoView({block:"start",behavior:"instant"})');
    await screenshot('polish-text-200-'+width);
  }
  results.checks.push('polish:demo-controls-fit-text-200-percent');
  await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:false});
  await navigate();
  await evaluate('document.querySelector(".header__actions a[download]").focus()');
  // Header actions are followed by the five navigation links before main content.
  for(let step=0;step<8;step++) {
    await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
    await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
    if(await evaluate('document.activeElement.classList.contains("project-demo-link")')) break;
  }
  const focus=await evaluate('(() => {const link=document.querySelector(".project-demo-link");link.scrollIntoView({block:"center",behavior:"instant"});const s=getComputedStyle(link),r=link.getBoundingClientRect(),n=document.querySelector(".site-nav").getBoundingClientRect();return {name:document.activeElement.getAttribute("aria-label"),onDemo:document.activeElement===link,outline:s.outlineStyle,outlineWidth:s.outlineWidth,bottom:r.bottom,navTop:n.top};})()');
  assert(focus.onDemo);
  assert.equal(focus.outline,'solid');assert.equal(focus.outlineWidth,'3px');assert(focus.bottom<focus.navTop);
  await screenshot('polish-demo-focus');results.polish.focus=focus;
  results.checks.push('polish:demo-focus-visible-above-fixed-navigation');
};
