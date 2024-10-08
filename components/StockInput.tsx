import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface Props {
  form: { stock: number };
  setForm: React.Dispatch<React.SetStateAction<any>>; 
}

const StockInput: React.FC<Props> = ({ form, setForm }) => {

  const handleDecrement = () => {
    if (form.stock > 1) {
      setForm((prev: any) => ({ ...prev, stock: Math.max(1, form.stock - 1) }));
    }
  };

  const handleChangeText = (text: string) => {
    const value = parseInt(text) || 0;
    setForm((prev: any) => ({ ...prev, stock: Math.max(1, value) }));
  };

  return (
    <View style={[styles.container]}>
      <TouchableOpacity
        onPress={() => setForm((prev: any) => ({ ...prev, stock: Math.max(1, form.stock - 1) }))}
        style={styles.roundButton}
      >
        <Text style={styles.buttonText}>-</Text>
      </TouchableOpacity>

      <TextInput
        value={form.stock.toString()}
        onChangeText={(text) => setForm((prev: any) => ({ ...prev, stock: parseInt(text) || 1 }))}
        keyboardType="numeric"
        style={styles.textInput}
      />

      <TouchableOpacity
        onPress={() => setForm((prev: any) => ({ ...prev, stock: form.stock + 1 }))}
        style={styles.roundButton}
      >
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    roundButton: {
      width: 24,
      height: 24,
      borderRadius: 48, 
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'gray',
    },
    buttonText: {
        fontFamily: 'poppinsRegular', 
        fontSize: 14, 
        color: '#000',
        textAlign: 'center',
    },
    textInput: {
      textAlign: 'center',
      marginHorizontal: 8,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 8, 
      width: 40, 
      height: 40, 
    },
  });

export default StockInput;
