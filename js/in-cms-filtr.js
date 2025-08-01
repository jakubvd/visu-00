document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.home-insights_category-filter-link');
  const collectionItems = document.querySelectorAll('.insigts-cms-collection-list .w-dyn-item');

  // Dodaj klasę 'current' do przycisku 'all' na starcie
  const allButton = document.querySelector('.home-insights_category-filter-link[data-category="all"]');
  if (allButton) allButton.classList.add('current');

  // Funkcja filtrująca z animacją
  function filterWithFade(category) {
    collectionItems.forEach(item => {
      // Zawsze resetuj klasy fade-in/fade-out przed animacją
      item.classList.remove('fade-in', 'fade-out');

      // Dodaj fade-out, zacznij animację
      item.classList.add('fade-out');

      // Po 100ms (czas trwania animacji) zmień widoczność i włącz fade-in, jeśli element ma być widoczny
      setTimeout(() => {
        if (category === 'all' || item.getAttribute('data-category') === category) {
          item.style.display = '';
          item.classList.remove('fade-out');
          // Trigger ponownej animacji fade-in
          void item.offsetWidth; // restart CSS animation
          item.classList.add('fade-in');
        } else {
          item.style.display = 'none';
          item.classList.remove('fade-out', 'fade-in');
        }
      }, 100);
    });
  }

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Usuń klasę 'current' ze wszystkich przycisków i dodaj do klikniętego
      filterButtons.forEach(btn => btn.classList.remove('current'));
      button.classList.add('current');

      const selectedCategory = button.getAttribute('data-category');
      filterWithFade(selectedCategory);
    });
  });

  // Inicjalne pokazanie wszystkich elementów (All)
  filterWithFade('all');
});