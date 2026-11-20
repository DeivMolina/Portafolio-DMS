/* Navigation checks against the production build using an installed Chrome.
 * Run: node scripts/verify-navigation.cjs [--contact] [--design] [--layout] [--motion]
 * --motion-only runs just the dedicated motion checks while diagnosing the runner.
 * No downloads, dependencies, real messages, or interaction with existing tabs.
 */
const fs = require('fs');
const path = require('path');
const os = require('os');
const http = require('http');
const { spawn } = require('child_process');
const WebSocket = require('ws');
const assert = require('assert/strict');
const root = path.resolve(__dirname, '..');
const buildRoot = path.join(root, 'build');
const motionOnly = process.argv.includes('--motion-only');
const baselinePerformance = process.argv.includes('--performance-baseline');
const seoMode = process.argv.includes('--seo');
const renderSocial = process.argv.includes('--render-social');
const seoVerifier = seoMode ? require('./verify-seo-browser.cjs') : null;
const polishMode = process.argv.includes('--polish') || seoMode;
const optimizeMode = process.argv.includes('--optimize');
const performanceMode = baselinePerformance || optimizeMode;
const performanceVerifier = performanceMode ? require('./verify-performance-browser.cjs') : null;
const resourcesVerifier = optimizeMode || polishMode ? require('./verify-resources-browser.cjs') : null;
const polishVerifier = polishMode ? require('./verify-polish-browser.cjs') : null;
const motionMode = process.argv.includes('--motion') || motionOnly || optimizeMode || polishMode;
const motionVerifier = motionMode ? require('./verify-motion-browser.cjs') : null;
const layoutMode = process.argv.includes('--layout') || motionMode || performanceMode;
const layoutVerifier = layoutMode ? require('./verify-layout-browser.cjs') : null;
const designMode = process.argv.includes('--design') || layoutMode;
const designVerifier = designMode ? require('./verify-design-browser.cjs') : null;
const contactMode = process.argv.includes('--contact') || designMode;
const contactVerifier = contactMode ? require('./verify-contact-browser.cjs') : null;
const output = path.join(root, 'docs', seoMode || renderSocial ? 'phase-9' : polishMode ? 'phase-8' : performanceMode ? 'phase-7' : motionMode ? 'phase-6' : layoutMode ? 'phase-5' : designMode ? 'phase-4' : contactMode ? 'phase-3' : 'phase-2');
const chrome = process.env.DMS_CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.pdf': 'application/pdf', '.svg': 'image/svg+xml', '.xml': 'application/xml', '.txt': 'text/plain', '.json': 'application/json' };

