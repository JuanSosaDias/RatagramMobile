import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Button,
  Alert,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Feed({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState("");

  const handleFeed = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch("http://localhost:3001/api/posts/feed", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setPosts(data || []);
      } else {
        setMessage(data.message || "Error al cargar el feed");
        if (response.status === 401) {
          await AsyncStorage.removeItem("token");
          navigation.navigate("Login");
        }
      }
    } catch (error) {
      setMessage("Error en el servidor");
      console.error("Error al cargar el feed: ", error);
    }
  };

  useEffect(() => {
    handleFeed();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.Publicacion}>
      <View style={styles.publicacionTitle}>
        <Image
          source={{ uri: item.user.profilePicture }}
          style={styles.publicacionTitleImage}
        />
        <Text>{item.user.username}</Text>
      </View>
      <Image source={{ uri: item.imageUrl }} style={styles.publicacionPhoto} />
      <View style={styles.publicacionContent}>
        <Text style={styles.publicacionDescription}>{item.caption}</Text>
        <Text>Likes: {item.likes ? item.likes.length : 0}</Text>
        <Text>Comments: {item.comments.length}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.feedRatagram}>
      <Text style={styles.titulo}>Feed Ratagram</Text>
      {message ? <Text>{message}</Text> : null}
      {posts.length > 0 ? (
        <FlatList
          data={posts.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )}
          renderItem={renderItem}
          keyExtractor={(item) => item.createdAt}
        />
      ) : (
        <Text>No hay publicaciones disponibles.</Text>
      )}
      <Button title="Abrir Drawer" onPress={() => navigation.openDrawer()} />
    </View>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  feedRatagram: {
    maxWidth: width - 40, // Ajuste para móviles
    marginHorizontal: 20,
    paddingVertical: 20,
    fontFamily: "Arial, sans-serif",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  feedRatagramItem: {
    listStyle: "none",
    textAlign: "center",
    color: "#888",
    fontSize: 14,
    marginTop: 10,
  },
  Publicacion: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  publicacionContent: {
    padding: 16,
  },
  publicacionTitle: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    fontWeight: "bold",
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  publicacionTitleImage: {
    width: 40,
    height: 40,
    borderRadius: 50,
    marginRight: 10,
  },
  publicacionPhoto: {
    width: "100%",
    height: 200, // Ajuste para móviles
    resizeMode: "cover",
  },
  publicacionDescription: {
    paddingVertical: 10,
    fontSize: 14,
    color: "#333",
  },
  publicacionWrappButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  publicacionLikeButton: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    color: "#ff5a5f",
    fontSize: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  publicacionCommentButton: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    color: "#ff5a5f",
    fontSize: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  publicacionCommentSection: {
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  commentInput: {
    width: "100%",
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    fontSize: 14,
  },
  commentInputPlaceholder: {
    color: "#aaa",
  },
});
