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

export default function registerApi() {
    return {
        signUp: createApiFunction("post", "sign_up"),
        signIn: createApiFunction("post", "sign_in"),
        isEmailRegistered: createApiFunction("post", "is_email_registered"),
        checkAccount: createApiFunction("post", "check_account"),
        sendOTP: createApiFunction("post", "send/otp"),
        verifyOTP: createApiFunction("post", "verify/otp"),
        changePassword: createApiFunction("put", "change/password"),
        updateUser: createApiFunction("put", "update/user"),
        refreshAuth: createApiFunction("post", "refresh_token"),
        revokeTokens: createApiFunction("put", "revoke/tokens"),
    }
}