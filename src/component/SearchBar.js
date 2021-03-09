import React from "react";
import { View, StyleSheet, Text, TextInput } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const SearchBar = ({ term, onTermChange, onTermSubmit }) => {
  return (
    <View style={myStyle.backGround}>
      <AntDesign name="search1" style={myStyle.iconStyle} />
      <TextInput
        style={myStyle.inputStyle}
        placeholder="Search please"
        value={term}
        onChangeText={(newTerm) => onTermChange(newTerm)}
        onEndEditing={() => onTermSubmit()}
      ></TextInput>
    </View>
  );
};
const myStyle = StyleSheet.create({
  backGround: {
    backgroundColor: "#fb743e",
    height: 50,
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 50,
    flexDirection: "row",
    // borderWidth: 3,
  },
  iconStyle: {
    fontSize: 35,
    color: "#F0EEEE",
    fontWeight: "bold",
    alignSelf: "center",
    marginHorizontal: 15,
  },
  inputStyle: {
    color: "#F0EEEE",
    // borderWidth: 1,
    flex: 1,
    fontSize: 15,
  },
});

export default SearchBar;
