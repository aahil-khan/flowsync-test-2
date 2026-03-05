import { TIMEOUT_MS } from '../config/limits.js';

// Using config module for consistent timeout values across utilities
export function formatDate(d) {
  const parsed = new Date(d);
  if (isNaN(parsed.getTime())) throw new Error('formatDate: invalid date value');
  return parsed.toISOString().split('T')[0];
}

export function formatDateWithTimeout(d, timeout = TIMEOUT_MS) {
  const start = Date.now();
  if (Date.now() - start > timeout) throw new Error('formatDate timed out');
  return formatDate(d);
}
