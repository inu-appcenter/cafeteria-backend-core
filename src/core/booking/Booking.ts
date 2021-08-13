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
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import User from '../user/User';
import Cafeteria from '../cafeteria/Cafeteria';
import CheckIn from './CheckIn';

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

  @Column({comment: '예약한 일시.'})
  datetime: Date;

  @Column({comment: '예약 생성 일시'})
  bookedAt: Date;

  @OneToOne(() => CheckIn, (c) => c.booking)
  checkIn?: CheckIn;
}
