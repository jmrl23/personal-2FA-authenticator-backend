import dotenv from 'dotenv';
import { basename } from 'node:path';
import { yellow, magentaBright, gray } from 'colorette';
import { logger } from './logger';

export const loadEnvFiles = function loadEnvFiles(...paths: string[]): void {
  for (const path of paths) {
    const data = dotenv.config({ path, override: true }).parsed;

    if (!data || Object.keys(data).length < 1) {
      continue;
    }

    const name = basename(path);

    for (const key in data) {
      const value = data[key];

      logger.debug(
        `DotEnvFile ${yellow('Var')} ${magentaBright(name)} ${gray('%s: %s')}`,
        key,
        value,
      );
    }
  }
};
