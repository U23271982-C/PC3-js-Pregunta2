import axios from 'axios';
import { createAlova } from 'alova';
import adapterFetch from 'alova/fetch';
import reactHook from 'alova/react';

const API_URL = 'http://localhost:3001';

// --- Axios Configuration ---
export const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// --- Alova Configuration ---
export const alovaInstance = createAlova({
    baseURL: API_URL,
    statesHook: reactHook,
    requestAdapter: adapterFetch(),
    responded: response => response.json(),
});
