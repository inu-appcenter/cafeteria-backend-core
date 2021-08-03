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

import {BaseEntity, Between, Column, Entity, FindConditions, PrimaryGeneratedColumn} from 'typeorm';
import {endOfDay, startOfDay} from 'date-fns';

/**
 * 할인 처리 완료된 트랜잭션의 기록입니다.
 * 지난 할인 내역을 찾는 기준이 됩니다.
 *
 * 중요한 거라서 굳이 분리했습니다.
 *
 * 외래키 없어요!! 사용자나 카페테리아가 없을수도 있거든요 ㅎ
 */
@Entity()
export default class DiscountTransaction extends BaseEntity {
  @PrimaryGeneratedColumn({comment: '식별자'})
  id: number;

  @Column({comment: '할인받은 사용자의 학번'})
  studentId: string;

  @Column({comment: '할인받은 Cafeteria의 식별자'})
  cafeteriaId: number;

  @Column({comment: '할인받은 시간대'})
  mealType: number;

  @Column({comment: '할인 일시'})
  timestamp: Date;

  /**
   * 오늘 할인 내역을 모두 찾아옵니다.
   * 찾는 조건으로 학번과 카페테리아 식별자를 지원합니다.
   * 조건을 안 주면 해당 조건은 없는 조건이 됩니다(=다 찾음).
   *
   * @param studentId 학번
   * @param cafeteriaId 카페테리아 식별자
   * @param date 찾을 날짜
   */
  static async findTransactions(
    studentId?: string,
    cafeteriaId?: number,
    date: Date = new Date()
  ): Promise<DiscountTransaction[]> {
    const options: FindConditions<DiscountTransaction> = {
      timestamp: Between(startOfDay(date).toISOString(), endOfDay(date).toISOString()),
    };

    if (studentId) {
      options.studentId = studentId;
    }

    if (cafeteriaId) {
      options.cafeteriaId = cafeteriaId;
    }

    return await DiscountTransaction.find(options);
  }
}
