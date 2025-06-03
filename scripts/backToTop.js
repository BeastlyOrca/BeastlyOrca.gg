document.addEventListener('DOMContentLoaded', () => {
  const backToTopBtn = document.getElementById('backToTop');

  // Initially hidden (CSS handles opacity)
  backToTopBtn.classList.remove('visible');

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });
});
