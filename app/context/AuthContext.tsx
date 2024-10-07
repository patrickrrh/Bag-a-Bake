import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import authenticationApi from '@/api/authenticationApi';
import * as SecureStore from "expo-secure-store";
import { ActivityIndicator, View } from "react-native";
import Toast from 'react-native-toast-message';

const AuthContext = createContext<{
    signIn: (data: object) => void;
    signUp: (data: object) => void;
    signOut: () => void;
    isAuthenticated: boolean | null;
    isLoading: boolean;
    justSignedIn: boolean;
}>({
    signIn: (data: object) => null,
    signUp: (data: object) => null,
    signOut: () => null,
    isAuthenticated: null,
    isLoading: false,
    justSignedIn: false
})

export function AuthProvider({ children }: PropsWithChildren) {

    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [justSignedIn, setJustSignedIn] = useState(false);

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
    console.log("Login Status:", justSignedIn)

    const showToast = (message: string) => {
        console.log("is toast called")
        Toast.show({
            type: 'error',
            text1: 'Oops!',
            text2: message,
        });
    }

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" />
            </View>
        );
    }

    const signIn = async (data: object) => {
        setIsLoading(true);
        try {
            const response = await authenticationApi().signIn(data);
            if (response.error) {
                throw new Error(response.error);
            } else {
                await SecureStore.setItemAsync("accessToken", response.accessToken);
                await SecureStore.setItemAsync("refreshToken", response.refreshToken);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Login failed:', error);
            if (error instanceof Error) {
                showToast(error.message);
            } else {
                showToast('An unexpected error occurred');
            }
        } finally {
            setIsLoading(false);
            setJustSignedIn(true);  
        }
    }

    const signUp = async (data: object) => {
        setIsLoading(true);
        try {
            const response = await authenticationApi().signUp(data);
            if (response.error) {
                throw new Error(response.error);
            } else {
                await SecureStore.setItemAsync("accessToken", response.accessToken);
                await SecureStore.setItemAsync("refreshToken", response.refreshToken);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.log("masuk disini", error)
            console.error('Registration failed:', error);
        } finally {
            setIsLoading(false);
            setJustSignedIn(true);
        }
    }

    const signOut = async () => {
        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("refreshToken");
        setIsAuthenticated(false);
        setJustSignedIn(false);
    };

    return (
        <AuthContext.Provider value={{ signIn, signUp, signOut, isAuthenticated, isLoading, justSignedIn }}>
            <Toast />
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
