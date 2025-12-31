(function() {
    let snowfallInitialized = false;
    let snowfallContainer = null;
    let resizeTimeout = null;

    const config = {
        count: 40,
        speed: 1.8,
        radius: 2.5,
        wind: 0.5,
        color: "#f1f2f6",
        opacity: 0.8,
        randomizeSpeed: false,
        randomizeSize: false
    };

    function initSnowfall() {
        if (snowfallInitialized) {
            return;
        }

        if (document.getElementById('snowfall-container')) {
            snowfallInitialized = true;
            return;
        }

        let container = document.createElement('div');
        container.id = 'snowfall-container';
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.pointerEvents = 'none';
        container.style.zIndex = '9998';
        container.style.overflow = 'hidden';
        document.body.appendChild(container);

        snowfallContainer = container;

        // создаются снежинки
        for (let i = 0; i < config.count; i++) {
            let snowflake = document.createElement('div');
            snowflake.className = 'snowflake';

            let radius = config.radius;
            if (config.randomizeSize) {
                radius = config.radius * (0.5 + 1.5 * Math.random());
            }

            let speed = config.speed;
            if (config.randomizeSpeed) {
                speed = config.speed * (0.5 + 1.5 * Math.random());
            }

            let leftPosition = Math.random() * window.innerWidth;
            let duration = window.innerHeight / speed * 20;
            let delay = Math.random() * duration;

            snowflake.style.width = (2 * radius) + 'px';
            snowflake.style.height = (2 * radius) + 'px';
            snowflake.style.backgroundColor = config.color;
            snowflake.style.opacity = config.opacity.toString();
            snowflake.style.boxShadow = `0 0 ${radius}px ${config.color}`;
            snowflake.style.left = leftPosition + 'px';
            snowflake.style.top = '-10px';
            snowflake.style.borderRadius = '50%';
            snowflake.style.position = 'absolute';
            snowflake.style.animation = `snowfall ${duration}ms linear infinite`;
            snowflake.style.animationDelay = delay + 'ms';
            snowflake.style.willChange = 'transform, opacity';
            snowflake.style.backfaceVisibility = 'hidden';

            container.appendChild(snowflake);
        }

        snowfallInitialized = true;
    }

    function handleResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            if (!document.getElementById('snowfall-container')) {
                snowfallInitialized = false;
                initSnowfall();
            }
        }, 1000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSnowfall);
    } else {
        initSnowfall();
    }

    window.addEventListener('resize', handleResize);

    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
            if (!document.getElementById('snowfall-container')) {
                snowfallInitialized = false;
                initSnowfall();
            }
        }
    });

    if (!document.getElementById('snowfall-styles')) {
        let styleEl = document.createElement('style');
        styleEl.id = 'snowfall-styles';
        styleEl.textContent = `
            @keyframes snowfall {
                0% {
                    opacity: 0;
                    transform: translateY(-10px) translateX(0);
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% {
                    opacity: 0;
                    transform: translateY(100vh) translateX(${config.wind * 50}px);
                }
            }

            @media (max-width: 480px) {
                .snowflake {
                    width: 4px !important;
                    height: 4px !important;
                }
            }
        `;
        document.head.appendChild(styleEl);
    }
})();
