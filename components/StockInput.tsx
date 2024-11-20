import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface Props {
  value: number;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

const StockInput: React.FC<Props> = ({ value, onChangeText, placeholder }) => {
  
  const handleDecrement = () => {
    if (value > 0) {
      onChangeText((Math.max(0, value - 1)).toString());
    }
  };

  const handleIncrement = () => {
    if (value < 100) {
      onChangeText((value + 1).toString());
    }
  };

  const handleChangeText = (text: string) => {
    const numberValue = parseInt(text) || 0;
    const clampedValue = Math.min(Math.max(numberValue, 1), 100); 
    onChangeText(clampedValue.toString());
  };

  return (
    <View style={[styles.container]}>
      <TouchableOpacity
        onPress={handleDecrement}
        style={styles.roundButton}
      >
        <Text style={styles.buttonText}>-</Text>
      </TouchableOpacity>

      <TextInput
        value={value.toString()}
        onChangeText={handleChangeText}
        keyboardType="numeric"
        style={styles.textInput}
        placeholder={placeholder}
      />

      <TouchableOpacity
        onPress={handleIncrement}
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
    justifyContent: 'center',
  },
  roundButton: {
    width: 24,
    height: 24,
    borderRadius: 48, 
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#fff'
  },
  buttonText: {
    fontFamily: 'poppinsRegular', 
    fontSize: 14, 
    color: '#000',
    textAlign: 'center',
  },
  textInput: {
    textAlign: 'center',
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8, 
    width: 40, 
    height: 40, 
    color: '#000',
    backgroundColor: '#fff',
  },
});

export default StockInput;
