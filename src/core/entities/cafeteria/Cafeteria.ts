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

import {BaseEntity, Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import Corner from './Corner';
import CafeteriaValidationParams from '../discount/CafeteriaValidationParams';
import CafeteriaBookingParams from '../booking/CafeteriaBookingParams';

@Entity()
export default class Cafeteria extends BaseEntity {
  @PrimaryGeneratedColumn({comment: '식별자'})
  id: number;

  @Column({comment: '실제 이름'})
  name: string;

  @Column({comment: '앱에 표시될 이름'})
  displayName: string;

  @Column({nullable: true, comment: '식당 공지'})
  comment?: string;

  @Column({comment: '메뉴 정보 지원 여부'})
  supportMenu: boolean;

  @Column({comment: '예약 지원 여부'})
  supportBooking: boolean;

  @Column({comment: '할인 지원 여부'})
  supportDiscount: boolean;

  @Column({comment: '알림 지원 여부'})
  supportNotification: boolean;

  @OneToMany(() => Corner, (c) => c.cafeteria)
  corners: Corner[];

  @OneToOne(() => CafeteriaValidationParams, (vp) => vp.cafeteria)
  discountValidationParams?: CafeteriaValidationParams;

  @OneToOne(() => CafeteriaBookingParams, (bp) => bp.cafeteria)
  bookingParams?: CafeteriaBookingParams;
}
