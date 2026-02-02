/**
 * Lens Draw Animation - Web Animations API version
 * More performant than CSS animations for stroke-dashoffset
 */
const LensDrawAnimation = (() => {
    const LENS_CIRCUMFERENCE = 920;
    const HANDLE_LENGTH = 250;

    // Timings
    const LENS_DURATION = 1400;   // Slightly slower for smoothness
    const HANDLE_DURATION = 700;
    const HANDLE_DELAY = 1300;    // Starts 100ms before lens finishes

    // Easing - sine ease-in-out as cubic bezier
    const EASING = 'cubic-bezier(0.37, 0, 0.63, 1)';

    function animateLens(lensCircle, onComplete) {
        // Set initial state
        lensCircle.style.strokeDasharray = LENS_CIRCUMFERENCE;
        lensCircle.style.strokeDashoffset = LENS_CIRCUMFERENCE;
        lensCircle.style.transformOrigin = '155px 155px';
        lensCircle.style.transform = 'rotate(36deg)';

        const animation = lensCircle.animate([
            { strokeDashoffset: LENS_CIRCUMFERENCE },
            { strokeDashoffset: 0 }
        ], {
            duration: LENS_DURATION,
            easing: EASING,
            fill: 'forwards'
        });

        animation.onfinish = onComplete;
        return animation;
    }

    function animateHandle(handleLine) {
        // Set initial state
        handleLine.style.strokeDasharray = HANDLE_LENGTH;
        handleLine.style.strokeDashoffset = HANDLE_LENGTH;

        return handleLine.animate([
            { strokeDashoffset: HANDLE_LENGTH },
            { strokeDashoffset: 0 }
        ], {
            duration: HANDLE_DURATION,
            easing: EASING,
            fill: 'forwards',
            delay: HANDLE_DELAY
        });
    }

    function animateContainer(container) {
        return container.animate([
            { opacity: 0 },
            { opacity: 1 }
        ], {
            duration: 300,
            easing: 'ease-out',
            fill: 'forwards'
        });
    }

    return {
        play(container, lensCircle, handleLine, onLensComplete) {
            // Start all animations
            animateContainer(container);
            animateLens(lensCircle, onLensComplete);
            animateHandle(handleLine);
        }
    };
})();
