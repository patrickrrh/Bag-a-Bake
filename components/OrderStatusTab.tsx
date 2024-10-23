import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Define the props for the OrderStatusTab
interface OrderStatusTabProps {
  selectedStatus: number;
  onSelectStatus: (status: number) => void;
}

const OrderStatusTab: React.FC<OrderStatusTabProps> = ({ selectedStatus, onSelectStatus }) => {
  const statusLabels: { [key: number]: string } = {
    1: 'Pending',
    2: 'Berlangsung',
    3: 'Selesai',
  };

  const statuses = [1, 2, 3];

  return (
    <View style={styles.container}>
      {statuses.map((status) => (
        <TouchableOpacity 
          key={status} 
          onPress={() => onSelectStatus(status)} 
          style={styles.tab}
        >
          <Text 
            style={[
              styles.tabText, 
              selectedStatus === status && styles.selectedTabText
            ]}
          >
            {statusLabels[status]}
          </Text>
          {selectedStatus === status && (
            <View style={styles.activeTabIndicator} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tab: {
    flex: 1, 
    alignItems: 'center',
    paddingTop: 10,
  },
  tabText: {
    color: '#000000',
    fontSize: 16,
    paddingBottom: 20,
    fontWeight: 'bold',
    opacity: 0.5, 
  },
  selectedTabText: {
    color: '#B0795A',
    fontWeight: 'bold',
    opacity: 1,
  },
  activeTabIndicator: {
    width: '100%',
    height: 5, 
    backgroundColor: '#B0795A',
    borderRadius: 10, 
    marginTop: 4,
  },
});

export default OrderStatusTab;
