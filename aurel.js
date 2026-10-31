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
