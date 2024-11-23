import axios from "axios";
import apiClient from "./apiClient";

const createApiFunction = (method: string, url: string) => async (data?: object) => {
    try {
        const response = await apiClient({
            method,
            url: `/${url}`,
            data: method === "post" || method === "put" ? data : undefined,
        });
        return response.data
    } catch(error) {    
        if (axios.isAxiosError(error)) {
            return error.response?.data
        }
        return { message: "An unexpected error occured" };
    }
}

export default function bakeryApi() {
    return {
        getPaymentByBakery: createApiFunction("post", "get/bakery/payment-info"),
    }
}