import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import TextTitle5 from '@/components/texts/TextTitle5';
import TextRating from '@/components/texts/TextRating';
import TextTitle4 from './texts/TextTitle4';
import CustomTag from './CustomTag';
import TextBeforePrice from './texts/TextBeforePrice';
import TextAfterPrice from './texts/TextAfterPrice';
import TextDiscount from './texts/TextDiscount';
import { formatRupiah } from '@/utils/commonFunctions';

interface Props {
    product: any;
    onPress: () => void;
}

const ProductCard: React.FC<Props> = ({ product, onPress }) => {

    return (
        <TouchableOpacity
            onPress={onPress}
            className='bg-white rounded-lg shadow-sm mr-4 mb-1'
        >
            <View className='p-4'>
                <View style={{ position: 'relative' }}>
                    <Image
                        source={require('../assets/images/bakery.png')}
                        style={{ width: '100%', height: 134, borderRadius: 8, marginBottom: 10 }}
                        resizeMode="cover"
                    />
                    <View style={{ position: 'absolute', top: 10, right: 10 }}>
                        <CustomTag count={product.productStock} />
                    </View>
                </View>
                <View className='flex-row justify-between items-center w-full'>
                    <TextTitle4 label={product.productName} />
                </View>
                <TextTitle5 label={product.bakery.bakeryName} />
                <View className='mt-2'>
                    <View className='flex-row'>
                        <View className='mr-2'>
                            <TextBeforePrice label={formatRupiah(product.productPrice)} />
                        </View>
                        <TextDiscount label={product.discountPercentage} />
                    </View>
                    <TextAfterPrice label={formatRupiah(product.todayPrice)} />
                </View>
            </View>
        </TouchableOpacity>
    );
};


export default ProductCard;