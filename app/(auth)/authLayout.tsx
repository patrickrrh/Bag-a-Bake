import { View, Text, ScrollView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

type Props = {
    children: React.ReactNode;
    headerContent?: React.ReactNode;
    footerContent?: React.ReactNode;
    isScrollable?: boolean;
}

const AuthLayout: React.FC<Props> = ({ children, headerContent, footerContent, isScrollable }) => {
    return (
        <SafeAreaView className="bg-background h-full flex-1">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

                <View style={{ flex: 1 }}>

                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            paddingHorizontal: 20,
                            marginBottom: Platform.OS === 'android' ? 20 : 0,
                        }}
                    >
                        <View>{headerContent}</View>

                        {
                            isScrollable ? (
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                        <View>
                                            <View className="mt-4">{children}</View>

                                            <View style={{ flex: 1 }} className="mt-20" />
                                            <View className="flex-row justify-center items-center">{footerContent}</View>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </ScrollView>
                            ) : (
                                <>
                                    <View className="mt-4">{children}</View>

                                    <View style={{ flex: 1 }} className="mt-20" />
                                    <View className="flex-row justify-center items-center">{footerContent}</View>
                                </>
                            )
                        }

                    </View>
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
};

export default AuthLayout;
