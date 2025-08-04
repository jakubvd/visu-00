// Universal Scramble Text on Hover for buttons with icon (Webflow version)
// Locks both button and text width to prevent layout jumps

document.addEventListener('DOMContentLoaded', function () {
  // Select all buttons that have the scramble effect enabled
  const scrambleButtons = document.querySelectorAll('a.button.is-icon[data-scramble-hover="true"]');

  scrambleButtons.forEach(function (btn) {
    // Select the text element inside the button (must have .btn-text)
    const textDiv = btn.querySelector('.btn-text');
    if (!textDiv) return;

    // Store original values
    const originalText = textDiv.textContent;
    let btnOriginalWidth = null;
    let textOriginalWidth = null;

    btn.addEventListener('mouseenter', function () {
      // Lock the button width (outer container)
      if (!btnOriginalWidth) {
        btnOriginalWidth = btn.offsetWidth;
        btn.style.width = btnOriginalWidth + 'px';
      }
      // Lock the text width (inner .btn-text)
      if (!textOriginalWidth) {
        textOriginalWidth = textDiv.offsetWidth;
        textDiv.style.width = textOriginalWidth + 'px';
        textDiv.style.display = 'inline-block'; // Prevent line-breaks
        textDiv.style.overflow = 'hidden'; // Hide overflow
        textDiv.style.whiteSpace = 'nowrap'; // Prevent wrapping
      }

      // Animate scramble text (icon is not affected)
      gsap.to(textDiv, {
        duration: 1.0,
        scrambleText: {
          text: originalText,
          chars: 'lowerCase',
          tweenLength: false,
          speed: 0.4,
          revealDelay: 0.08
        },
        ease: 'power2.inOut'
      });
    });

    btn.addEventListener('mouseleave', function () {
      // Restore original text
      textDiv.textContent = originalText;
      // Unlock text width and styles after a short delay
      setTimeout(function () {
        textDiv.style.width = '';
        textDiv.style.display = '';
        textDiv.style.overflow = '';
        textDiv.style.whiteSpace = '';
        textOriginalWidth = null;
        // Unlock button width
        btn.style.width = '';
        btnOriginalWidth = null;
      }, 200);
    });
  });
});