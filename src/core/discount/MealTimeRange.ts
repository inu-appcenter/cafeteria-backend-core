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

import {Column} from 'typeorm';

export type TimeRangeExpression = `${number}:${number}-${number}:${number}`;

export default class MealTimeRange {
  @Column({comment: '아침 식사 시간대'})
  breakfast: TimeRangeExpression;

  @Column({comment: '점심 식사 시간대'})
  lunch: TimeRangeExpression;

  @Column({comment: '저녁 식사 시간대'})
  dinner: TimeRangeExpression;

  static create(properties: Partial<MealTimeRange>): MealTimeRange {
    return Object.assign(new MealTimeRange(), properties);
  }
}
