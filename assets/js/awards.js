const awardButtons = document.querySelectorAll('[data-award-filter]');
const awardCards = document.querySelectorAll('.award-card[data-award-type]');
const awardYears = document.querySelectorAll('.award-year');

function filterAwards(type) {
  awardCards.forEach((card) => {
    card.hidden = !(type === 'all' || card.dataset.awardType === type);
  });
  awardYears.forEach((year) => {
    year.hidden = ![...year.querySelectorAll('.award-card')].some((card) => !card.hidden);
  });
  awardButtons.forEach((button) => {
    const active = button.dataset.awardFilter === type;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

awardButtons.forEach((button) => button.addEventListener('click', () => filterAwards(button.dataset.awardFilter)));
