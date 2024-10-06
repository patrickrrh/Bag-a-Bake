import { View, TextInput, TouchableOpacity, Image, Text } from 'react-native'
import React, { useState } from 'react'
import TextFormLabel from './texts/TextFormLabel'
import { images } from '@/constants/images'
import ErrorMessage from './texts/ErrorMessage';

interface Props {
  label: string;
  value: string;
  onPress: () => void;
  moreStyles?: string;
  error?: string | null;
}

const TimeField: React.FC<Props> = ({ label, value, onPress, moreStyles, error }) => {

  return (
    <View className={`space-y-1 ${moreStyles}`}>
      <TextFormLabel label={label} />
      <View className={`w-full h-[40px] px-4 bg-white rounded-[8px] items-center border ${error ? 'border-red-500' : 'border-gray-200'} focus:border-primary flex-row`}>
        <TouchableOpacity
          onPress={onPress}
          style={{ flex: 1, height: '100%', justifyContent: 'center' }}
        >
          <Text style={{ backgroundColor: 'transparent' }}>
            {value ? (
              value
            ) : (
              <Text className='text-gray-400'>
                Pilih Waktu
              </Text>
            )}
          </Text>
        </TouchableOpacity>
      </View>

      {error && (
        <ErrorMessage label={error} />
      )}
    </View>
  )
}

export default TimeField