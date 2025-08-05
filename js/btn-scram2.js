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

    // Lock widths function locks button and textSpan widths to prevent layout shifting during flicker
    function lockWidths() {
      button.style.width = '';
      button.style.minWidth = '';
      button.style.maxWidth = '';
      textSpan.style.width = '';
      textSpan.style.minWidth = '';
      textSpan.style.maxWidth = '';

      if (textSpan.style.display !== 'inline-block') {
        textSpan.style.display = 'inline-block';
      }
      if (textSpan.style.whiteSpace !== 'nowrap') {
        textSpan.style.whiteSpace = 'nowrap';
      }

      const btnWidth = button.offsetWidth;
      const textWidth = textSpan.offsetWidth;

      button.style.width = btnWidth + 'px';
      button.style.minWidth = btnWidth + 'px';
      button.style.maxWidth = btnWidth + 'px';

      textSpan.style.width = textWidth + 'px';
      textSpan.style.minWidth = textWidth + 'px';
      textSpan.style.maxWidth = textWidth + 'px';
    }

    // Unlock widths function resets the widths and display properties
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

    // Function to add 0.125rem padding to left and right dynamically on hover with smooth transition
    function addHoverPadding() {
      const paddingIncrement = remToPx(0.125); // convert 0.125rem to px

      // Get computed style padding-left and padding-right to calculate new padding values
      const computedStyle = getComputedStyle(button);
      const currentPaddingLeft = parseFloat(computedStyle.paddingLeft);
      const currentPaddingRight = parseFloat(computedStyle.paddingRight);

      // Set position relative to prevent layout shift
      button.style.position = 'relative';
      button.style.transition = 'padding-left 0.3s ease, padding-right 0.3s ease';

      // Increase padding left and right by 0.125rem (in px)
      button.style.paddingLeft = (currentPaddingLeft + paddingIncrement) + 'px';
      button.style.paddingRight = (currentPaddingRight + paddingIncrement) + 'px';
    }

    // Function to reset padding to original values on mouse leave
    function resetPadding() {
      button.style.transition = 'padding-left 0.3s ease, padding-right 0.3s ease';
      button.style.paddingLeft = '';
      button.style.paddingRight = '';
    }

    // Mouse enter event: lock widths, start flicker, add extra padding
    button.addEventListener('mouseenter', () => {
      if (flickerIntervalId !== null) return;
      lockWidths();
      flickerIntervalId = premiumFlicker(textSpan, 600, 90);
      addHoverPadding();
    });

    // Mouse leave event: clear flicker, restore original text, unlock widths, reset padding
    button.addEventListener('mouseleave', () => {
      if (flickerIntervalId !== null) {
        clearInterval(flickerIntervalId);
        flickerIntervalId = null;
      }
      textSpan.textContent = textSpan.dataset.originalText;
      unlockWidths();
      resetPadding();
    });
  });
});