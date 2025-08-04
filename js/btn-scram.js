// Universal Scramble Text on Hover for buttons (Webflow)
// Locks button & text width to prevent layout jumps

document.addEventListener('DOMContentLoaded', function () {
  // Select all buttons that have the scramble effect enabled
  const scrambleButtons = document.querySelectorAll('a.button[data-scramble-hover="true"]');

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
        textDiv.style.display = 'inline-block';
        textDiv.style.overflow = 'hidden';
        textDiv.style.whiteSpace = 'nowrap';
      }

      // Animate scramble text (letters only, minimal for premium look)
      gsap.to(textDiv, {
        duration: 0.8, // slower and shorter
        scrambleText: {
          text: originalText,
          chars: 'lowerCase', // Only lowercase letters
          revealDelay: 0.45,  // Reveal most of the text early, so only a few chars scramble
          speed: 0.18,        // Slower flicker
          tweenLength: false,
        },
        ease: 'power2.out'
      });
    });

    btn.addEventListener('mouseleave', function () {
      // Restore original text
      textDiv.textContent = originalText;
      // Unlock text & button width after a short delay to allow transition to finish
      setTimeout(function () {
        textDiv.style.width = '';
        textDiv.style.display = '';
        textDiv.style.overflow = '';
        textDiv.style.whiteSpace = '';
        textOriginalWidth = null;
        btn.style.width = '';
        btnOriginalWidth = null;
      }, 250);
    });
  });
});