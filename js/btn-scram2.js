// Smooth, premium flicker — only some letters, always restore original text
function premiumFlicker(element, duration = 600, interval = 100) {
  const original = element.dataset.originalText || element.textContent;
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  let letters = original.split('');
  let time = 0;

  const flicker = setInterval(() => {
    // Pick 1 random index (not a space)
    let idx = Math.floor(Math.random() * letters.length);
    let tryCount = 0;
    while (letters[idx] === ' ' && tryCount < 10) {
      idx = Math.floor(Math.random() * letters.length);
      tryCount++;
    }

    const origChar = letters[idx];
    letters[idx] = chars[Math.floor(Math.random() * chars.length)];
    element.textContent = letters.join('');

    setTimeout(() => {
      letters[idx] = origChar;
      element.textContent = letters.join('');
    }, interval / 2);

    time += interval;
    if (time >= duration) {
      clearInterval(flicker);
      element.textContent = original;
    }
  }, interval);

  return flicker;
}

// set correct data attribute for hover effect
document.addEventListener('DOMContentLoaded', function() {
  // Select all buttons with the correct data attribute
  const scramButtons = document.querySelectorAll('[data-scramble-hover="true"]');
  if (!scramButtons.length) {
    console.warn('No buttons found with [data-scramble-hover="true"]!');
    return;
  }

  scramButtons.forEach(button => {
    // .btn-text inside button required
    const textSpan = button.querySelector('.btn-text');
    if (!textSpan) {
      console.warn('No .btn-text element found in button:', button);
      return;
    }

    let flickerIntervalId = null;
    if (!textSpan.dataset.originalText) textSpan.dataset.originalText = textSpan.textContent;

    // Get the button variant for hover color
    const variant = button.getAttribute('data-button-variant') || 'dark';

    // Store static bg vars for each variant
    const hoverDark = 'var(--bg-color--button-hover-dark)';
    const hoverLight = 'var(--bg-color--button-hover-light)';
    // Store original static bg var for reset
    const originalBg = button.getAttribute('data-bg-color') || 'var(--bg-color--button-main-bg-blue)';

    function setHoverBg() {
      button.style.transition = 'background-color 0.5s cubic-bezier(0.5,0,0,1)';
      if (variant === 'dark') button.style.backgroundColor = hoverDark;
      else button.style.backgroundColor = hoverLight;
    }
    function unsetHoverBg() {
      button.style.transition = 'background-color 0.5s cubic-bezier(0.5,0,0,1)';
      button.style.backgroundColor = originalBg;
    }

    // --------
    // UPDATED: lockWidths() now locks ONLY the button width for smooth center alignment and zero shifting.
    // Steps:
    // 1. Remove any width-related styles from button and textSpan to measure natural width.
    // 2. Measure button's natural width (including padding and content).
    // 3. Lock only button's width, minWidth, and maxWidth to this measured width in px.
    // 4. Do NOT set any width, minWidth, or maxWidth on textSpan.
    // 5. Ensure textSpan keeps display: inline-block and white-space: nowrap for smooth animation (set only if necessary).
    function lockWidths() {
      // Remove width-related styles to get natural widths
      button.style.width = '';
      button.style.minWidth = '';
      button.style.maxWidth = '';
      textSpan.style.width = '';
      textSpan.style.minWidth = '';
      textSpan.style.maxWidth = '';

      // Ensure textSpan has inline-block and nowrap for smooth flicker animation
      // Only set if not already set to avoid unnecessary style changes
      if (textSpan.style.display !== 'inline-block') {
        textSpan.style.display = 'inline-block';
      }
      if (textSpan.style.whiteSpace !== 'nowrap') {
        textSpan.style.whiteSpace = 'nowrap';
      }

      // Measure button's natural width (includes padding and content)
      const btnWidth = button.offsetWidth;

      // Lock button width only
      button.style.width = btnWidth + 'px';
      button.style.minWidth = btnWidth + 'px';
      button.style.maxWidth = btnWidth + 'px';

      // Do NOT set any width properties on textSpan to allow smooth center alignment and zero shifting
    }

    // UPDATED: unlockWidths() removes only width-related styles from button,
    // and restores textSpan's display and whiteSpace to default (removes if set by script).
    function unlockWidths() {
      // Remove width locks from button
      button.style.width = '';
      button.style.minWidth = '';
      button.style.maxWidth = '';

      // Remove display and whiteSpace styles from textSpan if they were set by this script
      if (textSpan.style.display === 'inline-block') {
        textSpan.style.display = '';
      }
      if (textSpan.style.whiteSpace === 'nowrap') {
        textSpan.style.whiteSpace = '';
      }

      // Do NOT touch any width-related styles on textSpan because we did not set them
    }
    // --------

    button.addEventListener('mouseenter', () => {
      if (flickerIntervalId !== null) return;
      lockWidths();
      setHoverBg();
      flickerIntervalId = premiumFlicker(textSpan, 600, 90);
    });

    button.addEventListener('mouseleave', () => {
      if (flickerIntervalId !== null) {
        clearInterval(flickerIntervalId);
        flickerIntervalId = null;
      }
      textSpan.textContent = textSpan.dataset.originalText;
      unlockWidths();
      unsetHoverBg();
    });
  });
});