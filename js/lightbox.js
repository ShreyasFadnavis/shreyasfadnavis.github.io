// Lightbox — click-to-zoom for images and Mermaid diagrams
(function () {
  'use strict';

  var overlay = null;

  function createOverlay() {
    overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML =
      '<button class="lightbox-close" aria-label="Close">&times;</button>' +
      '<div class="lightbox-caption"></div>';
    document.body.appendChild(overlay);

    overlay.addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('active')) close();
    });
  }

  function open(el) {
    if (!overlay) createOverlay();

    // Remove any previous content (except close button and caption)
    var prev = overlay.querySelector('.lightbox-content');
    if (prev) prev.remove();

    var clone;
    if (el.tagName === 'IMG') {
      clone = document.createElement('img');
      clone.src = el.src;
      clone.alt = el.alt || '';
    } else {
      // SVG (Mermaid diagram)
      clone = el.cloneNode(true);
      clone.style.maxWidth = '90vw';
      clone.style.maxHeight = '90vh';
    }
    clone.className = 'lightbox-content';
    overlay.insertBefore(clone, overlay.querySelector('.lightbox-caption'));

    // Caption from alt text, or nearest .diagram-caption
    var caption = '';
    if (el.alt) {
      caption = el.alt;
    } else {
      var parent = el.closest('.mermaid');
      if (parent) {
        var cap = parent.nextElementSibling;
        if (cap && cap.classList.contains('diagram-caption')) {
          caption = cap.textContent;
        }
      }
    }
    overlay.querySelector('.lightbox-caption').textContent = caption;

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // Show with animation
    overlay.style.display = 'flex';
    requestAnimationFrame(function () {
      overlay.classList.add('active');
    });
  }

  function close() {
    if (!overlay) return;
    overlay.classList.remove('active');
    setTimeout(function () {
      overlay.style.display = 'none';
      document.body.style.overflow = '';
    }, 300);
  }

  // Attach handlers after DOM + Mermaid render
  function attach() {
    // Images in post body
    document.querySelectorAll('.post-body img').forEach(function (img) {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', function (e) {
        e.stopPropagation();
        open(img);
      });
    });

    // Mermaid SVGs
    document.querySelectorAll('.mermaid svg').forEach(function (svg) {
      svg.style.cursor = 'zoom-in';
      svg.addEventListener('click', function (e) {
        e.stopPropagation();
        open(svg);
      });
    });
  }

  // Wait for Mermaid to render (it's async)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(attach, 500);
    });
  } else {
    setTimeout(attach, 500);
  }
})();
