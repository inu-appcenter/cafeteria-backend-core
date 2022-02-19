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

import assert from 'assert';
import moment from 'moment';
import {addDays} from 'date-fns';

/**
 * 다음(내일) 날짜를 가져옵니다.
 * @param date
 */
export function getNextDay(date: Date) {
  return addDays(date, 1);
}

/**
 * 날짜 스트링이 YYYYMMDD 포맷으로 이루어져 있는지 여부를 가져옵니다.
 *
 * @param dateString 검증 대상 날짜 스트링.
 */
export function checkDateStringFormat(dateString: string) {
  return moment(dateString, 'YYYYMMDD').isValid();
}

/**
 * 날짜 스트링이 YYYYMMDD 포맷으로 이루어져 있지 않으면 뻗습니다.
 *
 * @param dateString 검증 대상 날짜 스트링.
 */
export function assertDateStringFormat(dateString: string) {
  assert(
    checkDateStringFormat(dateString),
    '날짜 포맷이 올바르지 않습니다. YYYYMMDD만 허용합니다.'
  );
}
