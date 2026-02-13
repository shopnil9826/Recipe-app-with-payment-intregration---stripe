import { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface MealDetail {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strYoutube?: string;
  [key: string]: any;
}

export default function MealDetailScreen() {
  const { mealId } = useLocalSearchParams();
  const router = useRouter();
  const [meal, setMeal] = useState<MealDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (mealId) {
      fetchMealDetails();
    }
  }, [mealId]);

  const fetchMealDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
      );
      const json = await res.json();
      if (json.meals && json.meals.length > 0) {
        setMeal(json.meals[0]);
      }
    } catch (error) {
      console.error('Error fetching meal details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIngredients = () => {
    if (!meal) return [];
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients.push({ ingredient, measure });
      }
    }
    return ingredients;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#d4a574" />
      </View>
    );
  }

  if (!meal) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Meal not found</Text>
      </View>
    );
  }

  const ingredients = getIngredients();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: meal.strMealThumb }} style={styles.image} />
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{meal.strMeal}</Text>
        
        <View style={styles.metaInfo}>
          <View style={styles.metaBox}>
            <Text style={styles.metaLabel}>Category</Text>
            <Text style={styles.metaValue}>{meal.strCategory}</Text>
          </View>
          <View style={styles.metaBox}>
            <Text style={styles.metaLabel}>Origin</Text>
            <Text style={styles.metaValue}>{meal.strArea}</Text>
          </View>
        </View>

        {ingredients.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📋 Ingredients</Text>
            {ingredients.map((item, index) => (
              <View key={index} style={styles.ingredientItem}>
                <View style={styles.ingredientDot} />
                <Text style={styles.ingredientText}>{item.ingredient}</Text>
                <Text style={styles.ingredientMeasure}>{item.measure}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👨‍🍳 Instructions</Text>
          <Text style={styles.instructions}>{meal.strInstructions}</Text>
        </View>

        {meal.strYoutube && (
          <TouchableOpacity style={styles.youtubeButton}>
            <Ionicons name="logo-youtube" size={20} color="#fff" />
            <Text style={styles.youtubeText}>Watch Video</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
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
  errorText: {
    color: '#2d1810',
    textAlign: 'center',
    marginTop: 20,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 320,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 44,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2d1810',
    marginBottom: 16,
  },
  metaInfo: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 12,
  },
  metaBox: {
    flex: 1,
    backgroundColor: '#fff8f3',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f0e4d6',
  },
  metaLabel: {
    fontSize: 12,
    color: '#a0826d',
    fontWeight: '600',
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 14,
    color: '#2d1810',
    fontWeight: '700',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2d1810',
    marginBottom: 12,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0e4d6',
  },
  ingredientDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d4a574',
    marginRight: 12,
  },
  ingredientText: {
    flex: 1,
    fontSize: 14,
    color: '#2d1810',
    fontWeight: '500',
  },
  ingredientMeasure: {
    fontSize: 13,
    color: '#a0826d',
    fontWeight: '600',
  },
  instructions: {
    fontSize: 15,
    color: '#7a6a5e',
    lineHeight: 26,
  },
  youtubeButton: {
    flexDirection: 'row',
    backgroundColor: '#ff0000',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    elevation: 3,
  },
  youtubeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 8,
  },
});
