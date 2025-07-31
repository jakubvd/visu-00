document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.home-insights_category-filter-link');
  const collectionItems = document.querySelectorAll('.insigts-cms-collection-list .w-dyn-item');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Usuwamy klasę 'current' z każdego przycisku
      filterButtons.forEach(btn => btn.classList.remove('current'));
      // Dodajemy klasę 'current' klikniętemu przyciskowi
      button.classList.add('current');

      const filterValue = button.getAttribute('data-category');

      collectionItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        // Jeśli 'all' to pokazujemy wszystko, inaczej filtrujemy
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = ''; // pokaz
        } else {
          item.style.display = 'none'; // ukryj
        }
      });
    });
  });
});