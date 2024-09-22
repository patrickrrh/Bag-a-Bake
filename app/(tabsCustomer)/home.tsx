import React from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


interface Product {
  idProduk: number;
  namaProduk: string;
  harga: number;
  stok: number;
  gambarProduk: string;
  ulasan: number;
  rating: number;
}

// Dummy product data (you'll probably get this from an API or your state management)
const products: Product[] = [
  {
    idProduk: 1,
    namaProduk: 'Roti Unyil',
    harga: 5000,
    stok: 2,
    gambarProduk: 'https://example.com/roti-unyil.jpg',
    ulasan: 20,
    rating: 4.2,
  },
  {
    idProduk: 2,
    namaProduk: 'Roti Coklat',
    harga: 8000,
    stok: 2,
    gambarProduk: 'https://example.com/roti-coklat.jpg',
    ulasan: 13,
    rating: 4.1,
  },
];

const HomePage: React.FC = () => {
  const navigation = useNavigation();

  // Function to handle card click and navigate to ProductDetail page
  const handleProductClick = (product: Product) => {
    navigation.navigate('ProductDetail', { product } as { product: Product }); // Pass the product as a parameter
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rekomendasi untuk Anda</Text>

      <FlatList
        data={products}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleProductClick(item)} // On card press, navigate to ProductDetail
          >
            <Image
              source={{ uri: item.gambarProduk }}
              style={styles.productImage}
            />
            <View style={styles.cardContent}>
              <Text style={styles.productName}>{item.namaProduk}</Text>
              <Text style={styles.productStock}>{item.stok} tersisa</Text>
              <Text style={styles.productRating}>
                ★ {item.rating} ({item.ulasan} ulasan)
              </Text>
              <Text style={styles.productPrice}>IDR {item.harga}/pcs</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.idProduk.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  card: {
    margin: 10,
    width: 150,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
  },
  productImage: {
    width: '100%',
    height: 100,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardContent: {
    padding: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  productStock: {
    color: '#888',
  },
  productRating: {
    fontSize: 12,
  },
  productPrice: {
    fontWeight: 'bold',
    marginTop: 5,
  },
});

export default HomePage;
