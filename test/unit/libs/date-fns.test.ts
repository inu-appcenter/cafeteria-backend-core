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

import {format} from 'date-fns';

describe('date-fns의 format함수', () => {
  it('는 계획대로 작동할까!', async () => {
    const formatted = format(new Date('2021-07-31 08:30:00'), 'yyyy-MM-dd 00:00:00');
    const expected = '2021-07-31 00:00:00';

    expect(formatted).toBe(expected);
  });
});
