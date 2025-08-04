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
}

// Usage (for your button)
btn.addEventListener('mouseenter', function () {
  flickerSingleLetters(textDiv, 700, 40); // Flicker for 700ms, swap every 40ms
});