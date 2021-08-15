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

import {BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import Cafeteria from '../cafeteria/Cafeteria';
import {
  isValidTimeRangeExpression,
  TimeRangeExpression,
  timeRangeExpressionToDates,
} from '../common/TimeRangeExpression';
import {addMinutes, isAfter, isBefore} from 'date-fns';
import assert from 'assert';

/**
 * 예약에 관련된 설정!
 */
@Entity()
export default class CafeteriaBookingParams extends BaseEntity {
  @PrimaryGeneratedColumn({comment: '식별자'})
  id: number;

  @OneToOne(() => Cafeteria, (c) => c.discountValidationParams, {cascade: ['update']})
  @JoinColumn()
  cafeteria: Cafeteria;

  @Column({comment: '속한 Cafeteria의 식별자'})
  cafeteriaId: number;

  @Column({comment: '수용 가능 인원'})
  capacity: number;

  @Column({comment: '예약을 받는 시간대'})
  acceptTimeRange: TimeRangeExpression;

  @Column({comment: '예약 시간대의 간격'})
  intervalMinutes: number;

  @Column({comment: '한 시간대당 예약 기간(분)'})
  durationMinutes: number;

  @Column({comment: '입장 시간 허용 오차'})
  toleranceMinutes: number;

  /**
   * 중복 없고 분단위로 떨어지는 Date 인스턴스를 만들어 가져옵니다.
   * 해당 시간이 지났는지 여부와 관계없이 모두 가져옵니다.
   *
   * 특정 날짜에 귀속되지 않습니다. 날짜는 인자로 주어진 baseDate에 근거합니다.
   *
   * intervalMinutes나 acceptRange가 이상하면 뻗습니다.
   *
   * @param baseDate 기준 날짜가 담긴 Date 인스턴스
   */
  allTimeSlots(baseDate: Date): Date[] {
    assert(this.intervalMinutes > 0, '시간 간격은 0보다 커야 합니다.');

    if (!isValidTimeRangeExpression(this.acceptTimeRange)) {
      return [];
    }

    const [start, end] = timeRangeExpressionToDates(this.acceptTimeRange, baseDate);
    const timeSlots: Date[] = [];
    let current = start;

    while (isBefore(current, end)) {
      assert(current.getTime() % (60 * 1000) === 0, '시간이 분 단위로 떨어져야 합니다.');

      const duplication = timeSlots.map((t) => t.getTime()).find((t) => t === current.getTime());

      assert(duplication == null, '타임 슬롯에 중복이 없어야 합니다.');

      timeSlots.push(new Date(current.getTime()));

      current = addMinutes(current, this.intervalMinutes);
    }

    return timeSlots;
  }

  /**
   * 오늘 마지막 예약 시간이 지났는지 여부를 반환합니다.
   *
   * 만약 오늘 예약이 오전 8시 30분부터 오전 10시 30분까지 진행되었고,
   * 현재 오전 11시라면 true입니다.
   */
  isOverToday(): boolean {
    const acceptUntil = timeRangeExpressionToDates(this.acceptTimeRange, new Date())[1];
    const now = new Date();

    return isAfter(now, acceptUntil);
  }
}
