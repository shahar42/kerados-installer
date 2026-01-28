class LensGallery {
    constructor(containerId, imageUrls, geometryConfig, options = {}) {
        this.container = document.getElementById(containerId);
        this.images = imageUrls;
        this.geometry = geometryConfig;
        this.options = {
            duration: 3000,     // Time from start of this image to start of next
            fadeDuration: 1000, // Duration of the fade transition
            ...options
        };
        
        if (this.container && this.images.length > 0) {
            this.init();
        }
    }

    init() {
        // Clear container
        this.container.innerHTML = '';
        
        // Geometry derived from injected config
        const imgX = this.geometry.cx - this.geometry.clipR;
        const imgY = this.geometry.cy - this.geometry.clipR;
        const imgSize = this.geometry.clipR * 2;

        // Animation calculations
        const count = this.images.length;
        const totalCycleTime = count * this.options.duration;
        
        // Percentages for keyframes
        const pctFade = (this.options.fadeDuration / totalCycleTime) * 100;
        const pctShow = (this.options.duration / totalCycleTime) * 100;
        const pctFadeOutEnd = ((this.options.duration + this.options.fadeDuration) / totalCycleTime) * 100;

        // Create Style for Keyframes
        const styleId = 'lens-gallery-style';
        let styleEl = document.getElementById(styleId);
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = styleId;
            document.head.appendChild(styleEl);
        }

        const keyframes = `
            @keyframes lensFadeLoop {
                0% { opacity: 0; }
                ${pctFade.toFixed(3)}% { opacity: 1; }
                ${pctShow.toFixed(3)}% { opacity: 1; }
                ${pctFadeOutEnd.toFixed(3)}% { opacity: 0; }
                100% { opacity: 0; }
            }
        `;
        styleEl.textContent = keyframes;

        // Create Image Elements
        this.images.forEach((src, index) => {
            const img = document.createElementNS("http://www.w3.org/2000/svg", "image");
            img.setAttribute("href", src);
            img.setAttribute("x", imgX);
            img.setAttribute("y", imgY);
            img.setAttribute("width", imgSize);
            img.setAttribute("height", imgSize);
            img.setAttribute("preserveAspectRatio", "xMidYMid slice");
            
            // Style
            img.style.opacity = '0'; 
            img.style.animationName = 'lensFadeLoop';
            img.style.animationDuration = `${totalCycleTime}ms`;
            img.style.animationIterationCount = 'infinite';
            img.style.animationTimingFunction = 'linear';
            
            // Stagger: Each image starts its cycle 'duration' ms after the previous
            const delay = index * this.options.duration;
            img.style.animationDelay = `${delay}ms`;
            
            this.container.appendChild(img);
        });
    }

    updateGeometry(newConfig) {
        this.geometry = newConfig;
        const imgX = this.geometry.cx - this.geometry.clipR;
        const imgY = this.geometry.cy - this.geometry.clipR;
        const imgSize = this.geometry.clipR * 2;

        const images = this.container.querySelectorAll('image');
        images.forEach(img => {
            img.setAttribute("x", imgX);
            img.setAttribute("y", imgY);
            img.setAttribute("width", imgSize);
            img.setAttribute("height", imgSize);
        });
    }
}
