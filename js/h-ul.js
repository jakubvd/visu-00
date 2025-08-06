/****
 * PREMIUM Underline Effect v4
 * - Use data-underline-hover="true" for solo elements (headings, links, etc.)
 */
document.addEventListener('DOMContentLoaded', function() {
  // Block double hover for 2s to avoid glitches
  const underlineBlockTime = 2000; // ms

  // For regular inline underline (no router)
  document.querySelectorAll('[data-underline-hover="true"]').forEach((el) => {
    el.addEventListener('mouseenter', () => triggerUnderline(el));
    el.addEventListener('mouseleave', () => triggerUnderlineOut(el));
  });

  // Store anim state per element (to allow both true/receive cases)
  const underlineAnimState = new WeakMap();

  // Universal underline IN function
  function triggerUnderline(el) {
    // Calculate anim duration based on text length
    const textLength = el.textContent.trim().length;
    let duration = Math.max(0.15, Math.min(0.02 * textLength, 0.45)); // seconds
    el.style.setProperty('--underline-anim-duration', duration + 's');

    let state = underlineAnimState.get(el) || {};
    if (state.blockHover) return;

    state.blockHover = true;
    state.isAnimatingIn = true;
    state.hoverOutQueued = false;
    el.classList.add('active');
    underlineAnimState.set(el, state);

    // After anim in finishes...
    setTimeout(() => {
      state.isAnimatingIn = false;
      // If hover left early, start anim out
      if (state.hoverOutQueued) {
        state.isAnimatingOut = true;
        el.classList.remove('active');
        setTimeout(() => {
          state.isAnimatingOut = false;
        }, duration * 1000);
      }
      // Unblock after block time
      setTimeout(() => {
        state.blockHover = false;
        underlineAnimState.set(el, state);
      }, underlineBlockTime);
      underlineAnimState.set(el, state);
    }, duration * 1000);
  }

  // Universal underline OUT function
  function triggerUnderlineOut(el) {
    let state = underlineAnimState.get(el) || {};
    const duration = parseFloat(el.style.getPropertyValue('--underline-anim-duration')) || 0.3;
    if (state.isAnimatingIn) {
      state.hoverOutQueued = true;
    } else if (!state.isAnimatingOut) {
      state.isAnimatingOut = true;
      el.classList.remove('active');
      setTimeout(() => {
        state.isAnimatingOut = false;
        underlineAnimState.set(el, state);
      }, duration * 1000);
    }
    underlineAnimState.set(el, state);
  }
});