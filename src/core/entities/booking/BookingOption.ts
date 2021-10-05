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
import {getNextDay} from '../../../utils/date';
import CafeteriaDayOff from './CafeteriaDayOff';
import {addMinutes, isFuture, isPast, isWeekend} from 'date-fns';
import CafeteriaBookingParams from './CafeteriaBookingParams';

/**
 * 읽기 전용 예약 옵션 엔티티!
 * 예약 가능한 옵션을 (알아서 잘) 찾아와주는 메소드도 가지고 있습니다 :)
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
   * 예약하는 시간대 다음 시간.
   */
  nextTimeSlot: Date;

  /**
   * 이미 예약한 사람 수.
   */
  used: number;

  /**
   * 전체 예약 가능 인원 수.
   */
  capacity: number;

  /**
   * 생성자 처럼 사용합니다.
   * 읽기전용이라 나만쓸거임 흥
   */
  private static async fromBookingParamsAndTimeSlot(
    bookingParams: CafeteriaBookingParams,
    timeSlot: Date
  ): Promise<BookingOption> {
    return Object.assign(new BookingOption(), {
      cafeteriaId: bookingParams.cafeteriaId,
      timeSlot,
      nextTimeSlot: addMinutes(timeSlot, bookingParams.intervalMinutes),
      used: await Booking.howManyBookedForCafeteriaAtTimeSlot(bookingParams.cafeteriaId, timeSlot),
      capacity: bookingParams.capacity,
    });
  }

  /**
   * 어떠한(또는 모든) 식당에 대해 사용자에게 보여 줄 예약 옵션을 가져옵니다.
   *
   * @param cafeteriaId 식당 식별자. 없으면 모든 식당에 대해 가져옵니다.
   */
  static async findForCafeteria(cafeteriaId?: number): Promise<BookingOption[]> {
    const allBookingParams = await CafeteriaBookingParams.find(
      cafeteriaId == null ? undefined : {cafeteriaId}
    );

    const allOptions = await Promise.all(
      allBookingParams.map((params) => this.findForSingleCafeteria(params))
    );

    return allOptions.flat();
  }

  private static async findForSingleCafeteria(
    bookingParams: CafeteriaBookingParams
  ): Promise<BookingOption[]> {
    const timeSlots = await this.getNextTimeSlotsInBusinessHour(bookingParams);

    return await Promise.all(
      timeSlots.map((slot) => BookingOption.fromBookingParamsAndTimeSlot(bookingParams, slot))
    );
  }

  /**
   * 식당 식별자와 타임슬롯으로 예약 옵션을 하나 가져옵니다.
   *
   * @param cafeteriaId 식당 식별자.
   * @param timeSlot 예약 시간대(타임슬롯).
   */
  static async findByCafeteriaAndTimeSlot(
    cafeteriaId: number,
    timeSlot: Date
  ): Promise<BookingOption | undefined> {
    const allOptions = await this.findForCafeteria(cafeteriaId);

    return allOptions.find((o) => o.timeSlot.getTime() === timeSlot.getTime());
  }

  /**
   * 예약 가능한 미래의 타임슬롯을 모두 가져옵니다.
   *
   * 예약이 가능하다 함은, 주말이 아니며 휴업 시간이 아님을 뜻합니다.
   * 미래라 함은, 해당 예약 시간이 아직 지나지 않았음을 뜻합니다.
   *
   * 오늘 모든 예약 운영이 종료되었으면 다음 날의 타임 슬롯을 가져옵니다.
   * 설령 다음 날이 휴일이거나 하루 종일 휴업이더라도 해당 날짜를 기준으로 빈 배열만 가져옵니다.
   */
  static async getNextTimeSlotsInBusinessHour(
    bookingParams: CafeteriaBookingParams
  ): Promise<Date[]> {
    const now = new Date();
    const baseDate = bookingParams.isOverToday() ? getNextDay(now) : now;

    const dayOffs = await CafeteriaDayOff.findForCafeteriaAtSameDay(
      bookingParams.cafeteriaId,
      baseDate
    );

    const isNotWeekend = (slot: Date) => !isWeekend(slot);
    const isNotOffTime = (slot: Date) => dayOffs.find((off) => off.isInOffTime(slot)) == null;
    const isNotOver = (slot: Date) => isFuture(addMinutes(slot, bookingParams.intervalMinutes));

    return bookingParams
      .allTimeSlots(baseDate)
      .filter(isNotWeekend)
      .filter(isNotOffTime)
      .filter(isNotOver);
  }

  /**
   * 해당 예약이 꽉 찼는가?
   */
  isFull() {
    return this.used >= this.capacity;
  }

  /**
   * 해당 시간대의 마지막 시간까지 지났는가?
   * 즉, 예약하기엔 늦은 시간대인가?
   */
  isPast() {
    return isPast(this.nextTimeSlot);
  }

  isAvailable() {
    return !this.isFull() && !this.isPast();
  }
}
