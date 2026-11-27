/* Interacciones mínimas, sin dependencias. */
(function () {
  "use strict";

  var root = document.documentElement;
  var STORAGE_KEY = "tema";

  /* Tema: preferencia guardada, luego preferencia del sistema. */
  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", theme === "dark" ? "#0b1a1e" : "#fbfaf6");
    }
    document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
      var dark = theme === "dark";
      btn.setAttribute("aria-pressed", dark ? "true" : "false");
      btn.setAttribute("aria-label", dark ? "Activar tema claro" : "Activar tema oscuro");
      btn.setAttribute("title", dark ? "Tema claro" : "Tema oscuro");
    });
  }

  var saved = null;
  try {
    saved = localStorage.getItem(STORAGE_KEY);
  } catch (e) {}

  var prefersDark =
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

  applyTheme(saved || (prefersDark ? "dark" : "light"));

  document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch (e) {}
    });
  });

  /* Menú móvil. */
  var toggle = document.querySelector("[data-nav-toggle]");
  var links = document.getElementById("menu-principal");

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    links.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && links.classList.contains("is-open")) {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* Sombra del encabezado al desplazar. */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-stuck", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* Mosaico de contexto: imagen destacada rotativa y miniaturas. */
  var mosaic = document.querySelector("[data-mosaic]");
  if (mosaic) {
    var mosaicLayers = Array.prototype.slice.call(mosaic.querySelectorAll("[data-mosaic-img]"));
    var mosaicThumbs = Array.prototype.slice.call(mosaic.querySelectorAll("[data-mosaic-thumb]"));
    var mosaicCaption = mosaic.querySelector("[data-mosaic-caption]");
    var mosaicCount = mosaic.querySelector("[data-mosaic-count]");
    var mosaicPause = document.querySelector("[data-mosaic-pause]");
    var slides = mosaicThumbs.map(function (thumb) {
      return {
        src: thumb.getAttribute("data-src"),
        alt: thumb.getAttribute("data-alt"),
        caption: thumb.getAttribute("data-caption")
      };
    });
    var extraSrc = mosaic.getAttribute("data-extra-src");
    if (extraSrc) {
      slides.push({
        src: extraSrc,
        alt: mosaic.getAttribute("data-extra-alt") || "",
        caption: mosaic.getAttribute("data-extra-caption") || ""
      });
    }

    var mIndex = 0;
    var activeLayer = 0;
    var mosaicTimer = null;
    var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var narrow = window.matchMedia && window.matchMedia("(max-width: 760px)").matches;
    var allowAuto = !reduced && !narrow;
    var userPaused = !allowAuto;

    function setPauseLabel() {
      if (!mosaicPause) return;
      mosaicPause.setAttribute("aria-pressed", userPaused ? "true" : "false");
      mosaicPause.textContent = userPaused ? (allowAuto ? "Reanudar" : "Reproducir") : "Pausar";
    }

    function updateMeta(data) {
      if (mosaicCaption) mosaicCaption.textContent = data.caption;
      if (mosaicCount) {
        mosaicCount.textContent =
          ("0" + (mIndex + 1)).slice(-2) + " / " + ("0" + slides.length).slice(-2);
      }
      mosaicThumbs.forEach(function (thumb, i) {
        thumb.setAttribute("aria-pressed", i === mIndex ? "true" : "false");
      });
    }

    function showSlide(nextIndex) {
      mIndex = ((nextIndex % slides.length) + slides.length) % slides.length;
      var data = slides[mIndex];
      updateMeta(data);
      if (!data || !data.src) return;

      var current = mosaicLayers[activeLayer];
      var incoming = mosaicLayers[1 - activeLayer];
      if (!current || !incoming) return;
      if (current.getAttribute("src") === data.src) return;

      var swapped = false;
      var swap = function () {
        if (swapped) return;
        swapped = true;
        incoming.src = data.src;
        incoming.alt = data.alt;
        incoming.removeAttribute("aria-hidden");
        current.setAttribute("aria-hidden", "true");
        incoming.classList.add("is-active");
        current.classList.remove("is-active");
        activeLayer = 1 - activeLayer;
      };

      var preload = new Image();
      preload.onload = swap;
      preload.onerror = swap;
      preload.src = data.src;
      if (preload.complete) swap();
    }

    function stopMosaic() {
      if (mosaicTimer) {
        window.clearInterval(mosaicTimer);
        mosaicTimer = null;
      }
    }

    function startMosaic() {
      stopMosaic();
      if (!allowAuto || userPaused || document.hidden) return;
      mosaicTimer = window.setInterval(function () {
        showSlide(mIndex + 1);
      }, 7000);
    }

    function resumeMosaic() {
      if (!userPaused) startMosaic();
    }

    mosaicThumbs.forEach(function (thumb, i) {
      thumb.addEventListener("click", function () {
        showSlide(i);
        if (!userPaused) startMosaic();
      });
    });

    if (mosaicPause) {
      mosaicPause.addEventListener("click", function () {
        userPaused = !userPaused;
        if (!userPaused) {
          allowAuto = true;
          startMosaic();
        } else {
          stopMosaic();
        }
        setPauseLabel();
      });
    }

    mosaic.addEventListener("mouseenter", stopMosaic);
    mosaic.addEventListener("mouseleave", resumeMosaic);
    mosaic.addEventListener("focusin", stopMosaic);
    mosaic.addEventListener("focusout", function (event) {
      if (!mosaic.contains(event.relatedTarget)) resumeMosaic();
    });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        stopMosaic();
      } else {
        resumeMosaic();
      }
    });

    updateMeta(slides[0]);
    setPauseLabel();
    startMosaic();
  }

  /* Año del pie de página. */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
