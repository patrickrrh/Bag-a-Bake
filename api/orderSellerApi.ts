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
        getLatestPendingOrder: createApiFunction("get", "get/latest/pending/order"),
        getLatestOngoingOrder: createApiFunction("get", "get/latest/ongoing/order"),
        countAllPendingOrder: createApiFunction("get", "count/all/pending/order"),
        countAllOngoingOrder: createApiFunction("get", "count/all/ongoing/order"),
        getAllOrderByStatus: createApiFunction("post", "get/all/order/status"),
        actionOrder: createApiFunction("put", "action/order"),
    }
}