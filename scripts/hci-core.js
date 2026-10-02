/* Shared lifecycle. Games register independently; all state stays in memory. */
window.HCI = (() => {
 const shuffle = a => { a=[...a]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a; };
 const mean = a => a.length ? Math.round(a.reduce((s,v)=>s+v,0)/a.length) : null;
 const ms = a => mean(a)===null?'—':mean(a)+' ms';
 function session(container, instructions) {
  const events=new AbortController(), timers=new Set();let alive=true;
  container.innerHTML=`<style>
  .hc p{font-size:13px!important;line-height:1.65}.hc button{font:inherit;cursor:pointer;touch-action:manipulation}.hc button:disabled{cursor:default;opacity:.55}.hc .hc-stage{position:relative;background:#e9eddf;border-radius:8px;padding:16px;min-height:230px;margin:16px 0;overflow:hidden}.hc .hc-bar{font-size:13px;font-weight:600;min-height:25px}.hc .hc-controls{display:flex;gap:10px;flex-wrap:wrap}.hc .hc-controls button,.hc .hc-start{padding:10px 18px;background:#193831;color:#fff;border:0;border-radius:25px}.hc-grid{display:grid;gap:7px}.hc-grid button{min-height:48px;border:1px solid #87967f;background:#fffef9;border-radius:6px;color:#193831;font-size:26px}.hc .hc-result{white-space:pre-line;font-size:14px!important}.hc .hc-symbol{font-size:75px;text-align:center;padding:20px;color:#193831}.hc .hc-note{font-size:11px!important;color:#58685f}.hc table{width:100%;border-collapse:collapse;font-size:12px}.hc th,.hc td{text-align:left;padding:8px 4px;border-bottom:1px solid #ccd4cc}.hc canvas{display:block;width:100%;height:auto;touch-action:none}.hc .hc-dot{position:absolute;border-radius:50%;background:#193831;color:white;border:0;transform:translate(-50%,-50%);padding:0}.hc .hc-pulse{width:80px;height:80px;margin:30px auto;border-radius:50%;background:#788575}.hc .hc-pulse.on{background:#b04427;box-shadow:0 0 0 12px #b0442730}.hc .hc-stage button:focus-visible{outline:3px solid #a64e1c;outline-offset:3px}
  </style><div class="hc"><p class="hc-help"></p><div class="hc-bar"></div><div class="hc-stage"></div><div class="hc-controls"></div><p class="hc-result" role="status" aria-live="polite"></p><button class="hc-start" type="button">Start session</button><p class="hc-note">A short interaction demo, not a clinical attention test. Closing clears this session. Keep this tab visible while playing.</p></div>`;
  const q=s=>container.querySelector(s), stage=q('.hc-stage'),bar=q('.hc-bar'),result=q('.hc-result'),controls=q('.hc-controls'),start=q('.hc-start');q('.hc-help').textContent=instructions;
  function later(fn,delay){const id=setTimeout(()=>{timers.delete(id);if(alive)fn();},delay);timers.add(id);return id;}
  function cancel(){for(const id of timers)clearTimeout(id);timers.clear();}
  function on(el,type,fn){el.addEventListener(type,fn,{signal:events.signal});}
  function button(text,fn,parent=controls){const b=document.createElement('button');b.type='button';b.textContent=text;on(b,'click',fn);parent.append(b);return b;}
  let begin;
  function finish(text){cancel();start.hidden=false;start.textContent='Play again';controls.replaceChildren();result.textContent=text;}
  on(start,'click',()=>{cancel();stage.replaceChildren();controls.replaceChildren();result.textContent='';start.hidden=true;begin();});
  on(document,'visibilitychange',()=>{if(document.hidden&&start.hidden){finish('Session stopped because the tab was hidden. Start a fresh session for consistent timing.');stage.replaceChildren();bar.textContent='Session stopped';}});
  return {stage,bar,result,controls,start,on,later,cancel,button,finish,begin:fn=>begin=fn,cleanup(){alive=false;cancel();events.abort();container.replaceChildren();}};
 }
 return {session,shuffle,mean,ms};
})();
