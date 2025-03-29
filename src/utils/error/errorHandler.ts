import { AxiosError } from "axios";

/**
 * Represents a custom error handler that extends the built-in `Error` class.
 * This class is designed to include additional information such as HTTP status codes
 * and optional data payloads, making it suitable for handling errors in an API client.
 */
export class ErrorHandler extends Error {
  public status: number;
  public data: any;

  /**
   * Creates an instance of the `ErrorHandler` class.
   *
   * @param message - A descriptive error message.
   * @param status - The HTTP status code representing the error type.
   * @param data - Optional additional data providing more context about the error.
   */
  constructor(message: string, status: number, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

/**
 * Handles API errors and maps them to a custom `ErrorHandler` instance.
 *
 * This function processes errors returned by Axios and provides a user-friendly
 * error message based on the HTTP status code. It also handles cases where the
 * error is due to a failed request or an unknown issue.
 *
 * @param error - The Axios error object containing details about the API error.
 * @returns An instance of `ErrorHandler` containing the error message, status code, and additional data.
 */
export function handleAPIError(error: AxiosError): ErrorHandler {
  const ERROR_MESSAGES: Record<number, string> = {
    400: "Invalid request (Bad Request)",
    401: "Unauthorized access. Please log in.",
    403: "Forbidden operation",
    404: "Resource not found",
    500: "Internal server error",
  };

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
