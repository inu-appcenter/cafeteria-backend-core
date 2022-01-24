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

import {Question, startTypeORM} from '../../index';

beforeAll(async () => {
  await startTypeORM();
});

describe('질문하기', () => {
  it('사용자 엔티티 대신 foreign key만 넣어줘도 됨.', async () => {
    const question = Question.create({
      userId: 1,
      deviceInfo: 'aedwa',
      appVersion: '1.343',
      content: '우히히 우히히',
      askedAt: new Date(),
    });

    console.log(question);

    await question.save();

    console.log(question);
  });
});

describe('질문+답변 가져오기', () => {
  it('relation 집어넣어주어야 질문과 함께 딸린 답변도 가져옴.', async () => {
    const questions = await Question.find({where: {userId: 1}, relations: ['answer']});

    console.log(questions);
  });
});
