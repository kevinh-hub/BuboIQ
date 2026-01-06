/**
 * API Retry Helper with exponential backoff
 * Provides resilience for API calls with automatic retry logic
 */

interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  retryableStatuses?: number[];
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxRetries: 2,
  initialDelay: 1000, // 1 second
  maxDelay: 5000, // 5 seconds
  backoffMultiplier: 2,
  retryableStatuses: [408, 429, 500, 502, 503, 504]
};

/**
 * Sleep utility
 */
const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Check if an error/response is retryable
 */
const isRetryable = (error: any, retryableStatuses: number[]): boolean => {
  // Network errors
  if (error.message === 'Failed to fetch' || error.message === 'Network request failed') {
    return true;
  }

  // HTTP status codes
  if (error.response?.status && retryableStatuses.includes(error.response.status)) {
    return true;
  }

  // Timeout errors
  if (error.name === 'AbortError' || error.code === 'ETIMEDOUT') {
    return true;
  }

  return false;
};

/**
 * Retry a fetch request with exponential backoff
 */
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retryOptions: RetryOptions = {}
): Promise<Response> {
  const opts = { ...DEFAULT_OPTIONS, ...retryOptions };
  let lastError: any;

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      // If response is ok or not retryable, return it
      if (response.ok || !opts.retryableStatuses.includes(response.status)) {
        return response;
      }

      // Store error for potential retry
      lastError = new Error(`HTTP ${response.status}: ${response.statusText}`);
      lastError.response = response;

      // If this is the last attempt, throw the error
      if (attempt === opts.maxRetries) {
        throw lastError;
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(
        opts.initialDelay * Math.pow(opts.backoffMultiplier, attempt),
        opts.maxDelay
      );

      console.warn(
        `Request failed (attempt ${attempt + 1}/${opts.maxRetries + 1}). Retrying in ${delay}ms...`,
        { url, status: response.status }
      );

      await sleep(delay);
    } catch (error: any) {
      lastError = error;

      // If not retryable or last attempt, throw
      if (!isRetryable(error, opts.retryableStatuses) || attempt === opts.maxRetries) {
        console.error(`Request failed after ${attempt + 1} attempts:`, error);
        throw error;
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(
        opts.initialDelay * Math.pow(opts.backoffMultiplier, attempt),
        opts.maxDelay
      );

      console.warn(
        `Request failed (attempt ${attempt + 1}/${opts.maxRetries + 1}). Retrying in ${delay}ms...`,
        { url, error: error.message }
      );

      await sleep(delay);
    }
  }

  throw lastError;
}

/**
 * Wrapper for async functions with retry logic
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  retryOptions: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...retryOptions };
  let lastError: any;

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      // If not retryable or last attempt, throw
      if (!isRetryable(error, opts.retryableStatuses) || attempt === opts.maxRetries) {
        console.error(`Operation failed after ${attempt + 1} attempts:`, error);
        throw error;
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(
        opts.initialDelay * Math.pow(opts.backoffMultiplier, attempt),
        opts.maxDelay
      );

      console.warn(
        `Operation failed (attempt ${attempt + 1}/${opts.maxRetries + 1}). Retrying in ${delay}ms...`,
        { error: error.message }
      );

      await sleep(delay);
    }
  }

  throw lastError;
}