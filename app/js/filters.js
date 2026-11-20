export function spoilerHidden(trophy, earnedIds, hideSpoilers) {
  if (!hideSpoilers) return false;
  if (earnedIds.has(trophy.id)) return false;
  if (trophy.grade === 'platinum') return false;
  return trophy.hidden === true || trophy.kind === 'story';
}

export function applyFilters(trophies, earnedIds, filters) {
  const query = (filters.query || '').trim().toLowerCase();
  return trophies.filter((t) => {
    if (filters.grade !== 'all' && t.grade !== filters.grade) return false;
    if (filters.kind === 'story' && t.kind !== 'story') return false;
    if (filters.kind === 'missable' && !t.missable) return false;
    if (filters.kind === 'collectible' && t.kind !== 'collectible') return false;
    if (filters.kind === 'activity' && t.kind !== 'activity') return false;
    if (filters.earned === 'earned' && !earnedIds.has(t.id)) return false;
    if (filters.earned === 'unearned' && earnedIds.has(t.id)) return false;
    if (query && !(t.name.toLowerCase().includes(query) || t.description.toLowerCase().includes(query))) return false;
    return true;
  });
}

export function missableTrophies(trophies) {
  return trophies.filter((t) => t.missable);
}

export function trophiesByStage(trophies, stage) {
  return trophies.filter((t) => t.roadmap_stage === stage);
}
