/**
 * This file is part of INU Cafeteria.
 *
 * Copyright 2021 INU Global App Center <potados99@gmail.com>
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
import Question from './Question';

@Entity()
export default class Answer extends BaseEntity {
  @PrimaryGeneratedColumn({comment: '식별자'})
  id: number;

  @OneToOne(() => Question, (q) => q.answer)
  @JoinColumn()
  question: Question;

  @Column({comment: '연관된 질문의 식별자'})
  questionId: number;

  @Column({comment: '제목'})
  title: string;

  @Column({type: 'text', comment: '내용'})
  body: string;

  @Column({comment: '답변 등록 일시'})
  answeredAt: Date = new Date();

  @Column({comment: '사용자가 읽었는지 여부'})
  read: boolean = false;

  @Column({comment: '사용자가 답변을 읽은 일시', nullable: true})
  readAt?: Date = undefined;

  /**
   * 안 읽은 답변만 가져옵니다.
   *
   * @param userId 그 답변에 딸린 질문을 남긴 사용자의 식별자.
   */
  static async findUnread(userId: number): Promise<Answer[]> {
    return await Answer.createQueryBuilder('answer')
      .innerJoin('answer.question', 'question') // question 필드에 join을 찰싹.
      .where('question.userId = :userId', {userId}) // 그 question의 userId로 필터.
      .andWhere('answer.read = :read', {read: false}) // 물론 answer는 unread인 것만.
      .getMany(); // 마니마니챙겨와
  }
}
