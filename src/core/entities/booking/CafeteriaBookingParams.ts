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
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Cafeteria from '../cafeteria/Cafeteria';
import BookingTimeRange from './BookingTimeRange';
import {isPast, isWithinInterval} from 'date-fns';
import BookingTimeSlot from './BookingTimeSlot';

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

  @OneToMany(() => BookingTimeRange, (p) => p.cafeteriaBookingParams)
  timeRanges: BookingTimeRange[];

  @Column({comment: '사용자가 식당에 머무는 시간(분)'})
  userStaysForMinutes: number;

  /**
   * 식당 식별자를 기준으로 하나 가져옵니다.
   *
   * @param cafeteriaId 식당 식별자.
   */
  static async findForBookingByCafeteriaId(
    cafeteriaId: number
  ): Promise<CafeteriaBookingParams | undefined> {
    return await this.findOne({
      where: {cafeteriaId},
      relations: ['timeRanges'],
    });
  }

  /**
   * 모두 가져옵니다.
   */
  static async findAllForBooking(): Promise<CafeteriaBookingParams[]> {
    return await this.find({
      relations: ['timeRanges'],
    });
  }

  /**
   * 이 예약 파라미터가 가지고 있는 모든 시간대 파라미터에 대해 타임슬롯을 뽑아 가져옵니다.
   * 오름차순으로 정렬합니다.
   *
   * @param baseDate 기준 날짜가 담긴 Date 인스턴스
   */
  getAllTimeSlots(baseDate: Date = new Date()): BookingTimeSlot[] {
    return this.timeRanges
      .map((range) => range.getTimeSlots(baseDate))
      .flat()
      .sort((a, b) => a.start.getTime() - b.start.getTime());
  }

  /**
   * 현재 timeSlot을 가져옵니다.
   * 현재 timeSlot이란, 오른차순 정렬된 모든 timeSlot 가운데 현재 시간보다 크지만 다음 timeSlot 보다 작은 것입니다.
   *
   * @param now current의 기준이 될 현재 시각.
   */
  getCurrentTimeSlot(now: Date = new Date()): BookingTimeSlot | undefined {
    const allTimeSlots = this.getAllTimeSlots(now);

    return allTimeSlots.find((ts) => isWithinInterval(now, {start: ts.start, end: ts.end}));
  }

  /**
   * 시작 시간(Date)으로 BookingTimeSlot을 찾습니다.
   *
   * @param start 찾을 날짜시각.
   */
  findTimeSlotByStart(start: Date): BookingTimeSlot | undefined {
    const allTimeSlots = this.getAllTimeSlots(start);

    return allTimeSlots.find((ts) => ts.start.getTime() === start.getTime());
  }

  /**
   * 오늘 마지막 예약 시간이 지났는지 여부를 반환합니다.
   *
   * 만약 오늘 예약이 오전 8시 30분부터 오전 10시 30분까지 진행되었고,
   * 현재 오전 11시라면 true입니다.
   */
  isOverToday(): boolean {
    const now = new Date();
    const allTimeSlots = this.getAllTimeSlots(now);

    const lastTimeSlot = allTimeSlots.pop();
    if (lastTimeSlot == null) {
      return true;
    }

    return isPast(lastTimeSlot.end);
  }
}
