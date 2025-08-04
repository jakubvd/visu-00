// Universal Scramble Text on Hover for buttons with/without icon (Webflow)
// Locks button & text width to prevent layout jumps on all types of buttons

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
        textDiv.style.display = 'inline-block'; // Prevent line-breaks
        textDiv.style.overflow = 'hidden'; // Hide overflow
        textDiv.style.whiteSpace = 'nowrap'; // Prevent wrapping
      }

      // Animate scramble text (letters only, premium/low-flicker effect)
      gsap.to(textDiv, {
        duration: 1.0,
        scrambleText: {
          text: originalText,
          chars: 'lowerCase', // Only lowercase letters
          revealDelay: 0.22,  // Reveal more original text sooner
          speed: 0.2,         // Slower flicker for more premium look
          rightToLeft: true,  // Scramble mostly end of string
          tweenLength: false
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