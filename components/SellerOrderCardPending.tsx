import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import TextTitle5 from '@/components/texts/TextTitle5';
import TextTitle4 from './texts/TextTitle4';
import CustomTagOrderStatus from './CustomTagOrderStatus';
import TextTitle5Gray from './texts/TextTitle5Gray';
import RejectOrderButton from './rejectOrderButton';
import AcceptOrderButton from './AcceptOrderButton';
import { calculateTotalOrderPrice } from '@/utils/commonFunctions';

interface Props {
    order: any;
    onPress: () => void;
    onAccept: () => void;
    onReject: () => void;
}

type OrderDetail = {
    orderDetailId: string;
    productQuantity: string;
    product: any;
}

const SellerOrderCardPending: React.FC<Props> = ({ order, onPress, onAccept, onReject }) => {

    //TO DO: kasih loader
    if (!order) {
        return null;
    }

    return (
        <TouchableOpacity
            onPress={onPress}
            className='w-full h-[277px] bg-white rounded-lg shadow-sm mt-4 p-4'
        >
            <View style={{ flexDirection: 'column', flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1, alignItems: 'center' }}>
                    <TextTitle4 label={`#${order.orderId}`} />
                    <TextTitle5Gray label={order.user.userName} />
                </View>

                <View className='h-[1px] bg-gray-100 my-4' />

                <View style={{ flexDirection: 'column', flex: 3 }}>
                    {order.orderDetail.map((item: OrderDetail) => (
                        <View key={item.orderDetailId} style={{ flexDirection: 'row', flex: 1, columnGap: 8 }}>
                            <TextTitle5 label={item.productQuantity} />
                            <TextTitle5 label={item.product.productName} />
                        </View>
                    ))}
                </View>

                <View className='h-[1px] bg-gray-100 my-4' />

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1, alignItems: 'center' }}>
                    <TextTitle4 label='Total Harga' />
                    <TextTitle4 label={calculateTotalOrderPrice(order.orderDetail)} />
                </View>

                <View className='h-[1px] bg-gray-100 my-4' />

                <View style={{ flex: 2, flexDirection: 'row', justifyContent: 'space-around' }}>
                    <RejectOrderButton
                        label='Tolak'
                        onPress={onReject}
                        isLoading={false}
                    />
                    <AcceptOrderButton
                        label='Terima'
                        onPress={onAccept}
                        isLoading={false}
                    />
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default SellerOrderCardPending;
