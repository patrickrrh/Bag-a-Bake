import OrderStatusTab from '@/components/OrderStatusTab';
import SearchBar from '@/components/SearchBar';
import TextHeader from '@/components/texts/TextHeader'
import TextTitle3 from '@/components/texts/TextTitle3';
import TextTitle5 from '@/components/texts/TextTitle5';
import TextRating from '@/components/texts/TextRating';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacityBase, Animated, ActivityIndicator, Modal, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import TextTitle4 from '@/components/texts/TextTitle4';
import OrderCard from '@/components/OrderCard';
import TextTitle5Date from '@/components/texts/TextTitle5Date';
import orderCustomerApi from '@/api/orderCustomerApi';
import { router } from 'expo-router';
import { OrderType } from '@/types/types';
import OrderCardWithRating from '@/components/OrderCardWithRating';
import { FontAwesome } from '@expo/vector-icons';
import { AirbnbRating, Rating } from 'react-native-ratings';
import TextAreaField from '@/components/TextAreaField';
import CustomButton from '@/components/CustomButton';
import ErrorMessage from '@/components/texts/ErrorMessage';
import ratingApi from '@/api/ratingApi';
import RatingInput from '@/components/RatingInput';

type RatingErrorState = {
  rating: string | null;
}

const Order = () => {
  const [selectedStatus, setSelectedStatus] = useState(0);
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [ratingOrderId, setRatingOrderId] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [ratingModal, setRatingModal] = useState(false);

  const emptyRatingForm = {
    rating: 0,
    review: ''
  }
  const [ratingForm, setRatingForm] = useState(emptyRatingForm);

  const emptyRatingError = {
    rating: null,
  }
  const [ratingError, setRatingError] = useState<RatingErrorState>(emptyRatingError);

  const insets = useSafeAreaInsets();

  const handleSelectStatus = (status: number) => {
    setOrders([]);
    setSelectedStatus(status);
  };

  const handleGetOrderByStatusApi = async () => {
    setIsLoading(true);
    try {
      const response = await orderCustomerApi().getOrderByStatus({ orderStatus: selectedStatus });
      if (response.status === 200) {
        setOrders(response.data ? response.data : []);
      }
    } catch (error) {
      console.error(error);
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  useEffect(() => {
    handleGetOrderByStatusApi();
  }, [selectedStatus]);

  console.log("Orders", JSON.stringify(orders, null, 2))

  const handleSubmitRatingApi = async () => {
    try {
      if (ratingForm.rating === 0) {
        setRatingError((prevError) => ({ ...prevError, rating: 'Rating harus diisi' }));
        return;
      }

      const response = await ratingApi().createRating({
        ...ratingForm,
        orderId: ratingOrderId
      })

      if (response.status === 201) {
        setRatingModal(false);
        setRatingOrderId(0);
        setRatingError(emptyRatingError);
        setRatingForm(emptyRatingForm);
        handleGetOrderByStatusApi();
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <View className='flex-1'>
      <View
        style={{
          backgroundColor: 'white',
          height: insets.top
        }}
      />

      <View className='bg-background h-full flex-1'>
        <View className='bg-white'>
          <View className='mx-5'>
            <TextHeader label="PESANAN" />
            <View className='mt-6'>
              <OrderStatusTab
                selectedStatus={selectedStatus || 0}
                onSelectStatus={handleSelectStatus}
              />
            </View>
          </View>
        </View>

        <View className='flex-1 mx-5'>
          {
            isLoading ? (
              <View className='flex-1 items-center justify-center'>
                <ActivityIndicator size="small" color="#828282" />
              </View>
            ) : (
              <FlatList
                data={orders}
                renderItem={({ item }) => (
                  (item.orderStatus === 3 && item.isRated === false) ? (
                    <OrderCardWithRating
                      item={item}
                      onPress={() => {
                        router.push({
                          pathname: '/order/orderDetail',
                          params: { order: JSON.stringify(item.bakeryId) }
                        })
                      }}
                      onPressRating={() => {
                        setRatingModal(true)
                        setRatingOrderId(item.orderId)
                      }}
                    />
                  ) : (
                    <OrderCard
                      item={item}
                      onPress={() => {
                        router.push({
                          pathname: '/order/orderDetail',
                          params: { order: JSON.stringify(item) }
                        })
                      }}
                    />
                  )
                )}
                keyExtractor={(item) => item.orderId.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
              />
            )
          }
        </View>
      </View>

      <Modal
        visible={ratingModal}
        onRequestClose={() => setRatingModal(false)}
        animationType='fade'
        presentationStyle='overFullScreen'
        transparent
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' }}>
              <View style={{
                height: '50%',
                backgroundColor: '#FEFAF9',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                padding: 20,
                width: '100%',
              }}>
                <View className='items-end'>
                  <TouchableOpacity
                    onPress={() => {
                      setRatingModal(false);
                      setRatingOrderId(0);
                      setRatingError(emptyRatingError);
                      setRatingForm(emptyRatingForm);
                    }}>
                    <FontAwesome name="close" size={18} color="#B0795A" />
                  </TouchableOpacity>
                </View>
                <View className='items-center mt-2'>
                  <RatingInput
                    rating={ratingForm.rating}
                    onRatingChange={(rating) => {
                      setRatingForm((prevForm) => ({ ...prevForm, rating: rating }));
                      setRatingError((prevError) => ({ ...prevError, rating: null }));
                    }}
                  />
                  {ratingError.rating && <ErrorMessage label={ratingError.rating} />}
                </View>
                <TextAreaField
                  label='Berikan ulasan Anda'
                  value={ratingForm.review}
                  onChangeText={(text) => {
                    setRatingForm((prevForm) => ({ ...prevForm, review: text }));
                  }}
                  keyboardType='default'
                  moreStyles='mt-7'
                />
                <CustomButton
                  label='Kirim'
                  handlePress={() => {
                    handleSubmitRatingApi();
                  }}
                  buttonStyles='mt-7'
                  isLoading={isLoading}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    </View>

  )
}

export default Order