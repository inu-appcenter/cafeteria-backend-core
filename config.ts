/**
 * This file is part of INU Cafeteria.
 *
 * Copyright (C) 2021 INU Global App Center <potados99@gmail.com>
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

import assert from 'assert';
import {ConnectionOptions} from 'typeorm/connection/ConnectionOptions';
import getEnv from './src/utils/env';

const isProduction = getEnv('NODE_ENV') === 'production';

if (isProduction) {
  assert(getEnv('DB_HOST'), 'DB 호스트 설정해주세요!');
  assert(getEnv('DB_USERNAME'), 'DB 사용자 이름 설정해주세요!');
  assert(getEnv('DB_PASSWORD'), 'DB 비밀번호 설정해주세요!');
}

export default {
  isProduction,

  database: <ConnectionOptions>{
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: getEnv('DB_USERNAME', 'potados'),
    password: getEnv('DB_PASSWORD', '1234'),
    database: 'cafeteria',
    timezone: '+09:00',
    logging: false,
  },
};
