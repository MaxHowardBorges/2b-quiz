export function parseDate(date) {
  if (!date) return new Date().toLocaleDateString('fr-CA');
  return new Date(date).toLocaleDateString('fr-CA');
}
export function getTimeFromDate(date) {
  if (!date) return new Date().toLocaleTimeString('fr-CA');
  return new Date(date).toLocaleTimeString('fr-CA');
}
