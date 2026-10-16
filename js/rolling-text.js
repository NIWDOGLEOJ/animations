/**
 * DevFest Rolling Text Controller
 * Provides:
 * 1. Vanilla JS character-by-character staggered roll (Zero dependencies)
 * 2. GSAP SplitText timeline generator (Exact replica of DevFest website)
 */

/**
 * Automatically enhances elements with [data-rolling-text] or class .stagger-roll
 * into letter-by-letter staggered animations.
 */
export function initStaggerRollingText(selector = "[data-stagger-roll]") {
  const elements = document.querySelectorAll(selector);

  elements.forEach((el) => {
    if (el.dataset.staggerInit) return;
    el.dataset.staggerInit = "true";

    const text = el.textContent.trim();
    el.innerHTML = "";

    const wrapper = document.createElement("span");
    wrapper.className = "relative inline-block overflow-hidden align-bottom";

    const topSpan = document.createElement("span");
    topSpan.className = "inline-block";
    topSpan.setAttribute("data-roll", "top");

    const bottomSpan = document.createElement("span");
    bottomSpan.className = "pointer-events-none absolute left-0 top-0 inline-block";
    bottomSpan.setAttribute("data-roll", "bottom");
    bottomSpan.setAttribute("aria-hidden", "true");

    // Split each character into animated spans with staggered delay
    text.split("").forEach((char, index) => {
      const displayChar = char === " " ? "\u00A0" : char;
      const delay = index * 0.025; // 25ms stagger per char

      const topChar = document.createElement("span");
      topChar.className = "inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]";
      topChar.style.transitionDelay = `${delay}s`;
      topChar.textContent = displayChar;
      topSpan.appendChild(topChar);

      const bottomChar = document.createElement("span");
      bottomChar.className = "inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] translate-y-full";
      bottomChar.style.transitionDelay = `${delay}s`;
      bottomChar.textContent = displayChar;
      bottomSpan.appendChild(bottomChar);
    });

    wrapper.appendChild(topSpan);
    wrapper.appendChild(bottomSpan);
    el.appendChild(wrapper);

    // Hover listeners
    const trigger = el.closest("a, button") || el;

    trigger.addEventListener("mouseenter", () => {
      topSpan.querySelectorAll("span").forEach((span) => {
        span.style.transform = "translateY(-100%)";
      });
      bottomSpan.querySelectorAll("span").forEach((span) => {
        span.style.transform = "translateY(0%)";
      });
    });

    trigger.addEventListener("mouseleave", () => {
      topSpan.querySelectorAll("span").forEach((span) => {
        span.style.transform = "translateY(0%)";
      });
      bottomSpan.querySelectorAll("span").forEach((span) => {
        span.style.transform = "translateY(100%)";
      });
    });
  });
}

/**
 * Exact GSAP integration method matching DevFest website
 * Usage: attachGsapRollingText(element, gsapInstance, SplitTextPlugin)
 */
export function attachGsapRollingText(element, gsap, SplitText) {
  if (!element || !gsap) return;

  const topEl = element.querySelector("[data-roll='top']");
  const bottomEl = element.querySelector("[data-roll='bottom']");
  if (!topEl || !bottomEl) return;

  let topSplit = SplitText ? new SplitText(topEl, { type: "chars" }) : null;
  let bottomSplit = SplitText ? new SplitText(bottomEl, { type: "chars" }) : null;

  const topChars = topSplit ? topSplit.chars : topEl.children;
  const bottomChars = bottomSplit ? bottomSplit.chars : bottomEl.children;

  gsap.set(bottomChars, { yPercent: 100 });

  const tl = gsap.timeline({ paused: true })
    .to(topChars, { yPercent: -100, duration: 0.5, ease: "power4.inOut", stagger: 0.025 }, 0)
    .to(bottomChars, { yPercent: 0, duration: 0.5, ease: "power4.inOut", stagger: 0.025 }, 0);

  const trigger = element.closest("a, button") || element;
  trigger.addEventListener("mouseenter", () => tl.play());
  trigger.addEventListener("mouseleave", () => tl.reverse());

  return () => {
    tl.kill();
    if (topSplit) topSplit.revert();
    if (bottomSplit) bottomSplit.revert();
  };
}
