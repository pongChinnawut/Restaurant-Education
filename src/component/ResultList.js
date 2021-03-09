import React from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  TouchableHighlight,
} from "react-native";
import ResultDetail from "./ResultsDetail";
import { useNavigation } from "@react-navigation/native";
// withNavigation not working in Navigation Expo 5
// import { withNavigation } from "react-navigation";

const ResultList = ({ title, results }) => {
  const navigation = useNavigation();
  return (
    <View style={myStyle.ViewList}>
      {/* <TouchableOpacity
        onPress={() => {
          navigation.navigate("ResulstShow");
        }}
      >
        <Text>555</Text>
      </TouchableOpacity> */}
      <Text style={myStyle.textTitle}>
        {title} [{results.length}]
      </Text>
      <FlatList
        horizontal={true}
        data={results}
        keyExtractor={(result) => result.id}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Yelp Restaurant", { id: item.id });
              }}
            >
              <ResultDetail result={item} />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};
const myStyle = StyleSheet.create({
  ViewList: {
    marginBottom: 10,
    marginLeft: 5,
    marginRight: 5,
    borderBottomWidth: 2,
    borderColor: "red",
    paddingBottom: 6,
    // border: `2px solid #000`,
  },
  textTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    marginBottom: 5,
  },
});
export default ResultList;
