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
import BookingTimeSlot from './BookingTimeSlot';
import CafeteriaBookingParams from './CafeteriaBookingParams';
import {areIntervalsOverlapping, isFuture, isPast, isWeekend} from 'date-fns';

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
  timeSlotStart: Date;

  /**
   * 예약하는 시간대 다음 시간.
   */
  timeSlotEnd: Date;

  /**
   * 전체 예약 가능 인원 수.
   */
  capacity: number;

  /**
   * 이미 예약한 사람 수.
   */
  reserved: number;

  /**
   * 모든 식당에 대해 사용자에게 보여 줄 예약 옵션을 가져옵니다.
   */
  static async findAll(): Promise<BookingOption[]> {
    const allBookingParams = await CafeteriaBookingParams.find();

    const allOptions = await Promise.all(
      allBookingParams.map((params) => this.buildAllFromBookingParams(params))
    );

    return allOptions.flat();
  }

  /**
   * 어떠한 식당에 대해 사용자에게 보여 줄 예약 옵션을 가져옵니다.
   *
   * @param cafeteriaId 식당 식별자.
   */
  static async findByCafeteriaId(cafeteriaId: number): Promise<BookingOption[]> {
    const params = await CafeteriaBookingParams.findForBookingByCafeteriaId(cafeteriaId);

    if (params == null) {
      return [];
    }

    return await this.buildAllFromBookingParams(params);
  }

  /**
   * 식당 식별자와 타임슬롯으로 예약 옵션을 하나 가져옵니다.
   * 예약 요청을 받아서 해당 옵션을 역으로 도출할 때에 사용합니다.
   *
   * @param cafeteriaId 식당 식별자.
   * @param timeSlotStart 타임슬롯 시작.
   */
  static async findByCafeteriaIdAndTimeSlotStart(
    cafeteriaId: number,
    timeSlotStart: Date
  ): Promise<BookingOption | undefined> {
    const options = await this.findByCafeteriaId(cafeteriaId);

    return options.find((o) => o.timeSlotStart.getTime() === timeSlotStart.getTime());
  }

  /**
   * 예약 파라미터로부터 예약 옵션을 모두 만들어 냅니다.
   *
   * @param bookingParams 예약 파라미터.
   * @private
   */
  private static async buildAllFromBookingParams(
    bookingParams: CafeteriaBookingParams
  ): Promise<BookingOption[]> {
    const timeSlots = await this.getNextTimeSlotsInBusinessHour(bookingParams);

    return await Promise.all(
      timeSlots.map((slot) => BookingOption.buildFromBookingParamsAndTimeSlot(bookingParams, slot))
    );
  }

  /**
   * 예약 파라미터와 하나의 타임슬롯으로부터 예약 옵션을 하나 만들어 냅니다.
   *
   * 생성자 처럼 사용합니다.
   * 읽기전용이라 나만쓸거임 흥
   *
   * @param bookingParams 예약 파라미터.
   * @param timeSlot 타임슬롯.
   * @private
   */
  private static async buildFromBookingParamsAndTimeSlot(
    bookingParams: CafeteriaBookingParams,
    timeSlot: BookingTimeSlot
  ): Promise<BookingOption> {
    return Object.assign(new BookingOption(), {
      cafeteriaId: bookingParams.cafeteriaId,
      timeSlot,
      used: await Booking.howManyBookedForCafeteriaAtTimeSlotStart(
        bookingParams.cafeteriaId,
        timeSlot.start
      ),
      capacity: timeSlot.capacity,
    });
  }

  /**
   * 예약 가능한 미래의 타임슬롯을 모두 가져옵니다.
   *
   * 예약이 가능하다 함은, 주말이 아니며 휴업 시간이 아님을 뜻합니다.
   * 미래라 함은, 해당 예약 시간이 아직 지나지 않았음을 뜻합니다.
   *
   * 오늘 모든 예약 운영이 종료되었으면 다음 날의 타임 슬롯을 가져옵니다.
   * 설령 다음 날이 휴일이거나 하루 종일 휴업이더라도 해당 날짜를 기준으로 빈 배열만 가져옵니다.
   *
   * @param bookingParams 예약 파라미터.
   * @param dayOffs 휴업 일정. 주어지지 않으면 알아서 가져옵니다.
   */
  static async getNextTimeSlotsInBusinessHour(
    bookingParams: CafeteriaBookingParams,
    dayOffs?: CafeteriaDayOff[]
  ): Promise<BookingTimeSlot[]> {
    const now = new Date();
    const baseDate = bookingParams.isOverToday() ? getNextDay(now) : now;

    const offs =
      dayOffs ??
      (await CafeteriaDayOff.findByCafeteriaIdAtSameDay(bookingParams.cafeteriaId, baseDate));

    const isNotWeekend = (slot: BookingTimeSlot) => !isWeekend(slot.start);
    const isNotOffTime = (slot: BookingTimeSlot) =>
      offs.find((off) =>
        areIntervalsOverlapping(
          {start: slot.start, end: slot.end},
          {start: off.startsAt, end: off.endsAt}
        )
      ) == null;
    const isNotOver = (slot: BookingTimeSlot) => isFuture(slot.end);

    return bookingParams
      .getAllTimeSlots(baseDate)
      .filter(isNotWeekend)
      .filter(isNotOffTime)
      .filter(isNotOver);
  }

  /**
   * 해당 예약이 꽉 찼는가?
   */
  isFull() {
    return this.reserved >= this.capacity;
  }

  /**
   * 해당 시간대의 마지막 시간까지 지났는가?
   * 즉, 예약하기엔 늦은 시간대인가?
   */
  isPast() {
    return isPast(this.timeSlotEnd);
  }

  /**
   * 예약 가능한가?
   * 꽉 차지 않았고 끝나지 않아야 합니다.
   */
  isAvailableForBooking() {
    return !this.isFull() && !this.isPast();
  }
}
