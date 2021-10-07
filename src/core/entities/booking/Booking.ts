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
  ManyToOne,
  MoreThan,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import User from '../user/User';
import CheckIn from './CheckIn';
import Cafeteria from '../cafeteria/Cafeteria';
import BookingStatus from './BookingStatus';
import {isFuture, isPast, subHours} from 'date-fns';

/**
 * 학식당 입장 예약!
 */
@Entity()
export default class Booking extends BaseEntity {
  @PrimaryGeneratedColumn({comment: '식별자'})
  id: number;

  /**
   * 외부에서 추측할 수 없는 예약 식별자가 필요합니다.
   * 예약증 발급할 때에 쓰거든요!
   */
  @Column({unique: true, comment: '또다른 식별자'})
  uuid: string;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @Column({comment: '예약한 사용자의 식별자'})
  userId: number;

  @ManyToOne(() => Cafeteria, {cascade: ['update']})
  @JoinColumn()
  cafeteria: Cafeteria;

  @Column({comment: '예약한 식당의 식별자'})
  cafeteriaId: number;

  @Column({comment: '타임슬롯 시작 일시'})
  timeSlotStart: Date;

  @Column({comment: '타임슬롯 끝 일시'})
  timeSlotEnd: Date;

  @Column({comment: '예약 생성 일시'})
  bookedAt: Date;

  @OneToOne(() => CheckIn, (c) => c.booking)
  checkIn?: CheckIn;

  /**
   * 현재 예약의 상태를 가져옵니다.
   */
  get status(): string {
    if (this.isUnused() && this.isNotLateToCheckIn()) {
      return BookingStatus.UNUSED_AVAILABLE;
    } else if (this.isUnused() && this.isLateToCheckIn()) {
      return BookingStatus.UNUSED_LATE;
    } else if (this.isUsed()) {
      return BookingStatus.USED;
    }

    /** 닿을 수 없는 곳 */
    throw new Error(
      '예약의 상태는 UNUSED_AVAILABLE, UNUSED_LATE, USED 중 하나로 도출되어야 합니다.'
    );
  }

  /**
   * 사용되었는가?
   * 체크인이 존재하면 사용된 것입니다.
   *
   * 주의: 엔티티를 가져올 때, relations 옵션으로 checkIn까지 가져와야 정확한 판단이 됩니다.
   */
  isUsed() {
    return this.checkIn != null;
  }

  /**
   * 아직 사용되지 않았는가?
   * 존재하지 않으면 사용되지 않은 것입니다.
   *
   * 주의: 엔티티를 가져올 때, relations 옵션으로 checkIn까지 가져와야 정확한 판단이 됩니다.
   */
  isUnused() {
    return !this.isUsed();
  }

  /**
   * 현재 시각 기준, 체크인하기에 너무 이른가?
   */
  isEarlyToCheckIn() {
    return isFuture(this.timeSlotStart);
  }

  /**
   * 현재 시각 기준, 체크인하기에 너무 이르지 않은가?
   */
  isNotEarlyToCheckIn() {
    return !this.isEarlyToCheckIn();
  }

  /**
   * 현재 시각 기준, 체크인 가능 시각을 초과했는가?
   * 체크인 가능 시각은 예약한 타임슬롯부터 그 다음 타임슬롯 직전까지입니다.
   */
  isLateToCheckIn() {
    return isPast(this.timeSlotEnd);
  }

  /**
   * 현재 시각 기준, 아직 체크인 가능 시각을 초과하지 않았는가?
   * 체크인 가능 시각은 예약한 타임슬롯부터 그 다음 타임슬롯 직전까지입니다.
   */
  isNotLateToCheckIn() {
    return !this.isLateToCheckIn();
  }

  /**
   * 지금이 체크인 가능한 시각인가?
   * 너무 일러도, 너무 늦어도 안됨.
   */
  isAvailableForCheckIn() {
    return this.isNotEarlyToCheckIn() && this.isNotLateToCheckIn();
  }

  /**
   * 어떤 식당, 어떤 타임슬롯에 대해 예약이 몇 개 존재하는지 찾습니다.
   *
   * @param cafeteriaId 식당 식별자.
   * @param timeSlotStart 타임슬롯 시작 시각.
   */
  static async howManyBookedForCafeteriaAtTimeSlotStart(
    cafeteriaId: number,
    timeSlotStart: Date
  ): Promise<number> {
    const bookings = await Booking.find({cafeteriaId, timeSlotStart});

    return bookings.length;
  }

  /**
   * 최근 inHours 시간 내의 예약을 최신 순으로 모두 가져옵니다.
   * 예약의 상태는 따지지 않습니다. 그냥 일단 다 가져옵니다.
   * relations에 user와 checkIn이 들어 있는 것이 특징입니다. checkIn은 상태 판단에 써야 하므로 꼭 가져옵니다.
   *
   * @param userId
   * @param inHours
   */
  static async findRecentBookings(userId: number, inHours: number = 72): Promise<Booking[]> {
    return await Booking.find({
      where: {
        userId: userId,
        bookedAt: MoreThan(subHours(new Date(), inHours)), // "inHours 시간 이전" 이후(=inHours 시간 내)
      },
      relations: ['user', 'checkIn'],
      order: {
        bookedAt: 'DESC', // 최신 순으로
      },
    });
  }

  /**
   * 체크인을 위해 예약을 찾습니다.
   * relations에 user와 checkIn이 들어 있는 것이 특징입니다.
   *
   * @param ticket
   */
  static async findForCheckIn(ticket: string): Promise<Booking | undefined> {
    return await Booking.findOne({where: {uuid: ticket}, relations: ['user', 'checkIn']});
  }

  /**
   * 식당 식별자와 타임 슬롯 시작 시간으로 예약들을 찾습니다.
   *
   * @param cafeteriaId 식당 식별자.
   * @param timeSlotStart 타임 슬롯 시작.
   */
  static async findAllByCafeteriaIdAndTimeSlotStart(
    cafeteriaId: number,
    timeSlotStart: Date
  ): Promise<Booking[]> {
    return await this.find({where: {cafeteriaId, timeSlotStart}, relations: ['checkIn']});
  }
}
