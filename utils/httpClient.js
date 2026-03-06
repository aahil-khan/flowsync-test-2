/**
 * HTTP Client with exponential backoff retry logic
 * Uses configuration from src/config/limits.js for retry parameters
 */

const axios = require('axios');
const { MAX_RETRIES, TIMEOUT_MS, RETRY_DELAY_MS } = require('../src/config/limits');

/**
 * Exponential backoff with jitter to prevent thundering herd
 * formula: base_delay * (2 ^ attempt) + random_jitter
 * @param {number} attempt - retry attempt number (0-based)
 * @returns {number} milliseconds to wait before next attempt
 */
function backoffWithJitter(attempt) {
  const exponentialDelay = RETRY_DELAY_MS * Math.pow(2, attempt);
  const jitter = Math.random() * exponentialDelay * 0.1; // 10% jitter
  return exponentialDelay + jitter;
}

/**
 * Create axios instance with default timeout from configuration
 */
const axiosInstance = axios.create({
  timeout: TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * HTTP GET request with exponential backoff retry on transient failures
 * Retries on: network errors, timeouts, 5xx errors
 * Does NOT retry on: 4xx errors (client errors)
 *
 * @param {string} url - The URL to request
 * @param {object} config - Optional axios config
 * @returns {Promise} axios response
 * @throws {Error} after MAX_RETRIES attempts exhausted
 */
async function httpGet(url, config = {}) {
  let lastError;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await axiosInstance.get(url, config);
      return response;
    } catch (error) {
      lastError = error;

      // Do not retry on client errors (4xx)
      if (error.response && error.response.status >= 400 && error.response.status < 500) {
        throw error;
      }

      // If this is the last attempt, throw
      if (attempt === MAX_RETRIES) {
        throw error;
      }

      // Calculate backoff and wait
      const delay = backoffWithJitter(attempt);
      console.log(
        `[httpClient] GET ${url} failed (attempt ${attempt + 1}/${MAX_RETRIES + 1}). Retrying in ${delay.toFixed(0)}ms.`
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

/**
 * HTTP POST request with exponential backoff retry on transient failures
 * Retries on: network errors, timeouts, 5xx errors
 * Does NOT retry on: 4xx errors (client errors)
 *
 * @param {string} url - The URL to request
 * @param {object} data - Request body data
 * @param {object} config - Optional axios config
 * @returns {Promise} axios response
 * @throws {Error} after MAX_RETRIES attempts exhausted
 */
async function httpPost(url, data = {}, config = {}) {
  let lastError;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await axiosInstance.post(url, data, config);
      return response;
    } catch (error) {
      lastError = error;

      // Do not retry on client errors (4xx)
      if (error.response && error.response.status >= 400 && error.response.status < 500) {
        throw error;
      }

      // If this is the last attempt, throw
      if (attempt === MAX_RETRIES) {
        throw error;
      }

      // Calculate backoff and wait
      const delay = backoffWithJitter(attempt);
      console.log(
        `[httpClient] POST ${url} failed (attempt ${attempt + 1}/${MAX_RETRIES + 1}). Retrying in ${delay.toFixed(0)}ms.`
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

module.exports = {
  httpGet,
  httpPost,
  backoffWithJitter,
};
