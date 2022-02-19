import {decodeJwt} from '../../utils/token';
import {extractJwt} from '../../utils/express';
import {NotLoggedIn} from '../../error/common';
import express, {RequestHandler} from 'express';

type Params = {
  jwtFieldName: string;
};

export function userIdGetterAssigner({jwtFieldName}: Params): RequestHandler {
  return (req, res, next) => {
    const jwtInRequest = extractJwt(req, jwtFieldName);
    if (jwtInRequest == null) {
      assignGetter(req);

      return next();
    }

    try {
      const {userId} = decodeJwt(jwtInRequest, jwtFieldName);

      assignGetter(req, userId);

      return next();
    } catch (e) {
      return next();
    }
  };
}

function assignGetter(req: express.Request, initial?: number) {
  Object.defineProperty(req, 'userId', {
    get() {
      return initial;
    },
  });

  req.requireUserId = () => {
    if (initial) {
      return initial;
    } else {
      throw NotLoggedIn();
    }
  };
}
