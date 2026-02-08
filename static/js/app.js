document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Cookie Consent
    CookieConsent.init();

    // 2. Initialize Waitlist Modal
    WaitlistModal.init();

    // 3. Initialize Magnifying Glass Geometry
    MagnifyingGlass.init();

    // 4. Initialize Scroll Reveal
    ScrollReveal.init();

    // 5. Initialize Lens Gallery with draw animation
    // Reduced to 6 images for better performance
    const weddingImages = [
        '/static/wedding_images/Gemini_Generated_Image_22hpp22hpp22hpp2.jpg',
        '/static/wedding_images/Gemini_Generated_Image_5qhxcj5qhxcj5qhx.jpg',
        '/static/wedding_images/Gemini_Generated_Image_alv1wfalv1wfalv1.jpg',
        '/static/wedding_images/Gemini_Generated_Image_miigm4miigm4miig.jpg',
        '/static/wedding_images/Gemini_Generated_Image_vslef2vslef2vsle.jpg',
        '/static/wedding_images/Gemini_Generated_Image_ca51vhca51vhca51.jpg'
    ];

    const container = document.getElementById('magnifying-glass-container');
    const isDesktop = window.matchMedia('(min-width: 768px)').matches;

    if (isDesktop) {
        // Desktop: Preload first image, then trigger draw animation
        const firstImage = new Image();
        firstImage.onload = firstImage.onerror = () => {
            container.classList.remove('loading');

            const lensCircle = document.getElementById('lens-circle');
            const handleLine = document.getElementById('handle-line');

            // Use Web Animations API for smoother GPU performance
            LensDrawAnimation.play(container, lensCircle, handleLine, () => {
                // When lens drawing finishes, trigger images fade-in
                container.classList.add('images-ready');
            });
        };
        firstImage.src = weddingImages[0];
    } else {
        // Mobile: Show immediately, no draw animation
        container.classList.remove('loading');
        container.classList.add('images-ready');
    }

    // Preload rest in background
    weddingImages.slice(1).forEach(src => { new Image().src = src; });

    // Pass the geometry config from MagnifyingGlass to LensGallery
    const gallery = new LensGallery('lens-images-container', weddingImages, MagnifyingGlass.currentConfig, {
        duration: 4000,
        fadeDuration: 1200
    });

    // Subscribe to geometry changes (Desktop <-> Mobile switch)
    MagnifyingGlass.subscribe((newConfig) => {
        gallery.updateGeometry(newConfig);
    });
});
