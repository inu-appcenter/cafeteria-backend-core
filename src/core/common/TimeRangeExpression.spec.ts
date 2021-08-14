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

import {isValidTimeRangeExpression, timeRangeExpressionToDates} from './TimeRangeExpression';

describe('시간대 표현 검증', () => {
  it('제대로된 표현이면 통과', async () => {
    const source = '08:30-12:30';
    const result = isValidTimeRangeExpression(source);

    expect(result).toBe(true);
  });

  it('잘못된 표현이면 실패', async () => {
    const source = '08:90-12:30';
    const result = isValidTimeRangeExpression(source);

    expect(result).toBe(false);
  });
});

describe('시간대 표현을 Date 객체로 바꾸기', () => {
  it('제대로 된 표현이면 성공', async () => {
    const source = '08:30-12:30';
    const [start, end] = timeRangeExpressionToDates(source);

    expect(start.getHours()).toBe(8);
    expect(start.getMinutes()).toBe(30);

    expect(end.getHours()).toBe(12);
    expect(end.getMinutes()).toBe(30);
  });
});
