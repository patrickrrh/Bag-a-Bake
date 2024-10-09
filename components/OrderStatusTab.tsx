import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Define the props for the OrderStatusTab
interface OrderStatusTabProps {
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
}

const OrderStatusTab: React.FC<OrderStatusTabProps> = ({ selectedStatus, onSelectStatus }) => {
  const statuses = ['Pending', 'Berlangsung', 'Selesai'];

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
            {status}
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
    flex: 1, // Take up equal space for each tab
    alignItems: 'center',
    paddingTop: 10, // Add padding between text and the border
  },
  tabText: {
    color: '#000000',
    fontSize: 16,
    paddingBottom: 20,
    fontWeight: 'bold',
    opacity: 0.5, // Add padding at the bottom of the text
  },
  selectedTabText: {
    color: '#B0795A',
    fontWeight: 'bold',
    opacity: 1,
  },
  activeTabIndicator: {
    width: '100%', // Take full width of the tab
    height: 5, // Set height to 5
    backgroundColor: '#B0795A',
    borderRadius: 10, // Set corner radius to 10
    marginTop: 4, // Space between text and underline
  },
});

export default OrderStatusTab;
