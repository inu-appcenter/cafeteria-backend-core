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

// @ts-ignore
import AntPathMatcher from 'ant-path-matcher';

/**
 * 요청의 경로가 미리 지정한 경로에 해당하는지 알려줍니다.
 *
 * 경로를 미리 지정할 때에는 ant pattern 을 사용합니다. 요기 참조: https://lng1982.tistory.com/169
 */
export default class PathMatcher {
  private antMatcher = new AntPathMatcher();

  constructor(private readonly pathPatterns: string[]) {}

  /**
   * 요청 들어온 경로가 미리 설정된 허용리스트 목록 중 최소 1개 이상의 패턴과 매치되는지 알려줍니다.
   *
   * @param requestPath 요청 들어온 경로
   */
  anyMatch(requestPath: string): Boolean {
    for (const pattern of this.pathPatterns) {
      if (this.antMatcher.match(pattern, requestPath)) {
        return true;
      }
    }

    return false;
  }
}
