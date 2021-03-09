import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ResultDetail = ({ result }) => {
  // function draw star
  const drawRating_star = (star, cssStar) => {
    var starArr = [];
    var count = 0;

    for (let index = 0; index < 5; index++) {
      count++;
      if (count <= 5 - Math.ceil(5 % star)) {
        starArr.push(<Ionicons name="star" style={cssStar} />);
      } else if (
        count == 5 - Math.ceil(5 % star) + 1 &&
        !Number.isInteger(star)
      ) {
        starArr.push(<Ionicons name="star-half-outline" style={cssStar} />);
      } else {
        starArr.push(<Ionicons name="star-outline" style={cssStar} />);
      }
    }
    return starArr;
  };

  return (
    <View style={myStyle.viewDetail}>
      <Image style={myStyle.picture} source={{ uri: result.image_url }} />
      <View
        style={{
          display: "flex",
          flexWrap: "wrap",
          width: 200,
          flexDirection: "row",
        }}
      >
        <Text style={myStyle.nameFood}>{result.name}</Text>
      </View>
      <View style={myStyle.dataDetail}>
        <View style={myStyle.dataDetailLeft}>
          <Text>
            {result.rating}/ {drawRating_star(result.rating, myStyle.iconStar)}
          </Text>
        </View>
        <View style={myStyle.dataDetailRight}>
          <Text>
            {" "}
            <Ionicons
              name="eye-outline"
              style={{ fontSize: 15, color: "#000" }}
            />
            &nbsp;{result.review_count}
          </Text>
        </View>
      </View>
    </View>
  );
};

const myStyle = StyleSheet.create({
  viewDetail: {
    marginRight: 10,
  },
  picture: {
    width: 200,
    height: 150,
    borderRadius: 5,
    fontWeight: "bold",
  },
  nameFood: {
    fontSize: 15,
    fontWeight: "bold",
    paddingVertical: 4,
  },
  dataDetail: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dataDetailLeft: {
    display: "flex",
    flexDirection: "row",
    // flex: 0.5,
  },
  dataDetailRight: {
    paddingRight: 10,
    backgroundColor: "#fc81506b",
    borderRadius: 6,
    // flex: 0.5,
  },
  iconStar: {
    fontSize: 15,
    color: "#000",
  },
});

export default ResultDetail;
