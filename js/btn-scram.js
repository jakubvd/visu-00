// Universal Scramble Text on Hover for buttons with icon (Webflow version)
// Run after DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  // Select all buttons that have the scramble effect enabled
  const scrambleButtons = document.querySelectorAll('a.button.is-icon[data-scramble-hover="true"]');

  scrambleButtons.forEach(function (btn) {
    // Select the text element inside the button, supporting both .btn-text and .button-text classes
    const textDiv = btn.querySelector('.btn-text');
    if (!textDiv) return;

    // Save original text and width
    const originalText = textDiv.textContent;
    let originalWidth = null;

    btn.addEventListener('mouseenter', function () {
      // Lock width to prevent jumps (including icon & text!)
      if (!originalWidth) {
        originalWidth = btn.offsetWidth;
        btn.style.width = originalWidth + 'px';
      }
      // Scramble only the text (icon is untouched)
      gsap.to(textDiv, {
        duration: 0.5,
        scrambleText: {
          text: originalText,
          chars: 'lowerCase', // or '01', or whatever suits you
          revealDelay: 0.05
        },
        ease: 'power2.inOut'
      });
    });

    btn.addEventListener('mouseleave', function () {
      // Restore original text
      textDiv.textContent = originalText;
      // Unlock width after a short delay so it doesn't feel glitchy
      setTimeout(function () {
        btn.style.width = '';
      }, 200);
    });
  });
});