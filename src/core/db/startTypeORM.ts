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

import config from '../../../config';
import {createConnection} from 'typeorm';
import {SnakeNamingStrategy} from 'typeorm-naming-strategies';

import User from '../entities/user/User';
import Notice from '../entities/notice/Notice';
import Corner from '../entities/cafeteria/Corner';
import Answer from '../entities/qna/Answer';
import Booking from '../entities/booking/Booking';
import CheckIn from '../entities/booking/CheckIn';
import Question from '../entities/qna/Question';
import Cafeteria from '../entities/cafeteria/Cafeteria';
import VisitRecord from '../entities/booking/VisitRecord';
import DiscountRule from '../entities/discount/DiscountRule';
import MenuParseRegex from '../entities/menu/MenuParseRegex';
import CafeteriaDayOff from '../entities/booking/CafeteriaDayOff';
import DiscountTransaction from '../entities/discount/DiscountTransaction';
import GuestLoginChallenge from '../entities/user/GuestLoginChallenge';
import CafeteriaBookingParams from '../entities/booking/CafeteriaBookingParams';
import DiscountProcessHistory from '../entities/discount/DiscountProcessHistory';
import CafeteriaValidationParams from '../entities/discount/CafeteriaValidationParams';

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
