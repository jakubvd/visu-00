// Smooth, premium flicker — only some letters, always restore original text
function premiumFlicker(element, duration = 600, interval = 100) {
  const original = element.dataset.originalText || element.textContent;
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  let letters = original.split('');
  let time = 0;

  // Block breaking to 2 lines
  element.style.whiteSpace = 'nowrap';
  // Lock width to prevent jumps
  element.style.width = element.offsetWidth + 'px';
  element.style.display = 'inline-block';

  const flicker = setInterval(() => {
    // Pick 1 or 2 random indices (only real letters, not spaces)
    let idx = Math.floor(Math.random() * letters.length);
    while (letters[idx] === ' ') idx = Math.floor(Math.random() * letters.length);

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
      // Unlock after animation
      element.style.width = '';
      element.style.display = '';
      element.style.whiteSpace = '';
    }
  }, interval);

  return flicker;
}

// On DOMContentLoaded, apply premium flicker to all relevant buttons
document.addEventListener('DOMContentLoaded', () => {
  const scramButtons = document.querySelectorAll('[data-scramble-hover="hover-scramble-effect"]');

  scramButtons.forEach(button => {
    const textSpan = button.querySelector('.btn-text');
    if (!textSpan) return;

    let flickerIntervalId = null;
    textSpan.dataset.originalText = textSpan.textContent;

    button.addEventListener('mouseenter', () => {
      if (flickerIntervalId !== null) return;
      button.style.width = button.offsetWidth + 'px';
      textSpan.style.width = textSpan.offsetWidth + 'px';
      textSpan.style.display = 'inline-block';
      textSpan.style.whiteSpace = 'nowrap';

      flickerIntervalId = premiumFlicker(textSpan, 600, 90);
    });

    button.addEventListener('mouseleave', () => {
      if (flickerIntervalId !== null) {
        clearInterval(flickerIntervalId);
        flickerIntervalId = null;
      }
      textSpan.textContent = textSpan.dataset.originalText;
      textSpan.style.width = '';
      textSpan.style.display = '';
      textSpan.style.whiteSpace = '';
      button.style.width = '';
    });
  });
});