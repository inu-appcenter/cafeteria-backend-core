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

import minimist from 'minimist';

/**
 * 명령줄 인자를 가져옵니다.
 *
 * @param key 가져올 인자의 이름.
 * @param fallback 없으면 이걸 가져와요.
 */
export default function getArg(key: string, fallback?: any): any {
  const allArgs = minimist(process.argv.slice(2));

  return allArgs[key] || fallback;
}
