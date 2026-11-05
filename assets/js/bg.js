/* ===== Fond animé « réseau » ===== */
(function(){
  var d=document,H=d.documentElement,reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
  var cur='reseau';
  var cv=d.createElement('canvas');cv.className='bgfx';d.body.insertBefore(cv,d.body.firstChild);
  var x=cv.getContext('2d'),W=0,Hh=0,dpr=1,mx=-999,my=-999,col='255,92,122',light=false,t0=performance.now(),raf=0,nodes=[],traces=[];
  function rgb(){var v=getComputedStyle(d.body).getPropertyValue('--a').trim(),m=v.match(/^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i);if(m)col=[1,2,3].map(function(i){return parseInt(m[i],16)}).join(',');light=H.dataset.mode==='light'}
  function size(){dpr=Math.min(2,devicePixelRatio||1);W=innerWidth;Hh=innerHeight;cv.width=W*dpr;cv.height=Hh*dpr;cv.style.width=W+'px';cv.style.height=Hh+'px';x.setTransform(dpr,0,0,dpr,0,0);seed()}
  function seed(){nodes=[];var n=Math.round(W*Hh/16000);for(var i=0;i<n;i++)nodes.push({x:Math.random()*W,y:Math.random()*Hh*1.6,vx:(Math.random()-.5)*.18,vy:(Math.random()-.5)*.18});
    traces=[];var g=48,ny=Math.ceil(Hh*2/g);for(var j=0;j<ny;j++){if(Math.random()<.22)traces.push({h:1,k:j*g,s:Math.random()*W,v:.6+Math.random()*1.2,l:60+Math.random()*160})}
    for(var c=0;c<Math.ceil(W/g);c++){if(Math.random()<.14)traces.push({h:0,k:c*g,s:Math.random()*Hh*2,v:.5+Math.random(),l:60+Math.random()*140})}}
  function heroFade(y){var h=d.querySelector('.grid-bg');if(!h)return 1;var b=h.getBoundingClientRect().bottom;return Math.max(0,Math.min(1,(y-b)/160))}
  var hb=0;
  function A(a){return 'rgba('+col+','+(light?a*1.15:a)+')'}
  function draw(now){var t=(now-t0)/1000,sy=scrollY;x.clearRect(0,0,W,Hh);var hEl=d.querySelector('.grid-bg');hb=hEl?hEl.getBoundingClientRect().bottom:-1;
    function f(y){return Math.max(0,Math.min(1,(y-hb)/160))}
    if(cur==='reseau'){var off=sy*.25%(Hh*1.6);
      for(var i=0;i<nodes.length;i++){var n=nodes[i];if(!reduce){n.x+=n.vx;n.y+=n.vy;if(n.x<0||n.x>W)n.vx*=-1;if(n.y<0||n.y>Hh*1.6)n.vy*=-1}}
      var P=nodes.map(function(n){var y=n.y-off;if(y<-40)y+=Hh*1.6;return [n.x,y]});
      for(i=0;i<P.length;i++){var p=P[i],fi=f(p[1]);if(!fi)continue;
        for(var j=i+1;j<P.length;j++){var q=P[j],dx=p[0]-q[0],dy=p[1]-q[1],dd=dx*dx+dy*dy;if(dd<17000){x.strokeStyle=A((1-dd/17000)*.16*fi);x.lineWidth=1;x.beginPath();x.moveTo(p[0],p[1]);x.lineTo(q[0],q[1]);x.stroke()}}
        var md=(p[0]-mx)*(p[0]-mx)+(p[1]-my)*(p[1]-my);
        if(md<36000){x.strokeStyle=A((1-md/36000)*.45*fi);x.beginPath();x.moveTo(p[0],p[1]);x.lineTo(mx,my);x.stroke()}
        x.fillStyle=A((md<36000?.7:.32)*fi);x.beginPath();x.arc(p[0],p[1],md<36000?2.4:1.6,0,7);x.fill()}
    }
    if(!reduce&&cur!=='none'&&cur!=='aurore'&&!d.hidden)raf=requestAnimationFrame(draw)}
  function start(){cancelAnimationFrame(raf);rgb();H.dataset.bg=cur;x.clearRect(0,0,W,Hh);if(cur!=='none'&&cur!=='aurore')raf=requestAnimationFrame(draw)}
  addEventListener('resize',function(){size();start()});
  addEventListener('pointermove',function(e){mx=e.clientX;my=e.clientY;if(reduce&&cur!=='none')requestAnimationFrame(draw)},{passive:true});
  d.addEventListener('pointerleave',function(){mx=my=-999});
  if(reduce)addEventListener('scroll',function(){if(cur!=='none')requestAnimationFrame(draw)},{passive:true});
  d.addEventListener('visibilitychange',function(){if(!d.hidden)start()});
  d.addEventListener('modechange',start);
  size();start();
  // orbites « Nuit éditoriale » : 3 ronds placés en milieu de page sur certaines pages
  var page=(location.pathname.split('/').pop()||'index.html').replace(/\?.*$/,'');
  var SPOTS={'index.html':['#competences',0,'r'],'stage-oci.html':['.pw',2,'l'],'projets.html':['.panel.on .sae-list > *',5,'l'],'sae304.html':['.pw',3,'r'],'sae4portfolio.html':['.pw',2,'l'],'stage-projet-mfa.html':['.pw',5,'r']};
  var sp=SPOTS[page];
  if(sp){var host=d.createElement('div');host.className='orbits';d.body.insertBefore(host,cv.nextSibling);
    var o=d.createElement('div');o.className='orb '+sp[2];
    o.innerHTML='<svg viewBox="0 0 560 560" aria-hidden="true"><g class="spin"><circle cx="280" cy="280" r="270" class="c1"/><circle cx="280" cy="280" r="200" class="c2"/><circle cx="280" cy="280" r="130" class="c3"/><circle cx="550" cy="280" r="6" class="p1"/><circle cx="280" cy="80" r="4" class="p2"/></g><g class="spin2"><circle cx="280" cy="150" r="3" class="p2"/></g></svg>';
    host.appendChild(o);
    function place(){var L=d.querySelectorAll(sp[0]),el=L[Math.min(sp[1],L.length-1)];if(!el)return;
      host.style.height=d.documentElement.scrollHeight+'px';var r=el.getBoundingClientRect();o.style.top=(r.top+scrollY-60)+'px'}
    place();addEventListener('resize',place);addEventListener('load',place);setTimeout(place,800);
    if(!reduce){addEventListener('scroll',function(){var r=o.getBoundingClientRect(),k=(innerHeight/2-(r.top+r.height/2))/innerHeight;o.style.setProperty('--ty',(k*60)+'px');o.style.setProperty('--rz',(k*25)+'deg')},{passive:true})}
  }
})();
