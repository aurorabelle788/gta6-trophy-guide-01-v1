const PROGRESS_KEY = 'vice-ledger-progress-v1';
const SETTINGS_KEY = 'vice-ledger-settings-v1';
const SEED_IDS = [2, 3, 8, 15, 16, 21, 28, 35, 42, 44, 46, 51, 53];

export function loadProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return new Set(Array.isArray(parsed.earned) ? parsed.earned : []);
  } catch {
    return new Set();
  }
}

export function saveProgress(earnedIds) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify({ earned: [...earnedIds].sort((a, b) => a - b), savedAt: new Date().toISOString() }));
}

export function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { hideSpoilers: true };
    return { hideSpoilers: true, ...JSON.parse(raw) };
  } catch {
    return { hideSpoilers: true };
  }
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function exportProgress(earnedIds) {
  const payload = { app: 'Vice Ledger — GTA VI Trophy Guide', version: 1, exportedAt: new Date().toISOString(), earned: [...earnedIds].sort((a, b) => a - b) };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'vice-ledger-progress.json';
  link.click();
  URL.revokeObjectURL(url);
  return payload.earned.length;
}

export async function importProgressFile(file) {
  const text = await file.text();
  const parsed = JSON.parse(text);
  const earned = Array.isArray(parsed) ? parsed : parsed.earned;
  if (!Array.isArray(earned)) throw new Error('Import file has no earned list');
  const ids = earned.map(Number).filter((n) => Number.isInteger(n));
  const next = new Set(ids);
  saveProgress(next);
  return next;
}

export function seedDemoProgress() {
  const seeded = new Set(SEED_IDS);
  saveProgress(seeded);
  return seeded;
}

export function seedParamPresent() {
  return new URLSearchParams(location.search).get('seed') === '13';
}
