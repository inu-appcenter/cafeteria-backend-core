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

import mysql from 'mysql2/promise';
import {RowDataPacket} from 'mysql2';

import getEnv from '../src/utils/env';
import {
  Answer,
  Cafeteria,
  CafeteriaBookingParams,
  CafeteriaValidationParams,
  Corner,
  DiscountProcessHistory,
  DiscountRule,
  DiscountTransaction,
  MenuParseRegex,
  Notice,
  Question,
  startTypeORM,
  User,
} from '../index';

/**
 * 2021년 8월 9일 마이그레이션
 *
 * 운영 DB의 정보를 가져와 새 스케마에 맞게 매핑한 다음 로컬 개발 DB에 저장합니다.
 *
 * 1단계: 운영 DB 정보 모두 빼오기.
 * 2단계: 로컬 DB 초기화하기.
 * 3단계: 로컬 DB에 운영 DB에서 빼온 정보 *가공하여* 집어넣기.
 */
async function performMigrationAndSaveProductionDataToLocalDatabase() {
  try {
    const dumped = await dumpProductionDatabase();

    await synchronizeLocalDatabase();

    await mapAndSaveEntitiesToLocalDatabase(dumped);

    console.log('성공 끝!');
  } catch (e) {
    console.log(e);
  }
}

async function dumpProductionDatabase() {
  const connection = await mysql.createConnection({
    host: getEnv('PROD_DB_HOST'),
    user: getEnv('PROD_DB_USERNAME'),
    password: getEnv('PROD_DB_PASSWORD'),
    database: 'cafeteria',
  });

  const [tables] = await connection.query('SHOW TABLES');
  const tableNames = (tables as RowDataPacket[]).map((t) => t['Tables_in_cafeteria']);

  console.log(`테이블 목록: ${tableNames}`);

  const rowsPerTable: Record<string, Record<string, any>[]> = {};

  for (const table of tableNames) {
    console.log(`${table} 덤프 중...`);

    const [rows] = await connection.query(`SELECT * from ${table}`);

    rowsPerTable[table] = (rows as RowDataPacket[]).map((d) => Object.assign({}, d));
  }

  console.log(`테이블 ${tableNames.length}개 덤프 완료.`);

  return rowsPerTable;
}

async function synchronizeLocalDatabase() {
  await startTypeORM(true);
}

async function mapAndSaveEntitiesToLocalDatabase(dumped: Record<string, Record<string, any>[]>) {
  /** User */
  console.log(`User 변환중...`);
  for (const raw of dumped['users']) {
    const barcodeStatus = dumped['user_discount_statuses'].find((st) => st.user_id === raw.id);

    await User.create({
      studentId: String(raw.id),
      rememberMeToken: raw.token,
      lastLoginAt: raw.last_login,
      barcode: raw.barcode,
      barcodeActivatedAt: barcodeStatus?.last_barcode_activation,
      barcodeTaggedAt: barcodeStatus?.last_barcode_tagging,
    }).save();
  }

  /** Question */
  console.log(`Question 변환중...`);
  for (const raw of dumped['questions']) {
    await Question.create({
      id: raw.id,
      user: await User.findOneOrFail({studentId: String(raw.user_id)}),
      deviceInfo: raw.device_info,
      appVersion: raw.version,
      content: raw.content,
      askedAt: raw.createdAt,
    }).save();
  }

  /** Answer */
  console.log(`Answer 변환중...`);
  for (const raw of dumped['answers']) {
    await Answer.create({
      id: raw.id,
      questionId: raw.question_id,
      title: raw.title,
      body: raw.body,
      answeredAt: raw.createdAt,
      read: raw.read === 1 ? true : false,
      readAt: raw.read === 1 ? new Date() : undefined,
    }).save();
  }

  /** Cafeteria */
  console.log(`Cafeteria 변환중...`);
  for (const raw of dumped['cafeteria']) {
    const comment = dumped['cafeteria_comments'].find((st) => st.cafeteria_id === raw.id);

    await Cafeteria.create({
      id: raw.id,
      name: raw.name,
      displayName: raw.display_name,
      comment: comment?.comment,
      supportMenu: raw.support_menu,
      supportDiscount: raw.support_discount,
      supportNotification: raw.support_notification,
    }).save();
  }

  /** CafeteriaValidationParams */
  console.log(`CafeteriaValidationParams 변환중...`);
  for (const raw of dumped['cafeteria_validation_params']) {
    await CafeteriaValidationParams.create({
      cafeteriaId: raw.cafeteria_id,
      token: raw.token,
      availableMealTypes: raw.available_meal_types,
      breakfast: raw.time_range_breakfast,
      lunch: raw.time_range_lunch,
      dinner: raw.time_range_dinner,
    }).save();
  }

  /** Corner */
  console.log(`Corner 변환중...`);
  for (const raw of dumped['corners']) {
    await Corner.create({
      id: raw.id,
      name: raw.name,
      displayName: raw.display_name,
      availableAt: raw.available_at,
      cafeteriaId: raw.cafeteria_id,
    }).save();
  }

  /** DiscountProcessHistory */
  console.log(`DiscountProcessHistory 변환중...`);
  for (const raw of dumped['transaction_histories']) {
    const typeTransform: Record<string, string> = {
      Validate: 'Verify',
      Commit: 'Commit',
      Cancel: 'Cancel',
    };

    await DiscountProcessHistory.create({
      id: raw.id,
      type: typeTransform[raw.type],
      studentId: String(raw.user_id),
      cafeteriaId: raw.cafeteria_id,
      mealType: raw.meal_type,
      failedAt: raw.failed_at,
      message: raw.message,
      timestamp: raw.timestamp,
    }).save();
  }

  /** DiscountRule */
  console.log(`DiscountRule 변환중...`);
  for (const raw of dumped['cafeteria_discount_rules']) {
    const idTransform: Record<number, number> = {
      2: 1,
      1: 2,
      3: 3,
      4: 4,
      6: 5,
      5: 6,
      7: 7,
    };

    await DiscountRule.create({
      id: idTransform[raw.id],
      name: raw.name,
      description: raw.description,
      enabled: raw.enabled === 1 ? true : false,
    }).save();
  }

  /** DiscountTransaction */
  console.log(`DiscountTransaction 변환중...`);
  for (const raw of dumped['discount_transactions']) {
    await DiscountTransaction.create({
      id: raw.id,
      studentId: String(raw.user_id),
      cafeteriaId: raw.cafeteria_id,
      mealType: raw.meal_type,
      timestamp: raw.timestamp,
    }).save();
  }

  /** MenuParseRegex */
  console.log(`MenuParseRegex 변환중...`);
  for (const raw of dumped['parse_regexes']) {
    await MenuParseRegex.create({
      id: raw.id,
      regex: raw.regex,
      comment: '사용 예시를 적어주세요!',
    }).save();
  }

  /** Notice */
  console.log(`Notice 변환중...`);
  for (const raw of dumped['notices']) {
    await Notice.create({
      id: raw.id,
      title: raw.title,
      body: raw.body,
      targetOs: raw.target_os,
      targetVersion: raw.target_version,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    }).save();
  }

  /**
   * CafeteriaBookingParams
   */
  // 학식당용 하나 프리셋
  await CafeteriaBookingParams.create({
    cafeteriaId: 1,
    capacity: 20,
    acceptTimeRange: '08:30-10:30',
    intervalMinutes: 5,
    durationMinutes: 30,
    toleranceMinutes: 5,
  }).save();
}

performMigrationAndSaveProductionDataToLocalDatabase().then().catch();
