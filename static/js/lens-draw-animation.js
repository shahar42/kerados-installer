/**
 * Lens Draw Animation - Web Animations API version
 * Sequential: circle completes, then handle draws immediately
 */
const LensDrawAnimation = (() => {
    const LENS_CIRCUMFERENCE = 920;
    const HANDLE_LENGTH = 250;

    // Timings
    const LENS_DURATION = 1400;
    const HANDLE_DURATION = 600;

    // Easing - sine ease-in-out as cubic bezier
    const EASING = 'cubic-bezier(0.37, 0, 0.63, 1)';

    function animateLens(lensCircle) {
        // Set initial state
        lensCircle.style.strokeDasharray = LENS_CIRCUMFERENCE;
        lensCircle.style.strokeDashoffset = LENS_CIRCUMFERENCE;
        lensCircle.style.transformOrigin = '155px 155px';
        lensCircle.style.transform = 'rotate(36deg)';

        return lensCircle.animate([
            { strokeDashoffset: LENS_CIRCUMFERENCE },
            { strokeDashoffset: 0 }
        ], {
            duration: LENS_DURATION,
            easing: EASING,
            fill: 'forwards'
        });
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
            fill: 'forwards'
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
        play(container, lensCircle, handleLine, onComplete) {
            // Start container fade and lens draw
            animateContainer(container);
            const lensAnim = animateLens(lensCircle);

            // Chain: when lens finishes, start handle
            lensAnim.onfinish = () => {
                const handleAnim = animateHandle(handleLine);
                // Call completion callback when handle finishes
                if (onComplete) {
                    handleAnim.onfinish = onComplete;
                }
            };
        }
    };
})();
