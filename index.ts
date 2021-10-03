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

import 'reflect-metadata';

/**
 * Date 계열 함수를 쓰기 전에 먼저 타임존을 설정합니다.
 * 있으면 있는걸 쓰고, 기본은 Asia/Seoul입니다.
 */
process.env.TZ = process.env.TZ || 'Asia/Seoul';

export * from './src/core/db';
export * from './src/core/meta';
export * from './src/core/utils';
export * from './src/core/logger';
export * from './src/core/entities';
export * from './src/core/validation';
