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

import Booking from './Booking';

/**
 * 예약 찾는 데에 필요한 메소드 중,
 * 콘솔과 앱 서버 양쪽 모두에서 사용될 것 같은 메소드를 여기에 모아 둡니다.
 */
export default class BaseBookingFinder {
  protected allRelations = ['user', 'cafeteria', 'checkIn'];

  /**
   * 식당 식별자와 타임 슬롯 시작 시간으로 예약들을 찾습니다.
   *
   * @param cafeteriaId 식당 식별자.
   * @param timeSlotStart 타임 슬롯 시작.
   */
  async findAllByCafeteriaIdAndTimeSlotStart(
    cafeteriaId: number,
    timeSlotStart: Date
  ): Promise<Booking[]> {
    return await Booking.find({
      where: {cafeteriaId, timeSlotStart},
      relations: this.allRelations,
    });
  }
}
