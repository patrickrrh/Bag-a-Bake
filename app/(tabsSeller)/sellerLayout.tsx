import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
    children: React.ReactNode;
    headerContent?: React.ReactNode;
}

const SellerLayout: React.FC<Props> = ({ children, headerContent }) => {
    return (
      <SafeAreaView className="bg-background h-full flex-1">
        
        <View className="bg-white shadow-md">
          {headerContent}
        </View>
  
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 justify-center px-8 mt-4">
            {children}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };

export default SellerLayout