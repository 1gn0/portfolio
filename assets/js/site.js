(function(){
  var d=document,h=d.documentElement;
  function setLang(l){h.lang=l;try{localStorage.setItem('portfolio-lang',l)}catch(e){}
    d.querySelectorAll('.lang button').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.l===l)});
    var t=d.documentElement.getAttribute('data-title-'+l);if(t)d.title=t;}
  var q=new URLSearchParams(location.search).get('lang'),s=null;try{s=localStorage.getItem('portfolio-lang')}catch(e){}
  setLang(q==='en'||q==='fr'?q:(s||'fr'));
  d.addEventListener('click',function(e){
    var b=e.target.closest('.lang button');if(b)setLang(b.dataset.l);
    var g=e.target.closest('.burger');if(g)d.querySelector('.links').classList.toggle('open');
    var o=e.target.closest('[data-pdf],[data-view]');if(o){e.preventDefault();view(o.dataset.pdf||o.dataset.view);}
    if(e.target.closest('[data-close]')||e.target.id==='modal'){var m2=d.getElementById('modal');if(m2){m2.classList.remove('on');m2.querySelector('iframe').src='about:blank';}}
    var t=e.target.closest('.tab,.step');if(t&&!t.disabled)showTab(t.dataset.t);
    var ln=e.target.closest('a[data-tab]');if(ln){showTab(ln.dataset.tab);}
  });
  d.addEventListener('keydown',function(e){if(e.key==='Escape'){var m=d.getElementById('modal');if(m&&m.classList.contains('on'))m.querySelector('[data-close]').click();}});
  function view(src){var m=d.getElementById('modal');if(!m)return;var f=m.querySelector('iframe'),v=m.querySelector('.imgv');
    if(/\.pdf$/i.test(src)){f.hidden=false;v.hidden=true;f.src=src}else{f.hidden=true;f.src='about:blank';v.hidden=false;v.querySelector('img').src=src}
    m.classList.add('on');}
  var order=['but1','but2','but3'],curTab=null;
  function showTab(id){
    var dir=curTab&&order.indexOf(id)<order.indexOf(curTab)?'from-l':'from-r';curTab=id;
    d.querySelectorAll('.tab,.step').forEach(function(t){t.setAttribute('aria-selected',t.dataset.t===id)});
    d.querySelectorAll('.panel').forEach(function(p){var on=p.id==='p-'+id;p.classList.remove('from-l','from-r');p.classList.toggle('on',on);if(on){p.classList.add(dir);p.querySelectorAll('.trl').forEach(function(x){x.style.animation='none';x.getBoundingClientRect();x.style.animation=''});p.querySelectorAll('[data-count]').forEach(count)}});
    try{history.replaceState(null,'','#'+id)}catch(e){}
  }
  function count(el){var to=+el.dataset.count,t0=null;function f(t){if(!t0)t0=t;var k=Math.min(1,(t-t0)/700);el.textContent=Math.round(to*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(f)}requestAnimationFrame(f)}
  addEventListener('keydown',function(e){var st=[].slice.call(d.querySelectorAll('.step'));if(!st.length||e.target.tagName==='INPUT')return;var i=st.findIndex(function(x){return x.getAttribute('aria-selected')==='true'});if(e.key==='ArrowRight'&&i<st.length-1)showTab(st[i+1].dataset.t);if(e.key==='ArrowLeft'&&i>0)showTab(st[i-1].dataset.t)});
  window.showTab=showTab;
  var hs=location.hash.slice(1);
  if(hs&&d.getElementById('p-'+hs))showTab(hs);
  else{var f=d.querySelector('.tab[aria-selected=true],.step[aria-selected=true]');if(f)showTab(f.dataset.t);}
})();
// ===== interactions v2 =====
(function(){
  var d=document,reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
  // fenêtres déplaçables, verrouillées dans leur section
  d.querySelectorAll('.win').forEach(function(w){
    var b=w.querySelector('.wbar');if(!b)return;
    var bounds=(w.dataset.bounds?d.querySelector(w.dataset.bounds):null)||w.closest('section')||w.parentElement;
    var x=0,y=0,ox=0,oy=0,on=false,lim=null;
    function set(){w.style.setProperty('--wx',x+'px');w.style.setProperty('--wy',y+'px');w.style.transform='translate('+x+'px,'+y+'px)'}
    function limits(){var c=bounds.getBoundingClientRect(),r=w.getBoundingClientRect(),bx=r.left-x,by=r.top-y;
      return {x0:c.left+12-bx,x1:c.right-12-(bx+r.width),y0:c.top+12-by,y1:c.bottom-12-(by+r.height)}}
    b.addEventListener('pointerdown',function(e){if(e.target.closest('.wd.r'))return;on=true;lim=limits();ox=e.clientX-x;oy=e.clientY-y;b.setPointerCapture(e.pointerId);w.classList.add('dragging');b.style.cursor='grabbing'});
    b.addEventListener('pointermove',function(e){if(!on)return;x=Math.min(Math.max(e.clientX-ox,Math.min(lim.x0,0)),Math.max(lim.x1,0));y=Math.min(Math.max(e.clientY-oy,Math.min(lim.y0,0)),Math.max(lim.y1,0));set()});
    function up(){on=false;w.classList.remove('dragging');b.style.cursor=''}
    b.addEventListener('pointerup',up);b.addEventListener('pointercancel',up);
    b.addEventListener('dblclick',function(){x=0;y=0;set()});
    var r=w.querySelector('.wd');if(r){r.classList.add('r');r.title='réduire / agrandir';r.addEventListener('click',function(){w.classList.toggle('min')})}
    addEventListener('resize',function(){if(!x&&!y)return;lim=limits();x=Math.min(Math.max(x,Math.min(lim.x0,0)),Math.max(lim.x1,0));y=Math.min(Math.max(y,Math.min(lim.y0,0)),Math.max(lim.y1,0));set()});
  });
  // grille réactive
  d.querySelectorAll('.grid-bg').forEach(function(g){g.addEventListener('pointermove',function(e){var r=g.getBoundingClientRect();g.style.setProperty('--gx',(e.clientX-r.left)+'px');g.style.setProperty('--gy',(e.clientY-r.top)+'px')});g.addEventListener('pointerleave',function(){g.style.setProperty('--gx','-400px')})});
  // spotlight + tilt
  var SP='.pw,.tool-card,.step-card,.mission-item,.structure-card,.logic-card,.sae-card,.uc,.tk,.ct,.doc,.tc,.company-card,.grade,.relc,.rb,.box,.cd';
  d.querySelectorAll(SP).forEach(function(el){el.classList.add('spot');
    el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();el.style.setProperty('--mx',(e.clientX-r.left)+'px');el.style.setProperty('--my',(e.clientY-r.top)+'px')})});
  if(!reduce&&matchMedia('(hover:hover)').matches)d.querySelectorAll('.tool-card,.sae-card,.uc,.doc,.logic-card,.mission-item,.tc,.step-card').forEach(function(el){el.classList.add('tilt');
    el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect(),px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5;el.style.transform='perspective(900px) rotateX('+(-py*5)+'deg) rotateY('+(px*6)+'deg) translateY(-3px)'});
    el.addEventListener('pointerleave',function(){el.style.transform=''})});
  // révélation au scroll
  if('IntersectionObserver' in window&&!reduce){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('rvd');io.unobserve(e.target)}})},{threshold:.08});
    d.querySelectorAll('.pw,.tool-card,.mission-item,.structure-card,.sae-card,.grade,.rb,.uc,.tk,.tc,.relc,.ct,.doc,.logic-card,.step-card').forEach(function(el){el.classList.add('rv');io.observe(el)})}
  // barre de lecture + timeline + sommaire
  var prog=d.querySelector('.rprog'),steps=[].slice.call(d.querySelectorAll('.steps-grid')),toc=[].slice.call(d.querySelectorAll('.toc a'));
  var secs=toc.map(function(a){return d.querySelector(a.getAttribute('href'))});
  function onscroll(){var h=d.documentElement,max=h.scrollHeight-h.clientHeight;if(prog)prog.style.setProperty('--rp',max>0?h.scrollTop/max:0);
    steps.forEach(function(g){var r=g.getBoundingClientRect(),p=(innerHeight*.6-r.top)/r.height;g.style.setProperty('--sp',Math.min(1,Math.max(0,p)))});
    var cur=-1;secs.forEach(function(s,i){if(s&&s.getBoundingClientRect().top<innerHeight*.35)cur=i});toc.forEach(function(a,i){a.classList.toggle('on',i===cur)})}
  addEventListener('scroll',onscroll,{passive:true});onscroll();
  // sections réductibles
  d.querySelectorAll('.pwbar .wd').forEach(function(w){w.addEventListener('click',function(){w.closest('.pw').classList.toggle('min')})});
  // palette de commandes
  var P=[['Accueil','Home','index.html'],['Parcours','Journey','index.html#parcours'],['Expériences','Experience','index.html#experience'],['Compétences','Skills','index.html#competences'],['UE1 · Administrer','UE1 · Administer','competence-administrer.html'],['UE2 · Connecter','UE2 · Connect','competence-connecter.html'],['UE3 · Programmer','UE3 · Program','competence-programmer.html'],['UE4 · Sécuriser','UE4 · Secure','competence-securiser.html'],['UE5 · Surveiller','UE5 · Monitor','competence-surveiller.html'],['Projets','Projects','projets.html'],['SAE 2.01 · Réseau petite entreprise','SAE 2.01 · Small business network','sae201.html'],['SAE 2.02 · Web Radio','SAE 2.02 · Web Radio','sae202.html'],['SAE 2.03 · Application Web','SAE 2.03 · Web Application','sae203.html'],['SAE 2.04 · Projet intégratif','SAE 2.04 · Integrative project','sae204.html'],['SAE 3.01 · Système de transmission','SAE 3.01 · Transmission system','sae301.html'],['SAE 3.02 · Applications communicantes','SAE 3.02 · Communicating apps','sae302.html'],['SAE 3.Cyber.03 · Réseau multi-sites','SAE 3.Cyber.03 · Multi-site network','sae303.html'],['SAE 3.Cyber.04 · Pentesting','SAE 3.Cyber.04 · Pentesting','sae304.html'],['SAE 4.Portfolio','SAE 4.Portfolio','sae4portfolio.html'],['Stage OCI','OCI Internship','stage-oci.html'],['Projet MFA','MFA project','stage-projet-mfa.html'],['CV','Resume','index.html#cv'],['Contact','Contact','index.html#contact']];
  var box=d.createElement('div');box.className='cmdk';box.innerHTML='<div class="bx"><input placeholder="aller à… (Échap pour fermer)" aria-label="Rechercher une page"><ul></ul></div>';d.body.appendChild(box);
  var inp=box.querySelector('input'),ul=box.querySelector('ul'),sel=0,cur=[];
  function lang(){return d.documentElement.lang==='en'?1:0}
  function render(){var q=inp.value.toLowerCase();cur=P.filter(function(p){return (p[0]+' '+p[1]).toLowerCase().indexOf(q)>-1});sel=Math.min(sel,Math.max(0,cur.length-1));ul.innerHTML=cur.map(function(p,i){return '<li class="'+(i===sel?'sel':'')+'"><a href="'+p[2]+'"><span>'+p[lang()]+'</span><small>'+p[2]+'</small></a></li>'}).join('')}
  function open(){box.classList.add('on');inp.value='';sel=0;render();setTimeout(function(){inp.focus()},0)}
  function close(){box.classList.remove('on')}
  inp.addEventListener('input',function(){sel=0;render()});
  box.addEventListener('click',function(e){if(e.target===box)close()});
  addEventListener('keydown',function(e){var t=e.target.tagName;
    if((e.key==='k'&&(e.ctrlKey||e.metaKey))||(e.key==='/'&&t!=='INPUT')){e.preventDefault();open()}
    if(!box.classList.contains('on'))return;
    if(e.key==='Escape')close();
    if(e.key==='ArrowDown'){e.preventDefault();sel=Math.min(sel+1,cur.length-1);render()}
    if(e.key==='ArrowUp'){e.preventDefault();sel=Math.max(sel-1,0);render()}
    if(e.key==='Enter'&&cur[sel])location.href=cur[sel][2]});
  var nb=d.querySelector('.top .lang');if(nb){var k=d.createElement('button');k.className='kbtn';k.type='button';k.textContent='Ctrl K';k.title='Aller à…';k.addEventListener('click',open);nb.parentNode.insertBefore(k,nb)}
})();
