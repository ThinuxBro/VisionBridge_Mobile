import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Stack navigator handles your screens */}
          <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#07176dff',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
        <Stack.Screen name="index" options={{ 
          title:"Vision Bridge", 
          headerBackVisible:false}} />
        <Stack.Screen name="module" options={{ title: "Modules" }} />
         <Stack.Screen
        name="profile"
        options={{
          presentation: 'modal',
        }}
      />
        {/* Add more screens here if needed */}
      </Stack>
    </GestureHandlerRootView>
  );
}
