// Using exponential backoff to avoid thundering herd on retries.
// Each retry waits RETRY_DELAY_MS * 2^attempt before the next attempt,
// up to a maximum of MAX_RETRIES total attempts within TIMEOUT_MS.
export const MAX_RETRIES = 3;
export const TIMEOUT_MS = 5000;
export const RETRY_DELAY_MS = 500;
