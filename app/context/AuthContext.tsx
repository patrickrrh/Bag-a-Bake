import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import authenticationApi from '@/api/authenticationApi';
import * as SecureStore from "expo-secure-store";
import { ActivityIndicator, View } from "react-native";

const AuthContext = createContext<{
    login: (email: string, password: string) => void;
    signUp: (data: object) => void;
    logout: () => void;
    isAuthenticated: boolean | null;
    isLoading: boolean;
    justLoggedIn: boolean;
}>({
    login: (email: string, password: string) => null,
    signUp: (data: object) => null,
    logout: () => null,
    isAuthenticated: null,
    isLoading: false,
    justLoggedIn: false
})

export function AuthProvider({ children }: PropsWithChildren) {

    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [justLoggedIn, setJustLoggedIn] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                setIsLoading(true);
                const token = await SecureStore.getItemAsync("accessToken");
                console.log("Token retrieved:", token);

                if (token) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error("Error checking authentication:", error);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    console.log("Auth Provider", isAuthenticated)
    console.log("Login Status:", justLoggedIn)

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" />
            </View>
        );
    }

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await authenticationApi().login({ email, password });
            if (response.error) {
                throw new Error(response.error);
            } else {
                await SecureStore.setItemAsync("accessToken", response.accessToken);
                await SecureStore.setItemAsync("refreshToken", response.refreshToken);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Login failed:', error);
        } finally {
            setIsLoading(false);
            setJustLoggedIn(true);
        }
    }

    const signUp = async (data: object) => {
        setIsLoading(true);
        try {
            const response = await authenticationApi().register(data);
            if (response.error) {
                throw new Error(response.error);
            } else {
                await SecureStore.setItemAsync("accessToken", response.accessToken);
                await SecureStore.setItemAsync("refreshToken", response.refreshToken);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Registration failed:', error);
        } finally {
            setIsLoading(false);
            setJustLoggedIn(true);
        }
    }

    const logout = async () => {
        console.log("is triggered logout");
        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("refreshToken");
        setIsAuthenticated(false);
        setJustLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ login, signUp, logout, isAuthenticated, isLoading, justLoggedIn }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useSession must be used within an SessionProvider');
    }
    return context;
}
