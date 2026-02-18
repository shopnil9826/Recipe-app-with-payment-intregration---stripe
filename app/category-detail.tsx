import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

type CategoryData = {
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
};

export default function CategoryDetailScreen() {
  const params = useLocalSearchParams<{ category?: string | string[] }>();
  const rawCategory = Array.isArray(params.category) ? params.category[0] : params.category;
  const router = useRouter();
  const [categoryData, setCategoryData] = useState<CategoryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!rawCategory) {
      setLoading(false);
      return;
    }
    let parsed: CategoryData | null = null;
    try {
      parsed = JSON.parse(rawCategory as string) as CategoryData;
      if (parsed && typeof parsed.strCategory === 'string') {
        setCategoryData(parsed);
        setLoading(false);
        return;
      }
    } catch {
      // Not JSON – treat as category name and fetch from API
    }
    const categoryName = typeof rawCategory === 'string' ? rawCategory : '';
    if (!categoryName) {
      setLoading(false);
      return;
    }
    fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
      .then((res) => res.json())
      .then((json) => {
        const list = json.categories || [];
        const found = list.find((c: CategoryData) => c.strCategory === categoryName);
        setCategoryData(found || {
          strCategory: categoryName,
          strCategoryThumb: '',
          strCategoryDescription: 'No description available.',
        });
      })
      .catch(() => {
        setCategoryData({
          strCategory: categoryName,
          strCategoryThumb: '',
          strCategoryDescription: 'No description available.',
        });
      })
      .finally(() => setLoading(false));
  }, [rawCategory]);

  if (!rawCategory) {
    return (
      <View style={styles.container}>
        <Text>No category found</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#d4a574" />
      </View>
    );
  }

  if (!categoryData) {
    return (
      <View style={styles.container}>
        <Text>No category found</Text>
      </View>
    );
  }

  const handleExploreCategory = () => {
    router.push({
      pathname: '/meals',
      params: { category: categoryData.strCategory }
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: categoryData.strCategoryThumb }}
          style={styles.image}
          contentFit="cover"
          placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
        />
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>{categoryData.strCategory}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>📖 Category</Text>
          </View>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About This Category</Text>
          <Text style={styles.description}>{categoryData.strCategoryDescription}</Text>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoBox}>
            <Text style={styles.infoIcon}>🍽️</Text>
            <Text style={styles.infoLabel}>Cuisines</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoIcon}>⭐</Text>
            <Text style={styles.infoLabel}>Popular</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.exploreButton}
          onPress={handleExploreCategory}
        >
          <Text style={styles.exploreButtonText}>Explore Meals</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff8f3',
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
  titleSection: {
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2d1810',
    marginBottom: 12,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff8f3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f0e4d6',
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#d4a574',
  },
  divider: {
    height: 1.5,
    backgroundColor: '#f0e4d6',
    marginVertical: 16,
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
  description: {
    fontSize: 16,
    color: '#7a6a5e',
    lineHeight: 26,
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0e4d6',
  },
  infoBox: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7a6a5e',
  },
  exploreButton: {
    flexDirection: 'row',
    marginTop: 24,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#d4a574',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#d4a574',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
  },
  exploreButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
