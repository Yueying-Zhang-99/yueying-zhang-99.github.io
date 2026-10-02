(async () => {
  // Publications is the single source for the cards embedded in project pages.
  const references = [...document.querySelectorAll('[data-publication-id]')];
  if (references.length) {
    try {
      const sourceURL = new URL('/publications.html', location.origin);
      const response = await fetch(sourceURL, { cache: 'no-store' });
      if (!response.ok) throw new Error(`Publications request failed: ${response.status}`);
      const source = new DOMParser().parseFromString(await response.text(), 'text/html');
      const cards = references.map((reference) => {
        const id = reference.dataset.publicationId;
        const original = source.getElementById(id);
        if (!original?.matches('.paper-card')) throw new Error(`Unknown publication: ${id}`);
        const card = original.cloneNode(true);
        card.open = false;
        card.querySelectorAll('a[href]').forEach((link) => {
          link.href = new URL(link.getAttribute('href'), sourceURL).href;
          if (link.textContent.trim() === 'Related project') {
            link.href = `${sourceURL.href}#${id}`;
            link.textContent = 'Publications page';
          }
        });
        // Project cards expand directly into the content, without an abstract label.
        card.querySelectorAll('h4').forEach((heading) => {
          if (heading.textContent.trim() === 'Abstract') heading.remove();
        });
        return card;
      });
      references.forEach((reference, index) => reference.replaceWith(cards[index]));
    } catch (error) {
      // Keep the direct publication links usable if loading is unavailable.
      console.error('Could not load related publications.', error);
    }
  }

const filterButtons = document.querySelectorAll('[data-filter]');
const topicButtons = document.querySelectorAll('[data-topic-filter]');
const papers = document.querySelectorAll('.paper-card[data-type]');
const yearSections = document.querySelectorAll('.pub-year');
const emptyMessage = document.getElementById('publication-filter-empty');
let activeType = 'all';
let activeTopic = 'all';

function filterPublications() {
  papers.forEach((paper) => {
    const typeMatches = activeType === 'all' || paper.dataset.type === activeType;
    const topics = (paper.dataset.topics || '').split(' ');
    const topicMatches = activeTopic === 'all' || topics.includes(activeTopic);
    const visible = typeMatches && topicMatches;
    paper.hidden = !visible;
    if (!visible) paper.open = false;
  });

  yearSections.forEach((section) => {
    const hasVisiblePaper = [...section.querySelectorAll('.paper-card')]
      .some((paper) => !paper.hidden);
    section.hidden = !hasVisiblePaper;
  });
  if (emptyMessage) emptyMessage.hidden = ![...papers].every((paper) => paper.hidden);

  filterButtons.forEach((button) => {
    const active = button.dataset.filter === activeType;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  topicButtons.forEach((button) => {
    const active = button.dataset.topicFilter === activeTopic;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activeType = button.dataset.filter;
    filterPublications();
  });
});
topicButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activeTopic = button.dataset.topicFilter;
    filterPublications();
  });
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

// Horizontal gallery controls.
document.querySelectorAll('.paper-gallery').forEach((gallery) => {
  const track = gallery.querySelector('.gallery-track');
  gallery.querySelector('.prev')?.addEventListener('click', () => {
    track.scrollBy({ left: -track.clientWidth * 0.8, behavior: 'smooth' });
  });
  gallery.querySelector('.next')?.addEventListener('click', () => {
    track.scrollBy({ left: track.clientWidth * 0.8, behavior: 'smooth' });
  });
});

// Full-screen image viewer. It automatically supports any number of gallery items.
const lightbox = document.getElementById('paper-lightbox');
const lightboxImage = lightbox.querySelector('img');
const lightboxCaption = lightbox.querySelector('figcaption');
let activeItems = [];
let activeIndex = 0;

function showLightboxImage() {
  const item = activeItems[activeIndex];
  lightboxImage.src = item.dataset.image;
  lightboxImage.alt = item.dataset.caption || 'Publication image';
  lightboxCaption.textContent = item.dataset.caption || '';
}

function openLightbox(item) {
  activeItems = [...item.closest('.gallery-track').querySelectorAll('.gallery-item')];
  activeIndex = activeItems.indexOf(item);
  showLightboxImage();
  lightbox.hidden = false;
  document.body.classList.add('lightbox-open');
  lightbox.querySelector('.lightbox-close').focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  lightboxImage.src = '';
  document.body.classList.remove('lightbox-open');
}

function moveLightbox(step) {
  activeIndex = (activeIndex + step + activeItems.length) % activeItems.length;
  showLightboxImage();
}

document.querySelectorAll('.gallery-item').forEach((item) => {
  item.addEventListener('click', () => openLightbox(item));
});
lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
lightbox.querySelector('.lightbox-prev').addEventListener('click', () => moveLightbox(-1));
lightbox.querySelector('.lightbox-next').addEventListener('click', () => moveLightbox(1));
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (event) => {
  if (lightbox.hidden) return;
  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowLeft') moveLightbox(-1);
  if (event.key === 'ArrowRight') moveLightbox(1);
});

})();
