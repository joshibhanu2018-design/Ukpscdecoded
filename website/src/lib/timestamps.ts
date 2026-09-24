/**
 * Most timestamp columns in this schema (password_reset_tokens.expires_at,
 * attempts.start_time, ...) are Postgres `timestamp without time zone` —
 * PostgREST returns them with no UTC suffix (e.g.
 * "2026-09-23T13:07:59.418"), and JS's Date parser treats a
 * timezone-less ISO string as LOCAL time, not UTC. On a non-UTC server
 * (confirmed: IST, UTC+5:30) that silently shifts the parsed time by
 * hours. The app always writes these as UTC (`new Date().toISOString()`),
 * so they must be parsed as UTC too.
 */
export function parseUtcTimestamp(value: string): Date {
  return new Date(/[Z+-]\d{2}:?\d{2}$|Z$/.test(value) ? value : `${value}Z`);
}
