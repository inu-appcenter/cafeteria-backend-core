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
import CafeteriaComment from './CafeteriaComment';
import CafeteriaValidationParams from '../discount/CafeteriaValidationParams';

@Entity()
export default class Cafeteria extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  displayName: string;

  @Column()
  supportMenu: boolean;

  @Column()
  supportDiscount: boolean;

  @Column()
  supportNotification: boolean;

  @OneToMany(() => Corner, (c) => c.cafeteria)
  corners: Corner[];

  @OneToOne(() => CafeteriaComment, (c) => c.cafeteria)
  comment?: CafeteriaComment;

  @OneToOne(() => CafeteriaValidationParams, (p) => p.cafeteria)
  discountValidationParams?: CafeteriaValidationParams;
}
