// Language, theme, print and date helpers for the CV.
(function () {
  "use strict";

  var root = document.documentElement;
  var STR = {
    en: { theme: "Switch between light and dark mode", print: "Print or save as PDF" },
    sv: { theme: "Växla mellan ljust och mörkt läge", print: "Skriv ut eller spara som PDF" },
  };

  var today = new Date();
  document.querySelectorAll("[data-years-since]").forEach(function (el) {
    var parts = el.dataset.yearsSince.split("-");
    var months = (today.getFullYear() - Number(parts[0])) * 12 + today.getMonth() - (Number(parts[1]) - 1);
    el.textContent = Math.floor(months / 12);
  });

  var yearEl = document.getElementById("current-year");
  if (yearEl) yearEl.textContent = today.getFullYear();

  function store(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      /* Private windows may refuse; the choice then lasts for this visit only. */
    }
  }

  function press(buttons, attr, value) {
    buttons.forEach(function (button) {
      button.setAttribute("aria-pressed", String(button.getAttribute(attr) === value));
    });
  }

  var themeToggle = document.getElementById("theme-toggle");
  var printButton = document.getElementById("print");
  var langButtons = Array.prototype.slice.call(document.querySelectorAll("[data-set-lang]"));

  function applyLang(lang) {
    root.lang = lang;
    root.dataset.lang = lang;
    press(langButtons, "data-set-lang", lang);
    themeToggle.setAttribute("aria-label", STR[lang].theme);
    themeToggle.title = STR[lang].theme;
    printButton.setAttribute("aria-label", STR[lang].print);
    printButton.title = STR[lang].print;
  }

  langButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var lang = button.getAttribute("data-set-lang");
      applyLang(lang);
      store("cv-lang", lang);
      var url = new URL(location.href);
      url.searchParams.set("lang", lang);
      history.replaceState(null, "", url);
    });
  });

  applyLang(root.dataset.lang === "sv" ? "sv" : "en");

  themeToggle.addEventListener("click", function () {
    var dark = root.dataset.theme === "dark" ||
      (!root.dataset.theme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    var next = dark ? "light" : "dark";
    root.dataset.theme = next;
    store("cv-theme", next);
  });

  printButton.addEventListener("click", function () {
    window.print();
  });
})();
