import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import React from 'react';
import TextTitle5 from './texts/TextTitle5';
import UploadButton from './UploadButton';
import CustomDropdown from './CustomDropdown';

interface Props {
    selectedMethods: string[];
    selectMethod: (methods: string) => void;
    selectDropdown: (value: string, method: string) => void;
    onChangeText: (method: string, value: string) => void;
    pickImage: () => void;
    form: any;
    paymentMethods: any[];
}

const PaymentInput: React.FC<Props> = ({ selectedMethods, selectMethod, pickImage, form, paymentMethods, selectDropdown, onChangeText }) => {

    const formattedPaymentServices = paymentMethods.map(item => ({
        ...item,
        serviceOptions: item.serviceOptions?.map((option: any) => ({
            label: option,
            value: option
        }))
    }));

    console.log("form on payment input", JSON.stringify(form, null, 2));


    return (
        <View>
            {paymentMethods.map((item, index) => (
                <TouchableOpacity
                    key={index}
                    onPress={() => selectMethod(item.method)}
                    className={`p-4 mb-2 bg-white rounded-lg border ${selectedMethods.includes(item.method) ? 'border-brown' : 'border-gray-300'}`}
                >
                    <View className='flex-row items-center'>
                        <View className={`w-6 h-6 mr-3 border-2 rounded-full ${selectedMethods.includes(item.method) ? 'border-brown' : 'border-gray-400'} justify-center items-center`}>
                            <View className={`w-3 h-3 ${selectedMethods.includes(item.method) ? 'bg-brown' : 'bg-gray-400'} rounded-full`} />
                        </View>
                        <TextTitle5 label={item.method} />
                    </View>

                    {item.method === 'QRIS' && selectedMethods.includes('QRIS') && (
                        <View className="mt-4 w-full flex-row space-x-4">
                            <UploadButton label="Unggah QRIS" handlePress={pickImage} />
                            {(() => {
                                const qrisPayment = form.find((service: { paymentMethod: string; }) => service.paymentMethod === 'QRIS');
                                if (qrisPayment?.paymentDetail) {
                                    return (
                                        <View className="w-32 h-32">
                                            <Image
                                                source={{ uri: qrisPayment.paymentDetail }}
                                                className="w-full h-full rounded-md"
                                            />
                                        </View>
                                    );
                                }
                                return null;
                            })()}
                        </View>
                    )}


                    {item.method !== 'QRIS' && selectedMethods.includes(item.method) && (
                        <View className='flex-row w-full items-end'>
                            <View className='w-2/5'>
                                <CustomDropdown
                                    label=''
                                    data={formattedPaymentServices.find((service) => service.method === item.method)?.serviceOptions || []}
                                    value={form.find((service: { paymentMethod: any; }) => service.paymentMethod === item.method)?.paymentService || ''}
                                    placeholder='Pilih'
                                    labelField='label'
                                    valueField='value'
                                    onChange={(service) => selectDropdown(item.method, service)}
                                />
                            </View>
                            <View className='flex-1 ml-4 mb-2'>
                                <TextInput
                                    value={form.find((service: { paymentMethod: any; }) => service.paymentMethod === item.method)?.paymentDetail || ''}
                                    onChangeText={(text) => onChangeText(item.method, text)}
                                    placeholder={
                                        item.method === 'Transfer Bank'
                                            ? 'No. Rekening'
                                            : 'No. Virtual Account'
                                    }
                                    placeholderTextColor="#B0B0B0"
                                    style={{
                                        borderBottomWidth: 1,
                                        borderBottomColor: '#B0B0B0',
                                        paddingVertical: 8,
                                        paddingHorizontal: 0,
                                    }}
                                />
                            </View>
                        </View>
                    )}
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default PaymentInput;
