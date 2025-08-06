// Smooth, premium flicker — only some letters, always restore original text
function premiumFlicker(element, duration = 480, interval = 120) {
  const original = element.dataset.originalText || element.textContent;
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  let letters = original.split('');
  let time = 0;
  let tickCount = 0;

  // Build array of eligible indexes (lowercase letters, not spaces)
  const eligibleIndexes = [];
  for (let i = 0; i < letters.length; i++) {
    if (letters[i] !== ' ' && letters[i] === letters[i].toLowerCase()) {
      eligibleIndexes.push(i);
    }
  }

  // Randomly select ~50% of eligible indexes for scrambling
  const scrambleCount = Math.ceil(eligibleIndexes.length / 2);
  const scrambleIndexes = [];
  const copyEligible = eligibleIndexes.slice();
  while (scrambleIndexes.length < scrambleCount && copyEligible.length > 0) {
    const randIdx = Math.floor(Math.random() * copyEligible.length);
    scrambleIndexes.push(copyEligible.splice(randIdx, 1)[0]);
  }

  // Block breaking to 2 lines and lock width
  element.style.whiteSpace = 'nowrap';
  element.style.width = element.offsetWidth + 'px';
  element.style.display = 'inline-block';

  const flicker = setInterval(() => {
    tickCount++;
    if (tickCount <= 2) {
      // For first two ticks, 80% chance to skip (gentle start)
      if (Math.random() > 0.2) return;
    } else {
      if (Math.random() > 0.7) return; // Later, 30% skip as usual
    }

    // Pick 1 random index from scrambleIndexes
    if (scrambleIndexes.length === 0) return;
    let idx = scrambleIndexes[Math.floor(Math.random() * scrambleIndexes.length)];

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

      flickerIntervalId = premiumFlicker(textSpan, 480, 120); // 480ms total, 120ms interval
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