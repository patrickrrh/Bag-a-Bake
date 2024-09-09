import axios from "axios";

const createApiFunction = (method: string, url: string) => async (data?: object) => {
    try {
        const response = await axios({
            method,
            url: `http://10.0.2.2:3000/api/${url}`,
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

export default function loginApi() {
    return {
        login: createApiFunction("post", "login"),
    }
}