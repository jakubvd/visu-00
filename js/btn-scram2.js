// Smooth, premium flicker effect for some letters in a button text, always restoring the original text.
// This effect repeatedly scrambles random letters and then restores them quickly, creating a flicker effect.
function premiumFlicker(element, duration = 600, interval = 100) {
  // Store the original text from a data attribute or current text content
  const original = element.dataset.originalText || element.textContent;
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  let letters = original.split('');
  let time = 0;

  const flicker = setInterval(() => {
    // Pick one random index that is not a space to replace temporarily with a random char
    let idx = Math.floor(Math.random() * letters.length);
    let tryCount = 0;
    while (letters[idx] === ' ' && tryCount < 10) {
      idx = Math.floor(Math.random() * letters.length);
      tryCount++;
    }

    const origChar = letters[idx];
    letters[idx] = chars[Math.floor(Math.random() * chars.length)];
    element.textContent = letters.join('');

    // Restore original char after half the interval
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

// Convert rem to pixels dynamically based on the root font size
function remToPx(rem) {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

document.addEventListener('DOMContentLoaded', function() {
  // Select all buttons with the attribute data-scramble-hover="true"
  const scramButtons = document.querySelectorAll('[data-scramble-hover="true"]');
  if (!scramButtons.length) {
    console.warn('No buttons found with [data-scramble-hover="true"]!');
    return;
  }

  scramButtons.forEach(button => {
    // The span containing the button text, required for the flicker effect
    const textSpan = button.querySelector('.btn-text');
    if (!textSpan) {
      console.warn('No .btn-text element found in button:', button);
      return;
    }

    let flickerIntervalId = null;

    // Store original text in a data attribute if not already set
    if (!textSpan.dataset.originalText) textSpan.dataset.originalText = textSpan.textContent;

    // Store original widths and paddings to restore on mouse leave
    let originalButtonWidth = null;
    let originalTextWidth = null;
    let originalPaddingLeft = null;
    let originalPaddingRight = null;

    // Set position relative on button to avoid layout shift when padding changes
    button.style.position = 'relative';

    // Function to lock widths of button and textSpan and add 2px padding on each side to button
    function lockWidthsAndAddPadding() {
      // Reset any previous inline styles to get accurate natural widths
      button.style.width = '';
      button.style.minWidth = '';
      button.style.maxWidth = '';
      textSpan.style.width = '';
      textSpan.style.minWidth = '';
      textSpan.style.maxWidth = '';

      // Ensure textSpan display and white-space to get correct width
      if (textSpan.style.display !== 'inline-block') textSpan.style.display = 'inline-block';
      if (textSpan.style.whiteSpace !== 'nowrap') textSpan.style.whiteSpace = 'nowrap';

      // Get natural widths
      originalButtonWidth = button.offsetWidth;
      originalTextWidth = textSpan.offsetWidth;

      // Get computed paddings
      const computedStyle = getComputedStyle(button);
      originalPaddingLeft = parseFloat(computedStyle.paddingLeft);
      originalPaddingRight = parseFloat(computedStyle.paddingRight);

      // Add 2px padding to left and right
      const paddingIncrement = 2; // in pixels

      // Lock widths including current width + 4px padding total (2px each side)
      button.style.width = originalButtonWidth + paddingIncrement * 2 + 'px';
      button.style.minWidth = button.style.width;
      button.style.maxWidth = button.style.width;

      textSpan.style.width = originalTextWidth + 'px';
      textSpan.style.minWidth = textSpan.style.width;
      textSpan.style.maxWidth = textSpan.style.width;

      // Animate padding with 500ms ease-in transition
      button.style.transition = 'padding-left 500ms ease-in, padding-right 500ms ease-in';

      // Apply new padding values (original + 2px)
      button.style.paddingLeft = (originalPaddingLeft + paddingIncrement) + 'px';
      button.style.paddingRight = (originalPaddingRight + paddingIncrement) + 'px';
    }

    // Function to unlock widths and reset paddings and transitions
    function unlockWidthsAndResetPadding() {
      button.style.transition = 'padding-left 500ms ease-in, padding-right 500ms ease-in';

      // Reset widths to default (remove inline styles)
      button.style.width = '';
      button.style.minWidth = '';
      button.style.maxWidth = '';

      textSpan.style.width = '';
      textSpan.style.minWidth = '';
      textSpan.style.maxWidth = '';

      // Reset padding to original (remove inline styles)
      button.style.paddingLeft = '';
      button.style.paddingRight = '';

      // Reset display and white-space for textSpan
      if (textSpan.style.display === 'inline-block') textSpan.style.display = '';
      if (textSpan.style.whiteSpace === 'nowrap') textSpan.style.whiteSpace = '';
    }

    // Mouse enter event: lock widths, start flicker, add padding
    button.addEventListener('mouseenter', () => {
      if (flickerIntervalId !== null) return;
      lockWidthsAndAddPadding();
      flickerIntervalId = premiumFlicker(textSpan, 600, 90);
    });

    // Mouse leave event: clear flicker, restore original text, unlock widths, reset padding
    button.addEventListener('mouseleave', () => {
      if (flickerIntervalId !== null) {
        clearInterval(flickerIntervalId);
        flickerIntervalId = null;
      }
      textSpan.textContent = textSpan.dataset.originalText;
      unlockWidthsAndResetPadding();
    });
  });
});