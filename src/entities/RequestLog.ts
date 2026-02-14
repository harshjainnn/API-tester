import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class RequestLog {
    @PrimaryKey({ type: 'number', autoincrement: true })
    id!: number;

    @Property({ type: 'string' })
    url!: string;

    @Property({ type: 'string' })
    method!: string;

    @Property({ type: 'json', nullable: true })
    headers?: object;

    @Property({ type: 'json', nullable: true })
    queryParams?: object;

    @Property({ type: 'text', nullable: true })
    body?: string;

    @Property({ type: 'number', nullable: true })
    responseStatus?: number;

    @Property({ type: 'number', nullable: true })
    responseTime?: number; // in ms

    @Property({ type: 'number', nullable: true })
    responseSize?: number; // in bytes

    @Property({ type: 'text', nullable: true })
    responsePreview?: string;

    @Property({ type: 'text', nullable: true })
    responseBody?: string;

    @Property({ type: 'date' })
    createdAt: Date = new Date();
}
