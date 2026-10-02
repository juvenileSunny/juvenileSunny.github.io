PortfolioGames.register({id:'rhythm-tracker',title:'Rhythm Tracker',description:'Follow a pulse, then keep the rhythm without the cue.',mount(c){
 const s=HCI.session(c,'Tap with the pulse every 700 ms. Watch 4 practice beats, then tap for 8 visible beats and 4 hidden beats. Compare timing with and without visual feedback.');
 s.begin(()=>{const period=700,origin=performance.now()+700;let taps=new Map(),extra=0;const dot=document.createElement('div');dot.className='hc-pulse';dot.setAttribute('aria-hidden','true');s.stage.append(dot);
 s.button('Tap',()=>{const now=performance.now(),index=Math.round((now-origin)/period);if(index<4||index>15)return;if(taps.has(index)){extra++;return;}taps.set(index,now-(origin+index*period));});
 function beat(i){if(i<4)s.bar.textContent=`Watch the rhythm · ${i+1}/4`;else if(i<12)s.bar.textContent=`Tap with the cue · ${i-3}/8`;else s.bar.textContent='Keep tapping — cue hidden';
 if(i<12){dot.classList.add('on');s.later(()=>dot.classList.remove('on'),120);}
 if(i<15)s.later(()=>beat(i+1),Math.max(0,origin+(i+1)*period-performance.now()));else s.later(end,period/2+20);}
 function end(){const visible=[],hidden=[];for(const [i,error] of taps)(i<12?visible:hidden).push(Math.abs(error));s.stage.textContent='Session complete';s.finish(`Mean absolute timing error:\nVisible cue: ${HCI.ms(visible)} (${visible.length}/8 beats)\nHidden cue: ${HCI.ms(hidden)} (${hidden.length}/4 beats)\nMissed beats: ${12-taps.size} · Extra taps: ${extra}\nLower timing error means closer to the intended beat. Visual timing depends on the device.`);}
 s.bar.textContent='Get ready to watch four beats';s.later(()=>beat(0),700);});return s.cleanup;
}});
