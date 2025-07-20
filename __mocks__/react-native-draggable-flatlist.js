import React from 'react';
import { View } from 'react-native';

const DraggableFlatList = ({ data = [], ListHeaderComponent, ListEmptyComponent }) => (
  <View>
    {data.length === 0 && ListEmptyComponent && <ListEmptyComponent />}
    {data.length > 0 && ListHeaderComponent && <ListHeaderComponent />}
  </View>
);

export default DraggableFlatList;

