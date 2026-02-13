import { useState } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type Meal = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
};

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [searchCache, setSearchCache] = useState<Record<string, Meal[]>>({});
  const router = useRouter();

  const searchMeals = async (query: string) => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      setMeals([]);
      setSearched(false);
      return;
    }

    // If we already have cached results for this query, use them
    if (searchCache[normalized]) {
      setMeals(searchCache[normalized]);
      setSearched(true);
      return;
    }

    try {
      setLoading(true);
      setSearched(true);
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${normalized}`
      );
      const json = await res.json();
      const fetchedMeals: Meal[] = json.meals || [];
      setMeals(fetchedMeals);
      setSearchCache((prev) => ({
        ...prev,
        [normalized]: fetchedMeals,
      }));
    } catch (error) {
      console.error('Error searching meals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);

    const trimmed = text.trim();

    if (!trimmed) {
      setMeals([]);
      setSearched(false);
      return;
    }

    // Trigger search for any non-empty query
    searchMeals(trimmed);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchInputContainer}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => searchMeals(searchQuery.trim())}
          >
            <Ionicons name="search" size={20} color="#a0826d" />
          </TouchableOpacity>
          <TextInput
            style={styles.searchInput}
            placeholder="Search meals..."
            placeholderTextColor="#a0826d"
            value={searchQuery}
            onChangeText={handleSearch}
            returnKeyType="search"
            onSubmitEditing={() => searchMeals(searchQuery.trim())}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => {
              setSearchQuery('');
              setMeals([]);
              setSearched(false);
            }}>
              <Ionicons name="close-circle" size={20} color="#d4a574" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#d4a574" />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      ) : searched && meals.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyText}>No meals found</Text>
          <Text style={styles.emptySubtext}>Try another search</Text>
        </View>
      ) : meals.length > 0 ? (
        <FlatList
          data={meals}
          keyExtractor={(item) => item.idMeal}
          renderItem={({ item }: { item: Meal }) => (
            <TouchableOpacity
              style={styles.resultCard}
              activeOpacity={0.8}
              onPress={() => router.push({
                pathname: '/meal-detail',
                params: { mealId: item.idMeal }
              })}
            >
              <Image
                source={{ uri: item.strMealThumb }}
                style={styles.resultImage}
              />
              <View style={styles.resultContent}>
                <Text style={styles.resultName}>{item.strMeal}</Text>
                <Text style={styles.resultCategory}>{item.strCategory}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#d4a574" />
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.initialContainer}>
          <Text style={styles.initialIcon}>🍽️</Text>
          <Text style={styles.initialText}>Search for your favorite meal</Text>
          <Text style={styles.initialSubtext}>Type at least 3 characters</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff8f3',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0e4d6',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f0e4d6',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 16,
    color: '#2d1810',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#7a6a5e',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2d1810',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#a0826d',
  },
  initialContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  initialText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2d1810',
    marginBottom: 4,
  },
  initialSubtext: {
    fontSize: 14,
    color: '#a0826d',
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginVertical: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#d4a574',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
  },
  resultImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  resultContent: {
    flex: 1,
    marginLeft: 12,
  },
  resultName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2d1810',
    marginBottom: 4,
  },
  resultCategory: {
    fontSize: 13,
    color: '#a0826d',
    fontWeight: '500',
  },
});
