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

import winston from 'winston';
import TransportStream from 'winston-transport';
import {
  CloudwatchTransportOptions,
  ConsoleTransportOptions,
  FileTransportOptions,
  getCloudwatchTransport,
  getConsoleTransport,
  getFileTransport,
} from './transports';

export type LoggerOptions = {
  consoleTransportOptions?: ConsoleTransportOptions;
  fileTransportOptions?: FileTransportOptions;
  cloudwatchTransportOptions?: CloudwatchTransportOptions;
};

export function buildLoggerWithOptions(level: string, options: LoggerOptions) {
  const transports: TransportStream[] = [];

  if (options.consoleTransportOptions) {
    transports.push(getConsoleTransport(level, options.consoleTransportOptions));
  }

  if (options.fileTransportOptions) {
    transports.push(
      getFileTransport(level, options.fileTransportOptions),
      getFileTransport('combined', options.fileTransportOptions)
    );
  }

  if (options.cloudwatchTransportOptions) {
    transports.push(
      getCloudwatchTransport(level, options.cloudwatchTransportOptions),
      getCloudwatchTransport('combined', options.cloudwatchTransportOptions)
    );
  }

  return createLogger(transports);
}

function createLogger(transports: TransportStream[]): winston.Logger {
  return winston.createLogger({
    level: 'verbose',
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      winston.format.json()
    ),
    transports,
  });
}
