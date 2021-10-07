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

import {
  TimeRangeExpression,
  isValidTimeRangeExpression,
  timeRangeExpressionToDates,
} from '../common/TimeRangeExpression';
import assert from 'assert';
import {logger} from '../../logger';
import BookingTimeSlot from './BookingTimeSlot';
import CafeteriaBookingParams from './CafeteriaBookingParams';
import {addMinutes, isBefore, isEqual} from 'date-fns';
import {BaseEntity, Column, Entity, JoinColumn, ManyToOne} from 'typeorm';

/**
 * 식당 예약 파라미터 중 시간대와 간격, 정원 등 시간대별로 달라지는 설정을 정의합니다.
 */
@Entity()
export default class BookingTimeRange extends BaseEntity {
  @Column({comment: '예약 운영 시간대'})
  timeRange: TimeRangeExpression;

  @Column({comment: '타임슬롯 간의 간격(분)'})
  intervalMinutes: number;

  @Column({comment: '타임슬롯당 수용 가능 인원'})
  capacity: number;

  @ManyToOne(() => CafeteriaBookingParams, (p) => p.timeRanges, {cascade: ['update']})
  @JoinColumn()
  cafeteriaBookingParams: CafeteriaBookingParams;

  @Column({comment: '속한 예약 파라미터의 식별자'})
  cafeteriaBookingParamsId: number;

  /**
   * 시간대(timeRange) 설정으로부터 모든 시간 슬롯(timeSlot)을 가져옵니다.
   * 해당 시간이 지났는지 여부와 관계없이 모두 가져옵니다.
   *
   * 특정 날짜에 귀속되지 않습니다. 날짜는 인자로 주어진 baseDate에 근거합니다.
   *
   * intervalMinutes나 timeRange가 이상하면 빈 배열을 반환합니다.
   *
   * @param baseDate 기준 날짜가 담긴 Date 인스턴스
   */
  buildAllTimeSlots(baseDate: Date): BookingTimeSlot[] {
    if (this.intervalMinutes <= 0) {
      logger.error(`시간 간격은 0보다 커야 합니다!`);
      return [];
    }

    if (!isValidTimeRangeExpression(this.timeRange)) {
      logger.error(`[${this.timeRange}]는 올바른 timeRange 형식이 아닙니다!`);
      return [];
    }

    const [start, end] = timeRangeExpressionToDates(this.timeRange, baseDate);

    const timeSlots: BookingTimeSlot[] = [];
    let current = start;

    while (isBefore(current, end) || isEqual(current, end)) {
      assert(current.getTime() % (60 * 1000) === 0, '시간이 분 단위로 떨어져야 합니다.');

      const duplication = timeSlots.find((slot) => slot.start.getTime() === current.getTime());

      assert(duplication == null, '타임 슬롯의 시간에 중복이 없어야 합니다.');

      const startOfTimeSlot = new Date(current.getTime());
      const endOfTimeSlot = addMinutes(startOfTimeSlot, this.intervalMinutes);

      timeSlots.push(
        new BookingTimeSlot({
          start: startOfTimeSlot,
          end: endOfTimeSlot,
          capacity: this.capacity,
        })
      );

      current = addMinutes(current, this.intervalMinutes);
    }

    return timeSlots;
  }
}
