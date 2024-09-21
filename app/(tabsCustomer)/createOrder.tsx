import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

const ProductDetail = () => {
  // Mock product data for development and testing
  const product = {
    idProduk: 1,
    namaProduk: 'Roti Unyil',
    harga: 5000,
    stok: 10,
    gambarProduk: 'https://example.com/roti-unyil.jpg',
    // Add other necessary product fields if needed
  };

  const [quantity, setQuantity] = useState(1);

  const handleAddQuantity = () => setQuantity((prev) => prev + 1);
  const handleReduceQuantity = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const createOrder = () => {
    const order = {
      productId: product.idProduk,
      productName: product.namaProduk,
      quantity,
      pricePerUnit: product.harga,
      totalPrice: quantity * product.harga,
    };
    alert(`Order placed for ${order.quantity} x ${order.productName}, total: Rp ${order.totalPrice}`);
  };

  return (
    <View style={{ padding: 20 }}>
      <Image
        source={{ uri: product.gambarProduk }}
        style={{ width: '100%', height: 200, borderRadius: 10 }}
      />
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 10 }}>
        {product.namaProduk}
      </Text>
      <Text style={{ color: '#888', marginVertical: 5 }}>{product.stok} tersisa</Text>
      <Text style={{ fontSize: 16, color: '#555', marginVertical: 10 }}>
        Product Description here.
      </Text>

      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Rp {product.harga}</Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
        <TouchableOpacity onPress={handleReduceQuantity} style={{ padding: 10, backgroundColor: '#ccc', borderRadius: 5 }}>
          <Text>-</Text>
        </TouchableOpacity>
        <Text style={{ marginHorizontal: 20 }}>{quantity}</Text>
        <TouchableOpacity onPress={handleAddQuantity} style={{ padding: 10, backgroundColor: '#ccc', borderRadius: 5 }}>
          <Text>+</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={createOrder}
        style={{ backgroundColor: '#f09', padding: 15, marginTop: 20, borderRadius: 5 }}
      >
        <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>
          Tambahkan Pesanan • Rp {quantity * product.harga}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProductDetail;
