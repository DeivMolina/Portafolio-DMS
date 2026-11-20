const assert = require('assert/strict');
const pause = ms => new Promise(resolve=>setTimeout(resolve,ms));

exports.verify = async ({send,evaluate,navigate,screenshot,waitFor,results}) => {
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await send('Emulation.setTouchEmulationEnabled',{enabled:false});
  await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:false});
  await navigate();
  const initial=await evaluate(`(() => ({images:[...document.images].map(i=>({alt:i.alt,width:i.getAttribute('width'),height:i.getAttribute('height'),loading:i.loading,src:i.currentSrc,decoding:i.decoding})),captchaMounted:!!document.querySelector('.contact__captcha-widget')?.children.length,originalGifRequested:performance.getEntriesByType('resource').some(e=>e.name.includes('.gif')),hero:document.querySelector('.me img').currentSrc,formFields:document.querySelectorAll('.contact__field input,.contact__field textarea').length}))()`);
  assert.equal(initial.images.length,29);
  assert(initial.images.every(i=>Number(i.width)>0&&Number(i.height)>0&&i.decoding==='async'));
  assert.equal(initial.images.filter(i=>i.loading==='eager').length,2);
  assert.equal(initial.formFields,4); assert(!initial.captchaMounted); assert(!initial.originalGifRequested);
  assert(initial.hero.includes('/assets/optimized/me-96.webp'));
  results.checks.push('resources:dimensions-and-async-decoding','resources:eager-above-fold-lazy-below-fold','resources:captcha-deferred-with-form-present','resources:gif-not-fetched-on-load');

  // Walk the archive to exercise native lazy loading, not forced eager assignment.
  for(let index=0;index<19;index++) {
    await evaluate('document.querySelectorAll(".portfolio__item")['+index+'].scrollIntoView({block:"center",behavior:"instant"})');
    await waitFor('(() => {const i=document.querySelectorAll(".portfolio__item img")['+index+'];return i.complete&&i.naturalWidth>0})()');
  }
  assert.equal(await evaluate('performance.getEntriesByType("resource").some(e=>e.name.includes(".gif"))'),false);
  const sources=await evaluate('[...document.querySelectorAll(".portfolio__item img")].map(i=>i.currentSrc)');
  assert(sources.every(src=>src.includes('/assets/optimized/')&&src.endsWith('.webp')));
  results.checks.push('resources:all-19-archive-images-load','resources:static-poster-through-archive-scroll');

  await evaluate('document.querySelector(".project-preview__toggle").scrollIntoView({block:"center",behavior:"instant"});document.querySelector(".project-preview__toggle").focus()');
  assert.equal(await evaluate('getComputedStyle(document.activeElement).outlineOffset'),'-4px');
  const key=async(key,code,windowsVirtualKeyCode)=>{
    await send('Input.dispatchKeyEvent',{type:'keyDown',key,code,windowsVirtualKeyCode,...(key==='Enter'?{text:'\r',unmodifiedText:'\r'}:{})});
    await send('Input.dispatchKeyEvent',{type:'keyUp',key,code,windowsVirtualKeyCode});
  };
  await key('Enter','Enter',13);
  await waitFor('document.querySelector(".project-preview__toggle").textContent.includes("Detener")');
  await waitFor('document.querySelector(".project-preview__toggle").parentElement.querySelector("img").complete');
  assert(await evaluate('document.querySelector(".project-preview__toggle").parentElement.querySelector("img").src.endsWith(".gif")'));
  await key(' ','Space',32);
  await waitFor('document.querySelector(".project-preview__toggle").textContent.includes("Reproducir")');
  await screenshot('resource-gif-poster-keyboard');
  results.checks.push('resources:original-gif-play-and-stop-by-keyboard');

  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
  await pause(100);
  await evaluate('document.querySelector(".project-preview__toggle").click()');
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await waitFor('document.querySelector(".project-preview__toggle").textContent.includes("Reproducir")');
  await evaluate('document.querySelector(".project-preview__toggle").click();document.getElementById("services").scrollIntoView({block:"start",behavior:"instant"})');
  await waitFor('document.querySelector(".project-preview__toggle").textContent.includes("Reproducir")');
  results.checks.push('resources:gif-stops-on-reduced-motion-and-offscreen');

  await evaluate('document.getElementById("contact").scrollIntoView({block:"start",behavior:"instant"})');
  await waitFor('!!window.__dmsCaptcha.complete');
  assert(await evaluate('document.querySelector(".contact__captcha-widget").getBoundingClientRect().height >= 144'));
  results.checks.push('resources:captcha-prepares-near-contact-with-reserved-space');

  await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:2,mobile:false});
  await navigate();
  const desktopHero=await evaluate('document.querySelector(".me img").currentSrc');
  assert(desktopHero.includes('/assets/optimized/me-192.webp'));
  results.checks.push('resources:responsive-source-at-dpr2');
  results.resources={initial,archiveSources:sources,desktopHero,originalAssetsRetained:true};
};
