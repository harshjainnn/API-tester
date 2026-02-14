
'use client';

import React from 'react';
import { ApiResponse } from '@/lib/types';
import clsx from 'clsx';
import { Copy } from 'lucide-react';

interface ResponsePanelProps {
    response: ApiResponse | null;
    loading: boolean;
}

export default function ResponsePanel({ response, loading }: ResponsePanelProps) {
    const [activeTab, setActiveTab] = React.useState<'body' | 'headers'>('body');

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!response) {
        return (
            <div className="h-full flex items-center justify-center bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-4 text-gray-500">
                Enter a URL and send request to see response
            </div>
        );
    }

    const isError = response.status >= 400 || response.status === 0;

    return (
        <div className="flex flex-col h-full bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 flex-1 overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
                <div className="flex items-center space-x-4">
                    <span className={clsx("font-bold", isError ? "text-red-500" : "text-green-500")}>
                        {response.status} {response.statusText}
                    </span>
                    <span className="text-sm text-gray-500">
                        Time: {response.time}ms
                    </span>
                    <span className="text-sm text-gray-500">
                        Size: {response.size}B
                    </span>
                </div>
            </div>

            <div className="flex border-b border-gray-200 dark:border-zinc-800">
                <button
                    onClick={() => setActiveTab('body')}
                    className={clsx("px-4 py-2 text-sm font-medium", activeTab === 'body' ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700")}
                >
                    Body
                </button>
                <button
                    onClick={() => setActiveTab('headers')}
                    className={clsx("px-4 py-2 text-sm font-medium", activeTab === 'headers' ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700")}
                >
                    Headers
                </button>
            </div>

            <div className="flex-1 overflow-auto p-4 relative group">
                {activeTab === 'body' && (
                    <>
                        <button
                            className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-zinc-800 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => navigator.clipboard.writeText(JSON.stringify(response.data, null, 2))}
                            title="Copy to clipboard"
                        >
                            <Copy size={16} />
                        </button>
                        <pre className="text-sm font-mono whitespace-pre-wrap break-all text-black dark:text-gray-300">
                            {response.data && typeof response.data === 'object' ? JSON.stringify(response.data, null, 2) : String(response.data)}
                        </pre>
                    </>
                )}
                {activeTab === 'headers' && (
                    <div className="space-y-1">
                        {Object.entries(response.headers || {}).map(([key, value]) => (
                            <div key={key} className="grid grid-cols-[200px_1fr] gap-4 text-sm">
                                <span className="font-semibold text-gray-700 dark:text-gray-300 truncate">{key}:</span>
                                <span className="text-gray-600 dark:text-gray-400 break-all">{String(value)}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
