const MagnifyingGlass = (() => {
    // Configuration for Desktop (Default)
    const desktopConfig = Object.freeze({
        cx: 155,
        cy: 155,
        r: 144,
        clipR: 132,
        handleStart: { x: 271, y: 238 },
        handleEnd: { x: 473, y: 383 }
    });

    // Configuration for Mobile (Smaller, more compact)
    const mobileConfig = Object.freeze({
        cx: 90,
        cy: 90,
        r: 70,
        clipR: 64,
        handleStart: { x: 148, y: 132 }, // Adjusted for smaller circle
        handleEnd: { x: 260, y: 220 }    // Shorter handle
    });

    let currentConfig = desktopConfig;
    const elements = {};
    const listeners = [];

    function cacheElements() {
        elements.clipCircle = document.getElementById('clip-circle');
        elements.lensCircle = document.getElementById('lens-circle');
        elements.handleLine = document.getElementById('handle-line');
        elements.svg = document.getElementById('magnifying-glass-svg');
    }

    function applyGeometry(config) {
        if (!elements.clipCircle || !elements.lensCircle || !elements.handleLine) return;

        // Apply to clip path circle
        elements.clipCircle.setAttribute('cx', config.cx);
        elements.clipCircle.setAttribute('cy', config.cy);
        elements.clipCircle.setAttribute('r', config.clipR);

        // Apply to visible lens circle
        elements.lensCircle.setAttribute('cx', config.cx);
        elements.lensCircle.setAttribute('cy', config.cy);
        elements.lensCircle.setAttribute('r', config.r);

        // Apply to handle
        elements.handleLine.setAttribute('x1', config.handleStart.x);
        elements.handleLine.setAttribute('y1', config.handleStart.y);
        elements.handleLine.setAttribute('x2', config.handleEnd.x);
        elements.handleLine.setAttribute('y2', config.handleEnd.y);
    }

    function notifyListeners() {
        listeners.forEach(callback => callback(currentConfig));
    }

    function checkResponsive() {
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        const newConfig = isMobile ? mobileConfig : desktopConfig;

        if (newConfig !== currentConfig) {
            currentConfig = newConfig;
            applyGeometry(currentConfig);
            notifyListeners();
        }
    }

    return {
        get currentConfig() { return currentConfig; },
        
        subscribe(callback) {
            listeners.push(callback);
        },

        init() {
            cacheElements();
            
            // Force initial application of geometry
            applyGeometry(currentConfig);
            
            // Initial check (in case we start on mobile)
            checkResponsive();
            
            // Listen for resize
            window.addEventListener('resize', () => {
                // Debounce could be added here if needed
                requestAnimationFrame(checkResponsive);
            });
        }
    };
})();
