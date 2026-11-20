import { exportProgress, importProgressFile } from '../store.js';

export function renderSettings(root, ctx) {
  root.innerHTML = `
    <h1>Settings &amp; Save</h1>
    <div class="card">
      <h2>Spoiler setting</h2>
      <label class="switch"><input type="checkbox" id="spoilerBox" ${ctx.settings.hideSpoilers ? 'checked' : ''}> Hide story trophies until earned</label>
      <p class="note">When on, hidden and story trophies show as “Hidden trophy” with no name or description until you tick them earned. Turn it off to see the full list.</p>
      <h2>Export &amp; import</h2>
      <p class="note">Progress lives in this browser's localStorage. Export a backup file, or import one to restore progress on another device.</p>
      <div class="btnrow">
        <button class="btn" id="exportBtn">Export progress (JSON)</button>
        <label class="btn ghost" for="importFile" style="cursor:pointer">Import progress…</label>
        <input type="file" id="importFile" accept="application/json,.json" hidden>
      </div>
      <p class="note" id="saveMsg">${ctx.earned.size} of ${ctx.trophies.length} trophies earned · saved locally.</p>
      <h2>Reset</h2>
      <div class="btnrow"><button class="btn ghost" id="resetBtn">Clear all progress</button></div>
    </div>`;
  root.querySelector('#spoilerBox').addEventListener('change', (e) => {
    ctx.settings.hideSpoilers = e.target.checked;
    ctx.persistSettings();
    ctx.rerender(false);
  });
  root.querySelector('#exportBtn').addEventListener('click', () => {
    const n = exportProgress(ctx.earned);
    root.querySelector('#saveMsg').textContent = `Exported ${n} earned trophies to vice-ledger-progress.json.`;
  });
  root.querySelector('#importFile').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const next = await importProgressFile(file);
      ctx.earned.clear();
      for (const id of next) ctx.earned.add(id);
      root.querySelector('#saveMsg').textContent = `Imported ${next.size} earned trophies from ${file.name}.`;
      ctx.rerender(false);
    } catch (err) {
      root.querySelector('#saveMsg').textContent = 'Import failed: ' + err.message;
    }
  });
  root.querySelector('#resetBtn').addEventListener('click', () => {
    ctx.earned.clear();
    ctx.persist();
    ctx.rerender(false);
  });
}
