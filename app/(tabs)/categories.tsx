import { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type Category = {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
};

export default function CategoriesScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await fetch(
      'https://www.themealdb.com/api/json/v1/1/categories.php'
    );
    const json = await res.json();
    setCategories(json.categories);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Categories</Text>
          <Text style={styles.subtitle}>Explore delicious recipes</Text>
        </View>
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={() => router.push('/search')}
        >
          <Ionicons name="search" size={24} color="#d4a574" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={categories}
        keyExtractor={(item: Category) => item.idCategory}
        renderItem={({ item }: { item: Category }) => (
          <TouchableOpacity 
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => router.push({
              pathname: '/meals',
              params: { category: item.strCategory }
            })}
          >
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: item.strCategoryThumb}}
                style={styles.image}
              />
              <View style={styles.overlay} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.name}>{item.strCategory}</Text>
              <Text style={styles.description} numberOfLines={2}>
                {item.strCategoryDescription}
              </Text>
              <View style={styles.footer}>
                <Text style={styles.footerText}>Tap to explore →</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        scrollEnabled={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff8f3',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0e4d6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#fff8f3',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f0e4d6',
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    color: '#2d1810',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: '#a0826d',
    fontWeight: '500',
  },
  card: {
    marginHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#d4a574',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    height: 160,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  cardContent: {
    padding: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2d1810',
    marginBottom: 8,
  },
  description: {
    fontSize: 13,
    color: '#7a6a5e',
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0e4d6',
  },
  footerText: {
    fontSize: 12,
    color: '#d4a574',
    fontWeight: '600',
  },
});
