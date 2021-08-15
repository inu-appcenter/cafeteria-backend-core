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

import User from './core/user/User';
import Notice from './core/notice/Notice';
import Corner from './core/cafeteria/Corner';
import Answer from './core/qna/Answer';
import Booking from './core/booking/Booking';
import CheckIn from './core/booking/CheckIn';
import Question from './core/qna/Question';
import Cafeteria from './core/cafeteria/Cafeteria';
import VisitRecord from './core/booking/VisitRecord';
import DiscountRule from './core/discount/DiscountRule';
import MenuParseRegex from './core/menu/MenuParseRegex';
import CafeteriaDayOff from './core/booking/CafeteriaDayOff';
import DiscountTransaction from './core/discount/DiscountTransaction';
import GuestLoginChallenge from './core/user/GuestLoginChallenge';
import CafeteriaBookingParams from './core/booking/CafeteriaBookingParams';
import DiscountProcessHistory from './core/discount/DiscountProcessHistory';
import CafeteriaValidationParams from './core/discount/CafeteriaValidationParams';

const entities = [
  User,
  Notice,
  Corner,
  Answer,
  Booking,
  CheckIn,
  Question,
  Cafeteria,
  VisitRecord,
  DiscountRule,
  MenuParseRegex,
  CafeteriaDayOff,
  DiscountTransaction,
  GuestLoginChallenge,
  CafeteriaBookingParams,
  DiscountProcessHistory,
  CafeteriaValidationParams,
];

export default async function startTypeORM(forceSync: boolean = false) {
  if (config.isProduction && forceSync) {
    throw new Error('프로덕션 환경에서는 forceSync를 지원하지 않습니다.');
  }

  const connection = await createConnection({
    ...config.database,
    entities,
    namingStrategy: new SnakeNamingStrategy(),
  });

  if (forceSync) {
    await connection.synchronize(true);
  }
}
