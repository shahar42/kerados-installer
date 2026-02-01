/**
 * Scroll Reveal - Uses IntersectionObserver for performant reveal animations
 * Works on both mobile and desktop
 */
const ScrollReveal = (() => {
    function init() {
        const revealElements = document.querySelectorAll('.reveal, .reveal-children');

        if (!revealElements.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Optionally unobserve after revealing (one-time animation)
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,  // Trigger when 15% visible
            rootMargin: '0px 0px -50px 0px'  // Trigger slightly before fully in view
        });

        revealElements.forEach(el => observer.observe(el));
    }

    return { init };
})();
