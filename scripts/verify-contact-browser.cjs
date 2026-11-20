// Test doubles live only in the isolated browser created by verify-navigation.
// No changes to the production bundle and no real EmailJS/CAPTCHA requests.
const assert = require('assert/strict');
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
let responseMode = 'success';
const requests = [];

exports.isEmailRequest = url => new URL(url).hostname === 'api.emailjs.com';
exports.respond = async (event, send, origin) => {
  if (event.request.method !== 'OPTIONS') {
    requests.push({ body: event.request.postData || '', response: responseMode });
    await pause(300);
  }
  await send('Fetch.fulfillRequest', {
    requestId: event.requestId,
    responseCode: responseMode === 'error' ? 500 : 200,
    responseHeaders: [
      { name: 'Access-Control-Allow-Origin', value: origin },
      { name: 'Access-Control-Allow-Methods', value: 'POST, OPTIONS' },
      { name: 'Access-Control-Allow-Headers', value: 'Content-Type' },
      { name: 'Content-Type', value: 'text/plain' },
    ],
    body: Buffer.from(responseMode === 'error' ? 'simulated failure' : 'OK').toString('base64'),
  });
};

exports.setupPage = async send => {
  await send('Page.addScriptToEvaluateOnNewDocument', { source: `
    window.__dmsCaptcha = { resets: 0 };
    window.grecaptcha = {
      render(container, options) {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = 'Verificación simulada';
        button.style.cssText = 'width:164px;min-height:100px;background:#242424;color:white;border:1px solid white;font:inherit';
        const response = document.createElement('textarea');
        response.hidden = true;
        response.name = 'g-recaptcha-response';
        container.append(button, response);
        window.__dmsCaptcha.complete = () => { response.value = 'simulated-browser-token'; options.callback(response.value); };
        window.__dmsCaptcha.expire = () => { response.value = ''; options['expired-callback'](); };
        button.onclick = window.__dmsCaptcha.complete;
        window.__dmsCaptcha.response = response;
        return 1;
      },
      reset() { window.__dmsCaptcha.resets++; if (window.__dmsCaptcha.response) window.__dmsCaptcha.response.value = ''; },
      getResponse() { return window.__dmsCaptcha.response?.value || ''; }
    };
  ` });
};

exports.checkLayout = async evaluate => {
  const layout = await evaluate(`(() => {
    const form = document.getElementById('form');
    return {
      width: innerWidth,
      formWidth: form.getBoundingClientRect().width,
      submitTextColor: getComputedStyle(form.querySelector('.contact__submit')).color,
      fields: [...form.querySelectorAll('.contact__field input, .contact__field textarea')].map(field => {
        const r = field.getBoundingClientRect(), style = getComputedStyle(field);
        return { name: field.name, label: field.labels[0]?.textContent, fontSize: style.fontSize, left: r.left, right: r.right, height: r.height };
      }),
      whatsapp: document.querySelector('.contact__options a[href*="wa.me"]').href
    };
  })()`);
  assert(layout.fields.every(field => field.label && parseFloat(field.fontSize) >= 16), 'Missing label or small input text');
  assert(layout.fields.every(field => field.left >= 0 && field.right <= layout.width), 'Contact input outside viewport');
  assert.equal(layout.whatsapp, 'https://wa.me/525540613200');
  assert.equal(layout.submitTextColor, 'rgb(255, 255, 255)');
  return layout;
};

exports.verify = async ({ send, evaluate, navigate, screenshot, waitFor, results }) => {
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await navigate('#contact');
  await waitFor('!!window.__dmsCaptcha?.complete');
  const values = { name: 'José Prueba', email: 'prueba@example.com', phone: '+52 55 1234 5678', message: 'Prueba simulada de contacto DMS.' };
  const fill = () => evaluate('(' + (data => {
    for (const [name, value] of Object.entries(data)) {
      const field = document.getElementById(name);
      field.value = value;
      field.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }).toString() + ')(' + JSON.stringify(values) + ')');
  const submit = () => evaluate('document.getElementById("form").requestSubmit()');
  await submit();
  assert.equal(requests.length, 0);
  assert.equal(await evaluate('document.activeElement.id'), 'name');
  results.checks.push('contact:native-required-validation');
  await fill();
  await submit();
  assert.equal(requests.length, 0);
  assert.equal(await evaluate('document.activeElement.getAttribute("aria-label")'), 'Verificación de seguridad');
  results.checks.push('contact:captcha-required');
  await evaluate('window.__dmsCaptcha.complete(); window.__dmsCaptcha.expire()');
  await submit();
  assert.equal(requests.length, 0);
  results.checks.push('contact:expired-captcha-blocked');
  await evaluate('window.__dmsCaptcha.complete()');
  await evaluate('document.getElementById("form").requestSubmit(); document.getElementById("form").requestSubmit()');
  assert.equal(await evaluate('document.querySelector(".contact__submit").disabled'), true);
  assert.equal(await evaluate('document.getElementById("form").getAttribute("aria-busy")'), 'true');
  await waitFor('document.querySelector(".contact__status").textContent.includes("se envió correctamente")');
  assert.equal(requests.length, 1);
  assert.equal(await evaluate('document.getElementById("email").value'), '');
  assert.equal(await evaluate('window.__dmsCaptcha.resets'), 1);
  results.checks.push('contact:success-clears-form-and-captcha', 'contact:duplicate-submission-blocked');
  const payload = requests[0].body;
  const field = name => payload.match(new RegExp('name="' + name + '"\\r?\\n\\r?\\n([^\\r\\n]*)'))?.[1];
  assert.equal(field('email'), values.email);
  assert.equal(field('phone'), values.phone);
  assert.equal(field('g-recaptcha-response'), 'simulated-browser-token');
  results.checks.push('contact:real-sdk-serializes-correct-fields');
  await screenshot('contact-success');
  responseMode = 'error';
  await fill();
  await evaluate('window.__dmsCaptcha.complete()');
  await submit();
  await waitFor('document.querySelector(".contact__form").textContent.includes("Tus datos se conservaron")');
  assert.equal(await evaluate('document.getElementById("email").value'), values.email);
  assert.equal(await evaluate('document.getElementById("message").value'), values.message);
  assert.equal(await evaluate('document.querySelector(".contact__submit").disabled'), false);
  assert.equal(await evaluate('window.__dmsCaptcha.resets'), 2);
  const feedback = await evaluate('(() => {const r=document.querySelector(".contact__feedback").getBoundingClientRect();const nav=document.querySelector(".site-nav").getBoundingClientRect();return {top:r.top,bottom:r.bottom,navTop:nav.top};})()');
  assert(feedback.top >= 0 && feedback.bottom < feedback.navTop, 'Error feedback hidden by navigation');
  await screenshot('contact-error');
  await submit();
  assert.equal(requests.length, 2);
  results.checks.push('contact:error-preserves-data-and-requires-new-captcha');
  responseMode = 'success';
  await evaluate('window.__dmsCaptcha.complete()');
  await submit();
  await waitFor('document.querySelector(".contact__status").textContent.includes("se envió correctamente")');
  assert.equal(requests.length, 3);
  results.checks.push('contact:retry-after-new-captcha');
  results.contact = { interceptedRequests: requests.length, realMessagesSent: 0, captcha: 'Clearly labeled test double; no Google verification', payloadFieldsVerified: ['email', 'phone', 'g-recaptcha-response'], localTemplate: 'correo.html', remoteTemplateAndReplyToVerified: false };
};
