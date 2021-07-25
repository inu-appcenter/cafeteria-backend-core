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

import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique} from 'typeorm';
import Question from '../qna/Question';

@Entity()
@Unique(['studentId'])
@Unique(['phoneNumber'])
@Unique(['barcode'])
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  studentId?: string;

  @Column({nullable: true})
  phoneNumber?: string;

  @Column()
  rememberMeToken: string;

  @Column()
  barcode: string;

  @Column()
  lastLoginAt: Date;

  @Column({nullable: true})
  barcodeActivatedAt?: Date;

  @Column({nullable: true})
  barcodeTaggedAt?: Date;

  @OneToMany(() => Question, (q) => q.user)
  questions: Question[];

  isValid() {
    return this.isStudent() || this.isOutsider();
  }

  isStudent() {
    return this.studentId != null && this.phoneNumber == null;
  }

  isOutsider() {
    return this.studentId == null && this.phoneNumber != null;
  }
}
