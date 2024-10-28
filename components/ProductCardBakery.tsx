import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import TextTitle5 from '@/components/texts/TextTitle5';
import TextRating from '@/components/texts/TextRating';
import TextTitle4 from './texts/TextTitle4';
import CustomTag from './CustomTag';
import TextBeforePrice from './texts/TextBeforePrice';
import TextAfterPrice from './texts/TextAfterPrice';
import TextDiscount from './texts/TextDiscount';

interface Props {
    product: any;
    onPress: () => void;
}

const ProductCardBakery: React.FC<Props> = ({ product, onPress }) => {

    console.log("product", product)

    return (
        <TouchableOpacity
            onPress={onPress}
            className='w-[162px] h-[248px] bg-white rounded-lg shadow-sm mr-4 mb-1'
        >
            <View className='p-4'>
                <Image
                    source={require('../assets/images/bakery.png')}
                    style={{ width: '100%', height: 134, borderRadius: 8, marginBottom: 10 }}
                    resizeMode="cover"
                />
                <View className='flex-row justify-between w-full'>
                    <TextTitle4 label={product.productName} />
                    <CustomTag count={product.productStock} />
                </View>
                <TextTitle5 label={product.bakeryName} />
                <View className='mt-2'>
                    <View className='flex-row mb-1'>
                        <View className='mr-2'>
                            <TextBeforePrice label={product.productPrice} />
                        </View>
                        <TextDiscount label={"10"} />
                    </View>
                    <TextAfterPrice label={product.productPrice} />
                </View>
            </View>
        </TouchableOpacity>
    );
};


export default ProductCardBakery;