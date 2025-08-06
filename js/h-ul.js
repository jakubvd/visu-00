document.addEventListener('DOMContentLoaded', function() {
  const underlineEls = document.querySelectorAll('[data-underline-hover="true"]');

  underlineEls.forEach(el => {
    el.addEventListener('mouseenter', function() {
      el.classList.remove('reversing');
      el.classList.add('active');
    });

    el.addEventListener('mouseleave', function() {
      el.classList.remove('active');
      el.classList.add('reversing');
      setTimeout(() => el.classList.remove('reversing'), 400); // tyle co transition
    });
  });
});