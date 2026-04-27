import { getToken } from "./authService";

export const authFetch = async (url: string, options: RequestInit = {}) => {
    const token = await getToken();

    const headers = {
        ...options.headers,
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    };

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
        const errorBody = await response.text();
        let message = "Request failed with status " + response.status;
       
        const parsed = JSON.parse(errorBody);
        if (parsed.message) message = parsed.message;
    
        throw new Error(message);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
};