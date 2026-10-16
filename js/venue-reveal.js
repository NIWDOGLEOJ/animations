/**
 * VenueReveal - Architectural Drawing to Real Building Transformation
 * Reverse-engineered directly from DevFest Chennai.
 * 
 * Works with both:
 * 1. GSAP + DrawSVG (Production DevFest mode)
 * 2. Native Web Animations API (WAAPI / Vanilla JS with ZERO dependencies)
 */

const ASPECT_RATIO = 1773 / 1167; // 1.51928

export class VenueReveal {
  constructor(container, options = {}) {
    this.container = typeof container === "string" ? document.querySelector(container) : container;
    if (!this.container) throw new Error("VenueReveal: container element not found");

    this.options = Object.assign({
      svgUrl: "assets/venue-lines.svg",
      photoUrl: "assets/venue.webp",
      autoPlayOnScroll: true,
      scrollThreshold: 0.35,
      staggerDelay: 0.008,
      duration: 1.6
    }, options);

    this.isPlaying = false;
    this.isCompleted = false;

    this.initDOM();
    this.initResponsiveSizing();
    this.loadSVG();

    if (this.options.autoPlayOnScroll) {
      this.initScrollTrigger();
    }
  }

  initDOM() {
    this.container.classList.add("venue-reveal");

    // Sizing Stage
    this.stage = document.createElement("div");
    this.stage.className = "venue-reveal__stage";

    // 1. Photo Layer
    this.photoLayer = document.createElement("div");
    this.photoLayer.className = "venue-reveal__photo-layer";
    this.photoImg = document.createElement("img");
    this.photoImg.className = "venue-reveal__photo";
    this.photoImg.src = this.options.photoUrl;
    this.photoImg.alt = "Venue Building";
    this.photoLayer.appendChild(this.photoImg);

    // 2. Lines Drawing Layer
    this.linesLayer = document.createElement("div");
    this.linesLayer.className = "venue-reveal__lines-layer";

    // 3. Cyan Flash Flare Layer
    this.flashLayer = document.createElement("div");
    this.flashLayer.className = "venue-reveal__flash";

    // 4. Vignette Layer
    this.vignetteLayer = document.createElement("div");
    this.vignetteLayer.className = "venue-reveal__vignette";

    // Assemble Stage
    this.stage.appendChild(this.photoLayer);
    this.stage.appendChild(this.linesLayer);
    this.stage.appendChild(this.flashLayer);
    this.stage.appendChild(this.vignetteLayer);

    // 5. Caption Overlay (if existing in container, keep it; else create default)
    let caption = this.container.querySelector(".venue-reveal__caption");
    if (!caption) {
      caption = document.createElement("div");
      caption.className = "venue-reveal__caption";
      caption.innerHTML = `
        <span class="venue-reveal__tagline">The Flagship Venue</span>
        <h3 class="venue-reveal__title">IITM Research Park</h3>
        <p class="venue-reveal__subtitle">Kanagam Road, Taramani, Chennai · Tamil Nadu 600113</p>
      `;
    }
    this.caption = caption;

    this.container.appendChild(this.stage);
    this.container.appendChild(this.caption);
  }

