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

export default function productApi() {
    return {
        createProduct: createApiFunction("post", "create/product"),
        getProductById: createApiFunction("post", "get/product/id"),
        updateProductById: createApiFunction("put", "edit/product/id"),
        searchProductByKeyword: createApiFunction("get", "search/product"),
        deleteProductById: createApiFunction("delete", "delete/product/id"),
        getProductsByCategory: createApiFunction("post", "get/products/category"),
        getRecommendedProducts: createApiFunction("post", "get/recommended/products"),
        getExpiringProducts: createApiFunction("get", "get/expiring/products"),
        getBakeryByProduct: createApiFunction("post", "get/bakery/product"),
    }
}