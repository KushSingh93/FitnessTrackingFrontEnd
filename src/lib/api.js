import axios from "axios";
import Cookies from 'js-cookie'; // Import js-cookie
import { HOST } from "../utils/constants"; // Base URL from constants

export const apiClient = axios.create({
    baseURL: HOST,
    withCredentials: true, // Handles cookies & authentication
    headers: {
        "Content-Type": "application/json",
    },
});

// Add a request interceptor to include the token from cookies
apiClient.interceptors.request.use(
    (config) => {
        const token = Cookies.get('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
