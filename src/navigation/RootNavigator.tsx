import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AppProvider } from "@/context/AppContext";
import { AnimalInfoScreen } from "@/screens/explore/AnimalInfoScreen";
import { CollectionScreen } from "@/screens/explore/CollectionScreen";
import { ExplorationScreen } from "@/screens/explore/ExplorationScreen";
import { MapScreen } from "@/screens/explore/MapScreen";
import { ResultScreen } from "@/screens/explore/ResultScreen";
import { HomeScreen } from "@/screens/home/HomeScreen";
import { SplashScreen } from "@/screens/home/SplashScreen";

export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  Map: undefined;
  Exploration: undefined;
  Result: undefined;
  AnimalInfo: undefined;
  Collection: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <AppProvider>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName="Splash"
        >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Map" component={MapScreen} />
          <Stack.Screen name="Exploration" component={ExplorationScreen} />
          <Stack.Screen name="Result" component={ResultScreen} />
          <Stack.Screen name="AnimalInfo" component={AnimalInfoScreen} />
          <Stack.Screen name="Collection" component={CollectionScreen} />
        </Stack.Navigator>
      </AppProvider>
    </NavigationContainer>
  );
}
