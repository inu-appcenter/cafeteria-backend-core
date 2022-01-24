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

import {
  BaseEntity,
  Between,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  SaveOptions,
} from 'typeorm';
import Cafeteria from '../cafeteria/Cafeteria';
import {isBefore, isAfter, isSameDay, startOfDay, endOfDay} from 'date-fns';
import assert from 'assert';

/**
 * 식당 휴업 정보
 */
@Entity()
export default class CafeteriaDayOff extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cafeteria)
  @JoinColumn()
  cafeteria: Cafeteria;

  @Column({comment: '연관된 식당 식별자'})
  cafeteriaId: number;

  @Column({comment: '휴업 시작 시간'})
  startsAt: Date;

  @Column({comment: '휴업 종료 시간'})
  endsAt: Date;

  /**
   * 저장 전에 검증!
   */
  save(options?: SaveOptions): Promise<this> {
    assert(isSameDay(this.startsAt, this.endsAt));
    assert(isAfter(this.endsAt, this.startsAt));

    return super.save(options);
  }

  /**
   * 주어진 날짜가 day off에 해당하는지 여부를 반환합니다.
   */
  isInOffTime(date: Date): boolean {
    return isAfter(date, this.startsAt) && isBefore(date, this.endsAt);
  }

  /**
   * 특정 식당의 어느 날짜에 해당하는 day off를 모두 가져옵니다.
   * 하루 중에서도 시간대별로 여러개일 수 있기 때문에 이렇게 했습니다.
   *
   * @param cafeteriaId 식당 식별자.
   * @param date 기준이 되는 날짜.
   */
  static async findByCafeteriaIdAtSameDay(
    cafeteriaId: number,
    date: Date
  ): Promise<CafeteriaDayOff[]> {
    return await CafeteriaDayOff.find({
      cafeteriaId,
      startsAt: Between(startOfDay(date), endOfDay(date)),
      endsAt: Between(startOfDay(date), endOfDay(date)),
    });
  }
}
