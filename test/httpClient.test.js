/**
 * Unit tests for HTTP client retry logic
 */

const assert = require('assert');
const { backoffWithJitter } = require('../utils/httpClient');
const { RETRY_DELAY_MS } = require('../src/config/limits');

describe('HTTP Client Retry Logic', () => {
  describe('backoffWithJitter', () => {
    it('should calculate exponential backoff for attempt 0', () => {
      const delay = backoffWithJitter(0);
      // Attempt 0: base_delay * 2^0 + jitter => RETRY_DELAY_MS + jitter (0-10%)
      const expectedMin = RETRY_DELAY_MS;
      const expectedMax = RETRY_DELAY_MS * 1.1;
      assert(
        delay >= expectedMin && delay <= expectedMax,
        `Delay ${delay} not in range [${expectedMin}, ${expectedMax}]`
      );
    });

    it('should calculate exponential backoff for attempt 1', () => {
      const delay = backoffWithJitter(1);
      // Attempt 1: base_delay * 2^1 + jitter => RETRY_DELAY_MS * 2 + jitter
      const expectedMin = RETRY_DELAY_MS * 2;
      const expectedMax = RETRY_DELAY_MS * 2 * 1.1;
      assert(
        delay >= expectedMin && delay <= expectedMax,
        `Delay ${delay} not in range [${expectedMin}, ${expectedMax}]`
      );
    });

    it('should calculate exponential backoff for attempt 2', () => {
      const delay = backoffWithJitter(2);
      // Attempt 2: base_delay * 2^2 + jitter => RETRY_DELAY_MS * 4 + jitter
      const expectedMin = RETRY_DELAY_MS * 4;
      const expectedMax = RETRY_DELAY_MS * 4 * 1.1;
      assert(
        delay >= expectedMin && delay <= expectedMax,
        `Delay ${delay} not in range [${expectedMin}, ${expectedMax}]`
      );
    });

    it('should increase delay exponentially with attempt count', () => {
      const delay0 = backoffWithJitter(0);
      const delay1 = backoffWithJitter(1);
      const delay2 = backoffWithJitter(2);

      assert(delay1 > delay0 * 1.5, 'Attempt 1 should be significantly longer than attempt 0');
      assert(delay2 > delay1 * 1.5, 'Attempt 2 should be significantly longer than attempt 1');
    });
  });
});
