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

import {EntityTarget, getConnection} from 'typeorm';

export type EntityClass = EntityTarget<any>;
export type EntityMetadata = {
  name: string;
  fields: {
    name: string;
    type: string;
    primary: boolean;
    nullable: boolean;
  }[];
};

/**
 * 엔티티의 이름과 칼럼들을 가져옵니다.
 * 기본 커넥션이 생성된 다음부터 작동합니다.
 *
 * @param entityClass 메타데이터가 가지고 싶은 엔티티 클래스.
 */
export default function getEntityMetadata(entityClass: EntityClass): EntityMetadata {
  const meta = getConnection().getMetadata(entityClass);

  return {
    name: meta.targetName,
    fields: meta.ownColumns.map((c) => ({
      name: c.propertyName,
      type: typeof c.type === 'function' ? typeof c.type() : c.type,
      primary: c.isPrimary,
      nullable: c.isNullable,
    })),
  };
}
