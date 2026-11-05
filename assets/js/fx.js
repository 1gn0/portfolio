/* ===== FX : interactions partagées ===== */
(function(){
  var d=document,reduce=matchMedia('(prefers-reduced-motion:reduce)').matches,hov=matchMedia('(hover:hover)').matches;
  function $$(s,r){return [].slice.call((r||d).querySelectorAll(s))}
  // classes d'effets sur l'accueil aussi
  var SP='.tk,.ct,.uc,.cell,.tc,.doc,.big';
  $$(SP).forEach(function(el){if(!el.classList.contains('spot')){el.classList.add('spot');0}});
  if(!reduce&&hov){
    $$('.tk,.uc,.doc,.cell,.tc').forEach(function(el){if(el.classList.contains('tilt'))return;el.classList.add('tilt');
      el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect(),px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5,k=el.classList.contains('tk')?3:6;el.style.transform='perspective(1000px) rotateX('+(-py*k)+'deg) rotateY('+(px*k*1.2)+'deg) translateY(-3px)';el.style.setProperty('--px',px);el.style.setProperty('--py',py)});
      el.addEventListener('pointerleave',function(){el.style.transform='';el.style.setProperty('--px',0);el.style.setProperty('--py',0)})});
    // contacts : attraction magnétique
    $$('.ct').forEach(function(el){el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();el.style.transform='translate('+((e.clientX-r.left-r.width/2)*.06)+'px,'+((e.clientY-r.top-r.height/2)*.12-3)+'px)'});el.addEventListener('pointerleave',function(){el.style.transform=''})});
    // boutons magnétiques
    $$('.btn').forEach(function(el){el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();el.style.transform='translate('+((e.clientX-r.left-r.width/2)*.18)+'px,'+((e.clientY-r.top-r.height/2)*.3-2)+'px)'});el.addEventListener('pointerleave',function(){el.style.transform=''})});
  }

  // curseur personnalisé : le point seul
  if(hov&&matchMedia('(pointer:fine)').matches){
    var H=d.documentElement,dot=d.createElement('div');dot.className='cur-dot';d.body.appendChild(dot);H.classList.add('cc');
    var LINK='a,button,.btn,[data-pdf],.step,.tk,.uc,.ct,summary,.pc,.sk,.tag,.chip,.doc,.wbar,.cell,.tc,.gr,.bgp b';
    addEventListener('pointermove',function(e){dot.style.transform='translate('+e.clientX+'px,'+e.clientY+'px)';
      var t=e.target;if(t.closest&&t.closest('iframe,input,textarea')){H.classList.remove('cur-on','cc');return}
      H.classList.add('cc','cur-on');H.classList.toggle('cur-link',!!(t.closest&&t.closest(LINK)))},{passive:true});
    d.addEventListener('pointerleave',function(){H.classList.remove('cur-on')});
  }
  // boutons « copier » sur email / téléphone
  var toast=d.createElement('div');toast.className='toast';d.body.appendChild(toast);var tt;
  function say(m){toast.textContent=m;toast.classList.add('on');clearTimeout(tt);tt=setTimeout(function(){toast.classList.remove('on')},1800)}
  $$('.ct[href^="mailto:"],.ct[href^="tel:"]').forEach(function(c){var b=d.createElement('button');b.type='button';b.className='cp';b.innerHTML='<span lang="fr">copier</span><span lang="en">copy</span>';
    b.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();var v=c.getAttribute('href').replace(/^(mailto:|tel:)/,'');(navigator.clipboard?navigator.clipboard.writeText(v):Promise.reject()).catch(function(){}).then(function(){say((d.documentElement.lang==='en'?'copied ✓ ':'copié ✓ ')+v)})});c.appendChild(b)});
  // mode clair / sombre
  (function(){var H=d.documentElement,nb=d.querySelector('.top .lang');if(!nb)return;var b=d.createElement('button');b.type='button';b.className='mode';b.setAttribute('aria-label','Mode clair / sombre');
    b.innerHTML='<svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg><svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
    function upd(){var l=H.dataset.mode==='light';b.title=l?(H.lang==='en'?'Dark mode':'Mode sombre'):(H.lang==='en'?'Light mode':'Mode clair')}
    b.addEventListener('click',function(){var m=H.dataset.mode==='light'?'dark':'light';H.dataset.mode=m;try{localStorage.setItem('portfolio-mode',m)}catch(e){}upd();d.dispatchEvent(new Event('modechange'))});
    upd();nb.parentNode.insertBefore(b,nb)})();
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

  // parcours : fil qui se remplit au scroll, commits qui s'allument, ligne survolée, clic = pulsation
  var rows=$$('#parcours .gr');
  if(rows.length){
    function pscroll(){var y=innerHeight*.62;rows.forEach(function(r){var b=r.getBoundingClientRect(),lm=r.querySelector('.lm');r.classList.toggle('lit',b.top+22<y);if(lm)lm.style.setProperty('--lf',Math.min(1,Math.max(0,(y-b.top-22)/(b.height))))})}
    addEventListener('scroll',pscroll,{passive:true});pscroll();
    rows.forEach(function(r){r.addEventListener('pointerenter',function(){r.classList.add('near')});r.addEventListener('pointerleave',function(){r.classList.remove('near')});
      r.addEventListener('click',function(){r.classList.remove('pop');void r.offsetWidth;r.classList.add('pop')})});
  }

  // images : logos jamais recadrés, captures larges sur toute la ligne, zoom au clic
  function fixImgs(){$$('main img').forEach(function(im){if(!im.naturalWidth)return;var src=im.getAttribute('src')||'',ar=im.naturalWidth/im.naturalHeight,cs=getComputedStyle(im),r=im.getBoundingClientRect();
      if(cs.objectFit==='cover'&&r.height>0){var br=r.width/r.height;if(/files\/logo\//.test(src)||Math.abs(br-ar)/ar>.45)im.classList.add('logoimg')}
      if(!im.closest('a,[data-view],[data-pdf],.tool-img,.sae-card,.pc')&&im.naturalWidth>r.width*1.15&&!im.classList.contains('logoimg')){im.dataset.view=src;im.classList.add('zoomable')}
      if(ar>1.7&&im.naturalWidth>r.width*1.25){var c=im;while(c&&c.parentElement&&c.parentElement.tagName!=='MAIN'){var pd=getComputedStyle(c.parentElement);if(pd.display==='grid'&&pd.gridTemplateColumns.split(' ').length>1){c.classList.add('full-row');break}if(c.parentElement.classList.contains('side-by-side-images')){c.classList.add('full-row');break}c=c.parentElement}}
    });
    // si une seule case reste seule dans une grille dont les autres passent en pleine ligne, elle passe aussi en pleine ligne
    $$('main .full-row').map(function(c){return c.parentElement}).filter(function(g,i,a){return a.indexOf(g)===i}).forEach(function(g){var rest=[].filter.call(g.children,function(c){return !c.classList.contains('full-row')});if(rest.length===1)rest[0].classList.add('full-row')})}
  if(d.readyState==='complete')fixImgs();else addEventListener('load',fixImgs);
})();
