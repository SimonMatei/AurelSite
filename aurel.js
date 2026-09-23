const menuButton = document.querySelector('.menu-button');
const mobileNav = document.querySelector('.mobile-nav');

menuButton.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  menuButton.classList.toggle('open', isOpen);
  menuButton.setAttribute('aria-expanded', String(isOpen));
  mobileNav.setAttribute('aria-hidden', String(!isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

document.querySelectorAll('.mobile-nav a').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    menuButton.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  });
});

const services = document.querySelectorAll('.service');
const servicePhoto = document.getElementById('service-photo');
services.forEach(service => {
  service.addEventListener('click', () => {
    services.forEach(item => item.classList.remove('active'));
    service.classList.add('active');
    servicePhoto.style.opacity = '0';
    servicePhoto.style.transform = 'scale(1.04)';
    window.setTimeout(() => {
      servicePhoto.src = service.dataset.image;
      servicePhoto.style.opacity = '1';
      servicePhoto.style.transform = 'scale(1)';
    }, 200);
  });
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

document.getElementById('year').textContent = new Date().getFullYear();

document.getElementById('contact-form').addEventListener('submit', event => {
  event.preventDefault();
  document.getElementById('form-message').textContent = 'Grazie! Il modulo è pronto graficamente: collegalo a Formspree, email o WhatsApp per ricevere le richieste.';
  event.currentTarget.reset();
});
