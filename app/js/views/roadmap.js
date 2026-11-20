import { trophiesByStage, spoilerHidden } from '../filters.js';
import { gradeLabel } from '../data.js';

const STAGES = [
  { n: 1, title: 'Stage 1 — Story playthrough', text: 'Play the story in order: the opening mission, Chapters 1–4, the final mission, every named story mission, and all eight stranger strands (Andy, Kenton, Billy, Randy, Tyrone and the rest). Story trophies cannot be missed — but the missable ones flagged below should be done while their moments are live.' },
  { n: 2, title: 'Stage 2 — Collectibles', text: 'Sweep the map: meditation spots, collectible card sets, WAiNK locations (100), vehicles discovered (100), every region of Leonida, and all garage properties. Do these district by district as the story opens new areas, so you rarely backtrack.' },
  { n: 3, title: 'Stage 3 — Activities', text: 'Races (20 different wins), drone races at every Top Fun location, the arcade, bowling, fishing vs Cal, hunting for Bret, robberies (shops, vaults, armored trucks, gang operations), and the partner trophies. Partner trophies need your partner present — do them during the story, not after it.' },
  { n: 4, title: 'Stage 4 — Grinds & cleanup', text: 'The long counts: 250 stunts, 50 challenges, gold medals in all 42 Shooting Range challenges, $250,000 laundered, $100,000 spent — and 100% completion for the gold trophy “A Long Road”. Check the in-game stats screen to see exactly what is left.' },
  { n: 5, title: 'Stage 5 — Platinum', text: '“Vice Got a Price!” pops automatically once the other 54 are earned. There is no separate final task — the platinum is the receipt for the roadmap above.' }
];

export function renderRoadmap(root, ctx) {
  const { trophies, earned } = ctx;
  const done = trophies.filter((t) => t.roadmap_stage < 5 && earned.has(t.id)).length;
  const total = trophies.filter((t) => t.roadmap_stage < 5).length;
  root.innerHTML = `
    <h1>Platinum Roadmap</h1>
    <p class="lede">The order to earn all 55 trophies, built from the official descriptions: story first, then collectibles, then activities, then the grinds. ${done} of ${total} non-platinum trophies earned.</p>
    <p class="note">Sources: Exophase — Grand Theft Auto VI trophy list (official names, descriptions, grades); PSNProfiles — GTA VI trophies (PSN counts). Where a step is not pinned down by the official description, the guides say so plainly.</p>
    ${STAGES.map((s) => {
      const list = trophiesByStage(trophies, s.n);
      const got = list.filter((t) => earned.has(t.id)).length;
      return `<section class="stage"><h3>${s.title} — ${got}/${list.length} earned</h3><p>${s.text}</p>
        <ol>${list.map((t) => { const hidden = spoilerHidden(t, earned, ctx.settings.hideSpoilers); const label = hidden ? 'Hidden trophy — earn it to reveal' : `<a href="#/trophy/${t.id}">${escapeHtml(t.name)}</a>`; return `<li>${label} <span class="grade ${t.grade}">${t.grade}</span>${t.missable ? ' <span class="tag miss">MISSABLE</span>' : ''} ${earned.has(t.id) ? '✓' : ''}</li>`; }).join('')}</ol></section>`;
    }).join('')}`;
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
