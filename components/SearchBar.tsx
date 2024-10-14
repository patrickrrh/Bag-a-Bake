import React from 'react';
import { View, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // or any icon library

// Define the props with TypeScript
interface SearchBarProps {
  value: string;
  placeholder: string;
  onChange: (text: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, placeholder, onChange }) => {
  return (
    <View
      className="flex-row items-center bg-white rounded-lg shadow-md px-4 py-2"
      // style={{ elevation: 3, borderRadius: 2 }}
    >
      <Ionicons name="search" size={20} color="#BDBDBD" />
      <TextInput
        className='ml-2 flex-1 text-black text-base'
        placeholder={placeholder}
        placeholderTextColor="#828282"
        value={value}
        onChangeText={onChange}
        style={{ fontFamily: "poppinsRegular", fontSize: 12 }}
      />
    </View>
  );
};

export default SearchBar;
