
import { NextResponse } from 'next/server';
import { getEM } from '@/lib/mikroorm';
import { RequestLog } from '@/entities/RequestLog';
import axios from 'axios';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { url, method, headers, queryParams, body: requestBody } = body;

        if (!url || !method) {
            return NextResponse.json({ error: 'URL and Method are required' }, { status: 400 });
        }

        const startTime = Date.now();
        let responseStatus: number = 0;
        let responseStatusText: string = 'OK';
        let responseData: any = null;
        let responseHeaders: any = {};
        let error: string | null = null;

        try {
            let requestData: unknown = undefined;
            if (requestBody && String(requestBody).trim()) {
                const trimmed = String(requestBody).trim();
                if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
                    try {
                        requestData = JSON.parse(trimmed);
                    } catch {
                        requestData = requestBody;
                    }
                } else {
                    requestData = requestBody;
                }
            }
            const response = await axios({
                url,
                method,
                headers: headers || {},
                params: queryParams || {},
                data: requestData,
                validateStatus: () => true, // Don't throw on error status
            });

            responseStatus = response.status;
            responseStatusText = response.statusText || 'OK';
            responseData = response.data;
            responseHeaders = response.headers;
        } catch (err: any) {
            error = err.message;
            responseStatus = 0;
            responseData = { error: err.message };
        }

        const endTime = Date.now();
        const duration = endTime - startTime;

        let responseStr: string;
        try {
            responseStr = typeof responseData === 'string' ? responseData : JSON.stringify(responseData);
        } catch {
            responseStr = String(responseData);
        }
        const responseSize = Buffer.byteLength(responseStr, 'utf8');

        // Persist to DB (store preview for list display, full body for detail if needed)
        const em = await getEM();
        const log = em.create(RequestLog, {
            url,
            method,
            headers: headers ?? undefined,
            queryParams: queryParams ?? undefined,
            body: requestBody,
            responseStatus,
            responseTime: duration,
            responseSize,
            responseBody: responseStr.length <= 50_000 ? responseStr : responseStr.substring(0, 50_000) + '\n… [truncated]',
            responsePreview: responseStr.substring(0, 200),
            createdAt: new Date(),
        });

        await em.persistAndFlush(log);

        return NextResponse.json({
            status: responseStatus,
            statusText: error ?? responseStatusText,
            headers: responseHeaders,
            data: responseData,
            time: duration,
            size: responseSize,
        });

    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
