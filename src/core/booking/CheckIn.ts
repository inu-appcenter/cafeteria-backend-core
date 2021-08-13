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

import Booking from './Booking';
import {BaseEntity, Column, JoinColumn, OneToOne, PrimaryGeneratedColumn} from 'typeorm';

/**
 * 예약 후 체크인!
 * 체크인은 예약에 딸려있습니다.
 */
export default class CheckIn extends BaseEntity {
  @PrimaryGeneratedColumn({comment: '식별자'})
  id: number;

  @OneToOne(() => Booking)
  @JoinColumn()
  booking: Booking;

  @Column({comment: '이 체크인에 딸린 예약의 식별자'})
  bookingId: number;

  @Column({comment: '체크인 시각'})
  checkedInAt: Date;
}
