/**
 * DevFest Glow Button - Pointer Burst Trigger
 * Attaches the ripple/burst animation on pointerdown to any element with .glow-btn
 */
export function initGlowButtons(root = document) {
  const buttons = root.querySelectorAll(".glow-btn");

  buttons.forEach((btn) => {
    // Avoid double attaching
    if (btn.dataset.glowAttached) return;
    btn.dataset.glowAttached = "true";

    btn.addEventListener("pointerdown", () => {
      triggerGlowBurst(btn);
    });
  });
}

export function triggerGlowBurst(buttonElement) {
  if (!buttonElement) return;

  // Clear existing timeout if currently bursting
  if (buttonElement._burstTimeout) {
    clearTimeout(buttonElement._burstTimeout);
  }

  // Remove class and force reflow to allow re-triggering rapid clicks
  buttonElement.classList.remove("glow-btn--burst");
  void buttonElement.offsetWidth;
  buttonElement.classList.add("glow-btn--burst");

  buttonElement._burstTimeout = setTimeout(() => {
    buttonElement.classList.remove("glow-btn--burst");
    buttonElement._burstTimeout = null;
  }, 900);
}

// Auto-initialize on DOM ready if run in browser
if (typeof window !== "undefined" && typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initGlowButtons());
  } else {
    initGlowButtons();
  }
}
