/*
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

-- 20211007
-- 예약 인원을 시간대별로 다르게 하는 요구사항을 반영하며 엔티티 설계에 변화가 생겼습니다.
-- 예약 파라미터, 예약 등 백엔드 코어의 엔티티 변화에 따른 테이블 마이그레이션입니다.

-- 예약 테이블의 타임슬롯 칼럼 이름 변경.
ALTER TABLE cafeteria.booking CHANGE time_slot time_slot_start datetime NOT NULL COMMENT '타임슬롯 시작 일시';
ALTER TABLE cafeteria.booking CHANGE next_time_slot time_slot_end datetime NOT NULL COMMENT '타임슬롯 끝 일시';

-- 예약 시간대 테이블 추가.
CREATE TABLE `booking_time_range`
(
    `id`                          int                                     NOT NULL AUTO_INCREMENT COMMENT '식별자',
    `time_range`                  varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '예약 운영 시간대',
    `interval_minutes`            int                                     NOT NULL COMMENT '타임슬롯 간의 간격(분)',
    `capacity`                    int                                     NOT NULL COMMENT '타임슬롯당 수용 가능 인원',
    `cafeteria_booking_params_id` int                                     NOT NULL COMMENT '속한 예약 파라미터의 식별자',
    PRIMARY KEY (`id`),
    KEY `FK_62a10cd6e28611a2fda50a76139` (`cafeteria_booking_params_id`),
    CONSTRAINT `FK_62a10cd6e28611a2fda50a76139` FOREIGN KEY (`cafeteria_booking_params_id`) REFERENCES `cafeteria_booking_params` (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- 예약 파라미터 테이블 칼럼 변경.
ALTER TABLE cafeteria.cafeteria_booking_params DROP COLUMN tolerance_minutes;
ALTER TABLE cafeteria.cafeteria_booking_params CHANGE duration_minutes user_stays_for_minutes int NOT NULL COMMENT '사용자가 식당에 머무는 시간(분)';
ALTER TABLE cafeteria.cafeteria_booking_params DROP COLUMN interval_minutes;
ALTER TABLE cafeteria.cafeteria_booking_params DROP COLUMN accept_time_range;
ALTER TABLE cafeteria.cafeteria_booking_params DROP COLUMN capacity;

-- 예약 시간대 테이블에 초기 데이터 추가.
INSERT INTO `booking_time_range` VALUES (1,'08:30-08:55',5,55,1),(2,'09:00-10:00',5,35,1);
