const filterButtons = document.querySelectorAll('[data-filter]');
const papers = document.querySelectorAll('.paper-card[data-type]');
const yearSections = document.querySelectorAll('.pub-year');

function filterPublications(type) {
  papers.forEach((paper) => {
    const visible = type === 'all' || paper.dataset.type === type;
    paper.hidden = !visible;
    if (!visible) paper.open = false;
  });

  yearSections.forEach((section) => {
    const hasVisiblePaper = [...section.querySelectorAll('.paper-card')]
      .some((paper) => !paper.hidden);
    section.hidden = !hasVisiblePaper;
  });

  filterButtons.forEach((button) => {
    const active = button.dataset.filter === type;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => filterPublications(button.dataset.filter));
});

// Close an expanded publication once the entire card has left the viewport.
const visibilityObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting && entry.target.open) {
      entry.target.open = false;
    }
  });
}, { threshold: 0 });

papers.forEach((paper) => visibilityObserver.observe(paper));
