const assert = require('assert/strict');
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

exports.verify = async ({ send, evaluate, navigate, screenshot, waitFor, results }) => {
  const media = value => send('Emulation.setEmulatedMedia', { features: [{ name:'prefers-reduced-motion', value }] });
  const viewport = (width,height,mobile=false) => send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile});
  const key = async (key,code,windowsVirtualKeyCode) => {
    await send('Input.dispatchKeyEvent',{type:'keyDown',key,code,windowsVirtualKeyCode,...(key==='Enter'?{text:'\r',unmodifiedText:'\r'}:{})});
    await send('Input.dispatchKeyEvent',{type:'keyUp',key,code,windowsVirtualKeyCode});
  };
  const heading = () => evaluate('document.querySelector("header h1 span").textContent');
  await send('Emulation.setTouchEmulationEnabled',{enabled:false});
  await viewport(1440,1000); await media('no-preference'); await navigate();
  await waitFor('document.querySelector("header h1").dataset.running === "true"');
  assert.equal(await evaluate('document.querySelector("header h1").getAttribute("aria-label")'),'Hey, soy David Molina.');
  await key('Tab','Tab',9); await key('Tab','Tab',9);
  const control = await evaluate('(() => {const e=document.activeElement,r=e.getBoundingClientRect(),s=getComputedStyle(e);return {className:e.className,height:r.height,outline:s.outlineStyle};})()');
  assert.equal(control.className,'typewriter__control'); assert(control.height>=44); assert.equal(control.outline,'solid');
  await key(' ','Space',32);
  await waitFor('document.querySelector(".typewriter__control").textContent.includes("Reanudar")');
  const held=await heading();
  assert(['Hey, soy David Molina.','Desarrollador Full Stack.','Bienvenido a mi universo Creativo.'].includes(held));
  await pause(1300); assert.equal(await heading(),held);
  await screenshot('motion-paused-desktop');
  await key(' ','Space',32);
  await waitFor('document.querySelector("header h1 span").textContent !== '+JSON.stringify(held));
  results.checks.push('motion:keyboard-pause-and-resume','motion:complete-text-when-paused','motion:stable-accessible-heading');

  await evaluate('document.getElementById("portfolio").scrollIntoView({block:"start",behavior:"instant"})');
  await waitFor('document.querySelector("header h1").dataset.running === "false"');
  const offscreen=await heading(); await pause(400); assert.equal(await heading(),offscreen);
  await evaluate('window.scrollTo({top:0,behavior:"instant"})');
  await waitFor('document.querySelector("header h1").dataset.running === "true"');
  results.checks.push('motion:offscreen-suspension-and-resume');

  await media('reduce');
  await waitFor('!document.querySelector(".typewriter__control")');
  assert.equal(await heading(),'Hey, soy David Molina.');
  await pause(500); assert.equal(await heading(),'Hey, soy David Molina.');
  assert.equal(await evaluate('getComputedStyle(document.documentElement).scrollBehavior'),'auto');
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".availability-badge")).animationName'),'none');
  await evaluate('window.scrollTo({top:0,behavior:"instant"})');
  await screenshot('motion-reduced-desktop');
  await media('no-preference');
  await waitFor('!!document.querySelector(".typewriter__control")');
  results.checks.push('motion:live-reduced-motion-preference');

  await send('DOM.enable'); await send('CSS.enable');
  async function force(selector,classes) {
    const doc=await send('DOM.getDocument');
    const node=await send('DOM.querySelector',{nodeId:doc.root.nodeId,selector});
    assert(node.nodeId); await send('CSS.forcePseudoState',{nodeId:node.nodeId,forcedPseudoClasses:classes});
  }
  await force('.portfolio__feature-item',['hover']);
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".portfolio__feature-item")).transform'),'none');
  const photo=await evaluate('getComputedStyle(document.querySelector(".about__me-image")).transform');
  await force('.about__me-image',['hover']);
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".about__me-image")).transform'),photo);
  await force('.header__actions .btn-primary',['active']); await pause(250);
  assert.equal(await evaluate('new DOMMatrixReadOnly(getComputedStyle(document.querySelector(".header__actions .btn-primary")).transform).m42'),1);
  await media('reduce'); await pause(250);
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".header__actions .btn-primary")).transform'),'none');
  results.checks.push('motion:static-decorations','motion:press-feedback-and-reduced-alternative');

  await media('no-preference'); await navigate('#testimonials');
  const carousel = () => evaluate('(() => {const s=document.querySelector(".testimonials__carousel").swiper;return {index:s.activeIndex,speed:s.params.speed,buttons:[...document.querySelectorAll(".testimonials__pagination button")].map(b=>{const r=b.getBoundingClientRect();return {width:r.width,height:r.height,name:b.getAttribute("aria-label"),controls:!!document.getElementById(b.getAttribute("aria-controls"))};}),visible:[...document.querySelectorAll(".testimonial")].filter(s=>s.getAttribute("aria-hidden")==="false").length};})()');
  let state=await carousel(); assert.equal(state.speed,300); assert.equal(state.buttons.length,4);
  assert(state.buttons.every(button=>button.width>=44 && button.height>=44 && button.name && button.controls));
  assert.equal(state.visible,1);
  await evaluate('window.__dmsClicks=0;document.querySelectorAll(".testimonials__pagination button")[1].addEventListener("click",()=>window.__dmsClicks++);document.querySelectorAll(".testimonials__pagination button")[1].focus()');
  await key('Enter','Enter',13);
  results.carouselKeyboardDiagnostic=await evaluate('(() => {const e=document.activeElement,s=document.querySelector(".testimonials__carousel").swiper;return {focus:e.tagName,name:e.getAttribute("aria-label"),index:s.activeIndex,clicks:window.__dmsClicks,slides:s.slides.length,width:s.width,locked:s.isLocked,enabled:s.enabled,destroyed:s.destroyed,translate:s.translate};})()');
  await screenshot('carousel-keyboard-diagnostic');
  await waitFor('document.querySelector(".testimonials__carousel").swiper.activeIndex === 1');
  await pause(350);
  await evaluate('document.querySelectorAll(".testimonials__pagination button")[2].focus()');
  await key(' ','Space',32);
  await waitFor('document.querySelector(".testimonials__carousel").swiper.activeIndex === 2');
  await pause(350);
  assert.equal(await evaluate('document.querySelector(".testimonials__pagination [aria-current]").getAttribute("aria-label")'),'Mostrar testimonio 3 de 4');
  await screenshot('testimonials-keyboard-desktop');
  results.checks.push('carousel:native-enter-and-space','carousel:44px-labelled-targets','carousel:current-and-hidden-slide-states');

  await media('reduce');
  await waitFor('document.querySelector(".testimonials__carousel").swiper.params.speed === 0');
  await evaluate('document.querySelectorAll(".testimonials__pagination button")[3].click()');
  await waitFor('document.querySelector(".testimonials__carousel").swiper.activeIndex === 3');
  const reduced=await evaluate('(() => {const e=document.querySelector(".testimonials__carousel"),s=e.swiper;return {duration:getComputedStyle(s.wrapperEl).transitionDuration,slideOffset:s.slides[s.activeIndex].getBoundingClientRect().left-e.getBoundingClientRect().left};})()');
  assert.equal(reduced.duration,'0s'); assert(Math.abs(reduced.slideOffset)<2);
  const ax=await send('Accessibility.getFullAXTree');
  assert(ax.nodes.some(node=>!node.ignored && node.role?.value==='heading' && node.name?.value==='Hey, soy David Molina.'));
  results.checks.push('carousel:live-reduced-speed-and-position','motion:accessible-tree-stable-name');

  await viewport(390,844,true); await media('no-preference');
  await send('Emulation.setTouchEmulationEnabled',{enabled:true}); await navigate();
  await send('Page.bringToFront');
  assert.equal(await evaluate('!!document.querySelector(".typewriter__control")'),false);
  await evaluate('document.querySelector(".testimonials__carousel").scrollIntoView({block:"start",behavior:"instant"})');
  await waitFor('Math.abs(document.querySelector(".testimonials__carousel").getBoundingClientRect().top) < 2');
  await evaluate('window.__dmsGestureEvents=[];["pointerdown","pointermove","pointerup","touchstart","touchcancel"].forEach(type=>document.addEventListener(type,e=>{if(window.__dmsGestureEvents.length<12)window.__dmsGestureEvents.push({type:e.type,target:e.target.tagName,carousel:!!e.target.closest(".testimonials__carousel"),pointer:e.pointerType,x:e.clientX,y:e.clientY});},{capture:true,passive:true}))');
  const swipe=await evaluate('(() => {const r=document.querySelector(".testimonials__carousel").getBoundingClientRect();return {start:r.left+r.width*0.9,end:r.left+r.width*0.1,y:Math.min(r.top+160,innerHeight-130)};})()');
  assert(await evaluate('!!document.elementFromPoint('+swipe.start+','+swipe.y+').closest(".testimonials__carousel")'),'Gesture must start on the carousel');
  await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:swipe.start,y:swipe.y}]});
  for(let step=1;step<=5;step++) {
    await send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:swipe.start+(swipe.end-swipe.start)*step/5,y:swipe.y}]}); await pause(40);
  }
  await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await pause(350);
  results.swipeDiagnostic={...await carousel(),...await evaluate('(() => {const s=document.querySelector(".testimonials__carousel").swiper;return {translate:s.translate,touches:s.touches,data:{touched:s.touchEventsData.isTouched,moved:s.touchEventsData.isMoved},touchAction:getComputedStyle(s.el).touchAction,events:window.__dmsGestureEvents,viewport:{width:visualViewport.width,height:visualViewport.height,scale:visualViewport.scale,offsetTop:visualViewport.offsetTop}};})()'),gesture:swipe};
  await screenshot('carousel-swipe-diagnostic');
  await waitFor('document.querySelector(".testimonials__carousel").swiper.activeIndex === 1'); await pause(350);
  await screenshot('testimonials-touch-mobile');
  results.checks.push('carousel:synthesized-swipe','motion:static-mobile-heading');
  results.motion={control,held,offscreen,carousel:state,reduced,normalCarouselSpeed:300,reducedCarouselSpeed:0,visibilityAndTimerCleanup:'Covered by unit tests; no physical background-tab test.',mediaLimit:'Original GIF resources are preserved; CSS and JavaScript motion controls do not pause GIF decoding.'};
};
