import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from "react-native";
import API_getRaurant from "../api/yelp";
import { Ionicons } from "@expo/vector-icons";
import { Dimensions, Linking } from "react-native";
import MapView from "react-native-maps";
import { Divider } from "react-native-elements";
import { ListItem } from "react-native-elements";

var width = Dimensions.get("window").width; //full width
var height = Dimensions.get("window").height; //full height

export default function ResultShowScreen({ route, navigation }) {
  const [clickHappy, setclickHappy] = useState(false);
  const [happyCount, sethappyCount] = useState(0);
  const [like, setlike] = useState(false);
  const [unlike, setunlike] = useState(false);
  const [selectIndex, setselectIndex] = useState(null);
  const [isFav, setisFav] = useState(false);
  const { id } = route.params;
  const [result, setresult] = useState(null);
  const [resultReviews, setresultReviews] = useState(null);

  // Call Google Map
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [label, setLabel] = useState(null);

  const url = Platform.select({
    ios: "maps:" + latitude + "," + longitude + "?q=" + label,
    android: "geo:" + latitude + "," + longitude + "?q=" + label,
  });
  const mapGG = () => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        return Linking.openURL(url);
      } else {
        const browser_url =
          "https://www.google.de/maps/@" +
          latitude +
          "," +
          longitude +
          "?q=" +
          label;
        return Linking.openURL(browser_url);
      }
    });
  };

  // API CALL results restaurant
  const getResult = async (id) => {
    const response = await API_getRaurant.get(`/${id}`);
    setresult(response.data);
    setLatitude(response.data.coordinates.latitude);
    setLongitude(response.data.coordinates.longitude);
    setLabel(response.data.name);
  };

  // API CALL reviews restaurant
  const getResultReview = async (id) => {
    const response = await API_getRaurant.get(`/${id}/reviews`);
    setresultReviews(response.data);
  };

  useEffect(() => {
    getResult(id);
    getResultReview(id);
  }, []);

  if (!result) {
    return null;
  }

  if (!resultReviews) {
    return null;
  }

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

  // function draw happy
  const drawHappy = (data) => {
    const happyArr = [];
    for (let index = 0; index < 5; index++) {
      if (index < data) {
        happyArr.push(
          <Ionicons
            name="happy"
            style={myStyles.iconStarForYou}
            onPress={() => {
              setclickHappy(true);
              sethappyCount(index);
            }}
          />
        );
      } else {
        happyArr.push(
          <Ionicons
            name="happy-outline"
            style={myStyles.iconStarForYou}
            onPress={() => {
              setclickHappy(true);
              sethappyCount(index);
            }}
          />
        );
      }
    }
    return happyArr;
  };

  const checkDayNow = () => {
    const arrDateTime = [];
    const dayyy = result.hours[0].open.filter(
      (item) => item.day == new Date().getDay()
    );
    dayyy.map((item, index) => {
      if (index == 1) {
        arrDateTime.push(
          <Text style={{ color: "#000", marginRight: 5 }}>&nbsp;/&nbsp;</Text>
        );
        arrDateTime.push(
          <Text style={{ color: "#000", marginRight: 5 }}>
            {item.start.slice(0, 2)}:{item.start.slice(2, 4)}-
            {item.end.slice(0, 2)}:{item.end.slice(2, 4)}
          </Text>
        );
      } else {
        arrDateTime.push(
          <Text style={{ color: "#000", marginRight: 5 }}>
            {item.start.slice(0, 2)}:{item.start.slice(2, 4)}-
            {item.end.slice(0, 2)}:{item.end.slice(2, 4)}
          </Text>
        );
      }
    });
    return arrDateTime;
  };

  return (
    <View style={myStyles.container}>
      {console.log(label)}
      <ImageBackground
        source={{ uri: result.image_url }}
        style={myStyles.imgBackground}
      >
        {isFav ? (
          <TouchableOpacity
            onPress={() => {
              setisFav(!isFav);
            }}
          >
            <Ionicons
              name="heart"
              style={{
                fontSize: 32,
                color: "#383e56",
                alignSelf: "flex-end",
                paddingTop: 10,
              }}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              setisFav(!isFav);
            }}
          >
            <Ionicons
              name="heart-outline"
              style={{
                fontSize: 32,
                color: "#fff",
                alignSelf: "flex-end",
                paddingTop: 10,
              }}
            />
          </TouchableOpacity>
        )}
        <Text style={myStyles.textName}>{result.name}</Text>
        <Text style={myStyles.textName}></Text>
      </ImageBackground>

      <View style={myStyles.containerContent}>
        <View style={myStyles.rateBtn}>
          <View style={myStyles.starWrap}>
            {drawRating_star(result.rating, myStyles.iconStar)}
          </View>
          <View style={myStyles.contentUnderStarWrap}>
            <View style={myStyles.viewWrap}>
              <Ionicons name="eye-outline" style={myStyles.iconUnderStar} />
              <Text style={myStyles.textView}>
                {result.review_count} reviews
              </Text>
            </View>
            <View style={myStyles.viewWrap}>
              <Ionicons name="cash" style={myStyles.iconUnderStar} />
              <Text style={myStyles.textView}>Price-{result.price}</Text>
            </View>
          </View>
        </View>
        <ScrollView>
          <View style={myStyles.priceClaimWrap}>
            <View style={myStyles.circleAndText}>
              <View style={myStyles.priceClaimWrapText}>
                {result.hours[0].is_open_now ? (
                  <Ionicons name="thumbs-up" style={myStyles.iconCircle} />
                ) : (
                  <Ionicons name="thumbs-down" style={myStyles.iconCircle} />
                )}
              </View>
              <Text style={myStyles.textCircle}>
                {result.hours[0].is_open_now ? "Open now" : "Close now"}
              </Text>
            </View>
            <View style={myStyles.circleAndText}>
              <View style={myStyles.priceClaimWrapText}>
                <Ionicons name="bicycle" style={myStyles.iconCircle} />
              </View>
              <Text style={myStyles.textCircle}>
                {result.transactions.includes("delivery") ? (
                  <Ionicons
                    name="checkmark"
                    style={{
                      fontSize: 20,
                      color: "#fb743e",
                      fontWeight: "bold",
                    }}
                  />
                ) : (
                  <Ionicons
                    name="close"
                    style={{
                      fontSize: 20,
                      color: "#fb743e",
                      fontWeight: "bold",
                    }}
                  />
                )}
                &nbsp;Delivery
              </Text>
            </View>
            <View style={myStyles.circleAndText}>
              <View style={myStyles.priceClaimWrapText}>
                <Ionicons name="walk" style={myStyles.iconCircle} />
              </View>
              <Text style={myStyles.textCircle}>
                {result.location.cross_streets != "" ? (
                  <Ionicons
                    name="checkmark"
                    style={{
                      fontSize: 20,
                      color: "#fb743e",
                      fontWeight: "bold",
                    }}
                  />
                ) : (
                  <Ionicons
                    name="close"
                    style={{
                      fontSize: 20,
                      color: "#fb743e",
                      fontWeight: "bold",
                    }}
                  />
                )}
                &nbsp;walked
              </Text>
            </View>
            <View style={myStyles.circleAndText}>
              <View style={myStyles.priceClaimWrapText}>
                <Ionicons name="trophy" style={myStyles.iconCircle} />
              </View>
              <Text style={myStyles.textCircle}>
                {result.is_claimed ? (
                  <Ionicons
                    name="checkmark"
                    style={{
                      fontSize: 20,
                      color: "#fb743e",
                      fontWeight: "bold",
                    }}
                  />
                ) : (
                  <Ionicons
                    name="close"
                    style={{
                      fontSize: 20,
                      color: "#fb743e",
                      fontWeight: "bold",
                    }}
                  />
                )}
                &nbsp;claimed
              </Text>
            </View>
          </View>
          <View style={myStyles.catalogWrap}>
            <Text style={myStyles.textCatalog}>Categories :</Text>
            <View style={myStyles.catalogWrapIn}>
              {result.categories.map((item) => (
                <Text style={myStyles.textCatalogIn}>{item.title}</Text>
              ))}
            </View>

            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: "#fb743e",
                marginHorizontal: 20,
              }}
            ></View>

            <View style={myStyles.viewStoreWrap}>
              <Text style={myStyles.textViewStore}>More pictures</Text>
              <FlatList
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={result.photos}
                keyExtractor={(result) => result.id}
                renderItem={({ item }) => {
                  return (
                    <Image
                      source={{ uri: item }}
                      style={myStyles.imageRef}
                    ></Image>
                  );
                }}
              />
            </View>
          </View>
          {/* /////// review comment user ////////////// */}

          <View>
            <View
              style={{
                backgroundColor: "#fff",
                paddingLeft: 20,
                paddingTop: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                Reviews Comment From User
              </Text>
              <Text
                style={{
                  fontSize: 17,
                }}
              >
                <Text
                  style={{
                    backgroundColor: "#f48b60",
                    fontSize: 17,
                    fontWeight: "bold",
                    color: "#fff",
                  }}
                >
                  &nbsp;&nbsp;{resultReviews.total}&nbsp;comments&nbsp;&nbsp;
                </Text>{" "}
                from users
              </Text>
            </View>
            <View style={{ backgroundColor: "#f48b60", padding: 10 }}>
              {resultReviews &&
                resultReviews.reviews.map((item, index) => (
                  <ListItem
                    key={item.id}
                    bottomDivider
                    containerStyle={{ borderRadius: 10, marginBottom: 9 }}
                  >
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      {item.user.image_url ? (
                        <Image
                          source={{ uri: item.user.image_url }}
                          style={{ width: 60, height: 60, borderRadius: 100 }}
                        />
                      ) : (
                        <Image
                          source={{
                            uri:
                              "https://img2.thaipng.com/20180410/bbw/kisspng-avatar-user-medicine-surgery-patient-avatar-5acc9f7a7cb983.0104600115233596105109.jpg",
                          }}
                          style={{ width: 60, height: 60, borderRadius: 100 }}
                        />
                      )}
                      <View style={{ display: "flex", flexDirection: "row" }}>
                        {drawRating_star(item.rating, myStyles.iconSmallStar)}
                      </View>
                    </View>

                    <ListItem.Content>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          width: `100%`,
                        }}
                      >
                        <ListItem.Title
                          style={{ fontWeight: "bold", fontSize: 17 }}
                        >
                          {item.user.name}
                        </ListItem.Title>
                        <View style={{ display: "flex", flexDirection: "row" }}>
                          <Ionicons
                            name={`${
                              selectIndex == index && like
                                ? "thumbs-up"
                                : "thumbs-up-outline"
                            }`}
                            onPress={() => {
                              setlike(true);
                              setunlike(false);
                              setselectIndex(index);
                            }}
                            style={{
                              fontSize: 20,
                              color: "#fb743e",
                              marginRight: 10,
                            }}
                          />
                          <Ionicons
                            name={`${
                              selectIndex == index && unlike
                                ? "thumbs-down"
                                : "thumbs-down-outline"
                            }`}
                            onPress={() => {
                              setunlike(true);
                              setlike(false);
                              setselectIndex(index);
                            }}
                            style={{ fontSize: 20, color: "#fb743e" }}
                          />
                        </View>
                      </View>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "bold",
                          color: "#fb743e",
                        }}
                      >
                        <Ionicons
                          name="create-outline"
                          style={{ fontSize: 18, color: "#fb743e" }}
                        />{" "}
                        {item.time_created}
                      </Text>
                      <ListItem.Subtitle style={{ color: "#4d4b4b" }}>
                        {item.text}
                      </ListItem.Subtitle>
                    </ListItem.Content>
                  </ListItem>
                ))}
            </View>
          </View>
          {/* /////// write reviews happy ////////////// */}
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              padding: 20,
              paddingBottom: 15,
              backgroundColor: "#fff",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
              }}
            >
              Rate Review For You{" "}
              <Ionicons
                name="create"
                style={{ fontSize: 23, color: "#fb743e" }}
              />{" "}
              <Ionicons
                onPress={() => {
                  setclickHappy(false);
                  sethappyCount(0);
                }}
                name="trash-outline"
                style={{ fontSize: 23, color: "#fb743e" }}
              />
            </Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
                paddingBottom: 10,
              }}
            >
              {clickHappy ? drawHappy(happyCount + 1) : drawHappy(0)}
            </View>
            <Divider style={{ backgroundColor: "#fb743e" }} />
          </View>

          {/* /////// map and marker ////////////// */}
          <View style={myStyles.mapContainer}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                paddingBottom: 12,
                paddingLeft: 30,
              }}
            >
              <Text style={myStyles.titleMap}>Map</Text>
              <TouchableOpacity onPress={mapGG}>
                <Text style={{ color: "#606060" }}>
                  &nbsp;&nbsp;({" "}
                  <Ionicons
                    onPress={() => {
                      setclickHappy(false);
                      sethappyCount(0);
                    }}
                    name="navigate-circle"
                    style={{ fontSize: 18, color: "#fb743e" }}
                  />{" "}
                  view googleMap)
                </Text>
              </TouchableOpacity>
            </View>
            <View style={myStyles.mapAddressWrap}>
              <MapView
                style={myStyles.map}
                initialRegion={{
                  latitude: result.coordinates.latitude,
                  longitude: result.coordinates.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
              >
                <MapView.Marker
                  coordinate={{
                    latitude: result.coordinates.latitude,
                    longitude: result.coordinates.longitude,
                  }}
                  title={result.name}
                  description={result.location.display_address.join("")}
                >
                  <Image
                    source={{
                      uri:
                        "https://image.flaticon.com/icons/png/512/3310/3310786.png",
                    }}
                    style={{ width: 40, height: 40 }}
                  />
                </MapView.Marker>
              </MapView>

              <View style={myStyles.addressGrid}>
                <Ionicons
                  name="location-sharp"
                  style={myStyles.iconAddressGrid}
                />
                <Text style={myStyles.textAddressGrid}>
                  {" "}
                  {result.location.display_address.join("")}{" "}
                  {result.location.display_address.join("")}
                </Text>
              </View>
              {/* phone */}
              <Divider style={{ backgroundColor: "#fb743e" }} />
              <View style={myStyles.addressGrid}>
                <Ionicons name="call" style={myStyles.iconAddressGrid} />
                <Text style={myStyles.textAddressGrid}>
                  {result.phone}, {result.display_phone}
                </Text>
              </View>
              {/* dateTime */}
              <Divider style={{ backgroundColor: "#fb743e" }} />
              <View style={myStyles.addressGrid}>
                <Ionicons name="time" style={myStyles.iconAddressGrid} />
                <Text style={myStyles.textAddressGrid}>
                  เวลาให้บริการวันนี้&nbsp;{checkDayNow()}
                </Text>
              </View>
              <View style={{ display: "flex", flexDirection: "column" }}></View>
            </View>
          </View>
          <View></View>
          <View style={myStyles.footer}>
            <Text style={myStyles.btnFood}>
              <Ionicons
                name="fast-food"
                style={{ fontSize: 20, color: "#fb743e" }}
              />
              &nbsp;Order Now
            </Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const myStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imgBackground: {
    flex: 0.35,
    resizeMode: "cover",
    justifyContent: "space-between",
    backgroundColor: "#000",
    opacity: 0.8,
    paddingLeft: 15,
    paddingRight: 15,
  },
  textName: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  textContent: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
  containerContent: {
    flex: 0.65,
    position: "relative",
    zIndex: 1,
  },
  rateBtn: {
    alignSelf: "center",
    backgroundColor: "#fd4f0a",
    width: `90%`,
    height: 80,
    position: "absolute",
    top: -40,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    borderRadius: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
    zIndex: 100,
  },
  starWrap: {
    display: "flex",
    flexDirection: "row",
    alignSelf: "center",
  },
  iconStar: {
    fontSize: 30,
    paddingRight: 5,
    paddingLeft: 5,
    color: "#000",
  },
  contentUnderStarWrap: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 25,
    paddingRight: 25,
  },
  iconUnderStar: {
    fontSize: 25,
    paddingRight: 5,
    color: "#e4e6e5",
  },
  viewWrap: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  textView: {
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
    color: "#c5d7bd",
  },
  priceClaimWrap: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 20,
    marginTop: 56,
  },
  circleAndText: {
    display: "flex",
    alignItems: "center",
  },
  priceClaimWrapText: {
    backgroundColor: "#fff",
    width: 80,
    height: 80,
    borderRadius: 100,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  iconCircle: {
    fontSize: 40,
    color: "#fb743e",
  },
  textCircle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fb743e",
  },
  catalogWrap: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#383e56",
    padding: 20,
    paddingHorizontal: 0,
  },
  iconCatalog: {
    color: "#ffff",
    fontSize: 30,
    paddingHorizontal: 20,
  },
  catalogWrapIn: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
  },
  textCatalog: {
    fontSize: 21,
    letterSpacing: 1,
    fontWeight: "bold",
    color: "#fb743e",
    borderRadius: 6,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  textCatalogIn: {
    fontSize: 18,
    backgroundColor: "#fb743e",
    color: "#fff",
    textAlign: "center",
    borderRadius: 6,
    paddingHorizontal: 15,
    marginRight: 5,
    marginBottom: 15,
  },
  viewStoreWrap: {
    display: "flex",
  },
  textViewStore: {
    fontSize: 21,
    letterSpacing: 1,
    fontWeight: "bold",
    color: "#fb743e",
    borderRadius: 6,
    marginBottom: 10,
    paddingTop: 5,
    paddingHorizontal: 20,
  },
  imageRef: {
    width: 300,
    height: 200,
    borderRadius: 15,
    marginLeft: 5,
    marginRight: 5,
  },
  mapContainer: {
    backgroundColor: "#fff",
    display: "flex",
  },
  titleMap: {
    fontSize: 22,
    fontWeight: "bold",
    // paddingBottom: 12,
    // paddingLeft: 30,
  },
  mapAddressWrap: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    paddingHorizontal: 13,
  },
  textAddresswrap: {
    display: "flex",
    paddingHorizontal: 20,
    marginTop: 15,
  },
  textAddress: {
    fontSize: 18,
    fontWeight: "bold",
    color: "rgba(25, 24, 24, 0.721)",
  },
  textAddressIn: {
    fontSize: 16,
    color: "rgba(54, 53, 53, 0.721)",
  },
  iconAddress: {
    color: "#fb743e",
    fontSize: 20,
  },
  textPhone: {
    fontSize: 18,
    fontWeight: "bold",
    color: "rgba(25, 24, 24, 0.721)",
    marginTop: 20,
  },
  map: {
    flex: 0.6,
    height: 130,
  },
  // //////////////// new address grid //////////////////
  addressGrid: {
    display: "flex",
    flexDirection: "row",
    flex: 1,
    marginVertical: 15,
    paddingHorizontal: 10,
  },
  textAddressGrid: {
    flex: 0.9,
    fontSize: 15,
    color: "#605454",
  },
  iconAddressGrid: {
    flex: 0.1,
    fontSize: 20,
    color: "#fb743e",
  },
  footer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "#fff",
    paddingBottom: 20,
  },
  btnFood: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderRadius: 6,
    borderColor: "#fb743e",
    color: "#fb743e",
    fontSize: 20,
    fontWeight: "bold",
    paddingHorizontal: 20,
    paddingVertical: 12,
    textAlign: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },
  // //////////////////////// list ///////////////////////
  iconSmallStar: {
    marginTop: 3,
    fontSize: 12,
    color: "#fb743e",
  },
  // //////////////////////// write Review ///////////////////////
  iconStarForYou: {
    marginTop: 3,
    fontSize: 50,
    color: "#fb743eb6",
  },
});
