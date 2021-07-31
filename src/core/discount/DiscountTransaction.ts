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

import {BaseEntity, Column, Entity, MoreThan, PrimaryGeneratedColumn} from 'typeorm';
import {format} from 'date-fns';

/**
 * 할인 처리 완료된 트랜잭션의 기록입니다.
 * 지난 할인 내역을 찾는 기준이 됩니다.
 *
 * 외래키 없어요!! 없을수도 있거든요 ㅎ
 */
@Entity()
export default class DiscountTransaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  mealType: number;

  @Column()
  studentId: string;

  @Column()
  cafeteriaId: number;

  @Column()
  timestamp: Date;

  /**
   * 오늘 할인 내역을 모두 찾아옵니다.
   *
   * @param studentId 학번
   * @param cafeteriaId 카페테리아 식별자
   */
  static async findTransactionsToday(
    studentId: string,
    cafeteriaId: number
  ): Promise<DiscountTransaction[]> {
    return await DiscountTransaction.find({
      studentId,
      cafeteriaId,
      timestamp: MoreThan(format(new Date(), 'yyyy-MM-dd 00:00:00')),
    });
  }
}
