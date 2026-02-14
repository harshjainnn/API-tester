import { NextResponse } from 'next/server';
import { getEM } from '@/lib/mikroorm';
import { RequestLog } from '@/entities/RequestLog';

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
        const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, parseInt(searchParams.get('limit') || String(DEFAULT_PAGE_SIZE), 10)));
        const offset = (page - 1) * limit;

        const em = await getEM();
        const [logs, total] = await em.findAndCount(RequestLog, {}, {
            orderBy: { createdAt: 'DESC' },
            limit,
            offset,
        });

        return NextResponse.json({
            data: logs,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasMore: offset + logs.length < total,
            },
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const em = await getEM();
        const log = await em.findOne(RequestLog, { id: parseInt(id) });

        if (!log) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        await em.removeAndFlush(log);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
