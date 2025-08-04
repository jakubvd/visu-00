// Utility: Flicker random letters without breaking button width or layout
function flickerSingleLetters(element, duration = 600, interval = 35) {
  const original = element.textContent;
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  let letters = original.split('');
  let time = 0;

  // Lock the width of the text container to prevent size jumping
  element.style.width = element.offsetWidth + 'px';
  element.style.display = 'inline-block'; // Make sure width works

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
      element.textContent = original; // Restore original at end
      // Unlock width after animation
      element.style.width = '';
      element.style.display = '';
    }
  }, interval);

  // Return the interval ID so it can be cleared externally if needed
  return flicker;
}

document.addEventListener('DOMContentLoaded', () => {
  const scramButtons = document.querySelectorAll('.button[data-btn-scram="true"]');
  console.log('SCRAM BUTTONS:', scramButtons);

  scramButtons.forEach(button => {
    const textSpan = button.querySelector('.btn-text');
    console.log('TEXT SPAN:', textSpan);
    if (!textSpan) return;

    let flickerIntervalId = null;

    textSpan.dataset.originalText = textSpan.textContent;

    button.addEventListener('mouseenter', () => {
      if (flickerIntervalId !== null) return;
      button.style.width = button.offsetWidth + 'px';
      textSpan.style.width = textSpan.offsetWidth + 'px';
      textSpan.style.display = 'inline-block';

      flickerIntervalId = flickerSingleLetters(textSpan, 700, 40);
    });

    button.addEventListener('mouseleave', () => {
      if (flickerIntervalId !== null) {
        clearInterval(flickerIntervalId);
        flickerIntervalId = null;
      }
      textSpan.textContent = textSpan.dataset.originalText;
      textSpan.style.width = '';
      textSpan.style.display = '';
      button.style.width = '';
    });
  });
});