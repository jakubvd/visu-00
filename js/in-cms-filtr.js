document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.home-insights_category-filter-link');
  const collectionItems = document.querySelectorAll('.insigts-cms-collection-list .w-dyn-item');

  const allButton = document.querySelector('.home-insights_category-filter-link[data-category="all"]');
  if (allButton) allButton.classList.add('current');

  let isInitialLoad = true;

  function filterWithFade(category) {
    collectionItems.forEach(item => {
      // On initial load, just show all items without animation
      if (isInitialLoad && category === 'all') {
        item.style.display = '';
        item.classList.remove('fade-in', 'fade-out');
        return;
      }

      item.classList.remove('fade-in', 'fade-out');
      item.classList.add('fade-out');

      setTimeout(() => {
        if (category === 'all' || item.getAttribute('data-category') === category) {
          item.style.display = '';
          item.classList.remove('fade-out');
          void item.offsetWidth; // restart CSS animation
          item.classList.add('fade-in');
        } else {
          item.style.display = 'none';
          item.classList.remove('fade-out', 'fade-in');
        }
      }, 250);
    });

    if (isInitialLoad) isInitialLoad = false;
  }

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('current'));
      button.classList.add('current');

      const selectedCategory = button.getAttribute('data-category');
      filterWithFade(selectedCategory);
    });
  });

  // Initial load showing all without animation
  filterWithFade('all');
});