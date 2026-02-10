// Lightbox — click-to-zoom for images and Mermaid diagrams
(function () {
  'use strict';

  var overlay = null;

  function createOverlay() {
    overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML =
      '<button class="lightbox-close" aria-label="Close">&times;</button>' +
      '<div class="lightbox-stage"></div>' +
      '<div class="lightbox-caption"></div>';
    document.body.appendChild(overlay);

    overlay.addEventListener('click', function (e) {
      // Close when clicking overlay background or close button, not the content
      if (e.target === overlay || e.target.classList.contains('lightbox-close')) {
        close();
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('active')) close();
    });
  }

  function openImage(img) {
    if (!overlay) createOverlay();
    var stage = overlay.querySelector('.lightbox-stage');
    stage.innerHTML = '';

    var clone = document.createElement('img');
    clone.src = img.src;
    clone.alt = img.alt || '';
    clone.className = 'lightbox-content';
    stage.appendChild(clone);

    overlay.querySelector('.lightbox-caption').textContent = img.alt || '';
    show();
  }

  function openMermaid(container) {
    if (!overlay) createOverlay();
    var stage = overlay.querySelector('.lightbox-stage');
    stage.innerHTML = '';

    // Clone the entire mermaid container to preserve styles
    var wrapper = document.createElement('div');
    wrapper.className = 'lightbox-mermaid';
    wrapper.innerHTML = container.innerHTML;
    stage.appendChild(wrapper);

    // Caption from the next sibling .diagram-caption
    var cap = container.nextElementSibling;
    var caption = (cap && cap.classList.contains('diagram-caption')) ? cap.textContent : '';
    overlay.querySelector('.lightbox-caption').textContent = caption;
    show();
  }

  function show() {
    document.body.style.overflow = 'hidden';
    overlay.style.display = 'flex';
    // Force reflow before adding active class for transition
    overlay.offsetHeight;
    overlay.classList.add('active');
  }

  function close() {
    if (!overlay) return;
    overlay.classList.remove('active');
    setTimeout(function () {
      overlay.style.display = 'none';
      document.body.style.overflow = '';
    }, 300);
  }

  function attach() {
    // Images in post body
    document.querySelectorAll('.post-body img').forEach(function (img) {
      if (img.dataset.lightbox) return; // already attached
      img.dataset.lightbox = '1';
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        openImage(img);
      });
    });

    // Mermaid containers — attach to the div, not the SVG
    document.querySelectorAll('.mermaid').forEach(function (container) {
      if (container.dataset.lightbox) return;
      // Only attach if Mermaid has rendered an SVG inside
      if (!container.querySelector('svg')) return;
      container.dataset.lightbox = '1';
      container.style.cursor = 'zoom-in';
      container.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        openMermaid(container);
      });
    });
  }

  // Mermaid renders async — use MutationObserver + fallback timeout
  function init() {
    // Initial attach for anything already rendered
    attach();

    // Watch for Mermaid SVGs being inserted
    var obs = new MutationObserver(function () {
      attach();
    });
    var body = document.querySelector('.post-body');
    if (body) {
      obs.observe(body, { childList: true, subtree: true });
    }

    // Fallback: re-attach after Mermaid likely finishes
    setTimeout(attach, 1000);
    setTimeout(attach, 2500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
