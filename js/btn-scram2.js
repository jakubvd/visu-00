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
    // ZMIANA: funkcja blokująca width na obu elementach
    function lockWidths() {
      // Najpierw zdejmij style aby odczytać prawidłowy width
      button.style.width = lockWidth + 'px';
      button.style.minWidth = lockWidth + 'px';
      button.style.maxWidth = lockWidth + 'px';
      textSpan.style.width = '';
      textSpan.style.minWidth = '';
      textSpan.style.maxWidth = '';
      textSpan.style.display = 'inline-block';
      textSpan.style.whiteSpace = 'nowrap';

      // Pobierz aktualne szerokości
      const btnWidth = button.offsetWidth;
      const txtWidth = textSpan.offsetWidth;
      const lockWidth = Math.max(btnWidth, txtWidth);

      // Ustaw na obu
      button.style.width = lockWidth + 'px';
      button.style.minWidth = lockWidth + 'px';
      button.style.maxWidth = lockWidth + 'px';
      textSpan.style.width = lockWidth + 'px';
      textSpan.style.minWidth = lockWidth + 'px';
      textSpan.style.maxWidth = lockWidth + 'px';
      textSpan.style.display = 'inline-block';
      textSpan.style.whiteSpace = 'nowrap';
    }
    function unlockWidths() {
      button.style.width = '';
      button.style.minWidth = '';
      button.style.maxWidth = '';
      textSpan.style.width = '';
      textSpan.style.minWidth = '';
      textSpan.style.maxWidth = '';
      textSpan.style.display = '';
      textSpan.style.whiteSpace = '';
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