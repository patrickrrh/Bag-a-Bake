import { TouchableOpacity, Text, View, Image } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

interface Props {
    handlePress: () => void;
    buttonStyles?: object;
    proofOfPayment: string;
    isDisabled?: boolean
}

const UploadPayment: React.FC<Props> = ({ handlePress, buttonStyles, proofOfPayment, isDisabled }) => {

    return (
        <TouchableOpacity
            onPress={handlePress}
            disabled={isDisabled}
            activeOpacity={0.7}
            style={[
                {
                    backgroundColor: 'transparent',
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: '#828282',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 240,
                },
                buttonStyles,
            ]}
        >
            {
                proofOfPayment !== '' ? (
                    <Image
                        source={ isDisabled ? { uri: `${process.env.EXPO_PUBLIC_LOCAL_SERVER}/images/proof-of-payment/${proofOfPayment}` } : { uri: proofOfPayment } }
                        style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: 8,
                            aspectRatio: 9 / 16,
                            resizeMode: 'cover',
                        }}
                    />
                ) : (
                    <View style={{ alignItems: 'center', gap: 8, paddingHorizontal: 16 }}>
                        <Ionicons name="cloud-upload-outline" size={20} color="#828282" />
                        <Text
                            style={{
                                fontFamily: 'poppinsSemiBold',
                                fontSize: 8,
                                color: '#828282',
                            }}
                        >
                            Unggah Bukti Pembayaran
                        </Text>
                    </View>
                )
            }
        </TouchableOpacity>
    );
};

export default UploadPayment;
