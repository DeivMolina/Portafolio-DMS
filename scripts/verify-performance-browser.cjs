/* Local lab observations, not Lighthouse scores or field Core Web Vitals. */
const fs = require('fs');
const path = require('path');
const pause = ms => new Promise(resolve=>setTimeout(resolve,ms));

exports.measure = async ({send,evaluate,screenshot,origin,output,phase,observe}) => {
  await send('Network.enable');
  await send('Network.setCacheDisabled',{cacheDisabled:true});
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await send('Page.addScriptToEvaluateOnNewDocument',{source:`
    window.__dmsLab={lcp:null,cls:0,longTasks:[],shifts:[]};
    for (const type of ['largest-contentful-paint','layout-shift','longtask']) {
      try { new PerformanceObserver(list=>{ for (const entry of list.getEntries()) {
        if (type==='largest-contentful-paint') window.__dmsLab.lcp={ms:entry.startTime,size:entry.size,element:entry.element?.tagName};
        if (type==='layout-shift' && !entry.hadRecentInput) {window.__dmsLab.cls+=entry.value;window.__dmsLab.shifts.push({ms:entry.startTime,value:entry.value});}
        if (type==='longtask') window.__dmsLab.longTasks.push(entry.duration);
      }}).observe({type,buffered:true}); } catch {}
    }
  `});
  const trials=[];
  try {
    for(const scenario of [
      {name:'mobile-1',width:390,height:844,cpu:4,mbps:1.6,latency:150},
      {name:'mobile-2',width:390,height:844,cpu:4,mbps:1.6,latency:150},
      {name:'mobile-3',width:390,height:844,cpu:4,mbps:1.6,latency:150},
      {name:'desktop',width:1440,height:1000,cpu:1,mbps:10,latency:40},
    ]) {
      await send('Page.navigate',{url:'about:blank'});
      await send('Emulation.setDeviceMetricsOverride',{width:scenario.width,height:scenario.height,deviceScaleFactor:1,mobile:false});
      await send('Emulation.setCPUThrottlingRate',{rate:scenario.cpu});
      await send('Network.emulateNetworkConditions',{offline:false,latency:scenario.latency,downloadThroughput:scenario.mbps*1000000/8,uploadThroughput:750000/8});
      const requests=new Map();
      observe(event=>{
        const p=event.params;
        if(event.method==='Network.requestWillBeSent') requests.set(p.requestId,{url:p.request.url,type:p.type,bytes:0,done:false});
        const item=requests.get(p?.requestId);
        if(item && event.method==='Network.dataReceived') item.bytes+=p.encodedDataLength;
        if(item && event.method==='Network.loadingFinished') item.done=true;
      });
      await send('Page.navigate',{url:origin+'/'});
      await pause(8000);
      const state=await evaluate(`(() => ({...window.__dmsLab,paint:performance.getEntriesByType('paint').map(e=>({name:e.name,ms:e.startTime})),images:[...document.images].map(i=>({alt:i.alt,src:new URL(i.currentSrc||i.src,location.href).pathname,complete:i.complete,naturalWidth:i.naturalWidth,loading:i.loading})),overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth}))()`);
      const local=[...requests.values()].filter(item=>item.url.startsWith(origin+'/'));
      const trial={...scenario,windowMs:8000,...state,localRequests:local.length,localBodyBytes:local.reduce((sum,item)=>sum+item.bytes,0),imageBodyBytes:local.filter(i=>i.type==='Image').reduce((sum,item)=>sum+item.bytes,0),completedRequests:local.filter(i=>i.done).length,requestedImages:local.filter(i=>i.type==='Image').length,requests:local.map(i=>({...i,url:i.url.slice(origin.length)}))};
      trials.push(trial);
      if(scenario.name==='mobile-1' || scenario.name==='desktop') await screenshot('performance-'+phase+'-'+scenario.name);
      console.log(JSON.stringify({phase,scenario:scenario.name,bytes:trial.localBodyBytes,imageBytes:trial.imageBodyBytes,requests:trial.localRequests,lcp:trial.lcp,cls:trial.cls}));
      observe(null);
    }
  } finally {
    observe(null);
    await send('Emulation.setCPUThrottlingRate',{rate:1});
    await send('Network.emulateNetworkConditions',{offline:false,latency:0,downloadThroughput:-1,uploadThroughput:-1});
    await send('Network.setCacheDisabled',{cacheDisabled:false});
  }
  const median=values=>[...values].sort((a,b)=>a-b)[Math.floor(values.length/2)];
  const mobile=trials.filter(t=>t.name.startsWith('mobile'));
  const result={phase,engine:'Installed Chrome/CDP',conditions:'Fresh document/cache disabled, no third-party network, simulated CAPTCHA, reduced motion. Local HTTP server without gzip; fixed 8-second initial window. Not a production CDN, Lighthouse score, field INP, or full-session CLS.',trials,mobileMedian:{localBodyBytes:median(mobile.map(t=>t.localBodyBytes)),imageBodyBytes:median(mobile.map(t=>t.imageBodyBytes)),requestedImages:median(mobile.map(t=>t.requestedImages)),fcpMs:median(mobile.map(t=>t.paint.find(p=>p.name==='first-contentful-paint')?.ms||0)),lcpMs:median(mobile.map(t=>t.lcp?.ms||0)),initialCls:median(mobile.map(t=>t.cls))}};
  fs.writeFileSync(path.join(output,'performance-'+phase+'.json'),JSON.stringify(result,null,2)+'\n');
  return result;
};
