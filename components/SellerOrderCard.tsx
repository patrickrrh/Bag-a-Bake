import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import TextTitle5 from '@/components/texts/TextTitle5';
import TextTitle4 from './texts/TextTitle4';
import CustomTagOrderStatus from './CustomTagOrderStatus';
import TextTitle5Gray from './texts/TextTitle5Gray';
import { formatDate, formatDatewithtime, formatRupiah } from '@/utils/commonFunctions';
import { Ionicons } from '@expo/vector-icons';

interface Props {
    order: any;
    onPress: () => void;
    printPdf?: () => void
}

type OrderDetail = {
    orderDetailId: string;
    productQuantity: string;
    product: any;
    orderStatus: any;
}

const SellerOrderCard: React.FC<Props> = ({ order, onPress, printPdf }) => {

    return (
        <TouchableOpacity
            onPress={onPress}
            className='w-full h-[209px] bg-white rounded-lg shadow-sm mt-4 p-4'
        >
            <View style={{ flexDirection: 'column', flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1, alignItems: 'center' }}>
                    <TextTitle4 label={`#${order.orderId}`} />
                    <View className='flex-row space-x-3'>
                        <View className='pt-1'>
                            <TextTitle5Gray label={formatDatewithtime(order.orderDate)} />
                        </View>
                        {
                            order.orderStatus === 4 && (
                                <TouchableOpacity
                                    onPress={printPdf}
                                >
                                    <Ionicons name='share-outline' size={20} color='#B0795A' />
                                </TouchableOpacity>
                            )
                        }
                    </View>
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
                    <TextTitle4 label={formatRupiah(order.totalOrderPrice)} />
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default SellerOrderCard;
