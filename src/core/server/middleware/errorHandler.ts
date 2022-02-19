/**
 * This file is part of INU Cafeteria.
 *
 * Copyright 2021 INU Global App Center <potados99@gmail.com>
 *
 * INU Cafeteria is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * INU Cafeteria is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import {logger} from '../../logger';
import HttpError from '../../error/http/base/HttpError';
import CustomError from '../../error/custom/base/CustomError';
import {AssertionError} from 'assert';
import {stringifyError} from '../../utils';
import {ErrorRequestHandler} from 'express';

export function errorHandler(): ErrorRequestHandler {
  return (err, req, res, _ /** 파라미터 4개 없으면 작동 안함! */) => {
    if (isHttpError(err)) {
      logger.info(`HTTP 에러가 발생했습니다: ${stringifyError(err)}`);

      return res.status(err.statusCode).json(err.responseBody);
    } else if (isCustomError(err)) {
      logger.warn(`Custom 에러가 발생했습니다: ${stringifyError(err)}`);

      return res.status(err.statusCode).json(err.responseBody);
    } else if (isAssertionError(err)) {
      logger.warn(`Assertion 에러가 발생했습니다: ${stringifyError(err)}`);

      const {message} = err;

      return res.status(500).json({
        statusCode: 500,
        error: 'assertion_failed',
        message,
      });
    } else if (isErrorWithStatusCode(err)) {
      logger.error(`상태 코드와 함께 에러가 발생했습니다: ${stringifyError(err)}`);

      return res.status(500).json({
        statusCode: err.statusCode,
        error: err.name,
        message: err.message,
      });
    } else {
      logger.error(`처리되지 않은 에러가 발생했습니다: ${stringifyError(err)}`);

      return res.status(500).json({
        statusCode: 500,
        error: 'unhandled',
        message: stringifyError(err),
      });
    }
  };
}

function isHttpError(error: Error): error is HttpError {
  return error instanceof HttpError;
}

function isCustomError(error: Error): error is CustomError<any> {
  return error instanceof CustomError;
}

function isAssertionError(error: Error): error is AssertionError {
  return error instanceof AssertionError;
}

function isErrorWithStatusCode(error: Error): error is Error & {statusCode: number} {
  // @ts-ignore
  return error['statusCode'] != null;
}
