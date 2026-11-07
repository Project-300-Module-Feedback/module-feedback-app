// the ratings we work out averages for, add more here if we need them
export const RATING_FIELDS = ["overall", "teaching", "content", "assessmentFairness"];

export function average(reviews, field) {
  const values = reviews.map(r => r[field]).filter(v => typeof v === "number");
  if (values.length === 0) return null;
  const total = values.reduce((sum, v) => sum + v, 0);
  return Math.round((total / values.length) * 10) / 10;
}

export function getStats(reviews) {
  const stats = {};
  for (const field of RATING_FIELDS) {
    stats[field] = average(reviews, field);
  }
  stats.hoursPerWeek = average(reviews, "hoursPerWeek");

  const recommends = reviews.filter(r => r.recommend === true).length;
  stats.recommendPercent = reviews.length ? Math.round((recommends / reviews.length) * 100) : null;

  return stats;
}