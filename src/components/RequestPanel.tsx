
'use client';

import React, { useState, useEffect } from 'react';
import { HttpMethod, KeyValue, RequestConfig, ApiResponse } from '@/lib/types';
import axios from 'axios';
import { Trash, Plus, Send, Save } from 'lucide-react';

interface RequestPanelProps {
    initialConfig?: RequestConfig;
    onResponse: (response: ApiResponse | null) => void;
    onLoading: (loading: boolean) => void;
    onSave?: () => void; // Optional save hook
}

export default function RequestPanel({ initialConfig, onResponse, onLoading, onSave }: RequestPanelProps) {
    const [url, setUrl] = useState('');
    const [method, setMethod] = useState<HttpMethod>('GET');
    const [headers, setHeaders] = useState<KeyValue[]>([{ id: '1', key: '', value: '', active: true }]);
    const [queryParams, setQueryParams] = useState<KeyValue[]>([{ id: '1', key: '', value: '', active: true }]);
    const [body, setBody] = useState('');
    const [activeTab, setActiveTab] = useState<'params' | 'headers' | 'body'>('params');

    useEffect(() => {
        if (initialConfig) {
            setUrl(initialConfig.url);
            setMethod(initialConfig.method);
            setHeaders(initialConfig.headers.length ? initialConfig.headers : [{ id: '1', key: '', value: '', active: true }]);
            setQueryParams(initialConfig.queryParams.length ? initialConfig.queryParams : [{ id: '1', key: '', value: '', active: true }]);
            setBody(initialConfig.body);
        }
    }, [initialConfig]);

    const handleSend = async () => {
        onLoading(true);
        onResponse(null);
        try {
            // Convert arrays to object
            const headersObj = headers.reduce((acc, curr) => {
                if (curr.active && curr.key) acc[curr.key] = curr.value;
                return acc;
            }, {} as any);

            const paramsObj = queryParams.reduce((acc, curr) => {
                if (curr.active && curr.key) acc[curr.key] = curr.value;
                return acc;
            }, {} as any);

            const res = await axios.post('/api/request', {
                url,
                method,
                headers: headersObj,
                queryParams: paramsObj,
                body: body,
            });

            onResponse(res.data);
            if (onSave) onSave();
        } catch (error: any) {
            console.error(error);
            if (error.response) {
                onResponse(error.response.data);
            } else {
                onResponse({ status: 0, statusText: 'Network Error', data: null, headers: {}, time: 0, size: 0, error: error.message });
            }
        } finally {
            onLoading(false);
        }
    };

    const updateKeyValue = (
        setFunction: React.Dispatch<React.SetStateAction<KeyValue[]>>,
        id: string,
        field: 'key' | 'value' | 'active',
        newValue: any
    ) => {
        setFunction((prev) =>
            prev.map((item) => (item.id === id ? { ...item, [field]: newValue } : item))
        );
    };

    const addKeyValue = (setFunction: React.Dispatch<React.SetStateAction<KeyValue[]>>) => {
        setFunction((prev) => [...prev, { id: Date.now().toString(), key: '', value: '', active: true }]);
    };

    const removeKeyValue = (setFunction: React.Dispatch<React.SetStateAction<KeyValue[]>>, id: string) => {
        setFunction((prev) => prev.filter((item) => item.id !== id));
    };

    const renderKeyValueEditor = (
        items: KeyValue[],
        setFunction: React.Dispatch<React.SetStateAction<KeyValue[]>>
    ) => (
        <div className="space-y-2">
            {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={item.active}
                        onChange={(e) => updateKeyValue(setFunction, item.id, 'active', e.target.checked)}
                        className="mr-2"
                    />
                    <input
                        type="text"
                        placeholder="Key"
                        value={item.key}
                        onChange={(e) => updateKeyValue(setFunction, item.id, 'key', e.target.value)}
                        className="flex-1 p-2 bg-gray-50 border border-gray-300 rounded dark:bg-zinc-800 dark:border-zinc-700"
                    />
                    <input
                        type="text"
                        placeholder="Value"
                        value={item.value}
                        onChange={(e) => updateKeyValue(setFunction, item.id, 'value', e.target.value)}
                        className="flex-1 p-2 bg-gray-50 border border-gray-300 rounded dark:bg-zinc-800 dark:border-zinc-700"
                    />
                    <button
                        onClick={() => removeKeyValue(setFunction, item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                    >
                        <Trash size={16} />
                    </button>
                </div>
            ))}
            <button
                onClick={() => addKeyValue(setFunction)}
                className="flex items-center text-sm text-blue-500 hover:text-blue-600 mt-2"
            >
                <Plus size={16} className="mr-1" /> Add New
            </button>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 p-4">
            <div className="flex space-x-2 mb-4">
                <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value as HttpMethod)}
                    className="p-2 bg-gray-50 border border-gray-300 rounded dark:bg-zinc-800 dark:border-zinc-700 font-semibold"
                >
                    {['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map((m) => (
                        <option key={m} value={m}>{m}</option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder="Enter URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1 p-2 bg-gray-50 border border-gray-300 rounded dark:bg-zinc-800 dark:border-zinc-700"
                />
                <button
                    onClick={handleSend}
                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center font-medium"
                >
                    <Send size={18} className="mr-2" /> Send
                </button>
            </div>

            <div className="flex space-x-4 border-b border-gray-200 dark:border-zinc-800 mb-4">
                {['params', 'headers', 'body'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`pb-2 px-1 capitalize ${activeTab === tab ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-auto">
                {activeTab === 'params' && renderKeyValueEditor(queryParams, setQueryParams)}
                {activeTab === 'headers' && renderKeyValueEditor(headers, setHeaders)}
                {activeTab === 'body' && (
                    <textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        placeholder="Enter request body (JSON)"
                        className="w-full h-full p-4 font-mono text-sm bg-gray-50 border border-gray-300 rounded dark:bg-zinc-800 dark:border-zinc-700 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                )}
            </div>
        </div>
    );
}
