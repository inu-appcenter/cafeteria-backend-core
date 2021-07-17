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

import config from '../config';
import {createConnection} from 'typeorm';
import {SnakeNamingStrategy} from 'typeorm-naming-strategies';
import Cafeteria from './core/cafeteria/Cafeteria';
import CafeteriaComment from './core/cafeteria/CafeteriaComment';
import Corner from './core/cafeteria/Corner';
import CafeteriaDiscountRule from './core/discount/CafeteriaDiscountRule';
import CafeteriaValidationParams from './core/discount/CafeteriaValidationParams';
import DiscountHistory from './core/discount/DiscountHistory';
import MenuParseRegex from './core/menu/MenuParseRegex';
import Notice from './core/notice/Notice';
import Answer from './core/qna/Answer';
import Question from './core/qna/Question';
import User from './core/user/User';

const entities = [
  Cafeteria,
  CafeteriaComment,
  Corner,
  CafeteriaDiscountRule,
  CafeteriaValidationParams,
  DiscountHistory,
  MenuParseRegex,
  Notice,
  Answer,
  Question,
  User,
];

export default async function startTypeORM(forceSync: boolean = false) {
  if (config.isProduction && forceSync) {
    throw new Error('프로덕션 환경에서는 forceSync를 지원하지 않습니다.');
  }

  await createConnection({
    ...config.database,
    entities,
    synchronize: forceSync,
    namingStrategy: new SnakeNamingStrategy(),
  });
}
