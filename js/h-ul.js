/**
 * PREMIUM Underline Effect
 * - Dynamically sets underline animation speed based on text length
 * - Blocks "double hover" for 2s to avoid glitches
 * - Usage: Add data-underline-hover="true" to any text element
 * - Requires matching CSS for .active state and transition using --underline-anim-duration
 */

// How long to block re-hover (must be >= transition duration)
const underlineBlockTime = 2000; // ms, set to 2000ms = 2s

document.querySelectorAll('[data-underline-hover="true"]').forEach((el) => {
  // --------- DYNAMIC ANIMATION DURATION SETUP ---------
  // Calculate duration: 0.02s per character, min 0.15s, max 0.45s
  const textLength = el.textContent.trim().length;
  let duration = Math.max(0.15, Math.min(0.02 * textLength, 0.45));
  // Set CSS custom property for this element
  el.style.setProperty('--underline-anim-duration', duration + 's');

  // --------- PREMIUM BLOCK HOVER LOGIC ---------
  let hoverTimeout;
  let blockHover = false; // Prevent rapid multiple hovers

  el.addEventListener('mouseenter', () => {
    if (blockHover) return; // Ignore if within block window
    blockHover = true;      // Block further hovers

    clearTimeout(hoverTimeout);
    el.classList.add('active');

    // Unblock after specified time (make sure matches or exceeds animation)
    setTimeout(() => {
      blockHover = false;
    }, underlineBlockTime);
  });

  el.addEventListener('mouseleave', () => {
    // Use the calculated duration for the transition delay
    hoverTimeout = setTimeout(() => {
      el.classList.remove('active');
    }, duration * 1000); // Delay matches transition duration for smoothness
  });
});