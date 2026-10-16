# DevFest Chennai Animation Toolkit & Reusable Resources

This package contains extracted, modularized, and production-ready animations reverse-engineered from [devfest.gdgchennai.in](https://devfest.gdgchennai.in).

---

## 📦 What's Included

| Animation | Technology | Description |
| :--- | :--- | :--- |
| **1. Sketch → Building Reveal** | SVG Draw + Bloom Filter | Architectural blueprint line drawing that traces itself with glowing strokes, triggers an expanding cyan lens flash, and dissolves into a real photograph blooming into focus. |
| **2. 3D Floating Code Brackets** | Three.js + WebGL | 3D extruded `{` and `}` brackets that orbit, rotate, react to mouse parallax, scroll progress, and continuously cycle through Google's brand colors. |
| **3. Signature Google Glow Button** | CSS `@property` + Keyframes | Rotating conic-gradient border, quad-corner multi-color aura (Blue, Red, Yellow, Green), dual-masking cutout, and pointer-down shockwave burst. |
| **4. Staggered Rolling Text** | CSS & JS (Vanilla + GSAP) | Letter-by-letter vertical cascade roll on link or button hover. |
| **5. Google 4-Dot Bouncing Preloader** | Pure CSS | The canonical Google blue, red, yellow, green bouncing loader. |
| **6. Angled Dual-Clip Split Showcase** | CSS `clip-path` | Diagonal polygon split banner with hover zoom and radial vignettes. |
| **7. Infinite Seamless Marquee** | Pure CSS | Smooth sponsor/partner ticker with gradient edge masks and hover-pause. |

---

## 🚀 Quick Start / Live Demo

A complete interactive showcase is included in `index.html`.

To view it locally:
```bash
# Start any static local server:
npx serve /Users/godjoel/.gemini/antigravity/scratch/devfest-animations-kit
# or with Python:
cd /Users/godjoel/.gemini/antigravity/scratch/devfest-animations-kit && python3 -m http.server 3000
```
Then open `http://localhost:3000` in your browser.

---

## 🏛️ 1. Architectural Sketch → Building Transformation (Venue Reveal)

### Assets Required
Included in `assets/`:
- `assets/venue-lines.svg`: Vector architectural line drawing (586 KB).
- `assets/venue.webp`: High-resolution photograph of the building (552 KB).

### HTML (Pure Vanilla)
```html
<link rel="stylesheet" href="css/venue-reveal.css" />

<div id="venue-reveal" class="venue-reveal" style="height: 520px;">
  <div class="venue-reveal__caption">
    <span class="venue-reveal__tagline">The Flagship Venue</span>
    <h3 class="venue-reveal__title">IITM Research Park</h3>
    <p class="venue-reveal__subtitle">Kanagam Road, Taramani, Chennai</p>
  </div>
</div>

<script type="module">
  import { VenueReveal } from "./js/venue-reveal.js";

  const venue = new VenueReveal("#venue-reveal", {
    svgUrl: "assets/venue-lines.svg",
    photoUrl: "assets/venue.webp",
    autoPlayOnScroll: true
  });

  // Replay anytime:
  // venue.reset(); venue.play();
</script>
```

### React Component
```tsx
import { VenueReveal } from "./react/VenueReveal";

export function VenueSection() {
  return (
    <VenueReveal
      svgUrl="assets/venue-lines.svg"
      photoUrl="assets/venue.webp"
      title="IITM Research Park"
      subtitle="Kanagam Road, Taramani, Chennai"
    />
  );
}
```

---

## 🎨 2. Google Glow Button

### CSS
Include `css/glow-button.css` in your project.

### HTML (Pure Vanilla)
```html
<button class="glow-btn" data-shape="pill">
  <span class="glow-btn__corners" aria-hidden="true"></span>
  <span class="glow-btn__surface">
    <span class="glow-btn__label">Get tickets →</span>
  </span>
</button>

<script type="module">
  import { initGlowButtons } from "./js/glow-button.js";
  initGlowButtons(); // Adds pointer-down burst physics
</script>
```

### React Component
```tsx
import { GlowButton } from "./react/GlowButton";

export function App() {
  return (
    <GlowButton shape="pill" onClick={() => alert("Clicked!")}>
      Get tickets →
    </GlowButton>
  );
}
```

---

## 🔤 2. Rolling Text Hover Effect

### CSS & Vanilla JS
Include `css/rolling-text.css` and `js/rolling-text.js`:

```html
<a href="/agenda">
  <span data-stagger-roll>Explore Schedule</span> →
</a>

<script type="module">
  import { initStaggerRollingText } from "./js/rolling-text.js";
  initStaggerRollingText();
</script>
```

### React Component
```tsx
import { RollingText } from "./react/RollingText";

export function NavLink() {
  return (
    <a href="/agenda" className="text-white hover:text-white/80">
      <RollingText>Explore Schedule</RollingText> →
    </a>
  );
}
```

---

## 🌐 3. 3D Floating WebGL Brackets

### Requirements
Requires [Three.js](https://threejs.org/) and `SVGLoader`.

```html
<div id="brackets-canvas" style="position:fixed;inset:0;pointer-events:none;"></div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/SVGLoader.js"></script>

<script type="module">
  import { BracketsField } from "./js/brackets-field.js";

  const brackets = new BracketsField("#brackets-canvas", {
    enableMouseParallax: true,
    enableScroll: true,
    autoRotate: true
  });
</script>
```

### React Component
```tsx
import { BracketsCanvas } from "./react/BracketsCanvas";

export function Background() {
  return <BracketsCanvas enableMouseParallax={true} enableScroll={true} />;
}
```

---

## 🔴 4. Google 4-Dot Preloader

### CSS
Include `css/google-preloader.css`:

```html
<div class="google-preloader">
  <div class="google-preloader__track">
    <div class="google-preloader__dot"></div>
    <div class="google-preloader__dot"></div>
    <div class="google-preloader__dot"></div>
    <div class="google-preloader__dot"></div>
  </div>
</div>
```

---

## 📐 5. Diagonal Split Banner

### CSS
Include `css/split-banner.css`:

```html
<div class="split-showcase">
  <!-- Top Split -->
  <div class="split-showcase__panel split-showcase__panel--top">
    <img src="your-image-1.jpg" class="split-showcase__bg" alt="Top Panel" />
    <div class="split-showcase__vignette--top"></div>
    <div class="split-showcase__content split-showcase__content--top">
      <h3 class="split-showcase__title">Present</h3>
      <p class="split-showcase__desc">Share your knowledge with the community.</p>
    </div>
  </div>

  <!-- Bottom Split -->
  <div class="split-showcase__panel split-showcase__panel--bottom">
    <img src="your-image-2.jpg" class="split-showcase__bg" alt="Bottom Panel" />
    <div class="split-showcase__vignette--bottom"></div>
    <div class="split-showcase__content split-showcase__content--bottom">
      <p class="split-showcase__desc">Learn, connect and build with the community.</p>
      <h3 class="split-showcase__title">Attend</h3>
    </div>
  </div>
</div>
```

---

## ♾️ 6. Infinite Marquee Ticker

### CSS
Include `css/infinite-marquee.css`:

```html
<div class="infinite-marquee">
  <div class="infinite-marquee__track">
    <span class="infinite-marquee__item">Google Cloud</span>
    <span class="infinite-marquee__item">Android</span>
    <span class="infinite-marquee__item">Firebase</span>
  </div>
  <div class="infinite-marquee__track" aria-hidden="true">
    <span class="infinite-marquee__item">Google Cloud</span>
    <span class="infinite-marquee__item">Android</span>
    <span class="infinite-marquee__item">Firebase</span>
  </div>
</div>
```

---

## 📁 Directory Structure

```
devfest-animations-kit/
├── index.html                   # Interactive live demo showcase
├── README.md                    # Documentation & usage guide
├── css/
│   ├── glow-button.css          # Rotating conic border, corners glow & burst
│   ├── rolling-text.css         # Rolling text CSS rules
│   ├── google-preloader.css     # Google 4-dot bouncing animation
│   ├── split-banner.css         # Diagonal clip-path split banner
│   └── infinite-marquee.css     # Infinite marquee ticker
├── js/
│   ├── glow-button.js           # Burst ripple interaction trigger
│   ├── rolling-text.js          # Staggered letter cascade (Vanilla & GSAP)
│   └── brackets-field.js        # Three.js WebGL 3D brackets background
├── react/
│   ├── GlowButton.tsx           # React Glow Button
│   ├── RollingText.tsx          # React Rolling Text
│   ├── BracketsCanvas.tsx       # React 3D WebGL Canvas
│   ├── GooglePreloader.tsx      # React Preloader
│   └── InfiniteMarquee.tsx      # React Marquee
└── svg/
    ├── left_bracket.svg         # SVG vector geometry of left bracket
    └── right_bracket.svg        # SVG vector geometry of right bracket
```
