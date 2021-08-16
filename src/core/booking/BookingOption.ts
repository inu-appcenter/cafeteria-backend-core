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

import Booking from './Booking';
import {isFuture} from 'date-fns';
import CafeteriaDayOff from './CafeteriaDayOff';
import {getNextWorkDay} from '../../utils/date';
import CafeteriaBookingParams from './CafeteriaBookingParams';

/**
 * 읽기 전용 예약 옵션 엔티티!
 *
 * 옵션에 대해 예약을 진행할 수 없는 경우가 두 가지 있습니다:
 * 하나는 해당 옵션의 timeSlot이 이미 지난 경우,
 * 다른 하나는 해당 옵션의 예약이 꽉 찬 경우입니다.
 */
export default class BookingOption {
  /**
   * 식당 식별자.
   */
  cafeteriaId: number;

  /**
   * 예약하는 시간.
   */
  timeSlot: Date;

  /**
   * 이미 예약한 사람 수.
   */
  used: number;

  /**
   * 전체 예약 가능 인원 수.
   */
  capacity: number;

  /**
   * 읽기전용이라 나만쓸거임 흥
   */
  private static async fromBookingParamsAndTimeSlot(
    bookingParams: CafeteriaBookingParams,
    timeSlot: Date
  ): Promise<BookingOption> {
    return Object.assign(new BookingOption(), {
      cafeteriaId: bookingParams.cafeteriaId,
      timeSlot,
      used: await Booking.howManyBookedForCafeteriaAtTimeSlot(bookingParams.cafeteriaId, timeSlot),
      capacity: bookingParams.capacity,
    });
  }

  /**
   * 어떠한(또는 모든) 식당에 대해 사용자에게 보여 줄 예약 옵션을 가져옵니다.
   *
   * @param cafeteriaId 식당 식별자. 없으면 모든 식당에 대해 가져옵니다.
   * @param futureOnly 시간을 아직 지나치지 않아 선택 가능한 옵션만 가져올 것인지 여부.
   */
  static async findForCafeteria(
    cafeteriaId?: number,
    futureOnly: boolean = true
  ): Promise<BookingOption[]> {
    const allBookingParams = await CafeteriaBookingParams.find(
      cafeteriaId == null ? undefined : {cafeteriaId}
    );

    const allOptions = await Promise.all(
      allBookingParams.map((params) => this.findForSingleCafeteria(params, futureOnly))
    );

    return allOptions.flat();
  }

  private static async findForSingleCafeteria(
    bookingParams: CafeteriaBookingParams,
    futureOnly: boolean
  ): Promise<BookingOption[]> {
    const allTimeSlotsInBusinessHour = await this.getTimeSlotsInBusinessHour(bookingParams);

    const timeSlots = futureOnly
      ? allTimeSlotsInBusinessHour.filter(isFuture)
      : allTimeSlotsInBusinessHour;

    return await Promise.all(
      timeSlots.map((slot) => BookingOption.fromBookingParamsAndTimeSlot(bookingParams, slot))
    );
  }

  private static async getTimeSlotsInBusinessHour(
    bookingParams: CafeteriaBookingParams
  ): Promise<Date[]> {
    const now = new Date();
    const baseDate = bookingParams.isOverToday() ? getNextWorkDay(now) : now;
    const dayOffsAtThatDay = await CafeteriaDayOff.findForCafeteriaAtSameDay(
      bookingParams.cafeteriaId,
      baseDate
    );

    const isInBusinessHour = (slot: Date) =>
      dayOffsAtThatDay.find((dayOff) => dayOff.isInOffTime(slot)) == null;

    return bookingParams.allTimeSlots(baseDate).filter(isInBusinessHour);
  }

  isFull() {
    return this.used >= this.capacity;
  }

  isAvailable() {
    return !this.isFull();
  }
}
