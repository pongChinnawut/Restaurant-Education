import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import yelp from "../api/yelp";
import ResultList from "../component/ResultList";
import SearchBar from "../component/SearchBar";
import useResults from "../hook/useResults";
import { Divider } from "react-native-elements";

const SearchScreen = ({ navigation }) => {
  const [term, setterm] = useState("");
  const [searchApi, results, errMessage] = useResults();

  const filterResultsByPrice = (priceRate) => {
    return results.filter((res) => res.price === priceRate);
  };

  return (
    <View style={myStyle.viewContainer}>
      <SearchBar
        term={term}
        onTermChange={(newTerm) => setterm(newTerm)}
        onTermSubmit={() => searchApi(term)}
      />
      <Text style={{ color: "red" }}>{errMessage}</Text>
      <Text
        style={{
          fontSize: 16,
          marginLeft: 20,
          fontWeight: "bold",
          marginBottom: 10,
        }}
      >
        - results found ({results.length}) -
      </Text>

      <Divider style={{ backgroundColor: "#fb743e" }} />
      <ScrollView>
        <ResultList title="low-priced" results={filterResultsByPrice("$")} />
        <ResultList
          // navigation={navigation}
          title="Reasonable-priced"
          results={filterResultsByPrice("$$")}
        />
        <ResultList
          // navigation={navigation}
          title="Reasonable-priced"
          results={filterResultsByPrice("$$")}
        />
        <ResultList title="High-priced" results={filterResultsByPrice("$$$")} />
        <ResultList
          // navigation={navigation}
          title="ultra-priced"
          results={filterResultsByPrice("$$$$")}
        />
      </ScrollView>
    </View>
  );
};
const myStyle = StyleSheet.create({
  viewContainer: {
    flex: 1,
    padding: 3,
    // backgroundColor: "red",
    // height: 800,
  },
});

export default SearchScreen;
