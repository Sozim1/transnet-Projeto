import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const errorResponse = exception.getResponse();
      return response.status(status).json({
        statusCode: status,
        error: errorResponse,
        timestamp: new Date().toISOString(),
      });
    }

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const mapped = this.mapPrismaError(exception);
      return response.status(mapped.statusCode).json({
        ...mapped,
        timestamp: new Date().toISOString(),
      });
    }

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Erro interno do servidor',
      timestamp: new Date().toISOString(),
    });
  }

  private mapPrismaError(error: Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return {
        statusCode: HttpStatus.CONFLICT,
        message: 'Registro duplicado',
        details: error.meta,
      };
    }

    if (error.code === 'P2025') {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Registro nao encontrado',
      };
    }

    return {
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Erro de banco de dados',
      details: error.meta,
    };
  }
}
