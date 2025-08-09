import { HttpException, HttpStatus } from '@nestjs/common';

export class EBadCsrfTokenException extends HttpException {
  public constructor(message = 'Invalid CSRF token') {
    super(
      {
        message,
        error: 'Forbidden',
        statusCode: 403,
        code: 'EBADCSRFTOKEN',
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
