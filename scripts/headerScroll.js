let lastScrollTop = 0;

window.addEventListener('scroll', function() {
  let st = window.pageYOffset || document.documentElement.scrollTop;

  if (st > lastScrollTop) {
    // Scrolling down
    document.querySelector('.header').classList.add('hidden');
  } else {
    // Scrolling up
    document.querySelector('.header').classList.remove('hidden');
  }

  lastScrollTop = st <= 0 ? 0 : st;
});