document.querySelectorAll('[data-scramble-hover]').forEach(btn => {
  if (btn.getAttribute('data-scramble-hover') !== 'true') return;
  const originalText = btn.textContent;
  let widthLocked = false;

  btn.addEventListener('mouseenter', () => {
    // Lock width only once per button
    if (!widthLocked) {
      btn.style.width = btn.offsetWidth + "px";
      widthLocked = true;
    }
    gsap.to(btn, {
      scrambleText: {
        text: originalText,
        chars: "lowercase",
        speed: 0.4
      },
      duration: 1,
      ease: "power1.inOut"
    });
  });

  btn.addEventListener('mouseleave', () => {
    btn.textContent = originalText;
    // Uncomment below line to unlock width after hover, if needed:
    // btn.style.width = "";
  });
});