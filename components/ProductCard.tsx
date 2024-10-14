import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import TextTitle5 from '@/components/texts/TextTitle5';
import TextRating from '@/components/texts/TextRating';

interface Product {
    id: number;
    name: string;
    image: string;
    rating: number;
    reviews: number;
    price: number;
    currency: string;
}

const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
    <TouchableOpacity 
        style={{
            backgroundColor: 'white',
            borderRadius: 8,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 5,
            marginBottom: 15,
            padding: 10,
            width: '48%', // Ensure it takes half of the screen in grid layout
        }}
    >
        <Image
            source={require('../assets/images/produk1.png')}
            style={{ width: '100%', height: 134, borderRadius: 8, marginBottom: 10 }}
            resizeMode="cover"
        />
        <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 5 }}>{product.name}</Text>
        <Text style={{ color: '#8B4513', fontWeight: 'bold' }}>
            {product.currency} {product.price.toLocaleString()}
        </Text>
    </TouchableOpacity>
);


export default ProductCard;