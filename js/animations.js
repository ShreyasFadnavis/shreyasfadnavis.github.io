// Scroll-triggered reveal animations
(function() {
  'use strict';

  var revealElements = document.querySelectorAll(
    '.track, .strip-card, .notes-column, .links-category, .link-card-v2'
  );

  if (!revealElements.length) return;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(function(el) {
    el.classList.add('reveal-target');
    observer.observe(el);
  });
})();
