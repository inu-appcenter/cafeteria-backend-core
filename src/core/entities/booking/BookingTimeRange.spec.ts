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

import MockDate from 'mockdate';
import BookingTimeRange from './BookingTimeRange';

describe('타임슬롯 모두 만들기', () => {
  afterEach(() => {
    MockDate.reset();
  });

  const timeRange = new BookingTimeRange();
  timeRange.timeRange = '08:30-08:40';
  timeRange.intervalMinutes = 5;
  timeRange.capacity = 55;

  it('타임슬롯 모두 가져오기', async () => {
    MockDate.set('2021-09-26 09:26:30'); // 일요일

    const timeSlots = timeRange.buildAllTimeSlots(new Date());

    expect(timeSlots.length).toBe(3);
  });
});
