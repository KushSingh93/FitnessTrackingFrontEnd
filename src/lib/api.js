import axios from "axios";
import { HOST } from "../utils/constants"; // Base URL from constants

export const apiClient = axios.create({
    baseURL: HOST,
    withCredentials: true, // Handles cookies & authentication
    headers: {
        "Content-Type": "application/json",
    },
});
