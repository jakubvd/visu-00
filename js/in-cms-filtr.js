document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.home-insights_category-filter-link');
  const collectionItems = document.querySelectorAll('.insigts-cms-collection-list .w-dyn-item');

  const allButton = document.querySelector('.home-insights_category-filter-link[data-category="all"]');
  if (allButton) allButton.classList.add('current');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('current'));
      button.classList.add('current');

      const filterValue = button.getAttribute('data-category');

      collectionItems.forEach(item => {
        // Fade out
        item.classList.add('fade-out');

        setTimeout(() => {
          // Change display after fade-out
          if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }

          // Fade in only if visible
          if (item.style.display !== 'none') {
            item.classList.remove('fade-out');
            item.classList.add('fade-in');
          }
        }, 200); // czas trwania fade-out

        // Usuń fade-in po zakończeniu animacji, by można było ponownie dodać ją przy kolejnym kliknięciu
        item.addEventListener('transitionend', () => {
          item.classList.remove('fade-in');
        }, { once: true });
      });
    });
  });
});