// 41 Labs scripts
(function(){
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.getElementById('nav-menu');

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

  const noticeDate = document.getElementById('notice-date');
  if(noticeDate){
    const now = new Date();
    const month = now.toLocaleString('default', {month: 'long'});
    noticeDate.textContent = `${month} ${now.getFullYear()}`;
    const notice = noticeDate.parentElement;
    document.documentElement.style.setProperty('--notice-height', notice.offsetHeight + 'px');
  }
})();
