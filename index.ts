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

import 'reflect-metadata';

import {TimeRangeExpression} from './src/core/common/TimeRangeExpression';
import Cafeteria from './src/core/cafeteria/Cafeteria';
import Corner from './src/core/cafeteria/Corner';
import DiscountRule from './src/core/discount/DiscountRule';
import DiscountProcessHistory from './src/core/discount/DiscountProcessHistory';
import DiscountTransaction from './src/core/discount/DiscountTransaction';
import CafeteriaValidationParams from './src/core/discount/CafeteriaValidationParams';
import Menu from './src/core/menu/Menu';
import MenuParseRegex from './src/core/menu/MenuParseRegex';
import Notice from './src/core/notice/Notice';
import Question from './src/core/qna/Question';
import Answer from './src/core/qna/Answer';
import User from './src/core/user/User';
import Booking from './src/core/booking/Booking';
import CheckIn from './src/core/booking/CheckIn';
import VisitRecord from './src/core/booking/VisitRecord';
import CafeteriaBookingParams from './src/core/booking/CafeteriaBookingParams';
import GuestLoginChallenge from './src/core/user/GuestLoginChallenge';

import startTypeORM from './src/startTypeORM';
import getEntityMetadata, {EntityClass, EntityMetadata} from './src/getEntityMetadata';

export {
  TimeRangeExpression,
  Cafeteria,
  Corner,
  DiscountRule,
  DiscountProcessHistory,
  DiscountTransaction,
  CafeteriaValidationParams,
  Menu,
  MenuParseRegex,
  Notice,
  Question,
  Answer,
  User,
  Booking,
  CheckIn,
  VisitRecord,
  CafeteriaBookingParams,
  GuestLoginChallenge,
  startTypeORM,
  getEntityMetadata,
  EntityClass,
  EntityMetadata,
};
