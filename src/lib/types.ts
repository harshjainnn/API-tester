
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface KeyValue {
    id: string;
    key: string;
    value: string;
    active: boolean;
}

export interface RequestConfig {
    url: string;
    method: HttpMethod;
    headers: KeyValue[];
    queryParams: KeyValue[];
    body: string;
}

export interface ApiResponse {
    status: number;
    statusText: string;
    data: any;
    headers: any;
    time: number;
    size: number;
    error?: string;
}

export interface HistoryItem {
    id: number;
    url: string;
    method: string;
    headers?: object;
    queryParams?: object;
    body?: string;
    responseStatus?: number;
    responseTime?: number;
    responsePreview?: string;
    createdAt: string;
}

export interface HistoryResponse {
    data: HistoryItem[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasMore: boolean;
    };
}
