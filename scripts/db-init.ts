/**
 * Initialize the SQLite database and create/update the schema.
 * Run: npm run db:init  (or tsx scripts/db-init.ts)
 */
import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
import config from '../mikro-orm.config';

async function main() {
    const orm = await MikroORM.init(config);
    const generator = orm.getSchemaGenerator();
    await generator.updateSchema();
    await orm.close();
    console.log('Database schema updated.');
}

main().catch((err) => {
    console.error('DB init failed:', err);
    process.exit(1);
});
