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

import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

/**
 * Verify, Commit, Cancel 기록 열람용 엔티티입니다.
 */
@Entity()
export default class DiscountProcessHistory extends BaseEntity {
  @PrimaryGeneratedColumn({comment: '식별자'})
  id: number;

  @Column({comment: '기록의 유형(Verify, Commit, Cancel)'})
  type: 'Verify' | 'Commit' | 'Cancel' | string;

  @Column({comment: '학번'})
  studentId: string;

  @Column({comment: '연관된 Cafeteria의 식별자'})
  cafeteriaId: number;

  @Column({comment: '식사 시간대(아침: 4, 점심: 2, 저녁: 1)'})
  mealType: number;

  @Column({comment: '검증 실패한 규칙 번호(0이면 성공)'})
  failedAt: number;

  @Column({comment: '비고'})
  message: string;

  @Column({comment: '기록 생성 일자'})
  timestamp: Date;
}
