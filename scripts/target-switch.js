PortfolioGames.register({id:'target-switch',title:'Target Switch',description:'Compare pointing with small and large targets.',mount(c){
 const s=HCI.session(c,'Hit the numbered target as it alternates left and right. Compare 12 hits on small targets with 12 on large targets. Use mouse or touch for the pointing comparison.');
 s.begin(()=>{const order=HCI.shuffle([28,64]),rows=[];let block=0;
 function round(){let count=0,errors=0,rt=[],shown;const size=order[block];s.stage.replaceChildren();s.stage.style.height='260px';
 const dot=s.button('1',()=>{rt.push(performance.now()-shown);count++;if(count===12){rows.push({size,rt,errors});block++;if(block<2){round();return;}s.stage.textContent='Comparison complete';s.bar.textContent='Results';s.finish(rows.map(r=>`${r.size===28?'Small':'Large'} targets: ${HCI.ms(r.rt)} per hit · ${r.errors} missed clicks`).join('\n')+'\nConditions ran in random order. Practice and input device can influence the comparison.');return;}place();},s.stage);dot.className='hc-dot';dot.style.width=dot.style.height=size+'px';
 s.on(s.stage,'click',e=>{if(e.target===s.stage&&s.start.hidden)errors++;});
 function place(){dot.style.left=count%2?'80%':'20%';dot.style.top='50%';dot.textContent=String(count+1);s.bar.textContent=`${size===28?'Small':'Large'} targets · ${count}/12 hits`;shown=performance.now();}place();}round();});return s.cleanup;
}});
