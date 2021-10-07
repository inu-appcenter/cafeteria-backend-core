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

/**
 * 시간대의 시작과 끝, 그리고 해당 시간대의 정원을 나타내는
 * 읽기 전용 DTO 입니다.
 */
export default class BookingTimeSlot {
  /**
   * 타임 슬롯의 시작.
   */
  start: Date;

  /**
   * 타임 슬롯의 끝.
   * 다음 타임 슬롯의 시작과 같음.
   */
  end: Date;

  /**
   * 해당 타임 슬롯의 수용 가능 최대 인원(정원).
   */
  capacity: number;

  constructor(properties: Partial<BookingTimeSlot>) {
    Object.assign(this, properties);
  }
}
