# Refactoring Plan - Scott Meyers Style

Principles from Effective C++ adapted to JavaScript/HTML.

## 1. Separate Interface from Implementation

Extract embedded code into dedicated files:

```
static/
├── css/
│   └── styles.css
└── js/
    ├── app.js              # Main entry, initializes modules
    ├── magnifying-glass.js # Lens geometry and rendering
    ├── slideshow.js        # Image crossfade logic
    └── cookie-consent.js   # Cookie banner handling
```

HTML becomes pure structure - no inline styles or scripts.

## 2. Encapsulate What Varies

Replace scattered globals with encapsulated modules:

```javascript
// magnifying-glass.js
const MagnifyingGlass = (() => {
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
        elements.images = [
            document.getElementById('lens-image-1'),
            document.getElementById('lens-image-2')
        ];
    }

    function applyGeometry() {
        const imgX = config.cx - config.clipR;
        const imgY = config.cy - config.clipR;
        const imgSize = config.clipR * 2;
        // ... apply to elements
    }

    return {
        init() {
            cacheElements();
            applyGeometry();
        }
    };
})();
```

## 3. Make Interfaces Hard to Misuse

- Validate configuration values at init time
- Use `Object.freeze()` to prevent accidental mutation
- Add JSDoc type annotations or migrate to TypeScript

```javascript
/**
 * @typedef {Object} LensConfig
 * @property {number} cx - Center X (must be positive)
 * @property {number} cy - Center Y (must be positive)
 * @property {number} r - Border radius (must be > clipR)
 * @property {number} clipR - Clip radius (must be positive)
 */

function validateConfig(config) {
    if (config.r <= config.clipR) {
        throw new Error('Border radius must be greater than clip radius');
    }
    if (config.cx < 0 || config.cy < 0) {
        throw new Error('Center coordinates must be positive');
    }
}
```

## 4. Prefer Const Over Let

Current violations:
- `currentIndex` - should be encapsulated in Slideshow module
- `activeLayer` - should be encapsulated in Slideshow module

All module-level variables that don't change should be `const`.

## 5. Minimize Coupling

Bad (current):
```javascript
const image1 = document.getElementById('lens-image-1');
```

Good (dependency injection):
```javascript
const Slideshow = {
    init(imageElements, imageSources, intervalMs = 3000) {
        this.images = imageElements;
        this.sources = imageSources;
        this.interval = intervalMs;
        this.start();
    }
};
```

Components receive their dependencies, don't reach out to find them.

## 6. Single Responsibility Principle

Each module does one thing:

| Module | Responsibility |
|--------|----------------|
| `magnifying-glass.js` | Lens geometry calculation and SVG updates |
| `slideshow.js` | Image cycling with crossfade transitions |
| `cookie-consent.js` | Banner display, user preference storage |
| `app.js` | Wire modules together, handle initialization |

## 7. Design for Extension (Open/Closed Principle)

Slideshow should be configurable without modification:

```javascript
Slideshow.init({
    container: document.getElementById('lens-images'),
    images: weddingImages,
    interval: 3000,
    transition: 'crossfade', // or 'slide', 'fade', etc.
    transitionDuration: 800
});
```

Magnifying glass should support different rendering targets:

```javascript
MagnifyingGlass.init({
    svg: document.getElementById('magnifying-glass-svg'),
    geometry: customLensConfig  // Optional override
});
```

## Implementation Order

1. Extract CSS to separate file
2. Extract JS modules (start with cookie-consent, simplest)
3. Refactor magnifying-glass with encapsulation
4. Refactor slideshow with dependency injection
5. Create app.js entry point
6. Add validation and freeze configs
7. Add JSDoc types

## Notes

- Each step should be a separate commit
- Test in browser after each extraction
- No functionality changes during refactor - behavior must stay identical
