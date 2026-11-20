const TROPHY_URL = './data/trophies.json';
let cachedTrophies = null;

export async function loadTrophies() {
  if (cachedTrophies) return cachedTrophies;
  const response = await fetch(TROPHY_URL);
  if (!response.ok) throw new Error('Could not load trophy data');
  const data = await response.json();
  cachedTrophies = Array.isArray(data) ? data : data.trophies;
  return cachedTrophies;
}

export function gradeLabel(grade) {
  return grade.charAt(0).toUpperCase() + grade.slice(1);
}

export function kindLabel(kind) {
  const labels = { story: 'Story', missable: 'Missable', collectible: 'Collectible', activity: 'Activity' };
  return labels[kind] || kind;
}

export function countByGrade(trophies, earnedIds) {
  const counts = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  const totals = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  for (const t of trophies) {
    totals[t.grade] = (totals[t.grade] || 0) + 1;
    if (earnedIds.has(t.id)) counts[t.grade] = (counts[t.grade] || 0) + 1;
  }
  return { counts, totals };
}
