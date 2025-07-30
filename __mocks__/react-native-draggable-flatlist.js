import React from 'react';
import { View } from 'react-native';

const DraggableFlatList = ({ data = [], ListHeaderComponent, ListEmptyComponent }) => (
  <View>
    {ListHeaderComponent && <ListHeaderComponent />}
    {data.length === 0 && ListEmptyComponent && <ListEmptyComponent />}
  </View>
);

export default DraggableFlatList;

