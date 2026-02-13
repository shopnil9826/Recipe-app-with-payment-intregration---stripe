import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function NutritionScreen() {
  const [selectedDiet, setSelectedDiet] = useState<string | null>(null);
  const router = useRouter();

  // TODO: Replace this with your real Stripe Payment Link URL from the Stripe Dashboard (test mode).
  const STRIPE_PAYMENT_URL = 'https://buy.stripe.com/test_3cI28tewt2omchwfKI63K00';

  const dietOptions = [
    { id: 'vegan', label: '🌱 Vegan', emoji: '🌱' },
    { id: 'vegetarian', label: '🥗 Vegetarian', emoji: '🥗' },
    { id: 'paleo', label: '🥩 Paleo', emoji: '🥩' },
    { id: 'gluten-free', label: '🍞 Gluten-Free', emoji: '🍞' },
    { id: 'dairy-free', label: '🥛 Dairy-Free', emoji: '🥛' },
    { id: 'keto', label: '⚡ Keto', emoji: '⚡' },
  ];

  type DietId = (typeof dietOptions)[number]['id'];

  const dietDescriptions: Record<DietId, string> = {
    vegan: 'Plant-based foods only. No meat, fish, eggs or dairy. Usually higher in fiber and complex carbs.',
    vegetarian: 'No meat or fish. Typically includes eggs and/or dairy with a balance of carbs, fats and protein.',
    paleo: 'Focus on unprocessed meats, fish, eggs, vegetables, fruits and nuts. Lower in grains and legumes.',
    'gluten-free':
      'Avoids wheat, barley and rye. Can be balanced with naturally gluten‑free whole grains and starches.',
    'dairy-free': 'Avoids milk and dairy products. Can still be balanced with plant milks and other calcium sources.',
    keto: 'Very low carb, high fat, moderate protein. Encourages the body to use fat for fuel.',
  };

  type DietNutrition = {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };

  // All values are simple 0–100 "index" scores so they can be shown as percentages in the chart.
  const nutritionData: Record<DietId, DietNutrition> = {
    vegan: {
      calories: 80,
      protein: 60,
      carbs: 75,
      fat: 45,
      fiber: 95,
    },
    vegetarian: {
      calories: 90,
      protein: 70,
      carbs: 60,
      fat: 55,
      fiber: 80,
    },
    paleo: {
      calories: 95,
      protein: 85,
      carbs: 35,
      fat: 70,
      fiber: 60,
    },
    'gluten-free': {
      calories: 90,
      protein: 65,
      carbs: 55,
      fat: 55,
      fiber: 65,
    },
    'dairy-free': {
      calories: 85,
      protein: 60,
      carbs: 65,
      fat: 50,
      fiber: 70,
    },
    keto: {
      calories: 95,
      protein: 75,
      carbs: 10,
      fat: 95,
      fiber: 40,
    },
  };

  const chartMetrics: { key: keyof DietNutrition; label: string; unit: string }[] = [
    { key: 'calories', label: 'Energy density', unit: '%' },
    { key: 'protein', label: 'Protein focus', unit: '%' },
    { key: 'carbs', label: 'Carbohydrate focus', unit: '%' },
    { key: 'fat', label: 'Fat focus', unit: '%' },
    { key: 'fiber', label: 'Fiber richness', unit: '%' },
  ];

  const handleSelectDiet = (dietId: DietId) => {
    setSelectedDiet(dietId === selectedDiet ? null : dietId);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>🥗 Diet & Health</Text>
        <Text style={styles.subtitle}>Filter by dietary needs</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Your Diet</Text>
        <View style={styles.dietGrid}>
          {dietOptions.map((diet) => (
            <TouchableOpacity
              key={diet.id}
              style={[
                styles.dietButton,
                selectedDiet === diet.id && styles.dietButtonActive,
              ]}
              onPress={() => handleSelectDiet(diet.id)}
            >
              <Text style={styles.dietEmoji}>{diet.emoji}</Text>
              <Text style={[
                styles.dietLabel,
                selectedDiet === diet.id && styles.dietLabelActive,
              ]}>
                {diet.label.split(' ')[1]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {selectedDiet ? (
        <View style={styles.section}>
          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={24} color="#d4a574" />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.infoTitle}>Diet overview</Text>
              <Text style={styles.infoText}>{dietDescriptions[selectedDiet as DietId]}</Text>
            </View>
          </View>

          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Nutrition profile</Text>
            <Text style={styles.chartSubtitle}>
              Relative emphasis (0–100) for a typical day on this eating pattern.
            </Text>

            {chartMetrics.map((metric) => {
              const value = nutritionData[selectedDiet as DietId][metric.key];
              return (
                <View key={metric.key} style={styles.chartRow}>
                  <View style={styles.chartRowHeader}>
                    <Text style={styles.chartLabel}>{metric.label}</Text>
                    <Text style={styles.chartValue}>
                      {value}
                      {metric.unit}
                    </Text>
                  </View>
                  <View style={styles.chartBarBackground}>
                    <View style={[styles.chartBarFill, { width: `${value}%` }]} />
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      ) : (
        <View style={styles.section}>
          <View style={styles.emptyState}>
            <Ionicons name="stats-chart-outline" size={32} color="#d4a574" />
            <Text style={styles.emptyTitle}>See your nutrition chart</Text>
            <Text style={styles.emptySubtitle}>
              Choose a diet style above to view a simple nutrition breakdown and understand its general focus.
            </Text>
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support & premium recipes</Text>
        <View style={styles.paymentCard}>
          <Text style={styles.paymentText}>
            To test Stripe with Expo Go, we use a Stripe Payment Link. This opens a secure Stripe checkout page in your
            browser using test mode.
          </Text>

          <TouchableOpacity
            style={styles.paymentButton}
            onPress={() => {
              // Navigate to in-app checkout screen showing the Stripe Payment Link in a WebView.
              router.push(`/checkout?url=${encodeURIComponent(STRIPE_PAYMENT_URL)}`);
            }}
          >
            <Ionicons name="card-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.paymentButtonText}>Pay with Stripe (test)</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff8f3',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0e4d6',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2d1810',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#a0826d',
    fontWeight: '500',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2d1810',
    marginBottom: 12,
  },
  dietGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  dietButton: {
    flex: 1,
    minWidth: '30%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#f0e4d6',
    alignItems: 'center',
    elevation: 1,
  },
  dietButtonActive: {
    backgroundColor: '#fff8f3',
    borderColor: '#d4a574',
  },
  dietEmoji: {
    fontSize: 26,
    marginBottom: 6,
  },
  dietLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#7a6a5e',
    textAlign: 'center',
  },
  dietLabelActive: {
    color: '#d4a574',
  },
  infoSection: {
    paddingHorizontal: 16,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#d4a574',
    elevation: 2,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2d1810',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#7a6a5e',
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0e4d6',
  },
  chartCard: {
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2d1810',
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: 12,
    color: '#a0826d',
    marginBottom: 12,
  },
  chartRow: {
    marginBottom: 10,
  },
  chartRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  chartLabel: {
    fontSize: 13,
    color: '#2d1810',
    fontWeight: '600',
  },
  chartValue: {
    fontSize: 12,
    color: '#7a6a5e',
    fontWeight: '600',
  },
  chartBarBackground: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#f0e4d6',
    overflow: 'hidden',
  },
  chartBarFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#d4a574',
  },
  emptyState: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    elevation: 2,
  },
  emptyTitle: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '700',
    color: '#2d1810',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#7a6a5e',
    textAlign: 'center',
    lineHeight: 18,
  },
  paymentCard: {
    marginTop: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0e4d6',
  },
  paymentText: {
    fontSize: 13,
    color: '#7a6a5e',
    lineHeight: 18,
    marginBottom: 12,
  },
  paymentButton: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: '#d4a574',
  },
  paymentButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});
