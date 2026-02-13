import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type Meal = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
};

export default function DetailsScreen() {
  const [favorites, setFavorites] = useState<Meal[]>([]);
  const [randomMeal, setRandomMeal] = useState<Meal | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchRandomMeal();
  }, []);

  const fetchRandomMeal = async () => {
    try {
      const res = await fetch(
        'https://www.themealdb.com/api/json/v1/1/random.php'
      );
      const json = await res.json();
      if (json.meals && json.meals.length > 0) {
        setRandomMeal(json.meals[0]);
      }
    } catch (error) {
      console.error('Error fetching random meal:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎲 Meal of the Day</Text>
        {randomMeal ? (
          <TouchableOpacity 
            style={styles.mealCard}
            activeOpacity={0.8}
            onPress={() => router.push({
              pathname: '/meal-detail',
              params: { mealId: randomMeal.idMeal }
            })}
          >
            <Image
              source={{ uri: randomMeal.strMealThumb }}
              style={styles.mealImage}
            />
            <View style={styles.mealContent}>
              <Text style={styles.mealName}>{randomMeal.strMeal}</Text>
              <Text style={styles.mealCategory}>{randomMeal.strCategory}</Text>
              <View style={styles.mealFooter}>
                <Text style={styles.tapText}>Tap for recipe →</Text>
              </View>
            </View>
          </TouchableOpacity>
        ) : null}
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
        <View style={styles.refreshButton}>
          <TouchableOpacity 
            style={styles.refreshButtonInner}
            onPress={fetchRandomMeal}
          >
            <Ionicons name="refresh" size={20} color="#fff" />
            <Text style={styles.refreshText}>Get Another Meal</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
    fontSize: 20,
    fontWeight: '700',
    color: '#2d1810',
    marginBottom: 12,
  },
  mealCard: {
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
    height: 200,
  },
  mealContent: {
    padding: 16,
  },
  mealName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2d1810',
    marginBottom: 6,
  },
  mealCategory: {
    fontSize: 14,
    color: '#a0826d',
    fontWeight: '600',
    marginBottom: 12,
  },
  mealFooter: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0e4d6',
  },
  tapText: {
    fontSize: 13,
    color: '#d4a574',
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
  refreshButton: {
    marginTop: 12,
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
