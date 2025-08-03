// Custom Load More for Webflow CMS
document.addEventListener('DOMContentLoaded', function () {
  const btn = document.querySelector('.load-more-btn[data-cms-list]');
  const list = document.querySelector('.insights-cms-collection-list[data-cms-list]');
  if (!btn || !list) return;

  let page = 1;

  btn.addEventListener('click', function (e) {
    e.preventDefault();
    page++;
    btn.textContent = 'Loading...';
    btn.disabled = true;

    // Budujemy URL paginacji
    const nextPageUrl = window.location.pathname + '?page=' + page;

    fetch(nextPageUrl)
      .then(res => res.text())
      .then(html => {
        // Parse i wyciągamy TYLKO .w-dyn-items[data-cms-list="insights"]
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const newItems = doc.querySelector('.insights-cms-collection-list[data-cms-list="insights"]');
        if (newItems && newItems.children.length) {
          Array.from(newItems.children).forEach(child => {
            list.appendChild(child);
          });
          btn.textContent = 'Load More';
          btn.disabled = false;
        } else {
          btn.style.display = 'none';
        }
      })
      .catch(() => {
        btn.textContent = 'Error!';
        btn.disabled = false;
      });
  });
});