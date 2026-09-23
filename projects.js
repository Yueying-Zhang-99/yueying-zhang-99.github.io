const typeButtons = document.querySelectorAll('[data-project-type-filter]');
const stageButtons = document.querySelectorAll('[data-project-stage-filter]');
const projectCards = document.querySelectorAll('.project-index-card');
const projectEmpty = document.getElementById('project-filter-empty');
let projectType = 'all';
let projectStage = 'all';
function filterProjects(){projectCards.forEach(card=>{const types=card.dataset.types.split(' ');card.hidden=!((projectType==='all'||types.includes(projectType))&&(projectStage==='all'||card.dataset.stage===projectStage));});projectEmpty.hidden=![...projectCards].every(card=>card.hidden);typeButtons.forEach(button=>{const active=button.dataset.projectTypeFilter===projectType;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});stageButtons.forEach(button=>{const active=button.dataset.projectStageFilter===projectStage;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});}
typeButtons.forEach(button=>button.addEventListener('click',()=>{projectType=button.dataset.projectTypeFilter;filterProjects();}));
stageButtons.forEach(button=>button.addEventListener('click',()=>{projectStage=button.dataset.projectStageFilter;filterProjects();}));
