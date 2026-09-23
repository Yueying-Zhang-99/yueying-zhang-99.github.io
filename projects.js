const typeButtons=document.querySelectorAll('[data-project-type-filter]');
const stageButtons=document.querySelectorAll('[data-project-stage-filter]');
const projectCards=document.querySelectorAll('.project-index-card[data-types]');
const stageSections=document.querySelectorAll('.project-stage-section');
const emptyMessage=document.getElementById('project-filter-empty');
let activeProjectType='all';
let activeProjectStage='all';
function filterProjects(){projectCards.forEach(card=>{const types=(card.dataset.types||'').split(' ');const typeMatch=activeProjectType==='all'||types.includes(activeProjectType);const stageMatch=activeProjectStage==='all'||card.dataset.stage===activeProjectStage;card.hidden=!(typeMatch&&stageMatch);});stageSections.forEach(section=>{section.hidden=![...section.querySelectorAll('.project-index-card')].some(card=>!card.hidden);});emptyMessage.hidden=![...projectCards].every(card=>card.hidden);typeButtons.forEach(button=>{const active=button.dataset.projectTypeFilter===activeProjectType;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});stageButtons.forEach(button=>{const active=button.dataset.projectStageFilter===activeProjectStage;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});}
typeButtons.forEach(button=>button.addEventListener('click',()=>{activeProjectType=button.dataset.projectTypeFilter;filterProjects();}));
stageButtons.forEach(button=>button.addEventListener('click',()=>{activeProjectStage=button.dataset.projectStageFilter;filterProjects();}));
