export function formatDate(d) {
  if (!d) throw new Error('formatDate: date argument is required');
  const parsed = new Date(d);
  if (isNaN(parsed.getTime())) throw new Error('formatDate: invalid date value');
  return parsed.toISOString().split('T')[0];
}
