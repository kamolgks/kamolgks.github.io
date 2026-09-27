(() => {
  "use strict";
  const scriptUrl = document.currentScript.src;
  const root = document.documentElement;
  const languageSelect = document.querySelector("#language");
  const themeButton = document.querySelector(".theme-button");
  const errorNotice = document.querySelector(".language-error");
  const supportedLanguages = ["en", "ru", "uz"];
  const cache = new Map();
  let language = "en";
  let translations = {};
  let requestId = 0;

  const readPreference = (key) => {
    try { return localStorage.getItem(key); } catch { return null; }
  };
  const savePreference = (key, value) => {
    try { localStorage.setItem(key, value); } catch { /* Preferences are optional. */ }
  };
  const updateThemeLabel = () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    const label = translations["theme." + nextTheme] || ("Switch to " + nextTheme + " theme");
    themeButton.setAttribute("aria-label", label);
    themeButton.title = label;
    document.querySelector('meta[name="theme-color"]').content =
      root.dataset.theme === "dark" ? "#141716" : "#f5f6f1";
  };
  themeButton.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    savePreference("theme", root.dataset.theme);
    updateThemeLabel();
  });
  updateThemeLabel();
  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  const setLanguage = async (nextLanguage) => {
    if (!supportedLanguages.includes(nextLanguage)) return;
    const currentRequest = ++requestId;
    errorNotice.hidden = true;
    try {
      let dictionary = cache.get(nextLanguage);
      if (!dictionary) {
        const url = new URL("../locales/lang_" + nextLanguage + ".json", scriptUrl);
        const response = await fetch(url);
        if (!response.ok) throw new Error("Translation unavailable");
        dictionary = await response.json();
        cache.set(nextLanguage, dictionary);
      }
      if (currentRequest !== requestId) return;
      translations = dictionary;
      document.querySelectorAll("[data-lang-key]").forEach((element) => {
        const text = dictionary[element.dataset.langKey];
        if (typeof text === "string") element.textContent = text;
      });
      document.querySelectorAll("[data-label-key]").forEach((element) => {
        const label = dictionary[element.dataset.labelKey];
        if (label) element.setAttribute("aria-label", label);
      });
      language = nextLanguage;
      root.lang = language;
      languageSelect.value = language;
      document.title = dictionary["page." + document.body.dataset.page] || document.title;
      document.querySelector('meta[name="description"]').content = dictionary["meta.description"];
      savePreference("language", language);
      updateThemeLabel();
    } catch {
      if (currentRequest !== requestId) return;
      languageSelect.value = language;
      errorNotice.textContent = {
        en: "Could not load this language. Please try again.",
        ru: "Не удалось загрузить перевод. Попробуйте ещё раз.",
        uz: "Tarjimani yuklab bo‘lmadi. Qayta urinib ko‘ring."
      }[language];
      errorNotice.hidden = false;
    }
  };
  languageSelect.addEventListener("change", (event) => setLanguage(event.target.value));
  const savedLanguage = readPreference("language");
  setLanguage(supportedLanguages.includes(savedLanguage) ? savedLanguage : "en");
})();
