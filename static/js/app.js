document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Cookie Consent
    CookieConsent.init();

    // 2. Initialize Magnifying Glass Geometry
    MagnifyingGlass.init();

    // 3. Initialize Lens Gallery
    const weddingImages = [
        '/static/wedding_images/Gemini_Generated_Image_22hpp22hpp22hpp2.jpg',
        '/static/wedding_images/Gemini_Generated_Image_3z0s0i3z0s0i3z0s.jpg',
        '/static/wedding_images/Gemini_Generated_Image_5qhxcj5qhxcj5qhx.jpg',
        '/static/wedding_images/Gemini_Generated_Image_648w5x648w5x648w.jpg',
        '/static/wedding_images/Gemini_Generated_Image_i8t8i9i8t8i9i8t8.jpg',
        '/static/wedding_images/Gemini_Generated_Image_me4r7yme4r7yme4r.jpg',
        '/static/wedding_images/Gemini_Generated_Image_miigm4miigm4miig.jpg',
        '/static/wedding_images/Gemini_Generated_Image_n3obb7n3obb7n3ob.jpg',
        '/static/wedding_images/Gemini_Generated_Image_nk7ejnnk7ejnnk7e.jpg',
        '/static/wedding_images/Gemini_Generated_Image_qmlvkdqmlvkdqmlv.jpg',
        '/static/wedding_images/Gemini_Generated_Image_uf6ptpuf6ptpuf6p.jpg'
    ];

    // Preload images
    weddingImages.forEach(src => { new Image().src = src; });

    // Pass the geometry config from MagnifyingGlass to LensGallery
    new LensGallery('lens-images-container', weddingImages, MagnifyingGlass.config, {
        duration: 3000,
        fadeDuration: 1000
    });
});
