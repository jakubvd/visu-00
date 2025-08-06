/****
 * PREMIUM Underline Effect v4 (with router support)
 * - Use data-underline-hover="true" for solo elements (headings, links, etc.)
 * - Use data-underline-hover="receive" for text INSIDE buttons, trigger via parent with data-underline-text-router="true"
 * - Button: <a ... data-underline-text-router="true"><span ... data-underline-hover="receive"></span></a>
 * - Text: <span ... data-underline-hover="true">...</span>
 */

// Block double hover for 2s to avoid glitches
const underlineBlockTime = 2000; // ms

// For router use-case: trigger underline on child
document.querySelectorAll('[data-underline-text-router="true"]').forEach((router) => {
  const text = router.querySelector('[data-underline-hover="receive"]');
  if (!text) return;

  router.addEventListener('mouseenter', () => triggerUnderline(text));
  router.addEventListener('mouseleave', () => triggerUnderlineOut(text));
});

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

/******************************
 * UNDERLINE EFFECT ON BUTTON TEXT ONLY
 * Allows underline to follow just the text, not the whole button with padding.
 * Usage: Add data-underline-hover="true" to button and ensure text inside has .btn-text class
 * Example for Webflow: <a class="button is-secondary" ... data-underline-hover="true"><span class="btn-text">Text</span></a>
 ******************************/
document.querySelectorAll('.button.is-secondary[data-underline-hover="true"]').forEach((button) => {
  // Find the text span inside the button
  const text = button.querySelector('.btn-text');
  if (!text) return;

  // Add underline effect only to text on button hover
  button.addEventListener('mouseenter', () => text.classList.add('active'));
  button.addEventListener('mouseleave', () => text.classList.remove('active'));
});