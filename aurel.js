const menuButton=document.querySelector('.menu-button');const mobileNav=document.querySelector('.mobile-nav');menuButton.addEventListener('click',()=>{const open=mobileNav.classList.toggle('open');document.body.classList.toggle('menu-open',open);menuButton.classList.toggle('open',open);menuButton.setAttribute('aria-expanded',String(open));mobileNav.setAttribute('aria-hidden',String(!open));document.body.style.overflow=open?'hidden':''});document.querySelectorAll('.mobile-nav a').forEach(a=>a.addEventListener('click',()=>{mobileNav.classList.remove('open');document.body.classList.remove('menu-open');menuButton.classList.remove('open');menuButton.setAttribute('aria-expanded','false');mobileNav.setAttribute('aria-hidden','true');document.body.style.overflow=''}));

document.querySelectorAll('.service-toggle').forEach(toggle=>{toggle.addEventListener('click',()=>{const item=toggle.closest('.service-item');const wasOpen=item.classList.contains('open');document.querySelectorAll('.service-item').forEach(other=>other.classList.remove('open'));if(!wasOpen)item.classList.add('open')})});
const servicePhoto=document.getElementById('service-photo');document.querySelectorAll('.service-detail').forEach(detail=>{detail.addEventListener('click',()=>{document.querySelectorAll('.service-detail').forEach(item=>item.classList.remove('active'));detail.classList.add('active');servicePhoto.style.opacity='0';servicePhoto.style.transform='scale(1.04)';setTimeout(()=>{servicePhoto.src=detail.dataset.image;servicePhoto.style.opacity='1';servicePhoto.style.transform='scale(1)'},200)})});

document.querySelectorAll('.portfolio-toggle').forEach(toggle=>{toggle.addEventListener('click',()=>{const portfolio=toggle.closest('.portfolio');const wasOpen=portfolio.classList.contains('open');document.querySelectorAll('.portfolio').forEach(item=>item.classList.remove('open'));if(!wasOpen)portfolio.classList.add('open')})});
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(item=>observer.observe(item));document.getElementById('year').textContent=new Date().getFullYear();

document.querySelectorAll('.copy-btn').forEach(btn=>btn.addEventListener('click',async()=>{
  const text=btn.dataset.copy;
  try{await navigator.clipboard.writeText(text)}catch{const field=document.createElement('textarea');field.value=text;document.body.appendChild(field);field.select();document.execCommand('copy');field.remove()}
  const msg=btn.closest('.contact-option').querySelector('.copy-message');
  msg.textContent=btn.dataset.done;btn.textContent='COPIATO ✓';
  setTimeout(()=>{msg.textContent='';btn.textContent='COPIA'},2500);
}));

const contactForm=document.getElementById('contact-form');
const formMessage=document.getElementById('form-message');
contactForm.addEventListener('submit',async event=>{
  event.preventDefault();
  const form=event.currentTarget;
  const button=form.querySelector('button[type="submit"]');
  // Campo trappola: le persone non lo vedono, i bot lo compilano.
  if(form.elements._gotcha.value){form.reset();return}
  if(form.action.includes('IL_TUO_ID')){
    formMessage.textContent='Modulo non ancora collegato. Nel frattempo scrivici su WhatsApp o chiamaci.';
    return;
  }
  button.disabled=true;
  formMessage.textContent='Invio in corso…';
  try{
    const response=await fetch(form.action,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}});
    if(!response.ok)throw new Error(String(response.status));
    form.reset();
    formMessage.textContent='Grazie! Richiesta inviata, ti ricontatteremo al più presto.';
  }catch{
    formMessage.textContent='Invio non riuscito. Riprova tra poco oppure scrivici su WhatsApp.';
  }finally{
    button.disabled=false;
  }
});
// Telefono: header con sfondo dopo lo scroll e barra Chiama/WhatsApp
const header=document.querySelector('.header');
const quickBar=document.querySelector('.quick-bar');
const hero=document.querySelector('.hero');
const contact=document.getElementById('contatti');
let pastHero=false,contactVisible=false;
const updateQuickBar=()=>quickBar.classList.toggle('show',pastHero&&!contactVisible);
const onScroll=()=>{header.classList.toggle('scrolled',window.scrollY>40)};
window.addEventListener('scroll',onScroll,{passive:true});onScroll();
new IntersectionObserver(([e])=>{pastHero=!e.isIntersecting;updateQuickBar()},{threshold:.15}).observe(hero);
new IntersectionObserver(([e])=>{contactVisible=e.isIntersecting;updateQuickBar()},{threshold:0}).observe(contact);
