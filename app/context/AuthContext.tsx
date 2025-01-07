import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import authenticationApi from '@/api/authenticationApi';
import * as SecureStore from "expo-secure-store";
import { ActivityIndicator, View } from "react-native";
import Toast from 'react-native-toast-message';
import { UserType } from "@/types/types";
import { showToast } from "@/utils/toastUtils";

const AuthContext = createContext<{
    signIn: (data: object) => void;
    signUp: (data: object) => void;
    signOut: () => void;
    isAuthenticated: boolean | null;
    isLoading: boolean;
    isEditProfile: boolean;
    justSignedIn: boolean;
    userData: UserType | null;
    refreshUserData: () => Promise<void>;
    refreshUserStatus: () => Promise<void>;
}>({
    signIn: (data: object) => null,
    signUp: (data: object) => null,
    signOut: () => null,
    isAuthenticated: null,
    isEditProfile: false,
    isLoading: false,
    justSignedIn: false,
    userData: null,
    refreshUserData: async () => {},
    refreshUserStatus: async () => {},
})

export function AuthProvider({ children }: PropsWithChildren) {

    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [justSignedIn, setJustSignedIn] = useState(false);
    const [userData, setUserData] = useState<UserType | null>(null);
    const [isEditProfile, setIsEditProfile] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                setIsLoading(true);
                const token = await SecureStore.getItemAsync("accessToken");

                const userData = await SecureStore.getItemAsync("userData");
                const parsedUserData = JSON.parse(userData || "{}");

                if (token) {
                    setIsAuthenticated(true);
                    setUserData(parsedUserData);
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
                showToast('success', 'Berhasil masuk');
                await SecureStore.setItemAsync("accessToken", response.accessToken);
                await SecureStore.setItemAsync("refreshToken", response.refreshToken);
                await SecureStore.setItemAsync("userData", JSON.stringify(response.user));
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
            const response = await authenticationApi().signUpUser(data);
            if (response.error) {
                throw new Error(response.error);
            } else {
                showToast('success', 'Akun berhasil dibuat');
                await SecureStore.setItemAsync("accessToken", response.accessToken);
                await SecureStore.setItemAsync("refreshToken", response.refreshToken);
                await SecureStore.setItemAsync("userData", JSON.stringify(response.user));
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
        const res = await authenticationApi().revokeTokens({
            userId: userData?.userId
        });
        if (res.status === 200) {
            await SecureStore.deleteItemAsync("accessToken");
            await SecureStore.deleteItemAsync("refreshToken");
            await SecureStore.deleteItemAsync("userData");
            setIsEditProfile(false);
            setIsAuthenticated(false);
            setUserData(null);
            setJustSignedIn(true);
        }
    };

    const refreshUserStatus = async () => {
        try {
            const refreshToken = await SecureStore.getItemAsync("refreshToken");
            const userData = await authenticationApi().refreshUserStatus({ refreshToken: refreshToken })

            if (userData.status === 200) {
                await SecureStore.setItemAsync("userData", JSON.stringify(userData.user));
                setUserData(userData.user);
            } else {
                await SecureStore.deleteItemAsync("accessToken");
                await SecureStore.deleteItemAsync("refreshToken");
                await SecureStore.deleteItemAsync("userData");
                setIsAuthenticated(false);
                setUserData(null);
                showToast('error', 'Sesi Anda telah berakhir');
            }
        } catch (error) {
            console.error("Error refreshing user status:", error);
        }
    }

    const refreshUserData = async () => {
        try {
            setIsEditProfile(true);
            refreshUserStatus();
        } catch (error) {
            console.error("Error refreshing user data:", error);
        }
    };
    
    return (
        <AuthContext.Provider value={{ signIn, signUp, signOut, isAuthenticated, isLoading, justSignedIn, userData, refreshUserData, isEditProfile, refreshUserStatus }}>
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
