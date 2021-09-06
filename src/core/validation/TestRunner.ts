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

import Rule from '../entities/rule/Rule';
import {logger} from '../logger';
import {EntityClass} from '../meta';
import {RuleViolation} from './RuleViolation';

/**
 * 주어진 테스트를 실행합니다.
 */
export class TestRunner {
  constructor(private readonly tests: Test[], private readonly context: TestContext) {}

  /**
   * 테스트를 실행합니다.
   * 수 틀리면 RuleViolation을 터뜨립니다.
   */
  async runTests() {
    const {tests, context} = this;
    const {subject, ruleClass, excludedRuleIds} = context;

    logger.info(`${subject} Rule ${tests.map((test) => test.ruleId).join(', ')} 적용중`);

    for (const test of tests) {
      if (excludedRuleIds.includes(test.ruleId)) {
        continue;
      }

      const passed = await test.validate();
      const canBypass = await ruleClass.canBypass(test.ruleId);
      const ruleSummary = await ruleClass.getSummary(test.ruleId);

      if (passed) {
        logger.info(`${subject} 통과 ${ruleSummary}`);
      } else {
        if (canBypass) {
          logger.info(`${subject} 우회 ${ruleSummary}`);
        } else {
          logger.warn(`${subject} 실패 ${ruleSummary}`);
          throw new RuleViolation({error: test.failure, failedAt: test.ruleId});
        }
      }
    }
  }
}

export type Test = {
  ruleId: number;
  validate: () => Promise<boolean>;
  failure: Error;
};

export type TestContext = {
  /**
   * 이 검증을 촉발한 사용자의 정보.
   * 로그 출력할 때에 사용합니다.
   */
  subject: string;

  /**
   * 검증 규칙 클래스.
   * 해당 규칙이 켜져 있는지 알기 위해 사용합니다.
   */
  ruleClass: EntityClass & typeof Rule /*정적메소드*/;

  /**
   * 시험을 면제할 규칙의 id.
   * 여기에 주어진 숫자를 id로 가지는 규칙은 검증에서 제외(통과)됩니다.
   */
  excludedRuleIds: number[];
};
