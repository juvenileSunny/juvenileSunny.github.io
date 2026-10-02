PortfolioGames.register({id:'change-detective',title:'Change Detective',description:'Find the one symbol that changes between scenes.',mount(c){
 const s=HCI.session(c,'Two symbol grids alternate with a brief blank between them. Click the cell that changes. Five scenes; each has a 20-second limit.');
 s.begin(()=>{let trial=0,errors=0,misses=0,rt=[];
 function next(){if(trial===5){s.stage.textContent='Session complete';s.finish(`Changes found: ${rt.length}/5 · Timeouts: ${misses}\nWrong guesses: ${errors} · Mean detection: ${HCI.ms(rt)}`);return;}
 trial++;s.bar.textContent=`Scene ${trial}/5`;const symbols=HCI.shuffle(['●','▲','■','◆','★','✚','○','△','□']),change=Math.floor(Math.random()*9);s.stage.replaceChildren();const grid=document.createElement('div');grid.className='hc-grid';grid.style.gridTemplateColumns='repeat(3,1fr)';s.stage.append(grid);let phase=false,done=false;const shown=performance.now();
 const cells=symbols.map((symbol,index)=>s.button(symbol,()=>{if(done)return;if(index===change){done=true;s.cancel();rt.push(performance.now()-shown);next();}else errors++;},grid));
 function show(){if(done)return;grid.style.visibility='visible';cells.forEach((b,i)=>b.textContent=i===change&&phase?'✿':symbols[i]);phase=!phase;s.later(()=>{grid.style.visibility='hidden';s.later(show,160);},650);}show();
 s.later(()=>{done=true;misses++;s.cancel();next();},20000);}next();});return s.cleanup;
}});
