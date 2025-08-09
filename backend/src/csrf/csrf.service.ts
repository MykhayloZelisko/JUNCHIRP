import { HttpStatus, Injectable } from '@nestjs/common';
import { doubleCsrf, DoubleCsrfUtilities } from 'csrf-csrf';
import { NextFunction, Request, Response } from 'express';
import { EBadCsrfTokenException } from '../shared/exceptions/e-bad-csrf-token.exception';
import { ConfigService } from '@nestjs/config';
import { CsrfTokenResponseDto } from './dto/csrf-token.response-dto';

@Injectable()
export class CsrfService {
  private readonly csrf: DoubleCsrfUtilities;

  public constructor(configService: ConfigService) {
    this.csrf = doubleCsrf({
      getSecret: () => process.env.CSRF_SECRET ?? 'default_secret',
      getTokenFromRequest: (req) => req.headers['x-csrf-token'],
      cookieName:
        process.env.NODE_ENV === 'production'
          ? '__Host-prod.x-csrf-token'
          : '_csrf',
      cookieOptions: {
        secure: true,
        httpOnly: true,
        sameSite: 'lax',
        maxAge: configService.get<number>('EXPIRE_TIME_CSRF_TOKEN'),
      },
    });
  }

  public doubleCsrfProtection(
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    this.csrf.doubleCsrfProtection(req, res, (err) => {
      if (err?.code === 'EBADCSRFTOKEN') {
        const exception = new EBadCsrfTokenException();
        return res.status(HttpStatus.FORBIDDEN).json(exception.getResponse());
      }

      return next(err);
    });
  }

  public generateToken(req: Request, res: Response): CsrfTokenResponseDto {
    return { csrfToken: this.csrf.generateToken(req, res) };
  }
}
