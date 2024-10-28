import React from 'react';
import { TouchableOpacity, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';

interface Props {
  label: string;
  handlePress: () => void;
  buttonStyles?: StyleProp<ViewStyle>;
}

const SquareButton: React.FC<Props> = ({ label, handlePress, buttonStyles }) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={[styles.squareButton, buttonStyles]}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
};

export default SquareButton;

const styles = StyleSheet.create({
  squareButton: {
    width: 74, 
    height: 30,
    borderRadius: 30, 
    borderWidth: 2,
    borderColor: '#B0795A', 
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
    marginRight: 4
  },
  buttonText: {
    fontFamily: "poppins", 
    fontSize: 18, 
    fontWeight: "bold",
    color: '#B0795A'
  },
});
