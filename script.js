// 41 Labs scripts
(function(){
  const root = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  // Theme handling
  function setTheme(mode){
    root.setAttribute('data-theme', mode);
    localStorage.setItem('theme', mode);
  }
  const savedTheme = localStorage.getItem('theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  setTheme(savedTheme || (prefersLight ? 'light' : 'dark'));
  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  });

  // Mobile nav
  navToggle.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
    if(open){ navMenu.querySelector('a, button').focus(); }
  });
  function trapFocus(e){
    if(!navMenu.classList.contains('open')) return;
    const focusables = navMenu.querySelectorAll('a, button');
    const first = focusables[0];
    const last = focusables[focusables.length-1];
    if(e.key === 'Tab'){
      if(e.shiftKey && document.activeElement === first){e.preventDefault(); last.focus();}
      else if(!e.shiftKey && document.activeElement === last){e.preventDefault(); first.focus();}
    }
    if(e.key === 'Escape'){
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', false);
      navToggle.focus();
    }
  }
  document.addEventListener('keydown', trapFocus);

  // Smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');
      if(id.length > 1){
        const target = document.querySelector(id);
        if(target){
          e.preventDefault();
          const opts = {behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'};
          target.scrollIntoView(opts);
          navMenu.classList.remove('open');
          navToggle.setAttribute('aria-expanded', false);
        }
      }
    });
  });

  // Contact form
  contactForm.addEventListener('submit', async e => {
    e.preventDefault();
    formStatus.textContent = '';
    if(!contactForm.reportValidity()) return;
    const endpoint = contactForm.getAttribute('action');
    if(endpoint.includes('your-id')){
      formStatus.textContent = 'Form endpoint not configured. Please email us.';
      formStatus.style.color = '#F4A300';
      return;
    }
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept':'application/json' }
      });
      if(res.ok){
        formStatus.textContent = 'Thanks! We will be in touch.';
        contactForm.reset();
      } else {
        formStatus.textContent = 'Submission failed. Please email us.';
      }
    } catch(err){
      formStatus.textContent = 'Network error. Please try again later.';
    }
  });

  // Fade-in observer
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:0.2});
  document.querySelectorAll('.fade').forEach(el => observer.observe(el));

  // Year in footer
  const year = document.getElementById('year');
  if(year) year.textContent = new Date().getFullYear();
})();
