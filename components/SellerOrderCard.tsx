import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import TextTitle5 from '@/components/texts/TextTitle5';
import TextTitle4 from './texts/TextTitle4';
import CustomTagOrderStatus from './CustomTagOrderStatus';
import TextTitle5Gray from './texts/TextTitle5Gray';
import { calculateTotalOrderPrice } from '@/utils/commonFunctions';

interface Props {
    order: any;
    onPress: () => void;
}

type OrderDetail = {
    orderDetailId: string;
    productQuantity: string;
    product: any;
    orderStatus: any;
}

const SellerOrderCard: React.FC<Props> = ({ order, onPress }) => {

    return (
        <TouchableOpacity
            onPress={onPress}
            className='w-full h-[209px] bg-white rounded-lg shadow-sm mt-4 p-4'
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

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                    <CustomTagOrderStatus status={order.orderStatus} />
                    <TextTitle4 label={calculateTotalOrderPrice(order.orderDetail)} />
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default SellerOrderCard;
