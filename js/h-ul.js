// PREMIUM underline effect: let the line always reach the end on hover ON
// and only start hiding after the animation finishes, for smoothness.

// Select all elements with underline effect enabled via data attribute
document.querySelectorAll('[data-underline-hover="true"]').forEach((el) => {
  let hoverTimeout;

  // On mouse enter: trigger the underline animation
  el.addEventListener('mouseenter', () => {
    // Cancel any pending timeout to avoid glitches if hovered rapidly
    clearTimeout(hoverTimeout);
    // Add 'active' class to start the underline animation (expand)
    el.classList.add('active');
  });

  // On mouse leave: wait for the line to fully expand before hiding
  el.addEventListener('mouseleave', () => {
    // Set a timeout matching the CSS transition duration (e.g., 500ms)
    hoverTimeout = setTimeout(() => {
      // Remove 'active' class so the line animates out (collapses)
      el.classList.remove('active');
    }, 300); // Adjust if you change the transition time in your CSS!
  });
});