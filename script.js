// Humble Diamond Sisters Club of Nigeria — shared behaviour

/* =========================================================
   GALLERY AUTO-LOAD CONFIG
   The gallery page can automatically pull in every photo the
   club uploads to the "image2" folder on GitHub — no need to
   edit any HTML when new photos are added.

   EDIT THESE THREE LINES with your actual GitHub details:
   ========================================================= */
var GITHUB_OWNER  = 'calculiang';
var GITHUB_REPO   = 'hdsclub';
var GITHUB_BRANCH = 'main';
var GALLERY_FOLDER = 'image2';

document.addEventListener('DOMContentLoaded', function () {

  /* ---- mobile nav toggle ---- */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var isOpen = links.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- mark active nav link based on current file ---- */
  var current = (location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.nav-links a[href]').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ---- gallery lightbox (works for both the fallback photos and any auto-loaded ones) ---- */
  var lightbox = document.querySelector('.lightbox');
  function bindLightbox() {
    if (!lightbox) return;
    var lightboxImg = lightbox.querySelector('img');
    document.querySelectorAll('.gallery-item img').forEach(function (img) {
      img.addEventListener('click', function () {
        lightboxImg.setAttribute('src', img.getAttribute('src'));
        lightboxImg.setAttribute('alt', img.getAttribute('alt') || '');
        lightbox.classList.add('open');
      });
    });
  }
  if (lightbox) {
    var lightboxImg = lightbox.querySelector('img');
    var closeBtn = lightbox.querySelector('.close');
    function closeLightbox() { lightbox.classList.remove('open'); lightboxImg.setAttribute('src', ''); }
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLightbox();
    });
    bindLightbox();
  }

  /* ---- auto-load gallery photos from the image2 folder on GitHub ----
     If the club has uploaded new photos directly to that folder on GitHub,
     this replaces the sample photos below with the live folder contents.
     If it can't reach GitHub (e.g. placeholders not filled in yet, or
     offline), the sample photos already in the HTML stay exactly as they
     are — nothing breaks. */
  var grid = document.querySelector('.gallery-grid');
  if (grid && GITHUB_OWNER !== 'YOUR-GITHUB-USERNAME') {
    var apiUrl = 'https://api.github.com/repos/' + GITHUB_OWNER + '/' + GITHUB_REPO +
                 '/contents/' + GALLERY_FOLDER + '?ref=' + GITHUB_BRANCH;
    fetch(apiUrl)
      .then(function (res) { if (!res.ok) throw new Error('GitHub API error'); return res.json(); })
      .then(function (files) {
        var images = files.filter(function (f) {
          return f.type === 'file' && /\.(jpe?g|png|webp|gif)$/i.test(f.name) && f.name.toLowerCase() !== 'logo.png';
        });
        if (!images.length) return; // keep the existing sample photos if the folder is empty
        grid.innerHTML = '';
        images.forEach(function (file) {
          var label = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
          var item = document.createElement('div');
          item.className = 'gallery-item';
          var img = document.createElement('img');
          img.src = file.download_url;
          img.alt = label;
          img.loading = 'lazy';
          item.appendChild(img);
          grid.appendChild(item);
        });
        bindLightbox();
      })
      .catch(function () {
        /* GitHub unreachable or repo not public yet — sample photos stay as-is */
      });
  }

  /* ---- footer year ---- */
  document.querySelectorAll('.js-year').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

});
