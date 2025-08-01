document.querySelectorAll('[data-bg-color]').forEach(el => {
  const cssVarName = el.getAttribute('data-bg-color'); // np. "--bg-color--button-main-bg-blue"
  if (cssVarName) {
    el.style.backgroundColor = `var(${cssVarName})`;
  }
});

document.querySelectorAll('[data-text-color]').forEach(el => {
  const cssVarName = el.getAttribute('data-text-color'); // np. "--color--button-main-text-blue"
  if (cssVarName) {
    el.style.color = `var(${cssVarName})`;
  }
});

document.querySelectorAll('[data-padding-left]').forEach(el => {
  const paddingValue = el.getAttribute('data-padding-left'); // np. "2rem"
  if (paddingValue) {
    el.style.paddingLeft = paddingValue;
  }
});

document.querySelectorAll('[data-padding-right]').forEach(el => {
  const paddingValue = el.getAttribute('data-padding-right'); // np. "1.5rem"
  if (paddingValue) {
    el.style.paddingRight = paddingValue;
  }
});