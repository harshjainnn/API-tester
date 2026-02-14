
'use client';

import React, { useState } from 'react';
import RequestPanel from '@/components/RequestPanel';
import ResponsePanel from '@/components/ResponsePanel';
import HistoryPanel from '@/components/HistoryPanel';
import { ApiResponse, RequestConfig } from '@/lib/types';
import { Github } from 'lucide-react';

export default function Home() {
    const [selectedRequest, setSelectedRequest] = useState<RequestConfig | undefined>(undefined);
    const [response, setResponse] = useState<ApiResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [refreshHistoryTrigger, setRefreshHistoryTrigger] = useState(0);

    const handleResponse = (res: ApiResponse | null) => {
        setResponse(res);
        // Refresh history when a new request is successfully sent (and saved)
        if (res) {
            setRefreshHistoryTrigger(prev => prev + 1);
        }
    };

    const handleHistorySelect = (config: RequestConfig) => {
        setSelectedRequest(config);
    };

    return (
        <main className="flex h-screen flex-col bg-gray-100 dark:bg-zinc-950 text-gray-900 dark:text-gray-100 overflow-hidden">
            {/* Header */}
            <header className="h-14 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between px-4 shrink-0 z-10">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                        AT
                    </div>
                    <h1 className="font-bold text-lg tracking-tight">API Tester</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                        <Github size={20} />
                    </a>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <HistoryPanel onSelect={handleHistorySelect} refreshTrigger={refreshHistoryTrigger} />

                {/* Workspace */}
                <div className="flex-1 flex flex-col min-w-0 bg-gray-50 dark:bg-black">
                    <div className="flex-1 p-4 overflow-hidden flex flex-col md:flex-row gap-4">
                        {/* Left: Request Builder */}
                        <div className="flex-1 min-w-0 flex flex-col h-full">
                            <h2 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Request</h2>
                            <div className="flex-1 min-h-0">
                                <RequestPanel
                                    initialConfig={selectedRequest}
                                    onResponse={handleResponse}
                                    onLoading={setLoading}
                                />
                            </div>
                        </div>

                        {/* Right: Response Viewer */}
                        <div className="flex-1 min-w-0 flex flex-col h-full border-l md:border-l-0 border-gray-200 dark:border-zinc-800 md:pl-0">
                            <h2 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Response</h2>
                            <div className="flex-1 min-h-0">
                                <ResponsePanel response={response} loading={loading} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
