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

import PathMatcher from '../libs/PathMatcher';
import {decodeJwt} from '../../utils';
import {extractJwt} from '../../utils';
import {RequestHandler} from 'express';
import {InvalidJwt, NotLoggedIn} from '../../error/common';

type Params = {
  jwtKey: string;
  jwtFieldName: string;
  allowList?: string[];
};

export function authorizer<TParams = any, TQuery = any, TBody = any>({
  jwtKey,
  jwtFieldName,
  allowList,
}: Params): RequestHandler<TParams, any, TBody, TQuery> {
  const excludedPathMatcher = new PathMatcher(allowList || []);

  return (req, res, next) => {
    if (excludedPathMatcher.anyMatch(req.path)) {
      return next();
    }

    const jwtInRequest = extractJwt(req, jwtFieldName);
    if (jwtInRequest == null) {
      return next(NotLoggedIn());
    }

    try {
      decodeJwt(jwtInRequest, jwtKey);
      return next();
    } catch (e) {
      return next(InvalidJwt());
    }
  };
}
