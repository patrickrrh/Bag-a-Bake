import axios from "axios";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

const { baseURL } = Constants.expoConfig?.extra as { baseURL: string };

const apiClient = axios.create({
    baseURL,
})

// add access token to header
apiClient.interceptors.request.use(
    async (config) => {
        const accessToken = await SecureStore.getItemAsync("accessToken");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
)

// handle token expiration
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const { response } = error;
        if (response && response.status === 401) {
            try {
                const refreshToken = await SecureStore.getItemAsync("refreshToken");

                if (!refreshToken) {
                    return Promise.reject(error);
                }
                
                const { data } = await apiClient.post("/refresh_token", { refreshToken });

                await SecureStore.getItemAsync("accessToken", data.accessToken);
                await SecureStore.getItemAsync("refreshToken", data.refreshToken);

                if (error.config) {
                    error.config.headers.Authorization = `Bearer ${data.accessToken}`;
                    return apiClient.request(error.config);
                }
            } catch (error) {
                console.log("Failed to refresh token: ", error);
            }
        }
        return Promise.reject(error);
    }
)

export default apiClient