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
  PrimaryGeneratedColumn,
} from 'typeorm';
import Cafeteria from '../cafeteria/Cafeteria';
import {addDays, addMinutes} from 'date-fns';

/**
 * 방문 기록!
 *
 * 예약 후 방문(CheckIn)이든, 아니면 예약 없이 방문이든,
 * 모두 이 방문 기록을 생성합니다.
 */
@Entity()
export default class VisitRecord extends BaseEntity {
  @PrimaryGeneratedColumn({comment: '식별자'})
  id: number;

  @Column({nullable: true})
  bookingId?: number;

  @Column({nullable: true})
  studentId?: string;

  @Column({nullable: true})
  phoneNumber?: string;

  @ManyToOne(() => Cafeteria, {cascade: ['update']})
  @JoinColumn()
  cafeteria: Cafeteria;

  @Column({comment: '방문한 Cafeteria의 식별자'})
  cafeteriaId: number;

  @Column()
  visitedAt: Date;

  /**
   * 식당의 최근 방문 기록을 가져옵니다.
   *
   * @param cafeteriaId 식당 식별자.
   * @param recentMinutes '최근'이 몇 분인가.
   * @param now 기준이 되는 현재 시각.
   */
  static async findRecentRecords(
    cafeteriaId: number,
    recentMinutes: number,
    now: Date = new Date()
  ): Promise<VisitRecord[]> {
    const mostOldVisitTime = addMinutes(now, -recentMinutes);

    return await VisitRecord.find({cafeteriaId, visitedAt: MoreThan(mostOldVisitTime)});
  }

  /**
   * 기간 범위 내의 방문 기록 중, 동의를 유지하고 있는 상태의 사용자의 기록만 가져옵니다.
   *
   * @param from 기간 시작.
   * @param until 기간 끝.
   * @param agreementValidForDays 동의 유효기간. 기본 28일.
   */
  static async findUserAgreedRecordsInRange(
    from: Date,
    until: Date,
    agreementValidForDays: number = 28
  ): Promise<VisitRecord[]> {
    const beforeValidationPeriod = addDays(new Date(), -agreementValidForDays);

    return await VisitRecord.createQueryBuilder('record')
      .leftJoinAndSelect('record.cafeteria', 'cafeteria')
      .leftJoin(
        'user',
        'user',
        'user.studentId = record.studentId OR user.phoneNumber = record.phoneNumber'
      )
      .where('user.privacyPolicyAgreedAt IS NOT NULL')
      .andWhere('user.privacyPolicyAgreedAt > :beforeValidationPeriod', {beforeValidationPeriod})
      .andWhere('record.visitedAt > :from', {from})
      .andWhere('record.visitedAt < :until', {until})
      .getMany();
  }
}
