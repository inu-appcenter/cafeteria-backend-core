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

import {EntityClass} from '../../meta';
import {BaseEntity, Column, PrimaryColumn} from 'typeorm';

/**
 * Validation의 대상이 되는 무언가에 대해 적용할 규칙을 나타냅니다.
 * id로 식별하며, 설명을 제공하고, 켜져 있거나 꺼져 있습니다.
 */
export default abstract class Rule extends BaseEntity {
  /**
   * id는 직접 지정합니다.
   */
  @PrimaryColumn({comment: '식별자'})
  id: number;

  @Column({comment: '규칙 이름'})
  name: string;

  @Column({comment: '규칙 상세 설명'})
  description: string;

  @Column({comment: '활성화 여부'})
  enabled: boolean;

  static async getName<T extends Rule>(this: EntityClass, ruleId: number) {
    const rule = (await this.findOne(ruleId)) as T;

    return rule.name;
  }

  static async getSummary<T extends Rule>(this: EntityClass, ruleId: number) {
    const rule = (await this.findOne(ruleId)) as T;

    if (rule == null) {
      return `[RULE ${ruleId}] `;
    } else {
      return `[RULE ${rule.id}: ${rule.name}(${rule.description}, ${
        rule.enabled ? '켜짐' : '꺼짐'
      })] `;
    }
  }

  static async canBypass<T extends Rule>(this: EntityClass, ruleId: number) {
    const rule = (await this.findOne(ruleId)) as T;

    if (rule == null) {
      return true; // 없으면 활성화된걸루 침!
    }

    return !rule.enabled;
  }
}
