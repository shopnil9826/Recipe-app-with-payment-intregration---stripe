
import "../firebaseConfig";

import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="search" 
        options={{ 
          title: 'Search Meals',
          headerBackTitle: 'Back'
        }} 
      />
      <Stack.Screen 
        name="meals" 
        options={{ 
          title: 'Meals',
          headerBackTitle: 'Back'
        }} 
      />
      <Stack.Screen 
        name="meal-detail" 
        options={{ 
          title: 'Recipe',
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="category-detail" 
        options={{ 
          title: 'Category',
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="checkout"
        options={{
          title: 'Checkout',
          headerBackTitle: 'Back',
        }}
      />
    </Stack>
  );
}
