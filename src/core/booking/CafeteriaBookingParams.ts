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
import {TimeRangeExpression} from '../common/TimeRangeExpression';

@Entity()
export default class CafeteriaBookingParams extends BaseEntity {
  @PrimaryGeneratedColumn({comment: '식별자'})
  id: number;

  @OneToOne(() => Cafeteria, (c) => c.discountValidationParams, {cascade: ['update']})
  @JoinColumn()
  cafeteria: Cafeteria;

  @Column({comment: '속한 Cafeteria의 식별자'})
  cafeteriaId: number;

  @Column({comment: '예약 받기 시작하는 시간'})
  acceptFrom: TimeRangeExpression;

  @Column({comment: '예약을 그만 받는 시간'})
  acceptUntil: TimeRangeExpression;

  @Column({comment: '예약 시간대의 간격'})
  intervalMinutes: number;

  @Column({comment: '한 시간대당 예약 기간(분)'})
  durationMinutes: number;

  @Column({comment: '입장 시간 허용 오차'})
  toleranceMinutes: number;
}
