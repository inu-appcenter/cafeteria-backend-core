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

/**
 * 식사 시간대를 8진수로 나타냅니다.
 * 4는 아침,
 * 2는 점심,
 * 1은 저녁입니다.
 *
 * 합쳐서 나타낼 수 있습니다.
 * 예를 들어 아침 + 점심은 6,
 * 점심 + 저녁은 3,
 */

const MealType = {
  BREAKFAST: 4,
  LUNCH: 2,
  DINNER: 1,
  NONE: 0,

  all: [4, 2, 1, 0],
};

export default MealType;
