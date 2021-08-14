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
import {parse} from 'date-fns';

export type TimeRangeExpression = `${number}:${number}-${number}:${number}`;

export function isValidTimeRangeExpression(expression: string) {
  return /^[0-2][0-9]:[0-5][0-9]-[0-2][0-9]:[0-5][0-9]$/.test(expression);
}

export function timeRangeExpressionToDates(
  expression: string,
  referenceDate: Date = new Date()
): [Date, Date] {
  if (!isValidTimeRangeExpression(expression)) {
    throw new Error(`유효하지 않은 시간대 표현입니다: ${expression}`);
  }

  const [start, end] = expression.split('-');

  return [parse(start, 'HH:mm', referenceDate), parse(end, 'HH:mm', referenceDate)];
}
