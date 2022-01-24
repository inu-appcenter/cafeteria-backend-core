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

import {RuleViolation} from './RuleViolation';

/**
 * 검증 클래스에서 쓰기 좋은 wrapper를 포함하는 베이스 클래스입니다.
 */
export abstract class RuleValidator {
  /**
   * 실제 검증을 수행하고, 그 결과를 ValidationResult로 가져옵니다.
   * 자식 클래스에서 여러 단계의 규칙을 검증할 때에 사용하면 좋습니다.
   *
   * @param validationBody 실제 검증을 수행하는 함수입니다.
   * @protected
   */
  protected async runValidation(validationBody: () => Promise<void>): Promise<ValidationResult> {
    try {
      await validationBody();
    } catch (e) {
      if (e instanceof RuleViolation) {
        return e.result;
      } else {
        throw e;
      }
    }

    return {
      error: null,
      failedAt: 0,
    };
  }
}

/**
 * 검증의 결과.
 */
export type ValidationResult = {
  /**
   * 실패했을 때, 그 에러입니다.
   */
  error: Error | null;

  /**
   * 실패한 규칙의 번호입니다.
   * 실패하지 않았으면 0입니다.
   */
  failedAt: number;
};
