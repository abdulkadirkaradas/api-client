import { AxiosError } from "axios";

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
