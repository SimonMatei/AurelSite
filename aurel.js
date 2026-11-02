const menuButton=document.querySelector('.menu-button');const mobileNav=document.querySelector('.mobile-nav');menuButton.addEventListener('click',()=>{const open=mobileNav.classList.toggle('open');document.body.classList.toggle('menu-open',open);menuButton.classList.toggle('open',open);menuButton.setAttribute('aria-expanded',String(open));mobileNav.setAttribute('aria-hidden',String(!open));document.body.style.overflow=open?'hidden':''});document.querySelectorAll('.mobile-nav a').forEach(a=>a.addEventListener('click',()=>{mobileNav.classList.remove('open');document.body.classList.remove('menu-open');menuButton.classList.remove('open');menuButton.setAttribute('aria-expanded','false');mobileNav.setAttribute('aria-hidden','true');document.body.style.overflow=''}));

document.querySelectorAll('.service-toggle').forEach(toggle=>{toggle.addEventListener('click',()=>{const item=toggle.closest('.service-item');const wasOpen=item.classList.contains('open');document.querySelectorAll('.service-item').forEach(other=>other.classList.remove('open'));if(!wasOpen)item.classList.add('open')})});

document.querySelectorAll('.portfolio-toggle').forEach(toggle=>{toggle.addEventListener('click',()=>{const portfolio=toggle.closest('.portfolio');const wasOpen=portfolio.classList.contains('open');document.querySelectorAll('.portfolio').forEach(item=>item.classList.remove('open'));if(!wasOpen)portfolio.classList.add('open')})});
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(item=>observer.observe(item));document.getElementById('year').textContent=new Date().getFullYear();

document.querySelectorAll('.copy-btn').forEach(btn=>{const label=btn.textContent;btn.addEventListener('click',async()=>{
  const text=btn.dataset.copy;
  try{await navigator.clipboard.writeText(text)}catch{const field=document.createElement('textarea');field.value=text;document.body.appendChild(field);field.select();document.execCommand('copy');field.remove()}
  const box=btn.closest('.cx-direct, .contact-option');const msg=box&&box.querySelector('.copy-message');
  if(msg)msg.textContent=btn.dataset.done;btn.textContent='Copiato ✓';
  setTimeout(()=>{if(msg)msg.textContent='';btn.textContent=label},2500);
})});

// Modulo contatti rimosso: i contatti avvengono via telefono, WhatsApp ed email.
// Telefono: header con sfondo dopo lo scroll
const header=document.querySelector('.header');
const onScroll=()=>{header.classList.toggle('scrolled',window.scrollY>40)};
window.addEventListener('scroll',onScroll,{passive:true});onScroll();

// Richiesta preventivo: compone un messaggio WhatsApp o email, il sito non salva nulla
const quoteForm=document.getElementById('quote-form');
if(quoteForm){quoteForm.addEventListener('submit',event=>{
  event.preventDefault();
  if(!quoteForm.reportValidity())return;
  const f=quoteForm.elements;
  const via=(event.submitter&&event.submitter.dataset.via)||'wa';
  const nome=f.nome.value.trim(),zona=f.zona.value.trim();
  const lines=['Ciao Aurel, vorrei richiedere un preventivo.','','Nome: '+nome];
  if(zona)lines.push('Zona: '+zona);
  lines.push('Lavoro: '+f.tipo.value,'','Descrizione: '+f.messaggio.value.trim());
  const text=lines.join('\n');
  if(via==='mail'){
    location.href='mailto:info@aurelristrutturazioni.it?subject='+encodeURIComponent('Richiesta preventivo – '+nome)+'&body='+encodeURIComponent(text);
  }else{
    const url='https://wa.me/393290236658?text='+encodeURIComponent(text);
    const win=window.open(url,'_blank');
    if(win){win.opener=null}else{location.href=url}
  }
})}

