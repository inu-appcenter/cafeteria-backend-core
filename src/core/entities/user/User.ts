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

import {logger} from '../../logger';
import Question from '../qna/Question';
import {addDays, isAfter} from 'date-fns';
import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique} from 'typeorm';

@Entity()
@Unique(['studentId'])
@Unique(['phoneNumber'])
@Unique(['barcode'])
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn({comment: '식별자'})
  id: number;

  /**
   * 학생 전용 필드
   */
  @Column({nullable: true, comment: '학번'})
  studentId?: string;

  /**
   * 게스트 전용 필드
   */
  @Column({nullable: true, comment: '휴대전화 번호'})
  phoneNumber?: string;

  /**
   * 학생 전용 필드
   */
  @Column({nullable: true, comment: '바코드'})
  barcode?: string;

  @Column({comment: '자동로그인 토큰'})
  rememberMeToken: string;

  @Column({comment: '마지막 로그인 일시'})
  lastLoginAt: Date;

  @Column({nullable: true, comment: '마지막 바코드 활성화 일시'})
  barcodeActivatedAt?: Date;

  @Column({nullable: true, comment: '마지막 바코드 태그 일시'})
  barcodeTaggedAt?: Date;

  @Column({nullable: true, comment: '개인정보 이용방침 동의 일자'})
  privacyPolicyAgreedAt?: Date;

  @OneToMany(() => Question, (q) => q.user)
  questions: Question[];

  /**
   * 학생 또는 외부인 둘 중 하나인가?
   */
  isValid() {
    return this.isStudent() || this.isGuest();
  }

  /**
   * 학생인가?
   */
  isStudent() {
    return this.studentId != null && this.phoneNumber == null;
  }

  /**
   * 외부인인가?
   */
  isGuest() {
    return this.studentId == null && this.phoneNumber != null;
  }

  /**
   * 개인정보 수집이용 및 제공에 동의했는가?
   * 동의 유효기간이 지나면 동의하지 않은 것으로 간주합니다.
   *
   * @param agreementValidForDays 동의 유효기간. 기본 28일.
   */
  hasAgreedPrivacyPolicy(agreementValidForDays: number = 28) {
    if (this.privacyPolicyAgreedAt == null) {
      return false;
    }

    const beforeValidationPeriod = addDays(new Date(), -agreementValidForDays);

    return isAfter(this.privacyPolicyAgreedAt, beforeValidationPeriod);
  }

  /**
   * 개인정보처리방침에 동의함을 저장합니다.
   */
  agreePrivacyPolicy() {
    const now = new Date();

    logger.info(`사용자 ${this.identifier()}이(가) ${now}에 개인정보처리방침에 동의했습니다.`);

    this.privacyPolicyAgreedAt = now;
  }

  /**
   * 로그인 정보를 업데이트합니다.
   *
   * @param rememberMeToken 자동 로그인 토큰
   * @param barcode 바코드
   */
  updateLoginStatus(rememberMeToken: string, barcode?: string) {
    logger.info(`사용자 ${this.identifier()}의 로그인 정보를 업데이트합니다.`);

    this.rememberMeToken = rememberMeToken;
    this.lastLoginAt = new Date();
    this.barcode = barcode;
  }

  /**
   * 외부에서 사용자를 표현할 때에 사용하는 식별자입니다.
   * 학생이면 학번을, 외부인이면 전화번호를 반환합니다.
   */
  identifier() {
    return this.isStudent() ? this.studentId : this.phoneNumber;
  }

  /**
   * 만들거나, 가져옵니다.
   * 없을 때에만 새로 생성합니다.
   *
   * 새로 생성 후 저장은 하지 않습니다. 메모리에만 존재하는 상태입니다.
   */
  static async getOrCreate(properties: Partial<User>) {
    const userFound = await User.findOne({where: properties});

    if (userFound) {
      return userFound;
    } else {
      return User.create(properties);
    }
  }
}
