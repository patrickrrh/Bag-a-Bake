import React from 'react';
import { View, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  value: string;
  placeholder: string;
  onChange: (text: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, placeholder, onChange }) => {
  return (
    <View
      className="flex-row items-center bg-white rounded-lg shadow-md px-4"
      style={{ height: 46, alignItems: 'center' }}
    >
      <Ionicons name="search" size={20} color="#BDBDBD" />
      <TextInput
        className="ml-2 text-black"
        placeholder={placeholder}
        placeholderTextColor="#828282"
        value={value}
        onChangeText={onChange}
        style={{
          fontFamily: 'poppinsRegular',
          fontSize: 12,
          flex: 1,
          height: '100%',
          paddingVertical: 0,
        }}
      />
    </View>
  );
};

export default SearchBar;
