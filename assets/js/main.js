// main.js

document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION ---
    const languageConfig = {
        en: { name: 'English' },
        ru: { name: 'Русский' },
        uz: { name: "O'zbekcha" }
    };
    let currentLanguage = localStorage.getItem('language') || 'en';
    let translations = {};

    // --- ELEMENTS ---
    const themeBtn = document.querySelector('.theme-btn');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const langSwitchContainer = document.querySelector('.lang-switch');
    const langBtn = document.querySelector('.lang-btn');
    const langDropdown = document.querySelector('.lang-dropdown');
    const typingTextElement = document.querySelector('.typing-text');

    // --- THEME ---
    const initializeTheme = () => {
        const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        setTheme(savedTheme);
    };

    const setTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        if (themeBtn) {
            themeBtn.querySelector('i').className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
        }
    };

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            setTheme(currentTheme === 'dark' ? 'light' : 'dark');
        });
    }

    // --- NAVIGATION ---
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => navLinks.classList.toggle('show'));
        // Close mobile menu when a link is clicked (including inner elements)
        navLinks.addEventListener('click', (e) => {
            if (e.target.closest('a')) {
                navLinks.classList.remove('show');
            }
        });
    }

    // --- ACTIVE NAV LINK ON SCROLL ---
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a');

    const updateActiveNavLink = () => {
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 70) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${currentSectionId}`) {
                item.classList.add('active');
            }
        });
    };

    // --- SKILL BARS ANIMATION ON SCROLL ---
    const animateSkillBars = () => {
        const skillProgress = document.querySelectorAll('.progress');
        skillProgress.forEach(progress => {
            const rect = progress.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom >= 0) {
                progress.style.width = progress.getAttribute('data-width');
            }
        });
    };

    window.addEventListener('scroll', () => {
        updateActiveNavLink();
        animateSkillBars();
    });

    // --- TRANSLATION & LANGUAGE SWITCHER ---
    const loadTranslations = async (lang) => {
        try {
            // Corrected path to fetch from the root
            const response = await fetch(`assets/locales/lang_${lang}.json`);
            if (!response.ok) throw new Error(`Translation file for ${lang} not found.`);
            translations = await response.json();
        } catch (error) {
            console.error('Error loading translation:', error);
            translations = {}; // Fallback to empty
        }
    };

    const applyTranslations = () => {
        document.querySelectorAll('[data-lang-key]').forEach(el => {
            const key = el.getAttribute('data-lang-key');
            const translation = translations[key];
            if (translation) {
                el.textContent = translation;
            }
        });
        resetAndStartTypingAnimation();
    };

    const switchLanguage = async (lang) => {
        if (!lang || lang === currentLanguage) return;
        currentLanguage = lang;
        localStorage.setItem('language', lang);
        await loadTranslations(lang);
        applyTranslations();
        updateLangButton(lang);
    };

    const updateLangButton = (langCode) => {
        if (langBtn) {
            langBtn.querySelector('.current-lang').textContent = langCode.toUpperCase();
        }
    };

    const setupLangSwitcher = () => {
        if (!langSwitchContainer || !langDropdown) return;

        langDropdown.innerHTML = ''; // Clear existing options
        Object.keys(languageConfig).forEach(code => {
            const config = languageConfig[code];
            const option = document.createElement('div');
            option.className = 'lang-option';
            option.textContent = config.name;
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                switchLanguage(code);
                langDropdown.classList.remove('show');
            });
            langDropdown.appendChild(option);
        });

        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('show');
        });

        document.addEventListener('click', () => {
            langDropdown.classList.remove('show');
        });

        updateLangButton(currentLanguage);
    };

    // --- TYPING ANIMATION ---
    let typingTimeoutId = null;

    const performTypingAnimation = (words, wordIndex = 0, charIndex = 0, isDeleting = false) => {
        if (!typingTextElement || words.length === 0) return;

        clearTimeout(typingTimeoutId);
        const currentWord = words[wordIndex];

        if (isDeleting) {
            typingTextElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingTextElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let typingSpeed = isDeleting ? 50 : 150;

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause after typing
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500; // Pause before new word
        }

        typingTimeoutId = setTimeout(() => performTypingAnimation(words, wordIndex, charIndex, isDeleting), typingSpeed);
    };

    const resetAndStartTypingAnimation = () => {
        clearTimeout(typingTimeoutId);
        const animatedTexts = translations['hero.animatedTexts'] || [];
        if (typingTextElement) {
            typingTextElement.textContent = '';
            performTypingAnimation(animatedTexts);
        }
    };

    // --- INITIALIZATION ---
    const initialize = async () => {
        initializeTheme();
        setupLangSwitcher();
        await loadTranslations(currentLanguage);
        applyTranslations();
        updateActiveNavLink(); // Set active link on load
        animateSkillBars(); // Animate visible bars on load
        AOS.init({
            duration: 600, // SPEED CHANGE: Faster animation
            offset: 100,
            once: true,
            easing: 'ease-out-cubic'
        });
    };

    initialize();
});