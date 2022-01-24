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

import winston from 'winston';
import {formatLog} from './utils';
import {buildLoggerWithOptions, LoggerOptions} from './logger';

const levels = ['verbose', 'info', 'warn', 'error'] as const;

const loggers = new Map<string, winston.Logger>();

type LoggerWrapperSet = {
  [k in typeof levels[number]]: (...messages: any[]) => void;
};

export function setupLogger(options: LoggerOptions) {
  for (const level of levels) {
    loggers.set(level, buildLoggerWithOptions(level, options));
  }
}

export function getLoggerWrapperSet(): LoggerWrapperSet {
  const wrapperSet: any = {};

  for (const level of levels) {
    wrapperSet[level] = (...messages: any[]) => loggers.get(level)?.[level](formatLog(messages));
  }

  return wrapperSet;
}
