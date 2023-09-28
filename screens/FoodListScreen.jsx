import { View, Text, StyleSheet } from "react-native";
import React from "react";

function FoodListScreen({ route }) {
  const { foodData } = route.params;
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 18 }}>{JSON.stringify(foodData, null, 5)}</Text>
    </View>
  );
}

export default FoodListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 20,
    paddingLeft: 20,
  },
});
