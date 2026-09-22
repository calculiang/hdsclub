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
     Uses jsDelivr's public CDN API to list the folder (no rate limit, unlike
     GitHub's own API), then loads the actual images straight from GitHub.
     If anything fails (offline, placeholders not filled in, folder empty),
     the sample photos already in the HTML stay exactly as they are. */
  var grid = document.querySelector('.gallery-grid');
  if (grid && GITHUB_OWNER !== 'YOUR-GITHUB-USERNAME') {
    var listUrl = 'https://data.jsdelivr.com/v1/packages/gh/' + GITHUB_OWNER + '/' + GITHUB_REPO +
                  '@' + GITHUB_BRANCH + '?structure=flat';
    fetch(listUrl)
      .then(function (res) { if (!res.ok) throw new Error('jsDelivr API error'); return res.json(); })
      .then(function (data) {
        var files = (data && data.files) ? data.files : [];
        var prefix = '/' + GALLERY_FOLDER + '/';
        var images = files.filter(function (f) {
          return f.name.indexOf(prefix) === 0 &&
                 /\.(jpe?g|png|webp|gif)$/i.test(f.name) &&
                 f.name.toLowerCase() !== (prefix + 'logo.png').toLowerCase();
        });
        if (!images.length) return; // keep the existing sample photos if the folder is empty
        grid.innerHTML = '';
        images.forEach(function (file) {
          var relPath = file.name.replace(/^\//, ''); // e.g. image2/Matron.jpeg
          var fileName = relPath.split('/').pop();
          var label = fileName.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
          var item = document.createElement('div');
          item.className = 'gallery-item';
          var img = document.createElement('img');
          img.src = 'https://raw.githubusercontent.com/' + GITHUB_OWNER + '/' + GITHUB_REPO +
                     '/' + GITHUB_BRANCH + '/' + relPath;
          img.alt = label;
          img.loading = 'lazy';
          item.appendChild(img);
          grid.appendChild(item);
        });
        bindLightbox();
      })
      .catch(function () {
        /* jsDelivr unreachable or repo not public yet — sample photos stay as-is */
      });
  }

  /* ---- footer year ---- */
  document.querySelectorAll('.js-year').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

});
