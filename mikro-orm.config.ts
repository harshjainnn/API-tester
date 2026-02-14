import { Options } from '@mikro-orm/core';
import { SqliteDriver } from '@mikro-orm/sqlite';
import { RequestLog } from './src/entities/RequestLog';

const config: Options = {
    driver: SqliteDriver,
    dbName: 'database.sqlite',
    entities: [RequestLog],
    debug: process.env.NODE_ENV !== 'production',
};

export default config;
