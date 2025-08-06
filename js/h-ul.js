/**
 * PREMIUM Underline Effect v2 - Always finish IN before OUT
 * - Dynamically sets underline animation speed based on text length
 * - Blocks "double hover" for 2s to avoid glitches
 * - Usage: Add data-underline-hover="true" to any text element
 * - Requires matching CSS for .active state and transition using --underline-anim-duration
 */

const underlineBlockTime = 2000; // ms - blokada przed ponownym hoverem

document.querySelectorAll('[data-underline-hover="true"]').forEach((el) => {
  // --------- DYNAMIC ANIMATION DURATION SETUP ---------
  // Calculate duration: 0.02s per character, min 0.15s, max 0.45s
  const textLength = el.textContent.trim().length;
  let duration = Math.max(0.15, Math.min(0.02 * textLength, 0.45)); // seconds
  // Set CSS custom property for this element
  el.style.setProperty('--underline-anim-duration', duration + 's');

  // --------- PREMIUM BLOCK HOVER AND ANIMATION CONTROL ---------
  let isAnimatingIn = false;
  let shouldRemoveActive = false;
  let hoverTimeout;
  let blockHover = false;

  el.addEventListener('mouseenter', () => {
    if (blockHover) return;

    blockHover = true;
    isAnimatingIn = true;
    shouldRemoveActive = false;

    clearTimeout(hoverTimeout);
    el.classList.add('active');

    // After anim IN, allow OFF if user already left
    setTimeout(() => {
      isAnimatingIn = false;
      if (shouldRemoveActive) {
        el.classList.remove('active');
      }
      // Unblock hover after IN animation + block time
      setTimeout(() => {
        blockHover = false;
      }, underlineBlockTime);
    }, duration * 1000);
  });

  el.addEventListener('mouseleave', () => {
    if (isAnimatingIn) {
      shouldRemoveActive = true; // Wait for IN to finish
    } else {
      el.classList.remove('active');
    }
  });
});