// Visualizzatore foto con zoom (Lavori)
(()=>{
  const lb=document.getElementById('lightbox');if(!lb)return;
  const stage=lb.querySelector('.lb-stage'),img=lb.querySelector('.lb-img');
  const cap=lb.querySelector('.lb-caption'),count=lb.querySelector('.lb-count'),hint=lb.querySelector('.lb-hint');
  let list=[],idx=0,scale=1,tx=0,ty=0,lastFocus=null,busy=false;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pts=new Map();let start=null,pinch=null,lastTap=0;
  const MAX=4;
  const apply=()=>{img.style.transform='translate('+tx+'px,'+ty+'px) scale('+scale+')';lb.classList.toggle('zoomed',scale>1.01)};
  const dims=()=>{const r=stage.getBoundingClientRect();const nw=img.naturalWidth||1,nh=img.naturalHeight||1;const k=Math.min(r.width/nw,r.height/nh);return{r,w:nw*k,h:nh*k}};
  const clamp=()=>{const d=dims();const mx=Math.max(0,(d.w*scale-d.r.width)/2),my=Math.max(0,(d.h*scale-d.r.height)/2);tx=Math.min(mx,Math.max(-mx,tx));ty=Math.min(my,Math.max(-my,ty))};
  const zoomAt=(ns,cx,cy)=>{ns=Math.min(MAX,Math.max(1,ns));const r=stage.getBoundingClientRect();const px=cx-(r.left+r.width/2),py=cy-(r.top+r.height/2);tx=px-(px-tx)*(ns/scale);ty=py-(py-ty)*(ns/scale);scale=ns;if(scale<=1.01){scale=1;tx=0;ty=0}clamp();apply()};
  const reset=()=>{scale=1;tx=0;ty=0;apply()};
  const show=i=>{idx=(i+list.length)%list.length;const f=list[idx],im=f.querySelector('img'),c=f.querySelector('figcaption');
    img.src=im.currentSrc||im.src;img.alt=im.alt||'';cap.textContent=c?c.textContent:'';count.textContent=(idx+1)+' / '+list.length;
    lb.classList.toggle('single',list.length<2);img.style.opacity='1';reset();
    [idx-1,idx+1].forEach(k=>{const n=list[(k+list.length)%list.length];if(n){const p=new Image();const s=n.querySelector('img');p.src=s.currentSrc||s.src}})};
  const anim=(on)=>img.classList.toggle('lb-anim',on);
  const go=(dir)=>{if(busy||list.length<2)return;if(reduce){show(idx+dir);return}busy=true;
    const w=stage.clientWidth;anim(true);img.style.transform='translate('+(-dir*w*0.6)+'px,0)';img.style.opacity='0';
    setTimeout(()=>{anim(false);show(idx+dir);img.style.transform='translate('+(dir*w*0.35)+'px,0)';img.style.opacity='0';
      const enter=()=>requestAnimationFrame(()=>requestAnimationFrame(()=>{anim(true);img.style.transform='translate(0px,0px) scale(1)';img.style.opacity='1';setTimeout(()=>{anim(false);busy=false},320)}));
      (img.decode?img.decode():Promise.resolve()).catch(()=>{}).then(enter)},230)};
  const snapBack=()=>{anim(true);img.style.opacity='1';apply();setTimeout(()=>anim(false),320)};
  const open=(fig)=>{list=[...fig.closest('.portfolio-track').querySelectorAll('figure')];lastFocus=document.activeElement;
    lb.hidden=false;document.body.classList.add('lb-open');show(list.indexOf(fig));lb.querySelector('.lb-close').focus()};
  const close=()=>{lb.hidden=true;document.body.classList.remove('lb-open');img.removeAttribute('src');if(lastFocus)lastFocus.focus()};
  document.querySelectorAll('.portfolio-track figure').forEach(fig=>{
    const im=fig.querySelector('img');fig.tabIndex=0;fig.setAttribute('role','button');fig.setAttribute('aria-label','Ingrandisci: '+(im&&im.alt?im.alt:'foto'));
    fig.addEventListener('click',()=>open(fig));
    fig.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open(fig)}});
  });
  lb.querySelector('.lb-close').addEventListener('click',close);
  lb.querySelector('.lb-prev').addEventListener('click',()=>go(-1));
  lb.querySelector('.lb-next').addEventListener('click',()=>go(1));
  document.addEventListener('keydown',e=>{if(lb.hidden)return;
    if(e.key==='Escape')close();else if(e.key==='ArrowLeft')go(-1);else if(e.key==='ArrowRight')go(1);
    else if(e.key==='+'||e.key==='='){const r=stage.getBoundingClientRect();zoomAt(scale*1.4,r.left+r.width/2,r.top+r.height/2)}
    else if(e.key==='-'){const r=stage.getBoundingClientRect();zoomAt(scale/1.4,r.left+r.width/2,r.top+r.height/2)}
    else if(e.key==='Tab'){const f=[...lb.querySelectorAll('button')].filter(b=>b.offsetParent);const a=f.indexOf(document.activeElement);
      if(e.shiftKey&&a<=0){e.preventDefault();f[f.length-1].focus()}else if(!e.shiftKey&&a===f.length-1){e.preventDefault();f[0].focus()}}});
  stage.addEventListener('wheel',e=>{e.preventDefault();zoomAt(scale*Math.exp(-e.deltaY*0.0022),e.clientX,e.clientY)},{passive:false});
  stage.addEventListener('dblclick',e=>{zoomAt(scale>1.01?1:2.5,e.clientX,e.clientY)});
  stage.addEventListener('pointerdown',e=>{if(busy)return;stage.setPointerCapture(e.pointerId);pts.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(pts.size===1){start={x:e.clientX,y:e.clientY,tx,ty,t:Date.now()};
      if(e.pointerType==='touch'){const now=Date.now();if(now-lastTap<300){zoomAt(scale>1.01?1:2.5,e.clientX,e.clientY);lastTap=0;start=null}else lastTap=now}}
    else if(pts.size===2){const [a,b]=[...pts.values()];pinch={d:Math.hypot(a.x-b.x,a.y-b.y),s:scale};start=null}});
  stage.addEventListener('pointermove',e=>{if(!pts.has(e.pointerId))return;pts.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(pts.size===2&&pinch){const [a,b]=[...pts.values()];const d=Math.hypot(a.x-b.x,a.y-b.y);zoomAt(pinch.s*d/pinch.d,(a.x+b.x)/2,(a.y+b.y)/2)}
    else if(pts.size===1&&start&&scale>1.01){tx=start.tx+(e.clientX-start.x);ty=start.ty+(e.clientY-start.y);clamp();apply()}
    else if(pts.size===1&&start&&!busy){const dx=e.clientX-start.x,dy=e.clientY-start.y;if(Math.abs(dx)>=Math.abs(dy)){img.style.transform='translate('+dx+'px,0)';img.style.opacity=String(Math.max(.35,1-Math.abs(dx)/(stage.clientWidth*1.2)))}else if(dy>0){img.style.transform='translate(0,'+dy*0.6+'px)';img.style.opacity=String(Math.max(.4,1-dy/600))}}});
  const end=e=>{if(!pts.has(e.pointerId))return;pts.delete(e.pointerId);if(pts.size<2)pinch=null;
    if(pts.size===0&&start&&scale<=1.01){const dx=e.clientX-start.x,dy=e.clientY-start.y;
      const v=Math.abs(dx)/Math.max(1,Date.now()-start.t);
      if((Math.abs(dx)>70||(v>0.45&&Math.abs(dx)>25))&&Math.abs(dx)>Math.abs(dy)&&list.length>1){go(dx<0?1:-1)}else if(dy>110&&Math.abs(dy)>Math.abs(dx)){close()}else snapBack()}
    if(pts.size===0)start=null};
  stage.addEventListener('pointerup',end);stage.addEventListener('pointercancel',end);
  window.addEventListener('resize',()=>{if(!lb.hidden){clamp();apply()}});
  if(matchMedia('(hover:hover) and (pointer:fine)').matches)hint.textContent='Doppio clic o rotellina per lo zoom · frecce per scorrere';
})();
