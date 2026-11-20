const assert = require('assert/strict');

exports.setupPage = async send => {
  // Capture an actual parsed server node before deferred React executes.
  await send('Page.addScriptToEvaluateOnNewDocument', {source:`
    const serverObserver=new MutationObserver(()=>{
      const main=document.querySelector('#root main');
      if(main){window.__dmsServerMain=main;serverObserver.disconnect();}
    });
    serverObserver.observe(document,{childList:true,subtree:true});
  `});
};

exports.verify = async ({send,evaluate,navigate,screenshot,results,origin}) => {
  await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:false});
  await send('Emulation.setScriptExecutionDisabled',{value:true});
  try {
    await navigate();
    const state=await evaluate(`({
      projects:document.querySelectorAll('.portfolio__feature-item,.portfolio__item').length,
      demos:document.querySelectorAll('.project-demo-link').length,
      main:document.querySelectorAll('main').length,h1:document.querySelectorAll('h1').length,
      description:document.querySelector('#services').textContent,
      noScript:[...document.querySelectorAll('noscript')].some(n=>n.textContent.includes('WhatsApp')),
      submitDisabled:document.querySelector('.contact__submit').disabled,
      overflow:document.documentElement.scrollWidth>innerWidth+1,
      hashTargets:[...document.querySelectorAll('a[href^="#"]')].every(a=>document.getElementById(a.hash.slice(1)))
    })`);
    assert.equal(state.projects,23);assert.equal(state.demos,23);
    assert.equal(state.main,1);assert.equal(state.h1,1);
    assert(state.description.includes('México')&&state.description.includes('software a medida'));
    assert(state.noScript&&state.submitDisabled&&state.hashTargets&&!state.overflow);
    results.seo={withoutJavaScript:state};
    results.checks.push('SEO: full 23-project portfolio, links and Mexico services readable with JavaScript disabled');
    results.checks.push('SEO: no-JavaScript contact alternatives and disabled form submission');
    await screenshot('seo-without-javascript-390');
    await evaluate(`(()=>{const form=document.querySelector('#form');for(const [name,value] of Object.entries({name:'SEO validation',email:'test@example.com',phone:'5555555555',message:'Local test only'}))form.elements[name].value=value;form.elements.email.focus();})()`);
    await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,text:'\r',unmodifiedText:'\r'});
    await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
    assert.equal(await evaluate('location.search'),'');
    assert(await evaluate('!!document.querySelector(".contact__submit:disabled")'));
    results.checks.push('SEO: native Enter cannot submit the unhydrated contact form or put field values in a URL');
    // Native fragments remain useful even when React never starts.
    await evaluate(`([...document.querySelectorAll('a')].find(a=>a.getAttribute('href')==='#services')).click()`);
    assert.equal(await evaluate('location.hash'),'#services');
    results.checks.push('SEO: native fragment navigation works without JavaScript');
  } finally { await send('Emulation.setScriptExecutionDisabled',{value:false}); }
  await navigate();
  const hydrated=await evaluate(`({
    sameMain:window.__dmsServerMain===document.querySelector('#root main'),
    enabled:!document.querySelector('.contact__submit').disabled,
    projects:document.querySelectorAll('.portfolio__feature-item,.portfolio__item').length,
    mains:document.querySelectorAll('main').length,
    ids:[...document.querySelectorAll('[id]')].map(e=>e.id),
    canonical:[...document.querySelectorAll('link[rel=canonical]')].map(e=>e.href),
    title:document.title,lang:document.documentElement.lang
  })`);
  assert(hydrated.sameMain&&hydrated.enabled);
  assert.equal(hydrated.projects,23);assert.equal(hydrated.mains,1);
  assert.equal(new Set(hydrated.ids).size,hydrated.ids.length);
  assert.deepEqual(hydrated.canonical,['https://dm-series.com/']);
  assert.equal(hydrated.lang,'es-MX');
  assert(hydrated.title.includes('David Molina')&&hydrated.title.includes('México'));
  results.seo.hydrated=hydrated;
  results.checks.push('SEO: hydration retains the original main node, enables form and creates no duplicate content or IDs');
  results.checks.push('SEO: canonical, title and es-MX remain consistent after React hydration');
  const responses=await evaluate(`Promise.all(['/robots.txt','/sitemap.xml','/assets/dms-social.png','/assets/does-not-exist.png','/does-not-exist'].map(async path=>{const r=await fetch(path);return {path,status:r.status,type:r.headers.get('content-type')};}))`);
  assert.deepEqual(responses.map(r=>r.status),[200,200,200,404,404]);
  assert(responses[1].type.includes('xml')&&responses[2].type.includes('image/png'));
  results.seo.localHttp=responses;
  results.checks.push('SEO: local HTTP serves robots, XML sitemap and social PNG; missing assets and pages return 404');
};
