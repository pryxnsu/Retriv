import axios, { AxiosError, AxiosResponse } from 'axios';

const AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_URL!,
});

AxiosInstance.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => {
        return response;
    },
    async (error: AxiosError) => {
        const err = error as AxiosError;
        if (err.status === 429) {
            console.error((err.response?.data as AxiosError).message);
        }
        return Promise.reject(error);
    },
);

export default AxiosInstance;
