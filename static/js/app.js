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
        '/static/wedding_images/Gemini_Generated_Image_8ilbom8ilbom8ilb.jpg',
        '/static/wedding_images/Gemini_Generated_Image_alv1wfalv1wfalv1.jpg',
        '/static/wedding_images/Gemini_Generated_Image_b2u8bzb2u8bzb2u8.jpg',
        '/static/wedding_images/Gemini_Generated_Image_bq4e5nbq4e5nbq4e.jpg',
        '/static/wedding_images/Gemini_Generated_Image_c0v8poc0v8poc0v8.jpg',
        '/static/wedding_images/Gemini_Generated_Image_dv5yd9dv5yd9dv5y.jpg',
        '/static/wedding_images/Gemini_Generated_Image_i8t8i9i8t8i9i8t8.jpg',
        '/static/wedding_images/Gemini_Generated_Image_j4d9ynj4d9ynj4d9.jpg',
        '/static/wedding_images/Gemini_Generated_Image_me4r7yme4r7yme4r.jpg',
        '/static/wedding_images/Gemini_Generated_Image_miigm4miigm4miig.jpg',
        '/static/wedding_images/Gemini_Generated_Image_n3obb7n3obb7n3ob.jpg',
        '/static/wedding_images/Gemini_Generated_Image_nk7ejnnk7ejnnk7e.jpg',
        '/static/wedding_images/Gemini_Generated_Image_qmlvkdqmlvkdqmlv.jpg',
        '/static/wedding_images/Gemini_Generated_Image_rzxj68rzxj68rzxj.jpg',
        '/static/wedding_images/Gemini_Generated_Image_uf6ptpuf6ptpuf6p.jpg',
        '/static/wedding_images/Gemini_Generated_Image_vslef2vslef2vsle.jpg',
        '/static/wedding_images/Gemini_Generated_Image_xhx20jxhx20jxhx2.jpg'
    ];

    // Preload images
    weddingImages.forEach(src => { new Image().src = src; });

    // Pass the geometry config from MagnifyingGlass to LensGallery
    const gallery = new LensGallery('lens-images-container', weddingImages, MagnifyingGlass.currentConfig, {
        duration: 3000,
        fadeDuration: 1000
    });

    // Subscribe to geometry changes (Desktop <-> Mobile switch)
    MagnifyingGlass.subscribe((newConfig) => {
        gallery.updateGeometry(newConfig);
    });
});
