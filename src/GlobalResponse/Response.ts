export class ResponseApi<T = any> {
  statusCode: number;
  success: boolean;
  message?: string;
  data?: T;
  error?: string;

  public constructor(
    statusCode: number,
    success: boolean,
    message?: string,
    data?: T,
    error?: string
  ) {
    this.statusCode = statusCode;
    this.success = success;
    this.message = message;
    this.data = data;
    this.error = error;
  }

  static success<T>(
    statusCode: number,
    message?: string,
    data?: T
  ): ResponseApi<T> {
    return new ResponseApi<T>(statusCode, true, message, data);
  }

  static error<T>(
    statusCode: number,
    message?: string,
    error?: string
  ): ResponseApi<T> {
    return new ResponseApi<T>(statusCode, false, message, undefined, error);
  }
}
