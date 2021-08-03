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
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import User from '../user/User';
import Answer from './Answer';

@Entity()
export default class Question extends BaseEntity {
  @PrimaryGeneratedColumn({comment: '식별자'})
  id: number;

  @ManyToOne(() => User, (user) => user.questions)
  @JoinColumn()
  user: User;

  @Column({comment: '질문한 사용자의 식별자'})
  userId: number;

  @Column({comment: '기기 정보'})
  deviceInfo: string;

  @Column({comment: '앱 버전'})
  appVersion: string;

  @Column({type: 'text', comment: '내용'})
  content: string;

  @Column({comment: '질문 일시'})
  askedAt: Date;

  @OneToOne(() => Answer, (a) => a.question)
  answer?: Answer;
}
