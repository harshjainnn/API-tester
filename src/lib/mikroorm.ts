
import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
import config from '../../mikro-orm.config';

let orm: MikroORM;

export async function getORM() {
    if (!orm) {
        orm = await MikroORM.init(config);
    }
    return orm;
}

export async function getEM() {
    const orm = await getORM();
    return orm.em.fork();
}
