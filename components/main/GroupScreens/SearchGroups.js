import * as firebase from "firebase";
require("firebase/firestore");
import React, { useEffect, useState } from "react";
import { View, TextInput, Text, StyleSheet, FlatList } from "react-native";
import { fetchGroups } from "../../../redux/actions";
import { SearchBar } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";

export default function SearchGroups() {
  const [groups, setGroups] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    firebase
      .firestore()
      .collection("groups")
      .get()
      .then((snapshot) => {
        let groups = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        setGroups(groups);
        setFiltered(groups);
      });
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.groupCard}>
      <Text style={styles.groupTitle}>{item.name}</Text>
      <View style={styles.groupBody}>
        <Text>{item.description}</Text>
        <Text>Frequency: {item.frequency}</Text>
      </View>
    </View>
  );

  const searchFilter = (text) => {
    setSearch(text);
    const newData = groups.filter((item) => {
      const itemName = item.name.toUpperCase();
      const textData = text.toUpperCase();
      return itemName.indexOf(textData) > -1;
    });
    setFiltered(newData);
  };

  return (
    <View>
      <SearchBar
        placeholder="Type Here..."
        onChangeText={(text) => searchFilter(text)}
        value={search}
      />

      <FlatList
        numColumns={1}
        data={filtered}
        renderItem={renderItem}
        style={styles.groupsList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  groupCard: {
    padding: 10,
    margin: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4.65,
    elevation: 5,
  },
  groupsList: {
    padding: 10,
  },
  groupTitle: {
    fontSize: 24,
  },
  groupBody: {
    paddingTop: 10,
  },
});
