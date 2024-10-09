import { View, TouchableOpacity, Image, Text } from 'react-native';
import React, { useState } from 'react';
import TextFormLabel from './texts/TextFormLabel';
import DatePicker from '@react-native-community/datetimepicker';
import ErrorMessage from './texts/ErrorMessage';

interface Props {
  label: string;
  expirationDate: string | null;
  onConfirm: (date: Date) => void;
  error?: string | null;
}

const ExpirationDatePicker: React.FC<Props> = ({ label, expirationDate, onConfirm, error }) => {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleConfirm = (date: Date) => {
    setSelectedDate(date);
    onConfirm(date);
  };

  return (
    <View className="space-y-1 mt-7">
      <TextFormLabel label={label} />
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: 'white',
          borderColor: expirationDate ? '#ccc' : '#d1d5db',
          borderWidth: 1,
          borderRadius: 8,
          paddingVertical: 10,
          paddingHorizontal: 16,
          height: 40,
        }}
        onPress={() => setOpen(true)}
      >
        {/* Date Icon */}
        <Image
          source={require('@/assets/images/dateIcon.png')}
          style={{ width: 24, height: 24, marginRight: 16 }}
        />
        {/* Date Field */}
        <Text
          className="flex-1 text-black text-base"
          style={{
            flex: 1,
            color: expirationDate ? '#000' : '#828282',
            fontFamily: 'poppinsRegular',
            fontSize: 14,
          }}
        >
          {expirationDate || 'Pilih Tanggal Kedaluwarsa'}
        </Text>
      </TouchableOpacity>

      {/* DatePicker */}
      {open && (
        <DatePicker
          value={selectedDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, date) => {
            if (date) {
              handleConfirm(date);
            }
            setOpen(false);
          }}
          minimumDate={new Date()}
        />
      )}

      {/* Error Message */}
      {error && <ErrorMessage label={error} />}
    </View>
  );
};

export default ExpirationDatePicker;
