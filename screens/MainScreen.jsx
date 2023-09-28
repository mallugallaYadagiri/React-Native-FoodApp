import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  ToastAndroid,
} from "react-native";
import React, { useState } from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import DraggableFlatList from "react-native-draggable-flatlist";

function MainScreen({ navigation }) {
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [error, setError] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const renderItem = ({ item, drag, isActive }) => {
    return (
      <TouchableOpacity style={styles.itemContainer} onLongPress={drag}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",

            fontSize: 30,
          }}
        >
          <Icon name="drag-indicator" size={30} />
          <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: "bold" }}>
            {item.name}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-around",
            marginLeft: 50,
          }}
        >
          <Text
            style={{
              marginLeft: 10,
              fontSize: 16,
            }}
          >
            Price:{" "}
          </Text>
          <Text
            style={{
              marginLeft: 1,
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            $ {item.price}
          </Text>
        </View>
        <View style={styles.iconContainer}>
          <Icon name="edit" size={30} onPress={() => handleItemEdit(item)} />
          <Icon
            name="delete"
            size={30}
            onPress={() => {
              handleItemDelete(item);
            }}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const toggleModal = () => {
    setIsEditing(false);
    setSelectedItem(null);
    setItemName("");
    setItemPrice("");
    setError("");
    setIsModalVisible(!isModalVisible);
  };

  const handleItemEdit = (item) => {
    setSelectedItem(item);
    setItemName(item.name);
    setItemPrice(item.price);
    setIsEditing(true);
    setIsModalVisible(true);
  };

  const handleAddItem = () => {
    if (itemName.trim() !== "" && itemPrice.trim() !== "") {
      if (isEditing && selectedItem) {
        const updatedItem = {
          ...selectedItem,
          name: itemName,
          price: itemPrice,
        };

        const updatedData = data.map((item) =>
          item === selectedItem ? updatedItem : item
        );
        setData(updatedData);
        ToastAndroid.showWithGravity(
          "Item updated successfully",
          ToastAndroid.SHORT,
          ToastAndroid.TOP
        );
      } else {
        const newitem = {
          name: itemName,
          price: itemPrice,
        };
        setData([...data, newitem]);

        ToastAndroid.showWithGravity(
          "Item added successfully",
          ToastAndroid.SHORT,
          ToastAndroid.TOP
        );
      }
      toggleModal();
    } else {
      setError("Required field");
    }
  };

  const handleItemDelete = (item) => {
    const updatedData = data.filter((i) => i !== item);
    setData(updatedData);
  };

  return (
    <View style={styles.container}>
      <View>
        <DraggableFlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.name}
          onDragEnd={({ data }) => setData(data)}
        />
        <View style={styles.dashedLine} />

        <TouchableOpacity
          style={styles.addFoodItem}
          onPress={() => toggleModal()}
        >
          <Icon name="add" size={25} />
          <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: "bold" }}>
            Add Food Items
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate("FoodList", { foodData: data })}
        style={styles.button}
      >
        <Text style={styles.buttonTxt}>Go to Final Food List</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          toggleModal();
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                {isEditing ? "Update Food Item" : "Add Food Item"}
              </Text>
              <Icon name="close" size={25} onPress={() => toggleModal()} />
            </View>
            <TextInput
              placeholder="Item Name"
              style={styles.input}
              onChangeText={(text) => setItemName(text)}
              value={itemName}
            />
            {error && <Text style={styles.errorMsg}>{error}</Text>}
            <TextInput
              placeholder="Item Price"
              style={styles.input}
              onChangeText={(text) => setItemPrice(text)}
              value={itemPrice}
            />
            {error && <Text style={styles.errorMsg}>{error}</Text>}

            <View style={styles.modalButtonContainer}>
              <Pressable
                onPress={handleAddItem}
                style={[styles.modalButtons, { backgroundColor: "green" }]}
              >
                <Text style={styles.modalButtonText}>
                  {isEditing ? "Update Food Item" : "Add Food Item"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  itemContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "green",
    padding: 5,
    marginTop: 10,
    marginHorizontal: 10,
    fontSize: 30,
    borderRadius: 5,
    backgroundColor: "#A2CDB0",
  },
  iconContainer: {
    width: "20%",
    display: "flex",
    flexDirection: "row",
    borderLeftWidth: 2,
    borderColor: "gray",
    marginLeft: 10,
    paddingLeft: 10,
  },
  button: {
    backgroundColor: "green",
    width: "80%",
    height: "6%",
    color: "white",
    padding: 6,
    borderRadius: 5,
    margin: 10,
    marginBottom: 40,
    alignSelf: "center",
  },
  buttonTxt: {
    fontSize: 20,
    textAlign: "center",
    color: "#fff",
  },
  addFoodItem: {
    flexDirection: "row",
    borderRadius: 5,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "green",
    padding: 10,
    marginHorizontal: 10,
    marginVertical: 10,
    backgroundColor: "#98EECC",
  },
  dashedLine: {
    borderWidth: 2,
    borderColor: "gray",
    borderStyle: "dashed",
    marginHorizontal: 15,
    marginVertical: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "gray",
    fontSize: 18,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },

  modalButtons: {
    width: "80%",
    borderRadius: 5,
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  errorMsg: {
    color: "red",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 5,
  },
});
