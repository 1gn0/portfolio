/* ===== FX : interactions partagées ===== */
(function(){
  var d=document,reduce=matchMedia('(prefers-reduced-motion:reduce)').matches,hov=matchMedia('(hover:hover)').matches;
  function $$(s,r){return [].slice.call((r||d).querySelectorAll(s))}
  // classes d'effets sur l'accueil aussi
  var SP='.tk,.ct,.uc,.cell,.tc,.doc,.big';
  $$(SP).forEach(function(el){if(!el.classList.contains('spot')){el.classList.add('spot');el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();el.style.setProperty('--mx',(e.clientX-r.left)+'px');el.style.setProperty('--my',(e.clientY-r.top)+'px')})}});
  if(!reduce&&hov){
    $$('.tk,.uc,.doc,.cell,.tc').forEach(function(el){if(el.classList.contains('tilt'))return;el.classList.add('tilt');
      el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect(),px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5,k=el.classList.contains('tk')?3:6;el.style.transform='perspective(1000px) rotateX('+(-py*k)+'deg) rotateY('+(px*k*1.2)+'deg) translateY(-3px)';el.style.setProperty('--px',px);el.style.setProperty('--py',py)});
      el.addEventListener('pointerleave',function(){el.style.transform='';el.style.setProperty('--px',0);el.style.setProperty('--py',0)})});
    // contacts : attraction magnétique
    $$('.ct').forEach(function(el){el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();el.style.transform='translate('+((e.clientX-r.left-r.width/2)*.06)+'px,'+((e.clientY-r.top-r.height/2)*.12-3)+'px)'});el.addEventListener('pointerleave',function(){el.style.transform=''})});
    // boutons magnétiques
    $$('.btn').forEach(function(el){el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();el.style.transform='translate('+((e.clientX-r.left-r.width/2)*.18)+'px,'+((e.clientY-r.top-r.height/2)*.3-2)+'px)'});el.addEventListener('pointerleave',function(){el.style.transform=''})});
    // aura qui suit le curseur
    var a=d.createElement('div');a.className='aura';d.body.appendChild(a);var tx=0,ty=0,x=0,y=0,run=false;
    function loop(){x+=(tx-x)*.12;y+=(ty-y)*.12;a.style.transform='translate('+x+'px,'+y+'px)';if(Math.abs(tx-x)+Math.abs(ty-y)>.5)requestAnimationFrame(loop);else run=false}
    addEventListener('pointermove',function(e){tx=e.clientX;ty=e.clientY;a.classList.add('on');if(!run){run=true;requestAnimationFrame(loop)}},{passive:true});
    d.addEventListener('pointerleave',function(){a.classList.remove('on')});
    // éclats de code au clic
    addEventListener('pointerdown',function(e){if(e.target.closest('input,textarea,.cmdk'))return;var C='01{}<>;/#$_';for(var i=0;i<7;i++){var s=d.createElement('span'),ang=Math.random()*6.28,dist=30+Math.random()*50;s.className='burst';s.textContent=C[Math.floor(Math.random()*C.length)];s.style.left=e.clientX+'px';s.style.top=e.clientY+'px';s.style.setProperty('--dx',Math.cos(ang)*dist+'px');s.style.setProperty('--dy',Math.sin(ang)*dist+'px');s.style.setProperty('--r',(Math.random()*180-90)+'deg');d.body.appendChild(s);setTimeout(function(s){s.remove()}.bind(null,s),850)}})
  }
  // ondulation au clic sur les boutons
  $$('.btn').forEach(function(b){b.addEventListener('pointerdown',function(e){var r=b.getBoundingClientRect(),s=Math.max(r.width,r.height)*2,p=d.createElement('span');p.className='rip';p.style.cssText='width:'+s+'px;height:'+s+'px;left:'+(e.clientX-r.left-s/2)+'px;top:'+(e.clientY-r.top-s/2)+'px';b.appendChild(p);setTimeout(function(){p.remove()},650)})});
  // boutons « copier » sur email / téléphone
  var toast=d.createElement('div');toast.className='toast';d.body.appendChild(toast);var tt;
  function say(m){toast.textContent=m;toast.classList.add('on');clearTimeout(tt);tt=setTimeout(function(){toast.classList.remove('on')},1800)}
  $$('.ct[href^="mailto:"],.ct[href^="tel:"]').forEach(function(c){var b=d.createElement('button');b.type='button';b.className='cp';b.innerHTML='<span lang="fr">copier</span><span lang="en">copy</span>';
    b.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();var v=c.getAttribute('href').replace(/^(mailto:|tel:)/,'');(navigator.clipboard?navigator.clipboard.writeText(v):Promise.reject()).catch(function(){}).then(function(){say((d.documentElement.lang==='en'?'copied ✓ ':'copié ✓ ')+v)})});c.appendChild(b)});
  // révélation générale + décryptage des titres + commande tapée
  var G='.tk,.ct,.uc,.cell,.tc,.doc,.big,.gr,.bar,.lead,.chipl a,.contacts .ct,.win';
  var groups=new Map();
  $$(G).forEach(function(el){if(!el.classList.contains('rv')&&!el.classList.contains('win'))el.classList.add('rv');var p=el.parentNode;var i=groups.get(p)||0;groups.set(p,i+1);el.style.setProperty('--i',Math.min(i,8))});
  var CH='01#$%&@<>/\\{}[]=+*';
  function scramble(sp){var txt=sp.dataset.t||(sp.dataset.t=sp.textContent),n=txt.length,f=0,tot=22;var iv=setInterval(function(){f++;var out='';for(var i=0;i<n;i++){out+=(txt[i]===' '||i<n*f/tot)?txt[i]:CH[Math.floor(Math.random()*CH.length)]}sp.textContent=out;if(f>=tot){clearInterval(iv);sp.textContent=txt}},32)}
  function typeRef(r){var n=r.lastChild;if(!n||n.nodeType!==3||r.dataset.done)return;r.dataset.done=1;var t=n.nodeValue,i=0;n.nodeValue=' ';var c=d.createElement('i');c.className='caret';r.appendChild(c);var iv=setInterval(function(){i++;n.nodeValue=t.slice(0,i);if(i>=t.length){clearInterval(iv);setTimeout(function(){c.remove()},2200)}},45)}
  var tts=$$('.tt'),refs=$$('.ref');
  if('IntersectionObserver' in window&&!reduce){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var el=e.target;el.classList.add('rvd');io.unobserve(el)})},{threshold:.1});
    $$('.rv').forEach(function(el){io.observe(el)});
    var io2=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var t=e.target;io2.unobserve(t);$$(':scope>span[lang]',t).forEach(scramble);var r=t.querySelector('.ref');if(r)typeRef(r)})},{threshold:.6});
    tts.forEach(function(t){io2.observe(t)});
  }else{$$('.rv').forEach(function(el){el.classList.add('rvd')})}
})();
