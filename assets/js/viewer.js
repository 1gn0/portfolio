/* ===== Visionneuse de fichiers (PDF via pdf.js, images) ===== */
(function(){
  var d=document,H=d.documentElement,reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
  var BASE=(function(){var s=d.querySelector('script[src*="viewer.js"]');return s?s.getAttribute('src').replace(/js\/viewer\.js.*$/,''):'assets/'})();
  function L(fr,en){return H.lang==='en'?en:fr}
  var ICON={
    prev:'<path d="M15 18l-6-6 6-6"/>',next:'<path d="M9 18l6-6-6-6"/>',minus:'<path d="M5 12h14"/>',plus:'<path d="M12 5v14M5 12h14"/>',
    fit:'<path d="M4 9V5h4M20 9V5h-4M4 15v4h4M20 15v4h-4"/>',dl:'<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
    ext:'<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',x:'<path d="M6 6l12 12M18 6L6 18"/>',side:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/>'};
  function ic(n){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+ICON[n]+'</svg>'}
  var root=d.createElement('div');root.className='fvx';root.setAttribute('aria-hidden','true');
  root.innerHTML='<div class="fv" role="dialog" aria-modal="true">'+
    '<div class="fvbar"><span class="fvd"><b class="r" data-a="close" title="'+L('Fermer','Close')+'"></b><b class="y" data-a="side" title="'+L('Miniatures','Thumbnails')+'"></b><b class="g" data-a="max" title="'+L('Agrandir','Maximize')+'"></b></span>'+
    '<span class="fvt"><span class="fvp"></span><span class="fvn"></span><em class="fvk"></em></span>'+
    '<span class="fvtools">'+
      '<span class="fvg fvpg"><button data-a="prev" title="'+L('Page précédente','Previous page')+'">'+ic('prev')+'</button><span class="fvpc"><input class="fvpi" inputmode="numeric" aria-label="page"> / <span class="fvpt">1</span></span><button data-a="next" title="'+L('Page suivante','Next page')+'">'+ic('next')+'</button></span>'+
      '<span class="fvg"><button data-a="out" title="'+L('Dézoomer','Zoom out')+'">'+ic('minus')+'</button><button class="fvz" data-a="fit" title="'+L('Ajuster à la largeur','Fit width')+'">100%</button><button data-a="in" title="'+L('Zoomer','Zoom in')+'">'+ic('plus')+'</button></span>'+
      '<span class="fvg"><a class="fvdl" download title="'+L('Télécharger','Download')+'">'+ic('dl')+'</a><a class="fvext" target="_blank" rel="noopener" title="'+L('Ouvrir dans un onglet','Open in a new tab')+'">'+ic('ext')+'</a><button data-a="close" class="fvc" title="'+L('Fermer','Close')+' (Échap)">'+ic('x')+'</button></span>'+
    '</span></div>'+
    '<div class="fvb"><aside class="fvth"></aside><div class="fvs"><div class="fvpages"></div></div>'+
      '<div class="fvload"><span class="mono">$ cat <i class="fvln"></i></span><span class="fvbarp"><u></u></span><small class="mono fvpct">0%</small></div></div>'+
    '<div class="fvst mono"><span class="fvmode">-- '+L('LECTURE','READ ONLY')+' --</span><span class="fvinfo"></span><span class="fvkeys">'+L('Échap fermer · ←/→ pages · +/− zoom','Esc close · ←/→ pages · +/− zoom')+'</span></div>'+
  '</div>';
  d.body.appendChild(root);
  var win=root.querySelector('.fv'),pagesEl=root.querySelector('.fvpages'),scr=root.querySelector('.fvs'),th=root.querySelector('.fvth'),load=root.querySelector('.fvload'),
      zb=root.querySelector('.fvz'),pi=root.querySelector('.fvpi'),pt=root.querySelector('.fvpt'),info=root.querySelector('.fvinfo'),last=null;
  var st={kind:null,pdf:null,scale:1,fit:1,n:1,cur:1,src:'',img:null,io:null,rendered:{},tok:0};

  function loadLib(cb){if(window.pdfjsLib)return cb(true);var s=d.createElement('script');s.src=BASE+'vendor/pdfjs/pdf.js';
    s.onload=function(){try{pdfjsLib.GlobalWorkerOptions.workerSrc=BASE+'vendor/pdfjs/pdf.worker.js';cb(true)}catch(e){cb(false)}};s.onerror=function(){cb(false)};d.head.appendChild(s)}
  function size(b){return b>1048576?(b/1048576).toFixed(1).replace('.',',')+' Mo':Math.max(1,Math.round(b/1024))+' Ko'}

  function open(src,from){
    last=d.activeElement;st.tok++;var tok=st.tok;st.src=src;st.rendered={};pagesEl.innerHTML='';th.innerHTML='';info.textContent='';
    var parts=src.split('/'),name=parts.pop();root.querySelector('.fvp').textContent='~/'+parts.join('/')+(parts.length?'/':'');root.querySelector('.fvn').textContent=name;
    var ext=(name.split('.').pop()||'').toLowerCase();root.querySelector('.fvk').textContent=ext;root.querySelector('.fvln').textContent=name;
    root.querySelector('.fvdl').href=src;root.querySelector('.fvdl').setAttribute('download',name);root.querySelector('.fvext').href=src;
    st.kind=ext==='pdf'?'pdf':'img';root.dataset.kind=st.kind;root.classList.remove('side');
    // ouverture depuis l'élément cliqué
    if(from&&!reduce){var r=from.getBoundingClientRect();win.style.transformOrigin=(r.left+r.width/2-innerWidth/2+win.offsetWidth/2)+'px '+(r.top+r.height/2-innerHeight*.04)+'px'}else win.style.transformOrigin='50% 50%';
    root.classList.add('on');root.setAttribute('aria-hidden','false');H.classList.add('fv-open');
    requestAnimationFrame(function(){root.classList.add('in')});
    load.hidden=false;setP(0);
    if(st.kind==='img'){var im=new Image();im.onload=function(){if(tok!==st.tok)return;st.img=im;st.n=1;pt.textContent='1';pi.value='1';
        var w=d.createElement('div');w.className='fvpage fvimg';w.appendChild(im);pagesEl.appendChild(w);load.hidden=true;
        info.textContent=ext+' · '+im.naturalWidth+'×'+im.naturalHeight+' px';fitW();setTimeout(fitW,360)};im.onerror=function(){fail()};im.src=src;im.alt=name;return}
    loadLib(function(ok){if(tok!==st.tok)return;if(!ok)return fail();
      var task=pdfjsLib.getDocument({url:src});task.onProgress=function(p){if(p.total)setP(p.loaded/p.total)};
      task.promise.then(function(pdf){if(tok!==st.tok)return;st.pdf=pdf;st.n=pdf.numPages;pt.textContent=pdf.numPages;pi.value='1';st.cur=1;
        pdf.getDownloadInfo().then(function(i){info.textContent='pdf · '+pdf.numPages+' page'+(pdf.numPages>1?'s':'')+' · '+size(i.length)}).catch(function(){info.textContent='pdf · '+pdf.numPages+' pages'});
        if(pdf.numPages>2&&innerWidth>900)root.classList.add('side');
        pdf.getPage(1).then(function(p){var vp=p.getViewport({scale:1});st.pw=vp.width;st.ph=vp.height;build();load.hidden=true;fitW();setTimeout(fitW,360)})
      }).catch(function(){fail()})})
  }
  function fail(){load.hidden=true;pagesEl.innerHTML='<div class="fvfail mono">'+L('Aperçu indisponible ici.','Preview not available here.')+' <a href="'+st.src+'" target="_blank" rel="noopener">'+L('Ouvrir le fichier','Open the file')+' →</a></div>'}
  function setP(x){root.querySelector('.fvbarp u').style.transform='scaleX('+x+')';root.querySelector('.fvpct').textContent=Math.round(x*100)+'%'}
  function build(){pagesEl.innerHTML='';th.innerHTML='';if(st.io)st.io.disconnect();
    st.io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)render(+e.target.dataset.p)})},{root:scr,rootMargin:'600px 0px'});
    for(var i=1;i<=st.n;i++){var w=d.createElement('div');w.className='fvpage';w.dataset.p=i;w.innerHTML='<canvas></canvas><span class="fvpn mono">'+i+'</span>';pagesEl.appendChild(w);st.io.observe(w);
      var t=d.createElement('button');t.className='fvtb';t.dataset.p=i;t.innerHTML='<canvas></canvas><span>'+i+'</span>';th.appendChild(t)}
    thumbs()}
  function thumbs(){var tok=st.tok;[].forEach.call(th.querySelectorAll('.fvtb'),function(t){var i=+t.dataset.p;st.pdf.getPage(i).then(function(p){if(tok!==st.tok)return;var vp=p.getViewport({scale:120/p.getViewport({scale:1}).width}),c=t.querySelector('canvas');c.width=vp.width;c.height=vp.height;p.render({canvasContext:c.getContext('2d'),viewport:vp})})})}
  function render(i){if(st.kind!=='pdf'||!st.pdf)return;var key=i+'@'+st.scale.toFixed(3);if(st.rendered[i]===key)return;st.rendered[i]=key;var tok=st.tok;
    st.pdf.getPage(i).then(function(p){if(tok!==st.tok)return;var w=pagesEl.querySelector('.fvpage[data-p="'+i+'"]');if(!w)return;var dpr=Math.min(2.5,devicePixelRatio||1),vp=p.getViewport({scale:st.scale*dpr}),c=d.createElement('canvas');
      c.width=vp.width;c.height=vp.height;p.render({canvasContext:c.getContext('2d'),viewport:vp}).promise.then(function(){if(tok!==st.tok)return;var old=w.querySelector('canvas');w.replaceChild(c,old);w.classList.add('ok')})})}
  function apply(keep){var prev=scr.scrollHeight?scr.scrollTop/scr.scrollHeight:0;
    if(st.kind==='pdf'){var W=st.pw*st.scale,Hh=st.ph*st.scale;[].forEach.call(pagesEl.querySelectorAll('.fvpage'),function(w){w.style.width=W+'px';w.style.height=Hh+'px'});st.rendered={};
      [].forEach.call(pagesEl.querySelectorAll('.fvpage'),function(w){var r=w.getBoundingClientRect(),sr=scr.getBoundingClientRect();if(r.bottom>sr.top-600&&r.top<sr.bottom+600)render(+w.dataset.p)})}
    else if(st.img){st.img.style.width=st.img.naturalWidth*st.scale+'px'}
    zb.textContent=Math.round(st.scale*100)+'%';if(keep)scr.scrollTop=prev*scr.scrollHeight}
  function fitW(){var avail=scr.clientWidth-56,ah=scr.clientHeight-56;if(st.kind==='pdf'){st.fit=Math.min(2,avail/st.pw)}else if(st.img){st.fit=Math.min(1,avail/st.img.naturalWidth,ah/st.img.naturalHeight);if(st.fit<.2)st.fit=Math.min(1,avail/st.img.naturalWidth)}
    st.scale=st.fit;apply(false)}
  function zoom(f){st.scale=Math.max(.25,Math.min(5,st.scale*f));apply(true)}
  function go(i){i=Math.max(1,Math.min(st.n,i));st.want=i;clearTimeout(st.wt);st.wt=setTimeout(function(){st.want=0},700);pi.value=i;var w=pagesEl.querySelector('.fvpage[data-p="'+i+'"]');if(w)scr.scrollTo({top:w.offsetTop-24,behavior:reduce?'auto':'smooth'})}
  scr.addEventListener('scroll',function(){if(st.kind!=='pdf')return;var mid=scr.scrollTop+scr.clientHeight*.35,c=1;[].forEach.call(pagesEl.querySelectorAll('.fvpage'),function(w){if(w.offsetTop<=mid)c=+w.dataset.p});
    if(c!==st.cur){st.cur=c;if(d.activeElement!==pi)pi.value=c;[].forEach.call(th.querySelectorAll('.fvtb'),function(t){t.classList.toggle('on',+t.dataset.p===c)});var a=th.querySelector('.fvtb.on');if(a&&a.scrollIntoView)a.scrollIntoView({block:'nearest'})}},{passive:true});
  pi.addEventListener('change',function(){go(parseInt(pi.value,10)||1)});
  th.addEventListener('click',function(e){var t=e.target.closest('.fvtb');if(t)go(+t.dataset.p)});
  // glisser pour déplacer une image agrandie
  var drag=null;scr.addEventListener('pointerdown',function(e){if(st.kind!=='img'||e.button)return;drag={x:e.clientX,y:e.clientY,l:scr.scrollLeft,t:scr.scrollTop};scr.classList.add('grab')});
  addEventListener('pointermove',function(e){if(!drag)return;scr.scrollLeft=drag.l-(e.clientX-drag.x);scr.scrollTop=drag.t-(e.clientY-drag.y)});
  addEventListener('pointerup',function(){drag=null;scr.classList.remove('grab')});
  scr.addEventListener('dblclick',function(){if(st.kind==='img'){if(Math.abs(st.scale-st.fit)<.01)zoom(2/st.scale||2);else fitW()}});
  scr.addEventListener('wheel',function(e){if(e.ctrlKey){e.preventDefault();zoom(e.deltaY<0?1.1:1/1.1)}},{passive:false});
  function close(){if(!root.classList.contains('on'))return;root.classList.remove('in');H.classList.remove('fv-open');st.tok++;
    setTimeout(function(){root.classList.remove('on','max');root.setAttribute('aria-hidden','true');pagesEl.innerHTML='';th.innerHTML='';if(st.pdf){st.pdf.destroy();st.pdf=null}st.img=null},reduce?0:260);
    if(last&&last.focus)last.focus()}
  root.addEventListener('click',function(e){if(e.target===root)return close();var a=e.target.closest('[data-a]');if(!a)return;var k=a.dataset.a;
    if(k==='close')close();else if(k==='prev')go((st.want||st.cur)-1);else if(k==='next')go((st.want||st.cur)+1);else if(k==='in')zoom(1.2);else if(k==='out')zoom(1/1.2);else if(k==='fit')fitW();
    else if(k==='max'){root.classList.toggle('max');setTimeout(fitW,320)}else if(k==='side'){root.classList.toggle('side');setTimeout(fitW,320)}});
  addEventListener('keydown',function(e){if(!root.classList.contains('on'))return;if(e.target===pi&&e.key!=='Escape')return;
    if(e.key==='Escape'){e.preventDefault();e.stopPropagation();close()}else if(e.key==='ArrowRight'||e.key==='PageDown'){e.preventDefault();go((st.want||st.cur)+1)}else if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();go((st.want||st.cur)-1)}
    else if(e.key==='+'||e.key==='='){e.preventDefault();zoom(1.2)}else if(e.key==='-'){e.preventDefault();zoom(1/1.2)}else if(e.key==='0'){e.preventDefault();fitW()}},true);
  var rt;addEventListener('resize',function(){if(!root.classList.contains('on'))return;clearTimeout(rt);rt=setTimeout(fitW,150)});
  window.FV={open:open,close:close};
})();
