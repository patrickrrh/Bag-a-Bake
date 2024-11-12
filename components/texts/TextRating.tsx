import { View, Text } from 'react-native'
import React from 'react'
import { FontAwesome } from '@expo/vector-icons'
import TextTitle5 from './TextTitle5';

interface Props {
  rating: string;
  reviewCount: string;
  containerStyle?: string
}

const TextRating: React.FC<Props> = ({ rating, reviewCount, containerStyle }) => {
  return (
    <View className={`flex-row items-center ${containerStyle}`}>
      <FontAwesome name="star" size={12} color="#FA6F33" />
      <TextTitle5 label={rating} color='#FA6F33' containerStyle={{ marginLeft: 3, marginRight: 5 }} />
      <TextTitle5 label={`(${reviewCount} ulasan)`} />
    </View>
  )
}

export default TextRating