async function main() {
  assert(fs.existsSync(chrome), 'An installed Chrome is required; this script does not download it.');
  assert(fs.existsSync(path.join(buildRoot, 'index.html')), 'Build the project first.');
  fs.mkdirSync(output, { recursive: true });
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'dms-phase2-'));
  const server = http.createServer((req, res) => {
    let requested;
    try { requested = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
    catch { res.writeHead(400); res.end(); return; }
    const file = path.resolve(buildRoot, '.' + (requested === '/' ? '/index.html' : requested));
    if (!file.startsWith(buildRoot + path.sep)) { res.writeHead(403); res.end(); return; }
    fs.readFile(file, (error, data) => {
      if (error) { res.writeHead(404); res.end(); return; }
      res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      res.end(data);
    });
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = 'http://127.0.0.1:' + server.address().port;
  let browser, socket;
  const pending = new Map();
  const pageErrors = [];
  const hydrationErrors = [];
  let seq = 0, sessionId;
  let benchmarking = false, protocolObserver = null;
  const results = { engine: 'Installed Chrome, headless / CDP', origin, viewports: [], checks: [], limitations: ['Third-party requests blocked; reCAPTCHA and external fonts not validated.', 'No real messages or physical touch-device tests.', 'Layout outside phase 2 is recorded without correction.'] };
  if (layoutMode) results.limitations = ['EmailJS is intercepted and CAPTCHA simulated; no real messages or physical-device tests.', 'Only existing Google Fonts domains are allowed; actual font loading is recorded.', 'Zoom reflow is tested with equivalent CSS viewport sizes; text-only scaling is tested separately.'];
  try {
    browser = spawn(chrome, ['--headless=new', '--disable-gpu', '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows', '--no-first-run', '--no-default-browser-check', '--remote-debugging-address=127.0.0.1', '--remote-debugging-port=0', '--user-data-dir=' + profile, 'about:blank'], { windowsHide: true, stdio: ['ignore', 'ignore', 'pipe'] });
    const endpoint = await new Promise((resolve, reject) => {
      let log = '';
      const timer = setTimeout(() => reject(new Error('Chrome DevTools startup timed out.')), 20000);
      browser.on('error', error => { clearTimeout(timer); reject(error); });
      browser.on('exit', code => { clearTimeout(timer); reject(new Error('Chrome exited before startup: ' + code)); });
      browser.stderr.on('data', chunk => {
        log += chunk.toString();
        const match = log.match(/DevTools listening on (ws:\/\/[^\s]+)/);
        if (match) { clearTimeout(timer); resolve(match[1]); }
      });
    });
    socket = new WebSocket(endpoint);
    await new Promise((resolve, reject) => { socket.once('open', resolve); socket.once('error', reject); });
    const send = (method, params = {}, session = sessionId) => new Promise((resolve, reject) => {
      const id = ++seq;
      const timer = setTimeout(() => { pending.delete(id); reject(new Error('CDP timeout: ' + method)); }, 15000);
      pending.set(id, { resolve, reject, timer });
      socket.send(JSON.stringify({ id, method, params, ...(session ? { sessionId: session } : {}) }));
    });
    socket.on('message', data => {
      const event = JSON.parse(data.toString());
      if (protocolObserver && event.sessionId === sessionId) protocolObserver(event);
      if (event.id && pending.has(event.id)) {
        const task = pending.get(event.id); pending.delete(event.id); clearTimeout(task.timer);
        if (event.error) task.reject(new Error(JSON.stringify(event.error))); else task.resolve(event.result);
      }
      if (event.method === 'Runtime.exceptionThrown') pageErrors.push(event.params.exceptionDetails.text);
      if (seoMode && event.method === 'Runtime.consoleAPICalled' && ['error','warning'].includes(event.params.type)) {
        const message = event.params.args.map(arg => arg.value || arg.description || '').join(' ');
        if (/hydrat|server HTML|Minified React error/i.test(message)) hydrationErrors.push(message);
      }
      if (event.method === 'Fetch.requestPaused') {
        if (contactVerifier?.isEmailRequest(event.params.request.url)) {
          contactVerifier.respond(event.params, send, origin).catch(error => pageErrors.push(error.message));
          return;
        }
        const font = (layoutMode || renderSocial) && !benchmarking && ['fonts.googleapis.com', 'fonts.gstatic.com'].includes(new URL(event.params.request.url).hostname);
        const local = event.params.request.url.startsWith(origin + '/') || font;
        send(local ? 'Fetch.continueRequest' : 'Fetch.failRequest', local ? { requestId: event.params.requestId } : { requestId: event.params.requestId, errorReason: 'BlockedByClient' }).catch(() => {});
      }
    });
    results.browser = await send('Browser.getVersion', {}, null);
    const target = await send('Target.createTarget', { url: 'about:blank' }, null);
    sessionId = (await send('Target.attachToTarget', { targetId: target.targetId, flatten: true }, null)).sessionId;
    await send('Page.enable'); await send('Runtime.enable'); await send('Page.bringToFront');
    // Test navigation/form regressions without animation; motion has a dedicated normal/reduced pass.
    if (motionMode) await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    await send('Fetch.enable', { patterns: [{ urlPattern: '*', requestStage: 'Request' }] });
    if (contactVerifier) await contactVerifier.setupPage(send);
    if (seoVerifier) await seoVerifier.setupPage(send);
    const evaluate = async expression => {
      const response = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
      if (response.exceptionDetails) throw new Error(JSON.stringify(response.exceptionDetails));
      return response.result.value;
    };
    const waitFor = async expression => { for (let attempt = 0; attempt < 100; attempt++) { if (await evaluate(expression)) return; await pause(100); } throw new Error('Page condition timed out: ' + expression); };
    const navigate = async hash => {
      // Use a new document, avoiding retained React state and reload scroll restoration.
      await send('Page.navigate', { url: 'about:blank' });
      await waitFor('location.href === "about:blank"');
      await send('Page.navigate', { url: origin + '/' + (hash || '') });
      await waitFor('document.readyState === "complete" && !!document.querySelector(".site-nav") && [...document.images].filter(i=>{const r=i.getBoundingClientRect();return i.loading!=="lazy" || (r.top<innerHeight&&r.bottom>0&&r.left<innerWidth&&r.right>0)}).every(i=>i.complete)');
      await pause(250);
      if (layoutMode) {
        results.fonts = await evaluate('Promise.race([document.fonts.ready,new Promise(resolve=>setTimeout(resolve,5000))]).then(()=>({poppins:[...document.fonts].some(font=>font.family.includes("Poppins")&&font.status==="loaded"),geologica:[...document.fonts].some(font=>font.family.includes("Geologica")&&font.status==="loaded")}))');
      }
    };
    const screenshot = async (name, clip) => {
      if ((optimizeMode || polishMode) && !benchmarking) await waitFor('[...document.images].filter(i=>{const r=i.getBoundingClientRect();return r.top<innerHeight&&r.bottom>0&&r.left<innerWidth&&r.right>0}).every(i=>i.complete)');
      const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: !!clip, ...(clip ? { clip } : {}) });
      fs.writeFileSync(path.join(output, name + '.png'), Buffer.from(shot.data, 'base64'));
    };
    if (renderSocial) {
      await send('Emulation.setDeviceMetricsOverride', { width:1200, height:630, deviceScaleFactor:1, mobile:false });
      await send('Page.navigate', { url:origin+'/assets/dms-social.svg' });
      await waitFor('document.readyState === "complete"');
      await evaluate('document.fonts.ready.then(()=>true)');
      assert(await evaluate('document.fonts.check("500 78px Geologica")'), 'Social card font must load');
      const shot = await send('Page.captureScreenshot', { format:'png', captureBeyondViewport:false });
      const file = path.join(root,'public/assets/dms-social.png');
      fs.writeFileSync(file,Buffer.from(shot.data,'base64'));
      console.log('Rendered DMS social card: '+file);
      await send('Browser.close',{},null).catch(()=>{});
      return;
    }
    if (seoVerifier) await seoVerifier.verify({send,evaluate,navigate,screenshot,waitFor,results,origin});
    if (performanceVerifier) {
      benchmarking = true;
      const performance = await performanceVerifier.measure({send,evaluate,screenshot,origin,output,phase:baselinePerformance?'before':'after',observe:listener=>{protocolObserver=listener;}});
      benchmarking = false; protocolObserver = null;
      results.performance = performance;
      if (baselinePerformance) {
        await send('Browser.close',{},null).catch(()=>{});
        return;
      }
    }
    // Keep the dedicated motion pass separate from the responsive screenshot matrix.
    if (motionVerifier) await motionVerifier.verify({ send, evaluate, navigate, screenshot, waitFor, results });
    if (resourcesVerifier) await resourcesVerifier.verify({ send, evaluate, navigate, screenshot, waitFor, results });
    if (polishVerifier) await polishVerifier.verify({ send, evaluate, navigate, screenshot, waitFor, results });
    if (motionOnly) {
      assert.equal(pageErrors.length,0);
      results.passed=true; results.uncaughtPageErrors=pageErrors;
      fs.writeFileSync(path.join(output,'browser-results.json'),JSON.stringify(results,null,2)+'\n');
      console.log(JSON.stringify({passed:true,scope:'Motion checks only',checks:results.checks},null,2));
      await send('Browser.close',{},null).catch(()=>{});
      return;
    }
    if (motionMode) {
      await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
      await send('Emulation.setTouchEmulationEnabled', { enabled: false });
    }
    const viewports = layoutMode ? [[320,740],[360,800],[390,844],[600,900],[601,900],[768,1024],[1024,900],[1025,900],[1280,900],[1440,900],[1920,1000]] : [[320,740],[390,844],[768,1024],[1440,900]];
    for (const [width, height] of viewports) {
      await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
      await navigate();
      const layout = await evaluate('(() => { const nav=document.querySelector(".site-nav"), r=nav.getBoundingClientRect(); return { width:innerWidth, documentWidth:document.documentElement.scrollWidth, nav:{left:r.left,right:r.right,width:r.width}, targets:[...nav.querySelectorAll("a")].map(a=>{const r=a.getBoundingClientRect();return {name:a.getAttribute("aria-label"),width:r.width,height:r.height}}), mainCount:document.querySelectorAll("main").length, portfolioCount:document.querySelectorAll("section#portfolio").length, unresolvedAnchors:[...document.querySelectorAll("a[href^=\\"#\\"]")].map(a=>a.hash.slice(1)).filter(id=>!id||!document.getElementById(id)), nativeHandlers:{contextMenu:document.oncontextmenu===null,selection:document.onselectstart===null}, viewport:document.querySelector("meta[name=viewport]").content }; })()');
      assert(layout.nav.left >= 0 && layout.nav.right <= width, 'Navigation overflows at ' + width);
      assert(layout.targets.every(t => t.width >= 44 && t.height >= 44), 'Small navigation target at ' + width);
      assert.equal(layout.mainCount, 1); assert.equal(layout.portfolioCount, 1); assert.equal(layout.unresolvedAnchors.length, 0);
      assert(layout.nativeHandlers.contextMenu && layout.nativeHandlers.selection);
      assert(!/user-scalable|maximum-scale/.test(layout.viewport));
      results.viewports.push({ width, height, ...layout });
      const capture = !layoutMode || [320,390,768,1440,1920].includes(width);
      if (capture) await screenshot('navigation-' + width);
      if (layoutVerifier) results.layoutViewports = [...(results.layoutViewports || []), await layoutVerifier.checkViewport(evaluate)];
      if (designVerifier) {
        results.designViewports = [...(results.designViewports || []), await designVerifier.checkViewport(evaluate)];
      }
      if (contactVerifier) {
        const contactLayout = await contactVerifier.checkLayout(evaluate);
        results.contactLayouts = [...(results.contactLayouts || []), contactLayout];
        const clip = await evaluate('(() => { const r=document.getElementById("contact").getBoundingClientRect(); return {x:0,y:r.top+scrollY,width:document.documentElement.clientWidth,height:r.height,scale:1}; })()');
        if (capture) await screenshot('contact-' + width, clip);
      }
    }
    const current = () => evaluate('document.querySelector(".site-nav [aria-current]")?.getAttribute("aria-label")');
    for (const [id, label] of [['portfolio','Proyectos'],['otros-proyectos','Proyectos'],['services','Servicios'],['about','Sobre mí'],['contact','Contacto']]) {
      await evaluate('document.getElementById(' + JSON.stringify(id) + ').scrollIntoView({behavior:"instant",block:"start"})');
      await pause(200); assert.equal(await current(), label); results.checks.push('scroll:' + id);
    }
    await navigate('#experience');
    await pause(700); assert.equal(await current(), 'Sobre mí'); results.checks.push('direct:#experience');
    await evaluate('document.querySelector(".site-nav a[href=\\"#services\\"]").click()');
    await waitFor('document.querySelector(".site-nav [aria-current]")?.getAttribute("aria-label") === "Servicios" && Math.abs(document.getElementById("services").getBoundingClientRect().top - 24) < 3');
    await pause(200); assert.equal(await current(), 'Servicios');
    await evaluate('history.back()');
    await pause(1000); assert.equal(await current(), 'Sobre mí'); results.checks.push('history:back');
    await navigate();
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
    const focus = await evaluate('(() => {const a=document.activeElement,r=a.getBoundingClientRect(),s=getComputedStyle(a);return {text:a.textContent,href:a.getAttribute("href"),top:r.top,bottom:r.bottom,outline:s.outlineStyle,outlineWidth:s.outlineWidth};})()');
    assert.equal(focus.href, '#contenido-principal'); assert(focus.top >= 0); assert.equal(focus.outline, 'solid');
    await screenshot('skip-link-focus');
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
    await pause(1000); assert.equal(await evaluate('document.activeElement.id'), 'contenido-principal');
    results.checks.push('keyboard:skip-link-visible-and-focus-main'); results.skipLinkFocus = focus;
    await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    assert.equal(await evaluate('getComputedStyle(document.documentElement).scrollBehavior'), 'auto');
    results.checks.push('reduced-motion:instant-anchor-scroll');
    await evaluate('window.scrollTo({top:document.documentElement.scrollHeight,behavior:"instant"})'); await pause(200);
    const footer = await evaluate('(() => {const nav=document.querySelector(".site-nav").getBoundingClientRect(),copy=document.querySelector(".footer__copyrght").getBoundingClientRect();return {navTop:nav.top,copyBottom:copy.bottom,current:document.querySelector(".site-nav [aria-current]").getAttribute("aria-label")};})()');
    assert(footer.copyBottom < footer.navTop); assert.equal(footer.current, 'Contacto');
    results.checks.push('footer:copyright-unobscured'); results.footer = footer;
    await screenshot('footer-clearance');
    const accessibility = await send('Accessibility.getFullAXTree');
    const namedLinks = accessibility.nodes.filter(node => !node.ignored && node.role?.value === 'link');
    assert(namedLinks.every(node => node.name?.value?.trim()), 'Unnamed accessible link');
    results.accessibility = { namedLinks: namedLinks.length, mainLandmarks: accessibility.nodes.filter(node => !node.ignored && node.role?.value === 'main').length };
    results.checks.push('accessibility-tree:links-have-names');
    await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
    await send('Emulation.setTouchEmulationEnabled', { enabled: true });
    await navigate();
    const touchTarget = await evaluate('(() => {const r=document.querySelector(".site-nav a[href=\\"#contact\\"]").getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2};})()');
    await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: touchTarget.x, y: touchTarget.y }] });
    await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await pause(300); assert.equal(await current(), 'Contacto');
    results.checks.push('synthesized-touch:contact-link');
    if (contactVerifier) await contactVerifier.verify({ send, evaluate, navigate, screenshot, waitFor, results });
    if (designVerifier) await designVerifier.verify({ send, evaluate, navigate, screenshot, results });
    if (layoutVerifier) await layoutVerifier.verify({ send, evaluate, navigate, screenshot, results });
    results.uncaughtPageErrors = pageErrors;
    if (seoMode) { results.hydrationErrors=hydrationErrors; assert.equal(hydrationErrors.length,0,'React hydration errors'); }
    assert.equal(pageErrors.length, 0, 'Uncaught page exceptions');
    results.passed = true;
    fs.writeFileSync(path.join(output, 'browser-results.json'), JSON.stringify(results, null, 2) + '\n');
    console.log(JSON.stringify({ passed: true, viewports: results.viewports.map(v => ({width:v.width,documentWidth:v.documentWidth,navWidth:v.nav.width})), checks: results.checks, screenshots: output }, null, 2));
    await send('Browser.close', {}, null).catch(() => {});
  } catch (error) {
    results.passed = false;
    results.error = error.message;
    results.uncaughtPageErrors = pageErrors;
    fs.writeFileSync(path.join(output, 'browser-results.json'), JSON.stringify(results, null, 2) + '\n');
    throw error;
  } finally {
    if (socket) socket.close();
    for (const task of pending.values()) { clearTimeout(task.timer); task.reject(new Error('Browser session closed')); }
    pending.clear();
    if (browser) { await pause(500); if (browser.exitCode === null) browser.kill(); }
    await new Promise(resolve => server.close(resolve));
    // Delete only this run's unique temporary profile, after checking its parent.
    const resolved = path.resolve(profile);
    if (path.dirname(resolved) === path.resolve(os.tmpdir()) && path.basename(resolved).startsWith('dms-phase2-')) {
      try { fs.rmSync(resolved, { recursive: true, force: true, maxRetries: 3, retryDelay: 300 }); } catch { /* Chrome may retain a temporary file briefly. */ }
    }
  }
}
main().catch(error => { console.error(error.stack); process.exitCode = 1; });
