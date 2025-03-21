import { AxiosError } from "axios";

const HTTP_STATUS_CODES = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

const ERROR_MESSAGES: Record<number, string> = {
  [HTTP_STATUS_CODES.BAD_REQUEST]: "Invalid request (Bad Request)",
  [HTTP_STATUS_CODES.UNAUTHORIZED]: "Unauthorized access. Please log in.",
  [HTTP_STATUS_CODES.FORBIDDEN]: "Forbidden operation",
  [HTTP_STATUS_CODES.NOT_FOUND]: "Resource not found",
  [HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR]: "Internal server error",
};

export class ErrorHandler extends Error {
  public status: number;
  public data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export function handleAPIError(error: AxiosError): ErrorHandler {
  // Promise.reject(error);

  if (error.response) {
    const { status, data } = error.response;

    const message = ERROR_MESSAGES[status] || `Unknown error: ${status}`;
    return new ErrorHandler(message, status, data);
  } else if (error.request) {
    return new ErrorHandler("Failed to connect to the server. Please check your internet connection.", 0);
  } else {
    return new ErrorHandler(`Unknown error: ${error.message}`, 0);
  }
}
