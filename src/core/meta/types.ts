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

import {BaseEntity} from 'typeorm';

export type EntityClass<T extends BaseEntity = BaseEntity> = {
  new (): T;
} /*생성자*/ & typeof BaseEntity /*정적메소드*/;

export type EntityMetadata = {
  name: string;
  fields: {
    name: string;
    type: string;
    comment?: string;
    primary: boolean;
    nullable: boolean;
    relational: boolean;
    isMany: boolean;
  }[];
};
