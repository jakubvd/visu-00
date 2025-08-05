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

    // --------
    // UPDATED: lockWidths() now locks button and .btn-text widths for smooth center alignment and zero shifting.
    // Steps:
    // 1. Remove any width-related styles from button and textSpan to measure natural widths.
    // 2. Measure button's natural width (including padding and content).
    // 3. Measure textSpan's natural width.
    // 4. Lock button's width, minWidth, and maxWidth to its measured width in px.
    // 5. Lock textSpan's width, minWidth, and maxWidth to its measured width in px.
    // 6. Ensure textSpan keeps display: inline-block and white-space: nowrap for smooth animation (set only if necessary).
    function lockWidths() {
      // Remove width-related styles to get natural widths
      button.style.width = '';
      button.style.minWidth = '';
      button.style.maxWidth = '';
      textSpan.style.width = '';
      textSpan.style.minWidth = '';
      textSpan.style.maxWidth = '';

      // Ensure textSpan has inline-block and nowrap for smooth flicker animation
      if (textSpan.style.display !== 'inline-block') {
        textSpan.style.display = 'inline-block';
      }
      if (textSpan.style.whiteSpace !== 'nowrap') {
        textSpan.style.whiteSpace = 'nowrap';
      }

      // Measure button and textSpan natural widths
      const btnWidth = button.offsetWidth;
      const textWidth = textSpan.offsetWidth;

      // Lock button width only
      button.style.width = btnWidth + 'px';
      button.style.minWidth = btnWidth + 'px';
      button.style.maxWidth = btnWidth + 'px';

      // Lock textSpan width to prevent micro-shifting (especially with icon)
      textSpan.style.width = textWidth + 'px';
      textSpan.style.minWidth = textWidth + 'px';
      textSpan.style.maxWidth = textWidth + 'px';
    }

    // UPDATED: unlockWidths() removes width-related styles from button and textSpan,
    // and restores textSpan's display and whiteSpace to default (removes if set by script).
    function unlockWidths() {
      button.style.width = '';
      button.style.minWidth = '';
      button.style.maxWidth = '';

      textSpan.style.width = '';
      textSpan.style.minWidth = '';
      textSpan.style.maxWidth = '';

      if (textSpan.style.display === 'inline-block') {
        textSpan.style.display = '';
      }
      if (textSpan.style.whiteSpace === 'nowrap') {
        textSpan.style.whiteSpace = '';
      }
    }
    // --------

    button.addEventListener('mouseenter', () => {
      if (flickerIntervalId !== null) return;
      lockWidths();
      flickerIntervalId = premiumFlicker(textSpan, 600, 90);
    });

    button.addEventListener('mouseleave', () => {
      if (flickerIntervalId !== null) {
        clearInterval(flickerIntervalId);
        flickerIntervalId = null;
      }
      textSpan.textContent = textSpan.dataset.originalText;
      unlockWidths();
    });
  });
});