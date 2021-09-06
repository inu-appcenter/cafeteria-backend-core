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

import 'winston-daily-rotate-file';

import AWS from 'aws-sdk';
import path from 'path';
import winston from 'winston';
import WinstonCloudwatch from 'winston-cloudwatch';
import {getCloudwatchFormatter, getConsoleFormat, getFileFormat} from './formats';

export type CommonTransportOptions = {
  prefix?: string;
};

export type ConsoleTransportOptions = CommonTransportOptions;

export type FileTransportOptions = CommonTransportOptions & {
  logDirectory: string;
};

export type CloudwatchTransportOptions = CommonTransportOptions & {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  logGroupName: string;
};

export function getConsoleTransport(level: string, options: ConsoleTransportOptions) {
  return new winston.transports.Console({
    format: getConsoleFormat(options.prefix),
  });
}

export function getFileTransport(level: string, options: FileTransportOptions) {
  return new winston.transports.DailyRotateFile({
    format: getFileFormat(),
    filename: path.join(options.logDirectory, level, `${level}-%DATE%.log`),
    datePattern: 'YYYY-MM-DD',
  });
}

export function getCloudwatchTransport(level: string, options: CloudwatchTransportOptions) {
  AWS.config.update({
    region: options.region,
    credentials: new AWS.Credentials(options.accessKeyId, options.secretAccessKey),
  });

  return new WinstonCloudwatch({
    name: 'CloudwatchTransport',
    logGroupName: options.logGroupName,
    logStreamName: level,
    messageFormatter: getCloudwatchFormatter(options.prefix),
  });
}
