// Custom "Load More" logic for Webflow CMS lists
// by VisionDevs x ChatGPT | 100% custom, supports multiple lists

document.addEventListener('DOMContentLoaded', function () {
  // Wszystkie listy na stronie z atrybutem data-cms-list
  const cmsLists = document.querySelectorAll('[data-cms-list]');

  // Mapujemy numer aktualnej strony dla każdej listy
  const pageMap = new WeakMap();

  // Ustawiamy na każdej liście start na 1 stronie
  cmsLists.forEach(list => pageMap.set(list, 1));

  // Globalny event delegation dla przycisków "Load More"
  document.body.addEventListener('click', function (e) {
    const btn = e.target.closest('a.load-more-btn[data-cms-list]');
    if (!btn) return;

    e.preventDefault();

    // Pobierz nazwę listy z data-cms-list
    const listName = btn.getAttribute('data-cms-list');
    // Znajdź listę po data-cms-list
    const list = document.querySelector(`[data-cms-list="${listName}"]`);
    if (!list) return;

    // Znajdź kontener .w-dyn-items W TEJ liście
    const dynItems = list.querySelector('.w-dyn-items');
    if (!dynItems) {
      console.warn('Nie znaleziono .w-dyn-items w:', list);
      return;
    }

    // Strona (page) dla tej listy
    let currentPage = pageMap.get(list) || 1;
    currentPage++;
    pageMap.set(list, currentPage);

    // Budujemy URL do następnej strony
    let nextPageUrl = window.location.pathname + '?page=' + currentPage;

    // UI: blokada i info o ładowaniu
    btn.disabled = true;
    btn.textContent = 'Loading...';

    // Pobieramy HTML kolejnej strony
    fetch(nextPageUrl)
      .then(res => res.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Z NOWEJ strony pobieramy TYLKO items z odpowiadającej listy
        const newList = doc.querySelector(`[data-cms-list="${listName}"]`);
        const newDynItems = newList ? newList.querySelector('.w-dyn-items') : null;

        if (newDynItems && newDynItems.children.length > 0) {
          // Dodajemy tylko pojedyncze dzieci z .w-dyn-items (nie całą listę!)
          Array.from(newDynItems.children).forEach(item => {
            // Importujemy do docelowej .w-dyn-items
            dynItems.appendChild(item);
          });

          btn.disabled = false;
          btn.textContent = 'Load More';
        } else {
          // Brak nowych itemów — chowamy button
          btn.style.display = 'none';
        }
      })
      .catch(() => {
        btn.textContent = 'Error!';
        btn.disabled = false;
      });
  });
});