import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import authenticationApi from '@/api/authenticationApi';
import * as SecureStore from "expo-secure-store";
import { ActivityIndicator, View } from "react-native";
import Toast from 'react-native-toast-message';
import { BakeryType, UserType } from "@/types/types";

const AuthContext = createContext<{
    signIn: (data: object) => void;
    signUp: (data: object) => void;
    signOut: () => void;
    isAuthenticated: boolean | null;
    isLoading: boolean;
    justSignedIn: boolean;
    userData: UserType | null;
    bakeryData: BakeryType | null;
}>({
    signIn: (data: object) => null,
    signUp: (data: object) => null,
    signOut: () => null,
    isAuthenticated: null,
    isLoading: false,
    justSignedIn: false,
    userData: null,
    bakeryData: null
})

export function AuthProvider({ children }: PropsWithChildren) {

    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [justSignedIn, setJustSignedIn] = useState(false);
    const [userData, setUserData] = useState<UserType | null>(null);
    const [bakeryData, setBakeryData] = useState<BakeryType | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                setIsLoading(true);
                const token = await SecureStore.getItemAsync("accessToken");

                const userData = await SecureStore.getItemAsync("userData");
                const parsedUserData = JSON.parse(userData || "{}");

                const bakeryData = await SecureStore.getItemAsync("bakeryData");
                const parsedBakeryData = JSON.parse(bakeryData || "{}");
                if (token) {
                    setIsAuthenticated(true);
                    setUserData(parsedUserData);
                    setBakeryData(parsedBakeryData);
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
    }, [isAuthenticated]);

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
                await SecureStore.setItemAsync("userData", JSON.stringify(response.user));
                await SecureStore.setItemAsync("bakeryData", JSON.stringify(response.bakery));
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Login failed:', error);
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
                await SecureStore.setItemAsync("userData", JSON.stringify(response.user));
                await SecureStore.setItemAsync("bakeryData", JSON.stringify(response.bakery));
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Registration failed:', error);
        } finally {
            setIsLoading(false);
            setJustSignedIn(true);
        }
    }

    const signOut = async () => {
        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("refreshToken");
        await SecureStore.deleteItemAsync("userData");
        await SecureStore.deleteItemAsync("bakeryData");
        setIsAuthenticated(false);
        setUserData(null);
        setBakeryData(null);
        setJustSignedIn(true);
    };

    return (
        <AuthContext.Provider value={{ signIn, signUp, signOut, isAuthenticated, isLoading, justSignedIn, userData, bakeryData }}>
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
