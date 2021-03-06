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

import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import Cafeteria from './Cafeteria';

@Entity()
export default class Corner extends BaseEntity {
  @PrimaryGeneratedColumn({comment: '식별자'})
  id: number;

  @Column({comment: '실제 이름'})
  name: string;

  @Column({comment: '앱에 표시될 이름'})
  displayName: string;

  /**
   * 0부터 7까지입니다.
   * 아침: 4, 점심: 2, 저녁: 1
   */
  @Column({comment: '이용 가능 시간대(아침: 4, 점심: 2, 저녁: 1)'})
  availableAt: number;

  @ManyToOne(() => Cafeteria, (c) => c.corners, {cascade: ['update']})
  @JoinColumn()
  cafeteria: Cafeteria;

  @Column({comment: '속한 Cafeteria의 식별자'})
  cafeteriaId: number;
}
