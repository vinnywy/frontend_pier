/** Formatting helpers (pt-BR locale) for backend ISO timestamps. */

const TIME_FMT = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
})

/** "2026-06-11T18:00:00Z" → "18:00" */
export function formatTime(iso: string): string {
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? '--:--' : TIME_FMT.format(date)
}

const DATE_FMT = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

/** "2026-06-11T18:00:00Z" → "11/06/2026" */
export function formatDate(iso: string): string {
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? '--' : DATE_FMT.format(date)
}
