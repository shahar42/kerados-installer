const MagnifyingGlass = (() => {
    // Single source of truth for geometry
    const config = Object.freeze({
        cx: 110,
        cy: 110,
        r: 90,
        clipR: 82,
        handleStart: { x: 183, y: 162 },
        handleEnd: { x: 355, y: 287 }
    });

    const elements = {};

    function cacheElements() {
        elements.clipCircle = document.getElementById('clip-circle');
        elements.lensCircle = document.getElementById('lens-circle');
        elements.handleLine = document.getElementById('handle-line');
    }

    function applyGeometry() {
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

    return {
        // Expose config for other modules (like LensGallery) to use
        config,
        
        init() {
            cacheElements();
            applyGeometry();
        }
    };
})();
