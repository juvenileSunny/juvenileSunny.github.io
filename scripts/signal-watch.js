PortfolioGames.register({id:'signal-watch',title:'Signal Watch',description:'Spot the important signal among distractions.',mount(c){
 const s=HCI.session(c,'Press Respond only for ★. Ignore ●, ▲ and ■. Each symbol stays for 900 ms. Twenty trials.');
 let n,hits,misses,falseClicks,rt,target,responded,shown,active;
 s.begin(()=>{n=hits=misses=falseClicks=0;rt=[];active=false;const sequence=HCI.shuffle([...Array(7).fill('★'),...Array.from({length:13},(_,i)=>['●','▲','■'][i%3])]);
 const b=s.button('Respond',()=>{if(!active||responded)return;responded=true;if(target){hits++;rt.push(performance.now()-shown);}else falseClicks++;});b.focus();
 function trial(){if(n===sequence.length){active=false;s.stage.textContent='Session complete';s.finish(`Hits: ${hits}/7 · Missed signals: ${misses}\nFalse responses: ${falseClicks} · Mean correct response: ${HCI.ms(rt)}`);return;}
 const symbol=sequence[n++];target=symbol==='★';responded=false;active=true;shown=performance.now();s.bar.textContent=`Trial ${n}/20`;s.stage.innerHTML='<div class="hc-symbol">'+symbol+'</div>';
 s.later(()=>{active=false;if(target&&!responded)misses++;s.stage.textContent='';s.later(trial,350);},900);}
 trial();});return s.cleanup;
}});
