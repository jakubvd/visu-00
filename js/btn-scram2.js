// Smooth, premium flicker — only some letters, always restore original text
function premiumFlicker(element, duration = 700, interval = 250) {
  const original = element.dataset.originalText || element.textContent;
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  let letters = original.split('');
  let time = 0;

  // Block breaking to 2 lines and lock width
  element.style.whiteSpace = 'nowrap';
  element.style.width = element.offsetWidth + 'px';
  element.style.display = 'inline-block';

  const flicker = setInterval(() => {
    if (Math.random() > 0.7) return; // Skip this interval 30% of the time

    // Pick 1 random index (only lowercase letters)
    let idx = Math.floor(Math.random() * letters.length);
    let tryCount = 0;
    while (
      (letters[idx] === ' ' || letters[idx] !== letters[idx].toLowerCase()) &&
      tryCount < 20
    ) {
      idx = Math.floor(Math.random() * letters.length);
      tryCount++;
    }

    const origChar = letters[idx];
    letters[idx] = chars[Math.floor(Math.random() * chars.length)];
    element.textContent = letters.join('');

    setTimeout(() => {
      letters[idx] = origChar;
      element.textContent = letters.join('');
    }, interval / 1.2);

    time += interval;
    if (time >= duration) {
      clearInterval(flicker);
      element.textContent = original;
      element.style.width = '';
      element.style.display = '';
      element.style.whiteSpace = '';
    }
  }, interval);

  return flicker;
}

// set correct data attribute for hover effect
document.addEventListener('DOMContentLoaded', function() {
  // Select all buttons with the correct data attribute
  const scramButtons = document.querySelectorAll('[data-scramble-hover="true"]');
  if (!scramButtons.length) {
    console.warn('No buttons found with [scramble-hover="true"]!');
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

    button.addEventListener('mouseenter', () => {
      if (flickerIntervalId !== null) return;
      button.style.width = button.offsetWidth + 'px';
      textSpan.style.width = textSpan.offsetWidth + 'px';
      textSpan.style.display = 'inline-block';
      textSpan.style.whiteSpace = 'nowrap';

      flickerIntervalId = premiumFlicker(textSpan, 700, 250); // 700ms total, 150ms interval
    });

    button.addEventListener('mouseleave', () => {
      if (flickerIntervalId !== null) {
        clearInterval(flickerIntervalId);
        flickerIntervalId = null;
      }
      textSpan.textContent = textSpan.dataset.originalText;
      const savedWidth = textSpan.getAttribute('data-width');
      if (savedWidth) {
        textSpan.style.width = savedWidth;
      } else {
        textSpan.style.width = '';
      }
      textSpan.style.display = '';
      textSpan.style.whiteSpace = '';
      button.style.width = '';
    });
  });
});