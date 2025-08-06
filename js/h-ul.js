/****
 * PREMIUM Underline Effect v3 - Always finish IN before OUT, no glitch on fast hover out
 * - Underline animates fully in even on fast mouseleave, then animates out
 * - Blocks double hover for 2s to avoid glitches
 * - Usage: Add data-underline-hover="true" to any text element
 * - Requires matching CSS for .active state and transition using --underline-anim-duration
 */

const underlineBlockTime = 2000; // ms - block before re-hover

document.querySelectorAll('[data-underline-hover="true"]').forEach((el) => {
  // Calculate dynamic duration: 0.02s per char, min 0.15s, max 0.45s
  const textLength = el.textContent.trim().length;
  let duration = Math.max(0.15, Math.min(0.02 * textLength, 0.45)); // seconds
  el.style.setProperty('--underline-anim-duration', duration + 's');

  let isAnimatingIn = false;
  let isAnimatingOut = false;
  let blockHover = false;
  let hoverOutQueued = false;

  el.addEventListener('mouseenter', () => {
    if (blockHover) return;

    blockHover = true;
    isAnimatingIn = true;
    hoverOutQueued = false;
    el.classList.add('active');

    // Allow OUT only after IN finishes
    setTimeout(() => {
      isAnimatingIn = false;
      // If mouse left before IN finished, queue OUT now
      if (hoverOutQueued) {
        isAnimatingOut = true;
        el.classList.remove('active');
        setTimeout(() => {
          isAnimatingOut = false;
        }, duration * 1000);
      }
      // Unblock hover after IN+block time (to avoid rapid retrigger)
      setTimeout(() => {
        blockHover = false;
      }, underlineBlockTime);
    }, duration * 1000);
  });

  el.addEventListener('mouseleave', () => {
    if (isAnimatingIn) {
      hoverOutQueued = true; // Wait for IN to finish, then run OUT
    } else if (!isAnimatingOut) {
      // Only animate OUT if not already animating out
      isAnimatingOut = true;
      el.classList.remove('active');
      setTimeout(() => {
        isAnimatingOut = false;
      }, duration * 1000);
    }
  });
});