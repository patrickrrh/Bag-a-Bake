// import { View, Text, ScrollView } from 'react-native'
// import React from 'react'
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Toast from 'react-native-toast-message';
// import TextHeader from '@/components/texts/TextHeader';

// type Props = {
//     children: React.ReactNode;
//     headerContent?: React.ReactNode;
//     footerContent?: React.ReactNode;
// }

// const HistoryLayout: React.FC<Props> = ({ children, headerContent, footerContent }) => {
//     return (
//         <SafeAreaView className="bg-background h-full flex-1" >
//             <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
//                 <View className="flex-1 justify-center px-8">

//                     {/* Header */}
//                     <View>
//                         <TextHeader label="PESANAN SAYA" />
//                     </View>

//                     <View>

//                     </View>

//                     {/* Content */}
//                     <View className='mt-4'>
//                         {children}
//                     </View>
//                 </View>
//             </ScrollView>
//         </SafeAreaView>
//     )
// }

// export default HistoryLayout