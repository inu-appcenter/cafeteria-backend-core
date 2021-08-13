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
  @PrimaryGeneratedColumn({comment: '식별자'})
  id: number;

  @Column({nullable: true, comment: '학번'})
  studentId?: string;

  @Column({nullable: true, comment: '휴대전화 번호'})
  phoneNumber?: string;

  @Column({comment: '자동로그인 토큰'})
  rememberMeToken: string;

  @Column({comment: '마지막 로그인 일시'})
  lastLoginAt: Date;

  @Column({comment: '바코드'})
  barcode: string;

  @Column({nullable: true, comment: '마지막 바코드 활성화 일시'})
  barcodeActivatedAt?: Date;

  @Column({nullable: true, comment: '마지막 바코드 태그 일시'})
  barcodeTaggedAt?: Date;

  @OneToMany(() => Question, (q) => q.user)
  questions: Question[];

  isValid() {
    return this.isStudent() || this.isGuest();
  }

  isStudent() {
    return this.studentId != null && this.phoneNumber == null;
  }

  isGuest() {
    return this.studentId == null && this.phoneNumber != null;
  }

  async getQuestions() {
    return Question.find({where: {userId: this.id}});
  }

  static async getOrCreate(properties: Partial<User>) {
    const userFound = await User.findOne({where: properties});

    if (userFound) {
      return userFound;
    } else {
      return User.create(properties);
    }
  }
}
