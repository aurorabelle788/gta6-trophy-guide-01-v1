import { missableTrophies, spoilerHidden } from '../filters.js';

export function renderMissables(root, ctx) {
  const list = missableTrophies(ctx.trophies);
  const got = list.filter((t) => ctx.earned.has(t.id)).length;
  root.innerHTML = `
    <h1>Missable Trophies</h1>
    <p class="lede">${list.length} trophies flagged missable from their official descriptions — ${got} earned. These are the only ones a playthrough can actually lose.</p>
    <div class="warn"><strong>Golden rule:</strong> keep a manual save before every story choice, every one-off rival challenge, and every partner activity. If a missable does not pop, reload that save — do not start a new game.</div>
    <p class="note">Flags are built from the official descriptions on Exophase and PSNProfiles. Where the exact trigger is not pinned down by the description, the guide says so — this guide never invents a missable moment.</p>
    <ul class="trophy-list">
      ${list.map((t) => { const hidden = spoilerHidden(t, ctx.earned, ctx.settings.hideSpoilers); const nameHtml = hidden ? 'Hidden trophy — earn it to reveal' : `<a href="#/trophy/${t.id}">${escapeHtml(t.name)}</a>`; const descHtml = hidden ? 'Spoiler hidden until earned. Turn spoilers off in Settings to see story trophies.' : escapeHtml(t.description); const guideHtml = hidden ? '' : `<p class="guide">${escapeHtml(t.guide)}</p>`; return `<li class="trophy ${ctx.earned.has(t.id) ? 'earned' : ''}">
        <input type="checkbox" class="check" data-id="${t.id}" ${ctx.earned.has(t.id) ? 'checked' : ''} aria-label="Mark ${escapeHtml(t.name)} as earned">
        <div><h3>${nameHtml} <span class="grade ${t.grade}">${t.grade}</span> <span class="tag miss">MISSABLE</span></h3>
        <p class="desc">${descHtml}</p>
        ${guideHtml}</div>
        <button class="detail-link" data-id="${t.id}">Guide →</button>
      </li>`; }).join('')}
    </ul>`;
  root.querySelectorAll('.check').forEach((box) => box.addEventListener('change', () => {
    const id = Number(box.dataset.id);
    if (box.checked) ctx.earned.add(id); else ctx.earned.delete(id);
    ctx.persist();
    ctx.rerender(false);
  }));
  root.querySelectorAll('.detail-link').forEach((btn) => btn.addEventListener('click', () => { location.hash = '#/trophy/' + btn.dataset.id; }));
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
