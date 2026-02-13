import { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function MealsScreen() {
  const { category } = useLocalSearchParams();
  const router = useRouter();
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (category) {
      fetchMeals();
    }
  }, [category]);

  const fetchMeals = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
      );
      const json = await res.json();
      setMeals(json.meals || []);
    } catch (error) {
      console.error('Error fetching meals:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#d4a574" />
        <Text style={styles.loadingText}>Loading meals...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#2d1810" />
        </TouchableOpacity>
        <Text style={styles.title}>{category} Meals</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={meals}
        keyExtractor={(item) => item.idMeal}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.mealCard}
            activeOpacity={0.8}
            onPress={() => router.push({
              pathname: '/meal-detail',
              params: { mealId: item.idMeal }
            })}
          >
            <Image
              source={{ uri: item.strMealThumb }}
              style={styles.mealImage}
            />
            <Text style={styles.mealName} numberOfLines={2}>{item.strMeal}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff8f3',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff8f3',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#7a6a5e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0e4d6',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2d1810',
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  mealCard: {
    flex: 1,
    marginHorizontal: 4,
    marginTop: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#d4a574',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  mealImage: {
    width: '100%',
    height: 140,
  },
  mealName: {
    padding: 8,
    fontSize: 13,
    fontWeight: '600',
    color: '#2d1810',
    textAlign: 'center',
  },
});
