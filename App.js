import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthProvider } from "./app/context/AuthContext";
import Login from "./Layouts/Login";
//import Signup from "./Layouts/Signup";
//import MyFeed from "./Layouts/MyFeed";
//import MyProfile from "./Layouts/MyProfile";
//import FriendProfile from "./Layouts/FriendProfile";
//import Posts from "./components/Posts";
//import Protected from "./routes/Protected";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, // Ocultamos el header predeterminado de las tabs
        tabBarActiveTintColor: "#BD61DE", // Color activo para el texto/icono
        tabBarInactiveTintColor: "#808080", // Color inactivo para el texto/icono
      }}
    >
      {/* <Tab.Screen name="MyFeed" component={MyFeed} />
      <Tab.Screen name="MyProfile" component={MyProfile} />
      <Tab.Screen name="Buscar" component={FriendProfile} /> */}
    </Tab.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Rutas públicas */}
      <Stack.Screen name="Login" component={Login} />
      {/* <Stack.Screen name="Signup" component={Signup} /> */}
      {/* Rutas protegidas */}
      <Stack.Screen name="Protected" component={Protected}>
        <Stack.Screen name="BottomTabs" component={BottomTabs} />
        <Stack.Screen name="FriendProfile" component={FriendProfile} />
        <Stack.Screen name="Posts" component={Posts} />
      </Stack.Screen>
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppStack />
      </NavigationContainer>
    </AuthProvider>
  );
}
