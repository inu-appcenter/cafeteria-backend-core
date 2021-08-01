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

import {BaseEntity, getConnection} from 'typeorm';
import {ObjectType} from 'typeorm/common/ObjectType';
import {EntityTarget} from 'typeorm/common/EntityTarget';

export default class ExtendedEntity extends BaseEntity {
  static graphqlType<T extends ExtendedEntity>(this: ObjectType<T>): string {
    const meta = extractMetadata(this);
    return formatGraphqlType(meta, 'type');
  }

  static graphqlInput<T extends ExtendedEntity>(this: ObjectType<T>): string {
    return '';
  }
}

type Meta = {
  name: string;
  fields: {
    name: string;
    type: string;
    primary: boolean;
    nullable: boolean;
  }[];
};

function extractMetadata(entityClass: EntityTarget<any>): Meta {
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

function formatGraphqlType(meta: Meta, prefix: 'type' | 'input') {
  const fields = meta.fields.map(
    (f) => `${f.name}: ${graphqlType(f.type)}${f.nullable ? '' : '!'}`
  );

  return `${prefix} ${meta.name} {
    ${fields.join('\n\t')}
  }`;
}

function graphqlType(jsType: string) {
  const conversion: any = {
    string: 'String',
    number: 'Int',
    boolean: 'Boolean',
  };

  if (conversion[jsType]) {
    return conversion[jsType];
  } else {
    return jsType;
  }
}
