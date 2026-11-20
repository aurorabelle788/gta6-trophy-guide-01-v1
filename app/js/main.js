import { loadTrophies } from './data.js';
import { loadProgress, saveProgress, loadSettings, saveSettings, seedDemoProgress, seedParamPresent } from './store.js';
import { renderChecklist } from './views/checklist.js';
import { renderDetail } from './views/detail.js';
import { renderRoadmap } from './views/roadmap.js';
import { renderMissables } from './views/missables.js';
import { renderSettings } from './views/settings.js';

const appRoot = document.getElementById('app');
const navLinks = [...document.querySelectorAll('#topnav a')];

const ctx = {
  trophies: [],
  earned: loadProgress(),
  settings: loadSettings(),
  filters: { query: '', grade: 'all', kind: 'all', earned: 'all' },
  persist() { saveProgress(ctx.earned); },
  persistSettings() { saveSettings(ctx.settings); },
  rerender(refocusSearch = true) { renderRoute(refocusSearch); }
};

function currentRoute() {
  const hash = location.hash || '#/checklist';
  const parts = hash.replace(/^#\//, '').split('/');
  return { view: parts[0] || 'checklist', id: parts[1] ? Number(parts[1]) : null };
}

function renderRoute(refocusSearch = true) {
  const { view, id } = currentRoute();
  navLinks.forEach((a) => a.classList.toggle('active', a.dataset.route === view || (view === 'trophy' && a.dataset.route === 'checklist')));
  const hadSearchFocus = refocusSearch && document.activeElement && document.activeElement.id === 'q';
  const queryValue = ctx.filters.query;
  if (view === 'roadmap') renderRoadmap(appRoot, ctx);
  else if (view === 'missables') renderMissables(appRoot, ctx);
  else if (view === 'settings') renderSettings(appRoot, ctx);
  else if (view === 'trophy' && id) renderDetail(appRoot, ctx, id);
  else renderChecklist(appRoot, ctx);
  if (hadSearchFocus) {
    const q = document.getElementById('q');
    if (q) { q.focus(); q.setSelectionRange(q.value.length, q.value.length); }
  }
  window.scrollTo(0, 0);
}

async function bootViceLedger() {
  if (seedParamPresent() && ctx.earned.size === 0) ctx.earned = seedDemoProgress();
  ctx.trophies = await loadTrophies();
  window.addEventListener('hashchange', () => renderRoute(false));
  renderRoute(false);
}

bootViceLedger();
