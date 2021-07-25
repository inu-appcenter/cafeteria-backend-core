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

import {Answer, startTypeORM} from '../index';

beforeAll(async () => {
  await startTypeORM(true);
});

describe('사용자에게 달린 답변 중 안 일읽은 것 가져오기', () => {
  it('그냥 쿼리 빌더를 쓰자', async () => {
    // find option으로 하는거? 안돼요
    // https://github.com/typeorm/typeorm/issues/2707

    const answers = await Answer.createQueryBuilder('answer')
      .innerJoin('answer.question', 'question')
      .where('question.userId = :userId', {userId: 1})
      .andWhere('answer.read = :read', {read: false})
      .getMany();

    console.log(answers);
  });
});
