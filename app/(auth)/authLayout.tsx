import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

type Props = {
    children: React.ReactNode;
    headerContent?: React.ReactNode;
    footerContent?: React.ReactNode;
}

const AuthLayout: React.FC<Props> = ({ children, headerContent, footerContent }) => {
    return (
        <SafeAreaView className="bg-background h-full flex-1" >

            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100 }}>
                <Toast topOffset={50} />
            </View>

            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View className="flex-1 justify-center px-8">

                    {/* Header */}
                    <View>
                        {headerContent}
                    </View>

                    {/* Content */}
                    <View className='mt-4'>
                        {children}
                    </View>

                    {/* Footer */}
                    <View style={{ flex: 1 }} className='mt-20' />
                    <View className="flex-row justify-center items-center">
                        {footerContent}
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default AuthLayout