// Utility function to flicker letters in a text element
function flickerSingleLetters(element, duration = 600, interval = 35) {
  const original = element.textContent;
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  let letters = original.split('');
  let time = 0;

  const flicker = setInterval(() => {
    // Pick a random index
    const idx = Math.floor(Math.random() * letters.length);
    // Store original letter
    const origChar = letters[idx];
    // Replace with random char
    letters[idx] = chars[Math.floor(Math.random() * chars.length)];
    element.textContent = letters.join('');

    setTimeout(() => {
      // Restore the original letter after short time
      letters[idx] = origChar;
      element.textContent = letters.join('');
    }, interval);

    time += interval;
    if (time > duration) {
      clearInterval(flicker);
      element.textContent = original; // Ensure original at end
    }
  }, interval);

  // Return the interval ID so it can be cleared externally if needed
  return flicker;
}

// On DOM content loaded, initialize flicker effect on all buttons with data attribute
document.addEventListener('DOMContentLoaded', () => {
  // Select all buttons or elements with data-btn-scram="true"
  const scramButtons = document.querySelectorAll('[data-btn-scram="true"]');

  scramButtons.forEach(button => {
    // Find the text span inside the button (do not affect icon spans)
    const textSpan = button.querySelector('.btn-text');
    if (!textSpan) return; // Skip if no text span found

    let flickerIntervalId = null; // To keep track of flicker interval

    // On mouse enter, start flicker animation
    button.addEventListener('mouseenter', () => {
      // Prevent multiple intervals running simultaneously
      if (flickerIntervalId !== null) return;

      flickerIntervalId = flickerSingleLetters(textSpan, 700, 40);
    });

    // On mouse leave, clear flicker and restore original text immediately
    button.addEventListener('mouseleave', () => {
      if (flickerIntervalId !== null) {
        clearInterval(flickerIntervalId);
        flickerIntervalId = null;
      }
      // Restore original text immediately
      if (textSpan.dataset.originalText) {
        textSpan.textContent = textSpan.dataset.originalText;
      } else {
        // Store original text if not stored yet
        textSpan.dataset.originalText = textSpan.textContent;
      }
    });

    // Store the original text initially to data attribute for restoration
    textSpan.dataset.originalText = textSpan.textContent;
  });
});