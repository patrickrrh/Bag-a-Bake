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

export default function orderSellerApi() {
    return {
        getLatestPendingOrder: createApiFunction("post", "get/latest/pending/order"),
        getLatestPaymentOrder: createApiFunction("post", "get/latest/payment/order"),
        getLatestOngoingOrder: createApiFunction("post", "get/latest/ongoing/order"),
        countAllPendingOrder: createApiFunction("post", "count/all/pending/order"),
        countAllOnPaymentOrder: createApiFunction("post", "count/all/on-payment/order"),
        countAllOngoingOrder: createApiFunction("post", "count/all/ongoing/order"),
        getAllOrderByStatus: createApiFunction("post", "get/all/order/status"),
        actionOrder: createApiFunction("put", "action/order"),
        cancelOrder: createApiFunction("post", "seller/cancel/order"),
    }
}