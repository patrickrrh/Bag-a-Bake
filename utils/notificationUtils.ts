import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import Constants from "expo-constants";

export const requestNotificationPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status === 'granted') {
        const token = await Notifications.getDevicePushTokenAsync();
        return token;
    }
    return null;
}

export const setupNotificationListeners = () => {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
        })
    })

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    Notifications.addNotificationReceivedListener(notification => {
        console.log('Notification received:', notification);
    })

    Notifications.addNotificationResponseReceivedListener(response => {
        console.log('Notification response received:', response);
    })
}

// Notifications.setNotificationHandler({
//     handleNotification: async () => ({
//         shouldShowAlert: true,
//         shouldPlaySound: true,
//         shouldSetBadge: false,
//     }),
// });


// export const sendNotification = async (title: string, body: string) => {
//     await Notifications.scheduleNotificationAsync({
//         content: {
//             title,
//             body,
//         },
//         trigger: null,
//     });
// };

// export const monitorChanges = (orders: any[], favoriteProducts: any[]) => {
//     orders.forEach(order => {
//         if (order.status === 'updated') {
//             sendNotification('Order Status Updated', `Your order #{order.id} has been updated.`)
//         }
//     });
    
//     favoriteProducts.forEach(product => {
//         if (product.isNew) {
//             sendNotification('New Product Available', `${product.productName} is now available in your favorite bakery!`)
//         }
//     });
// }