// Custom "Load More" logic for Webflow CMS lists
// Supports multiple independent lists on one page.
// Pair each list and button with a data-cms-list attribute, e.g.:
// <div class="js-insights-list" data-cms-list="insights">...</div>
// <button class="load-more-btn" data-cms-list="insights">Load More</button>

document.addEventListener('DOMContentLoaded', function () {
  // Selector for all lists and all buttons
  const cmsLists = document.querySelectorAll('[data-cms-list]');
  const pageMap = new WeakMap(); // Tracks current page for each list

  // Initialize page counters
  cmsLists.forEach(list => pageMap.set(list, 1));

  // Event delegation for all load more buttons
  document.body.addEventListener('click', function (e) {
    const btn = e.target.closest('.load-more-btn[data-cms-list]');
    if (!btn) return;

    e.preventDefault();

    const listName = btn.getAttribute('data-cms-list');
    const list = document.querySelector('.js-insights-list[data-cms-list="' + listName + '"]');
    if (!list) return;

    // Find the .w-dyn-items inside this list
    const dynItems = list.querySelector('.w-dyn-items');
    if (!dynItems) return;

    // Get current page for this list
    let currentPage = pageMap.get(list) || 1;
    currentPage++;
    pageMap.set(list, currentPage);

    // Build URL for next page
    let nextPageUrl = window.location.pathname + '?page=' + currentPage;

    // Update button UI
    btn.disabled = true;
    btn.textContent = 'Loading...';

    // Fetch the next page
    fetch(nextPageUrl)
      .then(res => res.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        // Find the corresponding .w-dyn-items on the next page (by data-cms-list)
        const newList = doc.querySelector('.js-insights-list[data-cms-list="' + listName + '"]');
        const newDynItems = newList ? newList.querySelector('.w-dyn-items') : null;

        if (newDynItems && newDynItems.children.length > 0) {
          // Append each new item to the current list
          [...newDynItems.children].forEach(item => dynItems.appendChild(item));
          btn.disabled = false;
          btn.textContent = 'Load More';
        } else {
          // No more items – hide the button
          btn.style.display = 'none';
        }
      })
      .catch(() => {
        btn.textContent = 'Error!';
        btn.disabled = false;
      });
  });
});
