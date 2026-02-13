import { Redirect } from 'expo-router';

export default function TabsIndex() {
  // When the user hits the root of the tabs, send them to the Categories tab.
  return <Redirect href="/(tabs)/categories" />;
}
