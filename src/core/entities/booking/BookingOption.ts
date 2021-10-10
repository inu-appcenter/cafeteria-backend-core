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

import {isPast} from 'date-fns';

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

  /**
   * 생성자 대용
   *
   * @param partial
   */
  static async create(partial: Partial<BookingOption>): Promise<BookingOption> {
    return Object.assign(new BookingOption(), partial);
  }
}
