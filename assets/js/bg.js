/* ===== Fonds animés (propositions à valider) ===== */
(function(){
  var d=document,H=d.documentElement,reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
  var OPTS=[['none','actuel','current'],['reseau','réseau','network'],['points','points','dots'],['paquets','paquets','packets'],['aurore','aurore','aurora']];
  var cur;try{cur=new URLSearchParams(location.search).get('bg')||localStorage.getItem('portfolio-bg')}catch(e){}
  if(!OPTS.some(function(o){return o[0]===cur}))cur='none';
  var cv=d.createElement('canvas');cv.className='bgfx';d.body.insertBefore(cv,d.body.firstChild);
  var au=d.createElement('div');au.className='bgau';au.innerHTML='<i></i><i></i><i></i>';d.body.insertBefore(au,d.body.firstChild);
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
    }else if(cur==='points'){var g=32,oy=-(sy%g);
      for(var yy=oy;yy<Hh+g;yy+=g){var fy=f(yy);if(!fy)continue;for(var xx=g/2;xx<W;xx+=g){
        var dx2=xx-mx,dy2=yy-my,dm=Math.sqrt(dx2*dx2+dy2*dy2),near=Math.max(0,1-dm/190),
        wave=reduce?0:Math.max(0,Math.sin((xx*.6+(yy+sy)*.8)/90-t*1.1))**8*.5;
        var a=.07+near*.6+wave*.25,r=1+near*2.2+wave*.8;
        if(near>0&&dm>1){xx+=0}
        x.fillStyle=A(a*fy);x.beginPath();x.arc(xx-dx2/dm*near*6||xx,yy-dy2/dm*near*6||yy,r,0,7);x.fill()}}
    }else if(cur==='paquets'){var g2=48,oy2=-(sy*.5%(Hh*2));
      x.lineWidth=1;traces.forEach(function(tr){var L=tr.h?W:Hh*2,pos=(tr.s+(reduce?0:t*tr.v*60))%(L+tr.l);
        if(tr.h){var yv=tr.k+oy2;if(yv<0)yv+=Hh*2;if(yv>Hh)return;var fv=f(yv);if(!fv)return;
          x.strokeStyle=A(.05*fv);x.beginPath();x.moveTo(0,yv+.5);x.lineTo(W,yv+.5);x.stroke();
          var gr=x.createLinearGradient(pos-tr.l,0,pos,0);gr.addColorStop(0,A(0));gr.addColorStop(1,A(.55*fv));x.strokeStyle=gr;x.lineWidth=1.6;x.beginPath();x.moveTo(pos-tr.l,yv+.5);x.lineTo(pos,yv+.5);x.stroke();x.lineWidth=1;
          x.fillStyle=A(.8*fv);x.fillRect(pos-1.5,yv-1,3,3)}
        else{var xv=tr.k+.5,y1=pos+oy2,y0=y1-tr.l;[0,Hh*2].forEach(function(sh){var a1=y1+sh,a0=y0+sh;if(a1<0||a0>Hh)return;
          x.strokeStyle=A(.05);x.beginPath();x.moveTo(xv,Math.max(hb,0));x.lineTo(xv,Hh);x.stroke();
          var top=Math.max(a0,hb);if(a1<=top)return;var gr2=x.createLinearGradient(0,a0,0,a1);gr2.addColorStop(0,A(0));gr2.addColorStop(1,A(.5*f(a1)));x.strokeStyle=gr2;x.lineWidth=1.6;x.beginPath();x.moveTo(xv,top);x.lineTo(xv,a1);x.stroke();x.lineWidth=1;x.fillStyle=A(.8*f(a1));x.fillRect(xv-1.5,a1-1.5,3,3)})}});
      // nœuds aux croisements proches du curseur
      if(mx>0){for(var i3=-3;i3<=3;i3++)for(var j3=-3;j3<=3;j3++){var nx=Math.round(mx/g2+i3)*g2+.5,ny2=Math.round((my-oy2)/g2+j3)*g2+oy2+.5,dn=Math.hypot(nx-mx,ny2-my),k=Math.max(0,1-dn/150);if(k>0&&f(ny2)){x.strokeStyle=A(.5*k*f(ny2));x.strokeRect(nx-3,ny2-3,6,6)}}}
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
  // sélecteur temporaire (à retirer après choix)
  var bp=d.createElement('div');bp.className='bgp';
  bp.innerHTML='<span><span lang="fr">fond</span><span lang="en">background</span> <em>(test)</em></span>'+OPTS.map(function(o){return '<b data-v="'+o[0]+'"><span lang="fr">'+o[1]+'</span><span lang="en">'+o[2]+'</span></b>'}).join('');
  d.body.appendChild(bp);
  function mark(){[].forEach.call(bp.querySelectorAll('b'),function(b){b.classList.toggle('on',b.dataset.v===cur)})}mark();
  bp.addEventListener('click',function(e){var b=e.target.closest('b');if(!b)return;cur=b.dataset.v;try{localStorage.setItem('portfolio-bg',cur)}catch(e){}mark();start()});
})();
