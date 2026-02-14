
'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { HistoryItem, HistoryResponse, RequestConfig } from '@/lib/types';
import { Trash, RefreshCw } from 'lucide-react';
import clsx from 'clsx';

const PAGE_SIZE = 20;

interface HistoryPanelProps {
    onSelect: (config: RequestConfig) => void;
    refreshTrigger: number;
}

function historyItemToRequestConfig(item: HistoryItem): RequestConfig {
    const headers = item.headers != null
        ? (Array.isArray(item.headers)
            ? item.headers as unknown as RequestConfig['headers']
            : Object.entries(item.headers).map(([key, value], i) => ({
                id: `h-${item.id}-${i}`,
                key,
                value: String(value),
                active: true,
            })))
        : [{ id: '1', key: '', value: '', active: true }];
    const queryParams = item.queryParams != null
        ? (Array.isArray(item.queryParams)
            ? item.queryParams as unknown as RequestConfig['queryParams']
            : Object.entries(item.queryParams).map(([key, value], i) => ({
                id: `q-${item.id}-${i}`,
                key,
                value: String(value),
                active: true,
            })))
        : [{ id: '1', key: '', value: '', active: true }];
    return {
        url: item.url,
        method: item.method as RequestConfig['method'],
        headers: headers.length ? headers : [{ id: '1', key: '', value: '', active: true }],
        queryParams: queryParams.length ? queryParams : [{ id: '1', key: '', value: '', active: true }],
        body: item.body ?? '',
    };
}

export default function HistoryPanel({ onSelect, refreshTrigger }: HistoryPanelProps) {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [pagination, setPagination] = useState<HistoryResponse['pagination'] | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const fetchPage = useCallback(async (page: number, append: boolean) => {
        if (append) setLoadingMore(true);
        else setLoading(true);
        try {
            const res = await axios.get<HistoryResponse>('/api/history', {
                params: { page, limit: PAGE_SIZE },
            });
            setPagination(res.data.pagination);
            setHistory(prev => append ? [...prev, ...res.data.data] : res.data.data);
        } catch (error) {
            console.error('Failed to fetch history', error);
        } finally {
            if (append) setLoadingMore(false);
            else setLoading(false);
        }
    }, []);

    const fetchHistory = useCallback(() => fetchPage(1, false), [fetchPage]);

    useEffect(() => {
        fetchPage(1, false);
    }, [refreshTrigger, fetchPage]);

    const onScroll = useCallback(() => {
        const el = scrollRef.current;
        if (!el || loadingMore || !pagination?.hasMore) return;
        const { scrollTop, scrollHeight, clientHeight } = el;
        if (scrollTop + clientHeight >= scrollHeight - 80) {
            fetchPage(pagination.page + 1, true);
        }
    }, [loadingMore, pagination?.hasMore, pagination?.page, fetchPage]);

    const handleDelete = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        try {
            await axios.delete(`/api/history?id=${id}`);
            setHistory(prev => prev.filter(item => item.id !== id));
            if (pagination) {
                setPagination(prev => prev ? { ...prev, total: Math.max(0, prev.total - 1) } : null);
            }
        } catch (error) {
            console.error('Failed to delete history item', error);
        }
    };

    const getMethodColor = (method: string) => {
        switch (method) {
            case 'GET': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400';
            case 'POST': return 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400';
            case 'PUT': return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400';
            case 'DELETE': return 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400';
            default: return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20 dark:text-gray-400';
        }
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 w-64 md:w-80">
            <div className="p-4 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-center shrink-0">
                <h2 className="font-semibold text-lg">History</h2>
                <button onClick={fetchHistory} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full" title="Refresh">
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>
            <div
                ref={scrollRef}
                className="flex-1 overflow-auto"
                onScroll={onScroll}
            >
                {history.length === 0 && !loading ? (
                    <div className="p-4 text-center text-gray-500 text-sm">No history yet. Send a request to see it here.</div>
                ) : (
                    <>
                        <div className="divide-y divide-gray-100 dark:divide-zinc-800">
                            {history.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => onSelect(historyItemToRequestConfig(item))}
                                    className="p-3 hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer group relative"
                                >
                                    <div className="flex items-center space-x-2 mb-1">
                                        <span className={clsx('text-xs font-bold px-2 py-0.5 rounded', getMethodColor(item.method))}>
                                            {item.method}
                                        </span>
                                        <span className={clsx('text-xs font-medium', (item.responseStatus ?? 0) >= 400 ? 'text-red-500' : 'text-green-500')}>
                                            {item.responseStatus ?? '–'}
                                        </span>
                                    </div>
                                    <div className="text-sm truncate text-gray-700 dark:text-gray-300" title={item.url}>
                                        {item.url}
                                    </div>
                                    <div className="flex justify-between items-center mt-1">
                                        <span className="text-xs text-gray-400">
                                            {new Date(item.createdAt).toLocaleTimeString()}
                                        </span>
                                        <button
                                            onClick={(e) => handleDelete(e, item.id)}
                                            className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-opacity"
                                            aria-label="Delete"
                                        >
                                            <Trash size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {loadingMore && (
                            <div className="p-3 flex justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-blue-600" />
                            </div>
                        )}
                        {pagination && !pagination.hasMore && history.length > 0 && (
                            <div className="p-2 text-center text-xs text-gray-400">
                                {pagination.total} request{pagination.total !== 1 ? 's' : ''}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
