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
import {addDays} from 'date-fns';
import Booking from './Booking';

/**
 * 읽기 전용 예약 옵션 엔티티!
 *
 * 옵션에 대해 예약을 진행할 수 없는 경우가 두 가지 있습니다:
 * 하나는 해당 옵션의 timeSlot이 이미 지난 경우,
 * 다른 하나는 해당 옵션의 예약이 꽉 찬 경우입니다.
 */
export default class BookingOption {
  cafeteriaId: number;
  timeSlot: Date;

  used: number;
  capacity: number;

  /**
   * 읽기전용이라 나만쓸거임 흥
   */
  private static create(properties: Partial<BookingOption>): BookingOption {
    return Object.assign(new BookingOption(), properties);
  }

  /**
   * 어떠한 식당에 대해 예약 옵션을 가져옵니다.
   *
   * @param cafeteriaId 식당 식별자.
   * @param inTimeOnly 시간을 아직 지나치지 않아 선택 가능한 옵션만 가져올 것인지 여부.
   */
  static async findForCafeteria(
    cafeteriaId: number,
    inTimeOnly: boolean = true
  ): Promise<BookingOption[]> {
    const bookingParams = await CafeteriaBookingParams.findOne({cafeteriaId});
    if (bookingParams == null) {
      return [];
    }

    const now = new Date();
    const baseDate = bookingParams.isOverToday() ? addDays(now, 1) : now;
    const allTimeSlots = bookingParams.allTimeSlots(baseDate);

    const timeSlots = inTimeOnly
      ? allTimeSlots.filter((slot) => slot.getTime() < now.getTime())
      : allTimeSlots;

    const options: BookingOption[] = [];

    for (const timeSlot of timeSlots) {
      const option = BookingOption.create({
        cafeteriaId,
        timeSlot,
        used: await Booking.howManyBookedForCafeteriaAtTimeSlot(cafeteriaId, timeSlot),
        capacity: bookingParams.capacity,
      });

      options.push(option);
    }

    return options;
  }
}
