// PREMIUM underline effect: block "double hover" for 1s to avoid glitches

// How long to block re-hover (must be >= transition duration)
const underlineBlockTime = 1000; // ms, set to 1000ms = 1s

document.querySelectorAll('[data-underline-hover="true"]').forEach((el) => {
  let hoverTimeout;
  let blockHover = false; // Prevent rapid multiple hovers

  el.addEventListener('mouseenter', () => {
    if (blockHover) return; // Ignore if within block window
    blockHover = true;      // Block further hovers

    clearTimeout(hoverTimeout);
    el.classList.add('active');

    // Unblock after specified time (make sure matches or exceeds animation)
    setTimeout(() => {
      blockHover = false;
    }, underlineBlockTime);
  });

  el.addEventListener('mouseleave', () => {
    hoverTimeout = setTimeout(() => {
      el.classList.remove('active');
    }, 100); // Match your CSS transition (e.g., 100ms)
  });
});