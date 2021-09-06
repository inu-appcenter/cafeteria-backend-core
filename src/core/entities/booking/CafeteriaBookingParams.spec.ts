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

import CafeteriaBookingParams from './CafeteriaBookingParams';

describe('타임슬롯 가져오기', () => {
  it('처음과 끝은 가능하면 포함', () => {
    const params = new CafeteriaBookingParams();
    params.acceptTimeRange = '08:30-10:30';
    params.intervalMinutes = 5;

    const timeSlots = params.allTimeSlots(new Date());

    console.log(timeSlots.map((d) => d.toLocaleTimeString()));

    expect(timeSlots.length).toBe(25);
  });

  it('처음은 무조건 포함이지만 끝은 아닐 수 있음.', () => {
    const params = new CafeteriaBookingParams();
    params.acceptTimeRange = '08:30-10:30';
    params.intervalMinutes = 7;

    const timeSlots = params.allTimeSlots(new Date());

    console.log(timeSlots.map((d) => d.toLocaleTimeString()));

    expect(timeSlots.length).toBe(18);
  });
});
