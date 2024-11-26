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

export default function orderCustomerApi() {
    return {
        createOrder: createApiFunction("post", "create/order"),
        getOrderByStatus: createApiFunction("post", "get/order/status"),
        cancelOrder: createApiFunction("post", "cancel/order"),
        submitProofOfPayment: createApiFunction("post", "submit/proof-of-payment"),
    }
}