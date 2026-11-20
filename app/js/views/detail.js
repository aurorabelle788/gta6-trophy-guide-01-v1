import { gradeLabel, kindLabel } from '../data.js';
import { spoilerHidden } from '../filters.js';

const SOURCE_LINKS = {
  'Exophase': 'https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/',
  'PSNProfiles': 'https://psnprofiles.com/trophies/43531-grand-theft-auto-vi'
};

export function renderDetail(root, ctx, id) {
  const t = ctx.trophies.find((x) => x.id === id);
  if (!t) { root.innerHTML = '<h1>Trophy not found</h1><p><a href="#/checklist">Back to the checklist</a></p>'; return; }
  const isEarned = ctx.earned.has(t.id);
  const hidden = spoilerHidden(t, ctx.earned, ctx.settings.hideSpoilers);
  const name = hidden ? 'Hidden trophy — earn it to reveal' : t.name;
  const desc = hidden ? 'Spoiler hidden until earned. Turn spoilers off in Settings to see story trophies.' : t.description;
  const sources = (t.sources || []).map((s) => {
    const key = Object.keys(SOURCE_LINKS).find((k) => s.startsWith(k));
    return key ? `<li><a href="${SOURCE_LINKS[key]}">${escapeHtml(s)}</a></li>` : `<li>${escapeHtml(s)}</li>`;
  }).join('');

  root.innerHTML = `
    <p><a href="#/checklist">← Back to checklist</a></p>
    <div class="detail">
      <article class="card">
        <h1>${escapeHtml(name)}</h1>
        <p><span class="grade ${t.grade}">${t.grade}</span> <span class="tag">${kindLabel(t.kind)}</span> ${t.missable ? '<span class="tag miss">MISSABLE</span>' : ''} ${t.hidden ? '<span class="tag hidden-tag">HIDDEN ON PSN</span>' : ''}</p>
        <p class="desc"><strong>Official description:</strong> ${escapeHtml(desc)}</p>
        <h2>Guide</h2>
        <p class="guide">${escapeHtml(t.guide)}</p>
        <label class="switch"><input type="checkbox" id="earnedBox" ${isEarned ? 'checked' : ''}> Mark as earned</label>
        <p class="note">Roadmap stage: ${stageName(t.roadmap_stage)} · ${isEarned ? 'Earned — saved in this browser.' : 'Not earned yet.'}</p>
      </article>
      <aside class="card">
        <h2>Sources</h2>
        <p class="note">Every fact in this guide cites its source. The name, description and grade come from the official list; the guide itself is this entry's own words, built from that description.</p>
        <ul class="sources">${sources}</ul>
        <h2>When it can be missed</h2>
        <p>${t.missable ? '<strong>Yes — missable.</strong> See the Missables page for the warning, and keep a save from before the moment described in the guide.' : 'Not missable. You can earn it at any point — before, during or after the story.'}</p>
      </aside>
    </div>`;

  root.querySelector('#earnedBox').addEventListener('change', (e) => {
    if (e.target.checked) ctx.earned.add(t.id); else ctx.earned.delete(t.id);
    ctx.persist();
    ctx.rerender(false);
  });
}

function stageName(stage) {
  return { 1: 'Stage 1 — Story playthrough', 2: 'Stage 2 — Collectibles', 3: 'Stage 3 — Activities', 4: 'Stage 4 — Grinds & cleanup', 5: 'Stage 5 — Platinum' }[stage] || '—';
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
