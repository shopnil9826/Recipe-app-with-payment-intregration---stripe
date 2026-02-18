import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, ActivityIndicator, StyleSheet, Text, Alert } from 'react-native';
import { WebView } from 'react-native-webview';

export default function CheckoutScreen() {
  const params = useLocalSearchParams<{ url?: string }>();
  const router = useRouter();
  const rawUrl = typeof params.url === 'string' ? params.url : '';
  const checkoutUrl = rawUrl ? decodeURIComponent(rawUrl) : '';

  if (!checkoutUrl) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>No checkout URL provided.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: checkoutUrl }}
        startInLoadingState
        onNavigationStateChange={(navState) => {
          const url = navState.url || '';
          // Set your Stripe Payment Link "Success" redirect URL to something like:
          // https://food-app-success.test/stripe-success
          // Then we can detect it here.
          if (url.includes('stripe-success')) {
            Alert.alert('Payment successful', 'Your order has been placed.', [
              {
                text: 'OK',
                onPress: () => {
                  router.back();
                },
              },
            ]);
          }
        }}
        renderLoading={() => (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#d4a574" />
          </View>
        )}
        onError={() => {
          Alert.alert(
            'Could not load checkout',
            'The payment page failed to load. Please check your connection and try again.',
            [{ text: 'OK', onPress: () => router.back() }]
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  message: {
    fontSize: 16,
    color: '#2d1810',
  },
});
