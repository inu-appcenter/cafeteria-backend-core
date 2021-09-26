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

import {startTypeORM} from '../../db';
import VisitRecord from './VisitRecord';
import {addDays} from 'date-fns';

describe('사용자가 동의를 유지하고 있는 방문 기록만 꺼내오기', () => {
  beforeAll(async () => {
    await startTypeORM();
  });

  it('돌아가나!?', async () => {
    const records = await VisitRecord.findUserAgreedRecordsInRange(
      addDays(new Date(), -7),
      new Date(),
      28
    );

    console.log(records);
  });
});
