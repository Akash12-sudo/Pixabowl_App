import { View, Text, FlatList } from "react-native";

export default function ViewConnections(props) {
  const type = props.route.params.type;
  const list = props.route.params.list;

  console.log("type", type);
  console.log("list", list);

  return (
    <View className="w-full flex-1 justify-start items-center p-2">
      <View className="bg-white p-8 flex items-center w-full mt-40 border border-slate-300 rounded-tl-full rounded-tr-full">
        <Text className="font-bold antialiased tracking-wide text-xl text-slate-700 capitalize">
          {type}
        </Text>
      </View>
      <View className="w-full h-full bg-white flex items-center justify-center ">
        <FlatList
          horizontal={false}
          numColumns={1}
          data={list}
          renderItem={({ item }) => (
            <View>
              <Text>{item}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}
