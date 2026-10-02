PortfolioGames.register({id:'stop-signal',title:'Stop Signal',description:'Respond to GO, but hold back when STOP appears.',mount(c){
 const s=HCI.session(c,'Press Respond as soon as GO appears. On some trials, STOP appears 180 ms later: try to withhold your response. Wait for the next trial. Twenty trials.');
 s.begin(()=>{const trials=HCI.shuffle([...Array(6).fill(true),...Array(14).fill(false)]);let i=0,goHits=0,goMiss=0,failedStops=0,rt=[],active=false,responded=false,stopTrial=false,shown;
 const b=s.button('Respond',()=>{if(!active||responded)return;responded=true;if(stopTrial)failedStops++;else{goHits++;rt.push(performance.now()-shown);}});b.focus();
 function next(){if(i===20){active=false;s.stage.textContent='Session complete';s.finish(`GO responses: ${goHits}/14 · GO misses: ${goMiss}\nSuccessful stops: ${6-failedStops}/6\nMean correct GO response: ${HCI.ms(rt)}\nAn informal fixed-delay demo; not a validated inhibition score.`);return;}
 stopTrial=trials[i++];responded=false;active=true;shown=performance.now();s.bar.textContent=`Trial ${i}/20`;s.stage.innerHTML='<div class="hc-symbol">GO</div>';
 if(stopTrial)s.later(()=>{s.stage.innerHTML='<div class="hc-symbol" style="color:#a33725">STOP</div>';},180);
 s.later(()=>{active=false;if(!stopTrial&&!responded)goMiss++;s.stage.textContent='';s.later(next,500);},850);}next();});return s.cleanup;
}});
