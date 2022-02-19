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

import path from 'path';
import * as fs from 'fs';
import {getEnv} from './env';
import {logger} from '../logger';

const isWindows = process.platform === 'win32';

const DOCKER_SECRET_BASE_PATH = isWindows ? 'C:\\ProgramData\\Docker\\secrets' : '/run/secrets';

/**
 * Docker 컨테이너 환경에서, 해당 이름을 가지는 secret을 가져옵니다.
 * 만약 없으면 환경변수에서 찾습니다.
 * 거기서도 없으면 fallback을 가져옵니다.
 *
 * @param key 가져올 secret의 이름입니다.
 * @param fallback 아무리 찾아봐도 없으면 이걸 가져와요.
 */
export default function getSecret(key: string, fallback?: any): any {
  const secretPath = path.join(DOCKER_SECRET_BASE_PATH, key);

  if (fs.existsSync(secretPath)) {
    logger.verbose(`${key}를 ${secretPath}에서 읽어옵니다.`);

    return fs.readFileSync(secretPath).toString('utf-8').trim(); // 개행문자 꼭 잘라야 함.
  } else {
    logger.verbose(`${key}가 secret 경로에 없어 환경변수에서 읽어옵니다.`);

    return getEnv(key, fallback);
  }
}