  initResponsiveSizing() {
    const update = () => {
      const containerW = this.container.clientWidth;
      const containerH = this.container.clientHeight;
      if (!containerW || !containerH) return;

      let width, height;
      if (containerW / containerH > ASPECT_RATIO) {
        width = containerW;
        height = containerW / ASPECT_RATIO;
      } else {
        height = containerH;
        width = containerH * ASPECT_RATIO;
      }

      this.stage.style.width = `${width}px`;
      this.stage.style.height = `${height}px`;
      this.stage.style.left = `${-(width - containerW) / 2}px`;
      this.stage.style.top = `${-Math.min((height - containerH) * 0.15, 0.03 * height)}px`;
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(this.container);
    this._ro = ro;
  }

  async loadSVG() {
    try {
      const res = await fetch(this.options.svgUrl);
      const svgText = await res.text();
      this.linesLayer.innerHTML = svgText;
      const svg = this.linesLayer.querySelector("svg");
      if (svg) {
        svg.setAttribute("shape-rendering", "optimizeSpeed");
        svg.style.width = "100%";
        svg.style.height = "100%";
      }

      this.paths = Array.from(this.linesLayer.querySelectorAll("path"));
      this.preparePathLengths();
    } catch (err) {
      console.warn("VenueReveal: Failed to load SVG file:", err);
    }
  }

  preparePathLengths() {
    this.pathData = this.paths.map((path) => {
      let length = 1000;
      try {
        length = path.getTotalLength();
      } catch (e) {
        // Fallback for non-rendered elements
      }
      path.style.strokeDasharray = `${length} ${length}`;
      path.style.strokeDashoffset = `${length}`;
      return { path, length };
    });
  }

  initScrollTrigger() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !this.isPlaying && !this.isCompleted) {
          this.play();
          observer.unobserve(this.container);
        }
      });
    }, { threshold: this.options.scrollThreshold });

    observer.observe(this.container);
    this._observer = observer;
  }

  /**
   * Triggers the complete drawing-to-building animation sequence
   */
  async play() {
    if (this.isPlaying) return;
    this.isPlaying = true;

    // Reset initial state
    this.container.classList.remove("venue-reveal--completed");
    this.linesLayer.style.opacity = "1";
    this.photoLayer.style.opacity = "0";
    this.photoLayer.style.filter = "blur(16px) brightness(100%)";
    this.photoLayer.style.transform = "scale(1.015)";
    this.flashLayer.style.opacity = "0";
    this.flashLayer.style.transform = "scale(0.97)";
    this.vignetteLayer.style.opacity = "0";
    this.caption.style.opacity = "0";
    this.caption.style.transform = "translateY(14px)";

    if (window.gsap && window.DrawSVGPlugin) {
      this.playGSAP();
      return;
    }

    // Native Web Animations API (WAAPI) Sequence
    if (!this.pathData || this.pathData.length === 0) {
      await this.loadSVG();
    }

    // Step 1: Staggered drawing of all architectural lines
    const drawPromises = this.pathData.map(({ path, length }, index) => {
      return path.animate([
        { strokeDashoffset: length },
        { strokeDashoffset: 0 }
      ], {
        duration: 650,
        delay: index * (this.options.staggerDelay * 1000),
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        fill: "forwards"
      }).finished;
    });

    // Wait for the full drawing to complete
    const totalDrawTime = 650 + (this.pathData.length * this.options.staggerDelay * 1000);
    await new Promise((r) => setTimeout(r, Math.min(totalDrawTime, 1400)));

    // Step 2: The Cyan Light Flash & Dissolve of lines
    this.linesLayer.style.opacity = "0";

    // Flash flare bloom
    const flashAnim = this.flashLayer.animate([
      { opacity: 0, transform: "scale(0.97)" },
      { opacity: 0.95, transform: "scale(1)", offset: 0.25 },
      { opacity: 0, transform: "scale(1.05)" }
    ], {
      duration: 1100,
      easing: "ease-out",
      fill: "forwards"
    });

    // Step 3: Real Photo Unblurs and blooms into crisp view
    this.photoLayer.style.opacity = "1";
    this.photoLayer.style.transform = "scale(1)";
    this.photoLayer.style.filter = "blur(0px) brightness(100%)";

    await flashAnim.finished;

    // Step 4: Settle photo brightness and bring in text & vignette
    this.photoLayer.style.filter = "blur(0px) brightness(80%)";
    this.vignetteLayer.style.opacity = "1";
    this.caption.style.opacity = "1";
    this.caption.style.transform = "translateY(0)";

    this.container.classList.add("venue-reveal--completed");
    this.isPlaying = false;
    this.isCompleted = true;
  }

  playGSAP() {
    const gsap = window.gsap;
    const tl = gsap.timeline({
      onComplete: () => {
        this.container.classList.add("venue-reveal--completed");
        this.isPlaying = false;
        this.isCompleted = true;
      }
    });

    tl.to(this.container, { opacity: 1, duration: 0.4 })
      .to(this.paths, {
        drawSVG: "100%",
        duration: 0.6,
        ease: "none",
        stagger: { amount: 1, from: "start" }
      }, "-=0.1")
      .addLabel("drawDone", "+=0.2")
      .set(this.linesLayer, { opacity: 0 }, "drawDone")
      .to(this.photoLayer, {
        opacity: 1,
        scale: 1,
        filter: "blur(0px) brightness(100%)",
        duration: 0.85
      }, "drawDone")
      .fromTo(this.flashLayer, 
        { opacity: 0, scale: 0.97 }, 
        { opacity: 0.95, scale: 1, duration: 0.28, ease: "power2.out" }, 
        "drawDone"
      )
      .to(this.flashLayer, { opacity: 0, scale: 1.05, duration: 1, ease: "sine.out" }, "drawDone+=0.28")
      .to(this.photoLayer, { filter: "blur(0px) brightness(80%)", duration: 0.6 }, "drawDone+=1.2")
      .to(this.vignetteLayer, { opacity: 1, duration: 0.7 }, "drawDone+=1.4")
      .to(this.caption, { opacity: 1, y: 0, duration: 0.7 }, "<");
  }

  reset() {
    this.isPlaying = false;
    this.isCompleted = false;
    this.container.classList.remove("venue-reveal--completed");
    this.linesLayer.style.opacity = "1";
    this.photoLayer.style.opacity = "0";
    this.vignetteLayer.style.opacity = "0";
    this.caption.style.opacity = "0";
    this.preparePathLengths();
  }

  destroy() {
    if (this._ro) this._ro.disconnect();
    if (this._observer) this._observer.disconnect();
  }
}
