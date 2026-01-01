document.addEventListener("DOMContentLoaded", () => {
    const languages = {
        en: { name: "English" },
        ru: { name: "Русский" },
        uz: { name: "O'zbekcha" }
    };

    let currentLanguage = localStorage.getItem("language") || "en";
    let translations = {};

    const themeButton = document.querySelector(".theme-btn");
    const navToggle = document.querySelector(".nav-toggle");
    const navLinks = document.querySelector(".nav-links");
    const langSwitch = document.querySelector(".lang-switch");
    const langButton = document.querySelector(".lang-btn");
    const langDropdown = document.querySelector(".lang-dropdown");
    const typingText = document.querySelector(".typing-text");

    const setTheme = (theme) => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
        if (themeButton) {
            const icon = themeButton.querySelector("i");
            icon.className = theme === "dark" ? "fas fa-moon" : "fas fa-sun";
        }
    };


    const initTheme = () => {
        const savedTheme = localStorage.getItem("theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const defaultTheme = savedTheme || (prefersDark ? "dark" : "light");

        setTheme(defaultTheme);
    };

    if (themeButton) {
        themeButton.addEventListener("click", () => {
            const currentTheme = document.documentElement.getAttribute("data-theme");
            setTheme(currentTheme === "dark" ? "light" : "dark");
        });
    }

    if (navToggle && navLinks) {
        navToggle.addEventListener("click", () => {
            navLinks.classList.toggle("show");
        });
        navLinks.addEventListener("click", (event) => {
            if (event.target.closest("a")) {
                navLinks.classList.remove("show");
            }
        });
    }


    const sections = document.querySelectorAll("section[id]");
    const navAnchors = document.querySelectorAll(".nav-links a");

    const updateActiveNav = () => {
        let currentSection = "";
        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 70) {
                currentSection = section.getAttribute("id");
            }
        });

        navAnchors.forEach((anchor) => {
            anchor.classList.remove("active");
            if (anchor.getAttribute("href") === `#${currentSection}`) {
                anchor.classList.add("active");
            }
        });
    };


    const animateProgressBars = () => {
        const progressBars = document.querySelectorAll(".progress");
        progressBars.forEach((bar) => {
            const rect = bar.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
            if (isVisible) {
                const width = bar.getAttribute("data-width");
                bar.style.width = width;
            }
        });
    };


    window.addEventListener("scroll", () => {
        updateActiveNav();
        animateProgressBars();
    });


    const loadTranslations = async (langCode) => {
        try {
            const response = await fetch(`/assets/locales/lang_${langCode}.json`);
            if (!response.ok) {
                throw new Error(`Translation file for ${langCode} not found.`);
            }
            translations = await response.json();
        } catch (error) {
            console.error("Error loading translation:", error);
            translations = {};
        }
    };


    const applyTranslations = () => {
        document.querySelectorAll("[data-lang-key]").forEach((element) => {
            const key = element.getAttribute("data-lang-key");
            const translation = translations[key];
            if (translation) {
                element.textContent = translation;
            }
        });

        updateTypingAnimation();
    };


    const changeLanguage = async (langCode) => {
        if (langCode && langCode !== currentLanguage) {
            currentLanguage = langCode;
            localStorage.setItem("language", langCode);
            await loadTranslations(langCode);
            applyTranslations();
            updateLangButton(langCode);
        }
    };


    const updateLangButton = (langCode) => {
        if (langButton) {
            const currentLangSpan = langButton.querySelector(".current-lang");
            if (currentLangSpan) {
                currentLangSpan.textContent = langCode.toUpperCase();
            }
        }
    };


    const initLanguageSwitcher = () => {
        if (!langSwitch || !langDropdown) return;
        langDropdown.innerHTML = "";

        Object.keys(languages).forEach((langCode) => {
            const language = languages[langCode];
            const option = document.createElement("div");
            option.className = "lang-option";
            option.textContent = language.name;
            option.addEventListener("click", (event) => {
                event.stopPropagation();
                changeLanguage(langCode);
                langDropdown.classList.remove("show");
            });

            langDropdown.appendChild(option);
        });

        if (langButton) {
            langButton.addEventListener("click", (event) => {
                event.stopPropagation();
                langDropdown.classList.toggle("show");
            });
        }

        document.addEventListener("click", () => {
            langDropdown.classList.remove("show");
        });
        updateLangButton(currentLanguage);
    };


    let typingTimeout = null;
    const typeWriter = (texts, textIndex = 0, charIndex = 0, isDeleting = false) => {
        if (!typingText || texts.length === 0) return;
        clearTimeout(typingTimeout);
        const currentText = texts[textIndex];
        if (isDeleting) {
            typingText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        let typingSpeed = isDeleting ? 50 : 150;
        if (!isDeleting && charIndex === currentText.length) {

            isDeleting = true;
            typingSpeed = 2000;
        } else if (isDeleting && charIndex === 0) {

            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingSpeed = 500;
        }
        typingTimeout = setTimeout(
            () => typeWriter(texts, textIndex, charIndex, isDeleting),
            typingSpeed
        );
    };


    const updateTypingAnimation = () => {
        clearTimeout(typingTimeout);
        const animatedTexts = translations["hero.animatedTexts"] || [];
        if (typingText) {
            typingText.textContent = "";
            typeWriter(animatedTexts);
        }
    };


    const initApp = async () => {
        initTheme();
        initLanguageSwitcher();
        await loadTranslations(currentLanguage);
        applyTranslations();
        updateActiveNav();
        animateProgressBars();
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 600,
                offset: 100,
                once: true,
                easing: "ease-out-cubic"
            });
        }
    };

    initApp();
});