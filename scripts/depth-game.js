/* Depth Explorer — native WebGL, no downloads or third-party libraries.
   Register after scripts/games.js. All state is discarded on close. */
PortfolioGames.register({
 id:'depth-explorer', title:'Depth Explorer',
 description:'Explore a 3D scene. Can you select the nearest or farthest sphere?',
 mount(container){
  const events=new AbortController();let disposed=false,round=0,score=0,answered=true,shown=0;
  let objects=[],times=[],history=[],nearest=true,plan=[];
  const colors=[[.93,.48,.18],[.17,.65,.78],[.66,.47,.89]],names=['A · Orange','B · Blue','C · Purple'];
  const radius=.62,tan=Math.tan(48*Math.PI/360);let aspect=1;
  container.innerHTML=`<style>
  .dg p{font-size:13px!important;line-height:1.65}.dg .dg-question{font-size:23px!important;line-height:1.3;margin:15px 0}.dg .dg-bar{display:flex;justify-content:space-between;font-size:12px}.dg canvas{display:block;width:100%;height:320px;background:#142831;border-radius:9px;touch-action:manipulation;cursor:pointer;margin:15px 0}.dg .dg-answers{display:flex;flex-wrap:wrap;gap:8px}.dg button{font:inherit;font-size:12px;border:1px solid #9cae9a;border-radius:22px;padding:10px 14px;background:transparent;color:inherit;cursor:pointer;touch-action:manipulation}.dg button:disabled{opacity:.55;cursor:default}.dg .dg-next{background:#193831;color:white;margin-top:12px}.dg .dg-feedback{min-height:3em;white-space:pre-line}.dg .dg-note{font-size:11px!important;color:#58685f}.dg .dg-dot{display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:5px}.dg .dg-orange{background:#ed7a2e}.dg .dg-blue{background:#2ba6c7}.dg .dg-purple{background:#a878e3}@media(max-width:430px){.dg canvas{height:280px}}
  </style><div class="dg"><p>All three spheres have the same physical size. Use perspective, apparent size, and the floor grid to judge their distance from the camera. Tap a sphere or select its labeled button.</p><div class="dg-bar"><span data-round>12 rounds</span><span data-score>Score: 0</span></div><h4 class="dg-question">Near or far?</h4><canvas aria-label="3D scene with orange, blue, and purple spheres. Use the labeled buttons to answer."></canvas><div class="dg-answers"></div><p class="dg-feedback" role="status" aria-live="polite">Start when you’re ready.</p><button type="button" class="dg-next">Start session</button><p class="dg-note">A perspective-based interaction demo on a flat screen, not a stereoscopic vision test. No progress is saved.</p></div>`;
  const q=s=>container.querySelector(s),canvas=q('canvas'),question=q('.dg-question'),feedback=q('.dg-feedback'),next=q('.dg-next');
  const gl=canvas.getContext('webgl',{antialias:true,alpha:false});
  if(!gl){question.textContent='3D rendering is unavailable';feedback.textContent='This browser could not start WebGL. Try a browser with hardware acceleration enabled.';next.hidden=true;return()=>{events.abort();container.replaceChildren();};}
  const buffers=[],shaders=[];let program=null,observer=null;
  function shader(type,source){const s=gl.createShader(type);shaders.push(s);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error('Could not compile 3D shader');return s;}
  try{
   program=gl.createProgram();
   gl.attachShader(program,shader(gl.VERTEX_SHADER,`attribute vec3 p;attribute vec3 n;uniform vec3 center;uniform float scale;uniform float aspect;uniform float tangent;varying vec3 normal;varying float depth;void main(){vec3 v=p*scale+center;float near=.1;float far=60.;gl_Position=vec4(v.x/(aspect*tangent),v.y/tangent,-(far+near)/(far-near)*v.z-2.*far*near/(far-near),-v.z);normal=n;depth=-v.z;}`));
   gl.attachShader(program,shader(gl.FRAGMENT_SHADER,`precision mediump float;uniform vec3 color;uniform float lit;varying vec3 normal;varying float depth;void main(){float light=mix(1.,.38+.62*max(dot(normalize(normal),normalize(vec3(-.5,.8,.8))),0.),lit);vec3 c=color*light;float fog=clamp((depth-5.)/45.,0.,.65);gl_FragColor=vec4(mix(c,vec3(.078,.157,.192),fog),1.);}`));
   gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('Could not link 3D shader');
  }catch(error){for(const s of shaders)gl.deleteShader(s);if(program)gl.deleteProgram(program);feedback.textContent='The 3D renderer could not initialize. Try another browser.';next.hidden=true;return()=>container.replaceChildren();}
  const at={p:gl.getAttribLocation(program,'p'),n:gl.getAttribLocation(program,'n')},u={};
  for(const name of ['center','scale','aspect','tangent','color','lit'])u[name]=gl.getUniformLocation(program,name);
  function mesh(data){const b=gl.createBuffer();buffers.push(b);gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);return {buffer:b,count:data.length/6};}
  const sphere=[];
  function vertex(a,b){return [Math.sin(a)*Math.cos(b),Math.cos(a),Math.sin(a)*Math.sin(b)];}
  for(let i=0;i<20;i++)for(let j=0;j<30;j++){
   const a=i*Math.PI/20,b=j*2*Math.PI/30,da=Math.PI/20,db=2*Math.PI/30;
   for(const v of [vertex(a,b),vertex(a+da,b),vertex(a+da,b+db),vertex(a,b),vertex(a+da,b+db),vertex(a,b+db)])sphere.push(...v,...v);
  }
  const ball=mesh(sphere),grid=[];
  for(let x=-16;x<=16;x++)grid.push(x,-1.35,-2,0,1,0,x,-1.35,-35,0,1,0);
  for(let z=-2;z>=-35;z--)grid.push(-16,-1.35,z,0,1,0,16,-1.35,z,0,1,0);
  const floor=mesh(grid);
  function drawMesh(m,center,scale,color,lit,mode){gl.bindBuffer(gl.ARRAY_BUFFER,m.buffer);for(const [name,offset] of [['p',0],['n',12]]){gl.enableVertexAttribArray(at[name]);gl.vertexAttribPointer(at[name],3,gl.FLOAT,false,24,offset);}gl.uniform3fv(u.center,center);gl.uniform1f(u.scale,scale);gl.uniform3fv(u.color,color);gl.uniform1f(u.lit,lit);gl.drawArrays(mode,0,m.count);}
  function position(){objects.forEach((o,i)=>{o.center=[(i-1)*.57*o.depth*tan*aspect,-.73,-o.depth];});}
  function render(){if(disposed)return;const rect=canvas.getBoundingClientRect();if(!rect.width||!rect.height)return;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(rect.width*dpr);canvas.height=Math.round(rect.height*dpr);aspect=rect.width/rect.height;position();gl.viewport(0,0,canvas.width,canvas.height);gl.clearColor(.078,.157,.192,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.enable(gl.DEPTH_TEST);gl.useProgram(program);gl.uniform1f(u.aspect,aspect);gl.uniform1f(u.tangent,tan);drawMesh(floor,[0,0,0],1,[.24,.40,.43],0,gl.LINES);objects.forEach(o=>drawMesh(ball,o.center,radius,colors[o.color],1,gl.TRIANGLES));}
  const buttons=names.map((name,i)=>{const b=document.createElement('button');b.type='button';b.innerHTML=`<span class="dg-dot dg-${['orange','blue','purple'][i]}"></span>${name}`;b.disabled=true;b.addEventListener('click',()=>answer(i),{signal:events.signal});q('.dg-answers').append(b);return b;});
  const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
  function correct(){return objects.reduce((best,o)=>nearest?(o.depth<best.depth?o:best):(o.depth>best.depth?o:best)).color;}
  function answer(color){if(answered||disposed)return;answered=true;const elapsed=performance.now()-shown,expected=correct(),ok=color===expected;if(ok)score++;times.push(elapsed);history.push({ok,nearest});buttons.forEach(b=>b.disabled=true);q('[data-score]').textContent=`Score: ${score}/${round}`;
   const ordered=[...objects].sort((a,b)=>a.depth-b.depth).map(o=>names[o.color].split(' · ')[0]).join(' → ');
   feedback.textContent=`${ok?'Correct!':'Not quite.'} ${names[expected]} is ${nearest?'nearest':'farthest'}.\nNear → far: ${ordered}. Response: ${(elapsed/1000).toFixed(2)} s.`;
   next.hidden=false;next.textContent=round===12?'View results':'Next round';next.focus();}
  function newRound(){round++;nearest=plan[round-1];const base=6.3+Math.random()*.4,gap=round<=4?2.5:round<=8?1.7:1.05,depths=shuffle([base,base+gap,base+2*gap]),colorOrder=shuffle([0,1,2]);objects=depths.map((depth,i)=>({depth,color:colorOrder[i],center:[]}));answered=false;buttons.forEach(b=>b.disabled=false);question.textContent=`Which sphere is ${nearest?'NEAREST':'FARTHEST'}?`;q('[data-round]').textContent=`Round ${round}/12`;feedback.textContent='Select an object in the scene or its button below.';next.hidden=true;render();shown=performance.now();buttons[0].focus({preventScroll:true});}
  next.addEventListener('click',()=>{if(round===12){question.textContent='Session complete';const near=history.filter(h=>h.nearest),far=history.filter(h=>!h.nearest);feedback.textContent=`Accuracy: ${score}/12 (${Math.round(score/12*100)}%)\nNearest: ${near.filter(h=>h.ok).length}/6 · Farthest: ${far.filter(h=>h.ok).length}/6\nMean response time: ${(times.reduce((a,b)=>a+b,0)/times.length/1000).toFixed(2)} s\nThis reflects this session, not a measure of visual health.`;round=0;next.textContent='Play again';return;}
   if(round===0){score=0;times=[];history=[];plan=shuffle([...Array(6).fill(true),...Array(6).fill(false)]);q('[data-score]').textContent='Score: 0';}newRound();},{signal:events.signal});
  canvas.addEventListener('click',e=>{if(answered)return;const r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*2-1,y=1-(e.clientY-r.top)/r.height*2;let d=[x*aspect*tan,y*tan,-1];const length=Math.hypot(...d);d=d.map(v=>v/length);let selected=null,best=Infinity;
   for(const o of objects){const dot=o.center.reduce((sum,v,i)=>sum+v*d[i],0),dist=o.center.reduce((sum,v)=>sum+v*v,0),disc=dot*dot-dist+radius*radius;if(disc<0)continue;const t=dot-Math.sqrt(disc);if(t>0&&t<best){best=t;selected=o;}}
   if(selected)answer(selected.color);
  },{signal:events.signal});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&!answered){answered=true;buttons.forEach(b=>b.disabled=true);round=0;feedback.textContent='Session stopped while this tab was hidden. Start again for consistent timing.';next.hidden=false;next.textContent='Start again';}},{signal:events.signal});
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();answered=true;buttons.forEach(b=>b.disabled=true);next.hidden=true;feedback.textContent='The 3D connection was interrupted. Close this game and reopen it.';},{signal:events.signal});
  observer=new ResizeObserver(render);observer.observe(canvas);objects=[{depth:6.5,color:0},{depth:9,color:1},{depth:11.5,color:2}];render();
  return()=>{disposed=true;events.abort();observer.disconnect();for(const b of buffers)gl.deleteBuffer(b);for(const s of shaders)gl.deleteShader(s);gl.deleteProgram(program);gl.getExtension('WEBGL_lose_context')?.loseContext();container.replaceChildren();};
 }
});
