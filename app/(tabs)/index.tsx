import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type Meal = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
};

export default function HomeScreen() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchFeaturedMeals();
  }, []);

  const fetchFeaturedMeals = async () => {
    try {
      setLoading(true);
      const categories = ['Chicken', 'Beef', 'Dessert', 'Vegetarian', 'Seafood', 'Pasta'];
      const randomCat = categories[Math.floor(Math.random() * categories.length)];
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(randomCat)}`
      );
      const json = await res.json();
      const list = json.meals || [];
      setMeals(list.slice(0, 6));
    } catch (error) {
      console.error('Error fetching meals:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Meals</Text>
        <Text style={styles.sectionSubtitle}>Popular recipes to try</Text>
        {loading ? (
          <Text style={styles.loadingText}>Loading meals...</Text>
        ) : (
          <View style={styles.mealGrid}>
            {meals.map((meal) => (
              <TouchableOpacity
                key={meal.idMeal}
                style={styles.mealCard}
                activeOpacity={0.8}
                onPress={() => router.push({
                  pathname: '/meal-detail',
                  params: { mealId: meal.idMeal }
                })}
              >
                <Image
                  source={{ uri: meal.strMealThumb }}
                  style={styles.mealImage}
                />
                <View style={styles.mealContent}>
                  <Text style={styles.mealName} numberOfLines={2}>{meal.strMeal}</Text>
                  <Text style={styles.mealCategory}>{meal.strCategory}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ℹ️ About This App</Text>
        <View style={styles.infoBox}>
          <View style={styles.infoItem}>
            <Ionicons name="restaurant" size={24} color="#d4a574" />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Recipes Database</Text>
              <Text style={styles.infoValue}>1000+ meals from 10+ cuisines</Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="search" size={24} color="#d4a574" />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Search & Filter</Text>
              <Text style={styles.infoValue}>Find meals by name or category</Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="book" size={24} color="#d4a574" />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Full Recipes</Text>
              <Text style={styles.infoValue}>Complete ingredients & instructions</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          style={styles.refreshButtonInner}
          onPress={fetchFeaturedMeals}
        >
          <Ionicons name="refresh" size={20} color="#fff" />
          <Text style={styles.refreshText}>Refresh Meals</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff8f3',
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '500',
    color: '#2d1810',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#7a6a5e',
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 15,
    color: '#7a6a5e',
    textAlign: 'center',
    paddingVertical: 24,
  },
  mealGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  mealCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#d4a574',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  mealImage: {
    width: '100%',
    height: 120,
  },
  mealContent: {
    padding: 12,
  },
  mealName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2d1810',
    marginBottom: 4,
  },
  mealCategory: {
    fontSize: 12,
    color: '#a0826d',
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#d4a574',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0e4d6',
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2d1810',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 13,
    color: '#7a6a5e',
    lineHeight: 18,
  },
  refreshButtonInner: {
    flexDirection: 'row',
    backgroundColor: '#d4a574',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#d4a574',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
  },
  refreshText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 8,
  },
});
