import { Response } from 'express';

interface ApiResponse<T = any> {
  data: T | null;
  message: string;
  statusCode: number;
  metadata?: {
    page?: number;
    total?: number;
    limit?: number;
  };
}

export class ResponseHandler {
  static success<T>(
    res: Response,
    data: T,
    message: string = 'Success',
    statusCode: number = 200,
    metadata?: ApiResponse['metadata']
  ): void {
    const response: ApiResponse<T> = {
      data,
      message,
      statusCode,
      metadata: metadata || {},
    };
    res.status(statusCode).json(response);
  }

  static created<T>(
    res: Response,
    data: T,
    message: string = 'Resource created successfully'
  ): void {
    this.success(res, data, message, 201);
  }

  static noContent(res: Response, message: string = 'Success'): void {
    const response: ApiResponse<null> = {
      data: null,
      message,
      statusCode: 204,
      metadata: {},
    };
    res.status(204).json(response);
  }

  static error(
    res: Response,
    message: string,
    statusCode: number = 500
  ): void {
    const response: ApiResponse<null> = {
      data: null,
      message,
      statusCode,
      metadata: {},
    };
    res.status(statusCode).json(response);
  }

  static notFound(res: Response, message: string = 'Resource not found'): void {
    this.error(res, message, 404);
  }

  static badRequest(res: Response, message: string): void {
    this.error(res, message, 400);
  }
}
