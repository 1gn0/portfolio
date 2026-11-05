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
    var t=e.target.closest('.tab');if(t&&!t.disabled)showTab(t.dataset.t);
    var ln=e.target.closest('a[data-tab]');if(ln){showTab(ln.dataset.tab);}
  });
  d.addEventListener('keydown',function(e){if(e.key==='Escape'){var m=d.getElementById('modal');if(m&&m.classList.contains('on'))m.querySelector('[data-close]').click();}});
  function view(src){var m=d.getElementById('modal');if(!m)return;var f=m.querySelector('iframe'),v=m.querySelector('.imgv');
    if(/\.pdf$/i.test(src)){f.hidden=false;v.hidden=true;f.src=src}else{f.hidden=true;f.src='about:blank';v.hidden=false;v.querySelector('img').src=src}
    m.classList.add('on');}
  function showTab(id){
    d.querySelectorAll('.tab').forEach(function(t){t.setAttribute('aria-selected',t.dataset.t===id)});
    d.querySelectorAll('.panel').forEach(function(p){p.classList.toggle('on',p.id==='p-'+id)});
    try{history.replaceState(null,'','#'+id)}catch(e){}
  }
  window.showTab=showTab;
  var hs=location.hash.slice(1);
  if(hs&&d.getElementById('p-'+hs))showTab(hs);
  else{var f=d.querySelector('.tab[aria-selected=true]');if(f)showTab(f.dataset.t);}
})();
// fenêtre « profil.yml » déplaçable (easter egg)
(function(){
  var w=document.querySelector('.win'),b=w&&w.querySelector('.wbar');if(!b)return;
  var ox=0,oy=0,x=0,y=0,on=false;
  function set(){w.style.setProperty('--wx',x+'px');w.style.setProperty('--wy',y+'px')}
  b.addEventListener('pointerdown',function(e){on=true;ox=e.clientX-x;oy=e.clientY-y;b.setPointerCapture(e.pointerId);b.classList.add('drag')});
  b.addEventListener('pointermove',function(e){if(!on)return;x=e.clientX-ox;y=e.clientY-oy;set()});
  function up(){on=false;b.classList.remove('drag')}
  b.addEventListener('pointerup',up);b.addEventListener('pointercancel',up);
  b.addEventListener('dblclick',function(){x=0;y=0;set()});
})();
