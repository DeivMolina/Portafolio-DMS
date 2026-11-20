const assert = require('assert/strict');
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

async function measure(evaluate) {
  return evaluate('(' + (() => {
    const doc = document.documentElement;
    const header = document.getElementById('inicio');
    const title = header.querySelector('h1');
    const actions = header.querySelector('.header__actions');
    const rect = node => { const r = node.getBoundingClientRect(); return { left:r.left, right:r.right, top:r.top, bottom:r.bottom, width:r.width, height:r.height }; };
    const cols = selector => (getComputedStyle(document.querySelector(selector)).gridTemplateColumns.match(/[0-9.]+px/g) || []).filter(track => parseFloat(track) > 0).length;
    const nav = rect(document.querySelector('.site-nav'));
    const boxes = [...document.querySelectorAll('.container,.portfolio__item,.portfolio__feature-item,.service,.about__card,.contact__option,.form-field')];
    const overflow = boxes.filter(node => { const r=rect(node); return r.left < -1 || r.right > doc.clientWidth + 1; }).map(node => node.className);
    const rows = new Map();
    for (const card of document.querySelectorAll('.portfolio__item')) {
      const action = card.querySelector('.portfolio__item-cta .btn:last-child');
      if (!action) continue;
      const row = Math.round(card.getBoundingClientRect().top + scrollY);
      if (!rows.has(row)) rows.set(row, []);
      rows.get(row).push(action.getBoundingClientRect().bottom);
    }
    return {
      width: innerWidth, clientWidth:doc.clientWidth, documentWidth:doc.scrollWidth, height:innerHeight,
      rootFont: getComputedStyle(doc).fontSize,
      header:rect(header), actions:rect(actions),
      title:{...rect(title),scrollWidth:title.scrollWidth,clientWidth:title.clientWidth,scrollHeight:title.scrollHeight,clientHeight:title.clientHeight},
      nav, overflow,
      overflowDetails: doc.scrollWidth > doc.clientWidth + 1 ? [...document.querySelectorAll('body *')].filter(node => !node.closest('.swiper-wrapper') && node.getBoundingClientRect().right > doc.clientWidth + 1).slice(0, 20).map(node => ({tag:node.tagName,className:node.getAttribute('class'),text:node.textContent.slice(0,80),rect:rect(node)})) : [],
      archiveColumns:cols('.portfolio__container'), serviceColumns:cols('.services__container'), featureColumns:cols('.portfolio__feature-item'), aboutColumns:cols('.about__cards'), contactColumns:cols('.contact__container'),
      actionRows:[...rows.values()].map(values=>Math.max(...values)-Math.min(...values)),
      biographyAlign:getComputedStyle(document.querySelector('.about__content > p')).textAlign,
      heroCTA:header.querySelector('a[href="#contact"]')?.textContent,
      featured:document.querySelectorAll('.portfolio__feature-item').length,
      projects:document.querySelectorAll('.portfolio__item').length,
      notices:document.querySelectorAll('.portfolio__feature-subdescription').length
    };
  }).toString() + ')()');
}
function verifyGeometry(state) {
  assert(state.documentWidth <= state.clientWidth + 1, 'Horizontal page overflow: ' + JSON.stringify(state));
  assert.equal(state.overflow.length, 0, 'Content box outside viewport: ' + JSON.stringify(state));
  assert(state.header.bottom >= state.actions.bottom - 1, 'Hero actions clipped');
  assert(state.title.scrollWidth <= state.title.clientWidth + 1, 'Title clipped horizontally');
  assert(state.title.scrollHeight <= state.title.clientHeight + 1, 'Title clipped vertically');
  assert(state.nav.left >= 0 && state.nav.right <= state.clientWidth + 1, 'Fixed navigation overflows');
  assert(state.actionRows.every(delta => delta <= 2), 'Project actions do not align');
  assert(['start','left'].includes(state.biographyAlign));
  assert.equal(state.heroCTA, 'Hablemos');
  assert.equal(state.featured, 4); assert.equal(state.projects, 19); assert.equal(state.notices, 4);
}
exports.checkViewport = async evaluate => {
  const state = await measure(evaluate);
  verifyGeometry(state);
  if (state.width === 320) assert.equal(state.archiveColumns, 1);
  if (state.width === 768) assert.equal(state.archiveColumns, 2);
  if (state.width === 1440) assert.equal(state.archiveColumns, 3);
  return state;
};
exports.verify = async ({ send, evaluate, navigate, screenshot, results }) => {
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
  const scenarios = [
    {name:'landscape-568',width:568,height:320},
    {name:'landscape-667',width:667,height:375},
    {name:'landscape-844',width:844,height:390},
    {name:'short-desktop',width:1024,height:600},
    {name:'zoom-200-reflow',width:640,height:450},
    {name:'zoom-400-reflow',width:320,height:225},
    {name:'text-200-mobile',width:320,height:844,text:200},
    {name:'text-200-tablet',width:768,height:1024,text:200},
    {name:'text-200-desktop',width:1440,height:900,text:200},
    {name:'font-fallback-mobile',width:320,height:844,fallback:true},
    {name:'font-fallback-tablet',width:768,height:1024,fallback:true},
  ];
  results.layoutStress = [];
  for (const scenario of scenarios) {
    await send('Emulation.setDeviceMetricsOverride',{width:scenario.width,height:scenario.height,deviceScaleFactor:1,mobile:false});
    await navigate();
    await evaluate('document.querySelector(".typewriter__control")?.click()');
    if (scenario.text) await evaluate('document.documentElement.style.fontSize="200%"');
    if (scenario.fallback) await evaluate('document.documentElement.style.setProperty("--font-body","sans-serif");document.documentElement.style.setProperty("--font-display","sans-serif")');
    await pause(150);
    const state = await measure(evaluate);
    verifyGeometry(state);
    await evaluate('document.querySelector(".header__actions a[download]").scrollIntoView({block:"center",behavior:"instant"})');
    const reachable = await evaluate('(() => {const r=document.querySelector(".header__actions a[download]").getBoundingClientRect(), n=document.querySelector(".site-nav").getBoundingClientRect();return r.top>=0 && r.bottom<n.top;})()');
    assert(reachable, 'CV action cannot clear fixed navigation in ' + scenario.name);
    results.layoutStress.push({name:scenario.name,...state});
    if (['landscape-568','zoom-400-reflow','text-200-mobile'].includes(scenario.name)) await screenshot(scenario.name);
  }
  results.checks.push('layout:landscape-and-short-windows','layout:200-and-400-percent-reflow-equivalents','layout:text-only-200-percent','layout:font-fallback-reflow','layout:cv-reachable-above-navigation');
  const titles=['Hey, soy David Molina.','Desarrollador Full Stack.','Bienvenido a mi universo Creativo.'];
  results.titleStress=[];
  for (const width of [600,601,768,1024,1440]) {
    await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:false});
    await navigate();
    await evaluate('document.querySelector(".typewriter__control")?.click()');
    const title = await evaluate('(' + (texts => {
      const heading=document.querySelector('.typewriter-title');
      if (!heading) return {missing:true};
      const content=heading.querySelector('span') || heading;
      const original=content.textContent;
      const states=texts.map(text=>{content.textContent=text;return {text,width:heading.clientWidth,scrollWidth:heading.scrollWidth,height:heading.clientHeight,scrollHeight:heading.scrollHeight};});
      content.textContent=original;
      return {states};
    }).toString() + ')(' + JSON.stringify(titles) + ')');
    assert(!title.missing);
    assert(title.states.every(state=>state.scrollWidth<=state.width+1 && state.scrollHeight<=state.height+1));
    results.titleStress.push({width,...title});
    // Capture the complete supplied phrase without waiting through a typing cycle.
    await evaluate('(document.querySelector(".typewriter-title > span") || document.querySelector(".typewriter-title")).textContent="Bienvenido a mi universo Creativo."');
    await screenshot('complete-hero-'+width);
  }
  results.checks.push('layout:all-typewriter-phrases-fit');
  await send('Emulation.setDeviceMetricsOverride',{width:320,height:844,deviceScaleFactor:1,mobile:false});
  await navigate('#portfolio');
  await evaluate('document.querySelector(".portfolio__feature-title").textContent="ProyectoEmpresarialConUnNombreExtraordinariamenteLargoSinEspacios".repeat(3)');
  const longTitle=await measure(evaluate); verifyGeometry(longTitle);
  results.checks.push('layout:long-unbroken-project-title');
  await screenshot('long-title-stress');
  await navigate();
  for (const [width,height] of [[320,844],[768,1024],[1440,1000]]) {
    await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
    await navigate();
    for (const id of ['portfolio','otros-proyectos','services','about','testimonials','contact']) {
      await evaluate('document.getElementById('+JSON.stringify(id)+').scrollIntoView({block:"start",behavior:"instant"})');
      await pause(100); await screenshot('layout-'+id+'-'+width);
    }
  }
};
