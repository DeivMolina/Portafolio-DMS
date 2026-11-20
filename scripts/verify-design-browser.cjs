const assert = require('assert/strict');
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

exports.checkViewport = async evaluate => {
  const state = await evaluate(`(() => {
    const controls = [...document.querySelectorAll('.btn')].map(control => {
      const r = control.getBoundingClientRect(), s = getComputedStyle(control);
      return { text: control.textContent.trim(), height: r.height, radius: s.borderRadius, fontSize: s.fontSize, color: s.color, background: s.backgroundColor, primary: control.classList.contains('btn-primary') };
    });
    return { width: innerWidth, documentWidth: document.documentElement.scrollWidth, bodyFont: getComputedStyle(document.body).fontFamily, headingFont: getComputedStyle(document.querySelector('h1')).fontFamily, controls };
  })()`);
  assert(state.bodyFont.includes('Poppins'));
  assert(state.headingFont.includes('Geologica'));
  assert(state.controls.every(control => control.height >= 44 && control.radius === '8px'));
  assert(state.controls.filter(control => control.primary).every(control => control.color === 'rgb(255, 255, 255)' && control.background === 'rgb(75, 89, 251)'));
  if (state.width === 320) assert(state.documentWidth <= 331, 'More horizontal overflow than the phase 3 baseline');
  return state;
};

exports.verify = async ({ send, evaluate, navigate, screenshot, results }) => {
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await send('Emulation.setTouchEmulationEnabled', { enabled: false });
  await navigate();
  await send('DOM.enable'); await send('CSS.enable');
  const document = await send('DOM.getDocument');
  const node = await send('DOM.querySelector', { nodeId: document.root.nodeId, selector: '.portfolio__item .btn-primary' });
  assert(node.nodeId, 'Project action not found');
  const background = () => evaluate('getComputedStyle(document.querySelector(".portfolio__item .btn-primary")).backgroundColor');
  await send('CSS.forcePseudoState', { nodeId: node.nodeId, forcedPseudoClasses: ['hover'] });
  await pause(250); assert.equal(await background(), 'rgb(57, 72, 223)');
  await send('CSS.forcePseudoState', { nodeId: node.nodeId, forcedPseudoClasses: ['active'] });
  await pause(250); assert.equal(await background(), 'rgb(48, 61, 197)');
  await send('CSS.forcePseudoState', { nodeId: node.nodeId, forcedPseudoClasses: [] });
  results.checks.push('design:primary-hover-and-active');

  for (let i = 0; i < 8; i++) {
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
    if (await evaluate('document.activeElement.classList.contains("btn")')) break;
  }
  const focus = await evaluate('({action:document.activeElement.classList.contains("btn"),outline:getComputedStyle(document.activeElement).outlineWidth,style:getComputedStyle(document.activeElement).outlineStyle})');
  assert(focus.action && focus.outline === '3px' && focus.style === 'solid');
  results.checks.push('design:action-keyboard-focus');
  await screenshot('action-keyboard-focus');

  const cards = await evaluate('[...document.querySelectorAll(".portfolio__item,.service,.about__card,.contact__option,.testimonial")].map(element=>({radius:getComputedStyle(element).borderRadius,background:getComputedStyle(element).backgroundColor}))');
  assert(cards.every(card => card.radius === '16px' && card.background === 'rgb(23, 23, 53)'));
  results.checks.push('design:shared-card-surface-and-radius');
  const tags = await evaluate('[...document.querySelectorAll(".tag")].map(element=>({background:getComputedStyle(element).backgroundColor,fontSize:getComputedStyle(element).fontSize}))');
  assert(tags.length > 0 && tags.every(tag => tag.background === 'rgb(32, 32, 71)' && tag.fontSize === '14px'));
  results.checks.push('design:shared-technology-tag-style');

  await evaluate('document.getElementById("form").scrollIntoView({block:"start",behavior:"instant"});document.querySelector(".contact__submit").disabled=true');
  const disabled = await evaluate('({opacity:getComputedStyle(document.querySelector(".contact__submit")).opacity,cursor:getComputedStyle(document.querySelector(".contact__submit")).cursor})');
  assert.equal(disabled.opacity, '0.65'); assert.equal(disabled.cursor, 'progress');
  await evaluate('document.querySelector(".contact__submit").disabled=false;document.getElementById("email").focus()');
  const field = await evaluate('({font:getComputedStyle(document.getElementById("email")).fontSize,border:getComputedStyle(document.getElementById("email")).borderTopColor})');
  await pause(200);
  assert.equal(field.font, '16px');
  results.checks.push('design:disabled-and-field-states');

  for (const id of ['portfolio', 'otros-proyectos', 'services', 'about', 'testimonials']) {
    await evaluate('document.getElementById(' + JSON.stringify(id) + ').scrollIntoView({block:"start",behavior:"instant"})');
    await pause(100); await screenshot('surface-' + id);
  }
  for (const width of [320, 390]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 844, deviceScaleFactor: 1, mobile: false });
    await navigate('#about');
    const cardsFit = await evaluate('[...document.querySelectorAll(".about__card")].every(card=>card.scrollWidth<=card.clientWidth+1)');
    assert(cardsFit, 'Metric text overflows its card at ' + width);
    await screenshot('surface-about-' + width);
  }
  results.checks.push('design:metric-cards-fit-small-viewports');
  results.design = { primaryStates: ['default', 'hover', 'active'], focus, disabled, sharedCards: cards.length, sharedTags: tags.length, actualRemoteFontsValidated: false };
};
