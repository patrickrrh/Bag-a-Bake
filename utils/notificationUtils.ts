import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Set Notification Display
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

// Request send notification permission
export const requestNotificationPermission = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        return newStatus === 'granted';
    }
    return true;
}

// Send Notification
export const sendNotification = async (title: string, body: string) => {
    await Notifications.scheduleNotificationAsync({
        content: {
            title,
            body,
        },
        trigger: null,
    });
};

export const monitorChanges = (orders: any[], favoriteProducts: any[]) => {
    orders.forEach(order => {
        if (order.status === 'updated') {
            sendNotification('Order Status Updated', `Your order #{order.id} has been updated.`)
        }
    });
    
    favoriteProducts.forEach(product => {
        if (product.isNew) {
            sendNotification('New Product Available', `${product.productName} is now available in your favorite bakery!`)
        }
    });
}