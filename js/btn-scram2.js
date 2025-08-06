// Smooth, premium flicker — only some letters, always restore original text
function premiumFlicker(element, duration = 500, interval = 100) {
  const original = element.dataset.originalText || element.textContent;
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  let letters = original.split('');
  let time = 0;
  let currentIndex = 0;

  // Block breaking to 2 lines and lock width
  element.style.whiteSpace = 'nowrap';
  element.style.width = element.offsetWidth + 'px';
  element.style.display = 'inline-block';

  const flicker = setInterval(() => {
    if (Math.random() > 0.7) {
      // Skip this interval 30% of the time
      time += interval;
      if (time >= duration) {
        clearInterval(flicker);
        element.textContent = original;
        element.style.width = '';
        element.style.display = '';
        element.style.whiteSpace = '';
      }
      return;
    }

    // Find next lowercase letter index
    let tries = 0;
    while (
      (letters[currentIndex] === ' ' || letters[currentIndex] !== letters[currentIndex].toLowerCase()) &&
      tries < letters.length
    ) {
      currentIndex = (currentIndex + 1) % letters.length;
      tries++;
    }

    if (tries >= letters.length) {
      // No lowercase letters found, just skip flicker
      time += interval;
      if (time >= duration) {
        clearInterval(flicker);
        element.textContent = original;
        element.style.width = '';
        element.style.display = '';
        element.style.whiteSpace = '';
      }
      return;
    }

    const origChar = letters[currentIndex];
    letters[currentIndex] = chars[Math.floor(Math.random() * chars.length)];
    element.textContent = letters.join('');

    setTimeout(() => {
      letters[currentIndex] = origChar;
      element.textContent = letters.join('');
    }, interval / 1.2);

    currentIndex = (currentIndex + 1) % letters.length;
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

      flickerIntervalId = premiumFlicker(textSpan, 500, 100); // 500ms total, 100ms interval
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