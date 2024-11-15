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
        getBakery: createApiFunction("get", "get/bakery"),
        getBakeryByCategory: createApiFunction("post", "get/bakery/by-category"),
        getBakeryByProduct: createApiFunction("post", "get/bakery/by-product"),
        getBakeryByRegion: createApiFunction("post", "get/bakery/by-region"),
        getBakeryByExpiringProducts: createApiFunction("get", "get/bakery/by-expiring-products"),
        getBakeryWithFilters: createApiFunction("post", "get/bakery/with-filters"),
        getBakeryById: createApiFunction("post", "get/bakery/by-id"),
        updateBakery: createApiFunction("put", "update/bakery"),
    }
}