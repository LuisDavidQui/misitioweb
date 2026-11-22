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

  /* Año del pie de página. */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
