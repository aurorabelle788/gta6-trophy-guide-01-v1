import { gradeLabel, kindLabel, countByGrade } from '../data.js';
import { applyFilters, spoilerHidden } from '../filters.js';

export function renderChecklist(root, ctx) {
  const { trophies, earned, settings } = ctx;
  const filters = ctx.filters;
  const visible = applyFilters(trophies, earned, filters);
  const { counts, totals } = countByGrade(trophies, earned);
  const pct = Math.round((earned.size / trophies.length) * 100);

  root.innerHTML = `
    <h1>GTA VI Trophy Checklist</h1>
    <p class="lede">All 55 official PlayStation 5 trophies — 1 platinum, 2 gold, 6 silver, 46 bronze. Tick each one as you earn it; progress is saved in this browser.</p>
    <div class="statgrid">
      <div class="stat"><b>${earned.size} / ${trophies.length}</b><span>earned · ${pct}% to platinum</span></div>
      <div class="stat"><b>${counts.platinum}/${totals.platinum}</b><span>Platinum</span></div>
      <div class="stat"><b>${counts.gold}/${totals.gold}</b><span>Gold</span></div>
      <div class="stat"><b>${counts.silver}/${totals.silver}</b><span>Silver</span></div>
      <div class="stat"><b>${counts.bronze}/${totals.bronze}</b><span>Bronze</span></div>
    </div>
    <div class="progressbar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><i style="width:${pct}%"></i></div>
    <div class="toolbar">
      <input type="search" id="q" placeholder="Search by trophy name…" value="${escapeAttr(filters.query)}" aria-label="Search trophies">
      <select id="gradeFilter" aria-label="Filter by grade">
        <option value="all">All grades</option>
        ${['platinum', 'gold', 'silver', 'bronze'].map((g) => `<option value="${g}" ${filters.grade === g ? 'selected' : ''}>${gradeLabel(g)}</option>`).join('')}
      </select>
      <select id="earnedFilter" aria-label="Filter by earned state">
        <option value="all">Earned + unearned</option>
        <option value="earned" ${filters.earned === 'earned' ? 'selected' : ''}>Earned only</option>
        <option value="unearned" ${filters.earned === 'unearned' ? 'selected' : ''}>Unearned only</option>
      </select>
    </div>
    <div class="toolbar" role="group" aria-label="Filter by kind">
      ${[['all', 'All kinds'], ['story', 'Story'], ['missable', 'Missable'], ['collectible', 'Collectibles'], ['activity', 'Activities']].map(([k, label]) => `<button class="chip" data-kind="${k}" aria-pressed="${filters.kind === k}">${label}</button>`).join('')}
      <span class="note">${visible.length} of ${trophies.length} shown</span>
    </div>
    <ul class="trophy-list">
      ${visible.map((t) => trophyRow(t, earned, settings)).join('') || '<li class="empty">No trophies match these filters.</li>'}
    </ul>`;

  root.querySelector('#q').addEventListener('input', (e) => { ctx.filters.query = e.target.value; ctx.rerender(false); });
  root.querySelector('#gradeFilter').addEventListener('change', (e) => { ctx.filters.grade = e.target.value; ctx.rerender(); });
  root.querySelector('#earnedFilter').addEventListener('change', (e) => { ctx.filters.earned = e.target.value; ctx.rerender(); });
  root.querySelectorAll('.chip').forEach((chip) => chip.addEventListener('click', () => { ctx.filters.kind = chip.dataset.kind; ctx.rerender(); }));
  root.querySelectorAll('.check').forEach((box) => box.addEventListener('change', () => {
    const id = Number(box.dataset.id);
    if (box.checked) ctx.earned.add(id); else ctx.earned.delete(id);
    ctx.persist();
    ctx.rerender(false);
  }));
  root.querySelectorAll('.detail-link').forEach((btn) => btn.addEventListener('click', () => { location.hash = '#/trophy/' + btn.dataset.id; }));
}

function trophyRow(t, earned, settings) {
  const isEarned = earned.has(t.id);
  const hidden = spoilerHidden(t, earned, settings.hideSpoilers);
  const name = hidden ? 'Hidden trophy — earn it to reveal' : escapeHtml(t.name);
  const desc = hidden ? 'Spoiler hidden until earned. Turn spoilers off in Settings to see story trophies.' : escapeHtml(t.description);
  return `<li class="trophy ${isEarned ? 'earned' : ''}">
    <input type="checkbox" class="check" data-id="${t.id}" ${isEarned ? 'checked' : ''} aria-label="Mark ${escapeAttr(t.name)} as earned">
    <div><h3>${name} <span class="grade ${t.grade}">${t.grade}</span>${t.missable ? '<span class="tag miss">MISSABLE</span>' : ''}${hidden ? '<span class="tag hidden-tag">HIDDEN</span>' : ''}<span class="tag">${kindLabel(t.kind)}</span></h3>
    <p class="desc">${desc}</p></div>
    <button class="detail-link" data-id="${t.id}">Guide →</button>
  </li>`;
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeAttr(s) {
  return escapeHtml(s).replace(/"/g, '&quot;');
}
