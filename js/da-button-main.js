document.querySelectorAll('[data-bg-color]').forEach(el => {
  const cssVarName = el.getAttribute('data-bg-color'); // np. "--bg-color--button-main-bg-blue"
  if (cssVarName) {
    // Ustawienie background-color z CSS variable
    el.style.backgroundColor = `var(${cssVarName})`;
  }
});