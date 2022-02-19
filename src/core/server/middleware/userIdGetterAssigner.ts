import {NotLoggedIn} from '../../error';
import {decodeJwt, extractJwt} from '../../utils';
import express, {RequestHandler} from 'express';

type Params = {
  jwtKey: string;
  jwtFieldName: string;
};

export function userIdGetterAssigner({jwtKey, jwtFieldName}: Params): RequestHandler {
  return (req, res, next) => {
    const jwtInRequest = extractJwt(req, jwtFieldName);
    if (jwtInRequest == null) {
      assignGetter(req);

      return next();
    }

    try {
      const {userId} = decodeJwt(jwtInRequest, jwtKey);

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
