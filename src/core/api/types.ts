export class ApiError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status?: number,
    public readonly retryable = false,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class SessionExpiredError extends ApiError {
  constructor() {
    super('Session expired. Please sign in again.', 'SESSION_EXPIRED', 401);
    this.name = 'SessionExpiredError';
  }
}

export class NetworkError extends ApiError {
  constructor(message = 'Network unavailable') {
    super(message, 'NETWORK_ERROR', undefined, true);
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends ApiError {
  constructor() {
    super('Request timed out', 'TIMEOUT', undefined, true);
    this.name = 'TimeoutError';
  }
}

export type ApiResult<T> =
  | {success: true; data: T; fromCache?: boolean}
  | {success: false; error: ApiError};
