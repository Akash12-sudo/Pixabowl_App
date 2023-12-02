import React, { useState, useEffect } from "react";
import Config from "react-native-config";
import {
  Text,
  SafeAreaView,
  View,
  Image,
  FlatList,
  StyleSheet,
  Button,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  getDoc,
  getDocs,
  collection,
  doc,
  orderBy,
  query,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { auth, db } from "../../components/auth/Firebase";
import { useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesomeIcons from "react-native-vector-icons/FontAwesome";
import EvilIcons from "react-native-vector-icons/EvilIcons";

export default function FeedScreen(props) {
  const navigation = useNavigation();
  const [Posts, setPosts] = useState([]);
  const [likeButtonState, setLikeButtonState] = useState({
    name: "cards-heart-outline",
    color: "black",
  });

  const currentUserState = useSelector((state) => state.user);
  const usersState = useSelector((state) => state.usersState);
  console.log("Usersstate", usersState.users);
  console.log("Current UserState", currentUserState);

  // console.log(usersState.usersLoaded, currentUserState.following.length);

  useEffect(() => {
    console.log("Config Message API Key ->: ", process.env.EXPO_PUBLIC_API_KEY);
    let posts = [];
    if (
      usersState.usersFollowingLoaded === currentUserState.following.length &&
      currentUserState.following.length !== 0
    ) {
      for (let i = 0; i < currentUserState.following.length; i++) {
        const user = usersState.users.find(
          (el) => el.uid === currentUserState.following[i]
        );
        if (user) {
          posts = [...posts, ...user.posts];
        }
      }

      posts.sort(function (x, y) {
        return x.createdAt - y.createdAt;
      });

      for (let i = 0; i < posts.length; i++) {
        let post = posts[i];
        console.log(post.createdAt);
        const { nanoseconds, seconds } = post.createdAt;

        // Convert nanoseconds to milliseconds
        const milliseconds = seconds * 1000 + Math.floor(nanoseconds / 1e6);

        // Create a new Date object using setMilliseconds
        const date = new Date(0); // Pass 0 to initialize with the epoch time
        date.setUTCMilliseconds(milliseconds);

        // Extract day, month, and year
        const day = date.getUTCDate();
        const month = date.getUTCMonth() + 1; // Months are zero-based
        const year = date.getUTCFullYear();

        // Update the post with the formatted date
        post.newDate = `${day}/${month}/${year}`;
      }

      setPosts(posts);
    }
  }, [usersState.usersFollowingLoaded]);

  console.log("Feed Posts...", Posts);

  return (
    <SafeAreaView className="flex-1 items-center justify-start">
      <View className="flex-1 w-full">
        <FlatList
          numColumns={1}
          horizontal={false}
          data={Posts}
          className="mt-4"
          renderItem={({ item }) => {
            return (
              <View
                className=" gap-y-2  m-2 rounded-lg  bg-white"
                style={{ elevation: 2 }}
              >
                <View className="px-2 flex flex-row gap-x-2 items-center justify-start">
                  {item.user.profile_image ? (
                    <Image
                      source={{ uri: item.user.profile_image }}
                      className="rounded-full object-contain"
                      style={{ width: 28, height: 28 }}
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="account-circle"
                      color="gray"
                      size={28}
                    />
                  )}

                  <Text className="font-semibold antialiased">
                    {item.user.name}
                  </Text>
                </View>
                <Image
                  source={{ uri: item.url }}
                  className="object-contain w-full"
                  style={{ aspectRatio: 1 / 1 }}
                />
                <View className="px-1 flex flex-row gap-x-4 items-center justify-start">
                  <MaterialCommunityIcons
                    onPress={() => {
                      setLikeButtonState((prevState) =>
                        prevState.name === "cards-heart-outline"
                          ? { name: "cards-heart", color: "red" }
                          : { name: "cards-heart-outline", color: "black" }
                      );
                    }}
                    name={likeButtonState.name}
                    color={likeButtonState.color}
                    size={30}
                    style={{ marginTop: 2 }}
                  />
                  <FontAwesomeIcons
                    name="comment-o"
                    size={28}
                    onPress={() =>
                      navigation.navigate("Comment", {
                        postId: item.id,
                        uid: item.user.uid,
                      })
                    }
                  />
                </View>
                <View className="px-2 flex flex-row gap-x-2 items-center justify-start ">
                  <Text className="font-bold antialiased tracking-wide">0</Text>
                  <Text className="font-bold antialiased tracking-wide">
                    Likes
                  </Text>
                </View>

                <View className="px-2 flex flex-row gap-x-2 items-center justify-start ">
                  <Text className="font-bold antialiased">
                    {item.user.name}
                  </Text>
                  <Text className="font-semibold text-slate-700 antialiased tracking-wide">
                    {item.caption}
                  </Text>
                </View>
                <View className="p-2">
                  <Text
                    onPress={() =>
                      navigation.navigate("Comment", {
                        postId: item.id,
                        uid: item.user.uid,
                      })
                    }
                    className="tracking-wide antialiased font-semibold text-slate-600"
                  >
                    View All Comments...
                  </Text>
                  <Text className="tracking-widest text-slate-500">
                    {item.newDate}
                  </Text>
                </View>
              </View>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
}
