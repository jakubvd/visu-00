// Custom "Load More" logic for Webflow CMS lists
// Supports multiple independent lists on one page.
// Pair each list and button with a matching data-cms-list attribute, e.g.:
// <div data-cms-list="insights">...</div>
// <a href="#" class="load-more-btn" data-cms-list="insights">Load More</a>

document.addEventListener('DOMContentLoaded', function () {
  // Select all CMS lists by their data-cms-list attribute (any value)
  const cmsLists = document.querySelectorAll('[data-cms-list]');
  const pageMap = new WeakMap(); // Tracks current page for each list element

  // Initialize page counters for each CMS list
  cmsLists.forEach(list => pageMap.set(list, 1));

  // Event delegation for all "Load More" anchor buttons with class load-more-btn and data-cms-list attribute
  document.body.addEventListener('click', function (e) {
    const btn = e.target.closest('a.load-more-btn[data-cms-list]');
    if (!btn) return;

    e.preventDefault();

    // Get the data-cms-list value from the clicked button
    const listName = btn.getAttribute('data-cms-list');

    // Select the corresponding CMS list by matching data-cms-list attribute
    const list = document.querySelector('[data-cms-list="' + listName + '"]');
    if (!list) return;

    // Find the .w-dyn-items container inside the selected list
    const dynItems = list.querySelector('.w-dyn-items');
    if (!dynItems) return;

    // Get current page number for this list and increment it
    let currentPage = pageMap.get(list) || 1;
    currentPage++;
    pageMap.set(list, currentPage);

    // Construct URL for the next page (preserving current path)
    let nextPageUrl = window.location.pathname + '?page=' + currentPage;

    // Update button UI to indicate loading state
    btn.disabled = true;
    btn.textContent = 'Loading...';

    // Fetch the next page HTML
    fetch(nextPageUrl)
      .then(res => res.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Find the corresponding CMS list on the fetched page by data-cms-list attribute
        const newList = doc.querySelector('[data-cms-list="' + listName + '"]');
        const newDynItems = newList ? newList.querySelector('.w-dyn-items') : null;

        if (newDynItems && newDynItems.children.length > 0) {
          // Append each new item to the current list's .w-dyn-items container
          [...newDynItems.children].forEach(item => dynItems.appendChild(item));
          btn.disabled = false;
          btn.textContent = 'Load More';
        } else {
          // No more items found – hide the button
          btn.style.display = 'none';
        }
      })
      .catch(() => {
        btn.textContent = 'Error!';
        btn.disabled = false;
      });
  });
});
