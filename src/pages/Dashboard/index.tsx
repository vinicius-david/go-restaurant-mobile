import React, { useEffect, useState } from 'react';
import { Image, ScrollView } from 'react-native';

import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import Logo from '../../assets/logo-header.png';
import SearchInput from '../../components/SearchInput';

import api from '../../services/api';
import formatValue from '../../utils/formatValue';

import {
  Container,
  Header,
  FilterContainer,
  Title,
  CategoryContainer,
  CategorySlider,
  CategoryItem,
  CategoryItemTitle,
  FoodsContainer,
  FoodList,
  Food,
  FoodImageContainer,
  FoodContent,
  FoodTitle,
  FoodDescription,
  FoodPricing,
} from './styles';

interface Food {
  id: number;
  name: string;
  description: string;
  category: number;
  price: number;
  thumbnail_url: string;
  formattedPrice: string;
  extras: Extra[];
}

interface Category {
  id: number;
  title: string;
  image_url: string;
}

interface Extra {
  id: number;
  name: string;
  value: number;
}

const Dashboard: React.FC = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<
    number | undefined
  >();
  const [searchValue, setSearchValue] = useState('');

  const navigation = useNavigation();

  async function handleNavigate(id: number): Promise<void> {
    navigation.navigate('FoodDetails', { id });
  }

  useEffect(() => {
    async function loadFoods(): Promise<void> {
      if (selectedCategory || searchValue) {
        if (selectedCategory) {
          const { data } = await api.get(
            `/foods?category_like=${selectedCategory}`,
          );
          const newData = data.map((food: Food) => {
            return {
              ...food,
              formattedPrice: formatValue(food.price),
            };
          });
          setFoods(newData);
        }
        if (searchValue) {
          const { data } = await api.get(`/foods?name_like=${searchValue}`);
          const newData = data.map((food: Food) => {
            return {
              ...food,
              formattedPrice: formatValue(food.price),
            };
          });
          setFoods(newData);
        }
      } else {
        const newFoods = [
          {
            id: 1,
            name: 'Ao molho',
            description:
              'Macarrão ao molho branco, fughi e cheiro verde das montanhas.',
            price: 19.9,
            formattedPrice: String(formatValue(19.9)),
            category: 1,
            thumbnail_url:
              'https://storage.googleapis.com/golden-wind/bootcamp-gostack/desafio-gorestaurant-mobile/ao_molho.png',
            extras: [
              {
                id: 1,
                name: 'Bacon',
                value: 1.5,
              },
              {
                id: 2,
                name: 'Frango',
                value: 2,
              },
            ],
          },
          {
            id: 2,
            name: 'Veggie',
            description:
              'Macarrão com pimentão, ervilha e ervas finas colhidas no himalaia.',
            price: 21.9,
            formattedPrice: String(formatValue(21.9)),
            category: 2,
            thumbnail_url:
              'https://storage.googleapis.com/golden-wind/bootcamp-gostack/desafio-gorestaurant-mobile/veggie.png',
            extras: [
              {
                id: 3,
                name: 'Bacon',
                value: 1.5,
              },
            ],
          },
          {
            id: 3,
            name: 'A la Camarón',
            description:
              'Macarrão com vegetais de primeira linha e camarão dos 7 mares.',
            price: 25.9,
            formattedPrice: String(formatValue(25.9)),
            category: 3,
            thumbnail_url:
              'https://storage.googleapis.com/golden-wind/bootcamp-gostack/desafio-gorestaurant-mobile/camarao.png',
            extras: [
              {
                id: 4,
                name: 'Bacon',
                value: 1.5,
              },
            ],
          },
        ];

        setFoods(newFoods);
      }
    }

    loadFoods();
  }, [selectedCategory, searchValue]);

  useEffect(() => {
    async function loadCategories(): Promise<void> {
      const { data } = await api.get('/categories');
      setCategories(data);
    }

    loadCategories();
  }, []);

  function handleSelectCategory(id: number): void {
    if (id === selectedCategory) {
      setSelectedCategory(undefined);
      return;
    }
    setSelectedCategory(id);
  }

  return (
    <Container>
      <Header>
        <Image source={Logo} />
        <Icon
          name="log-out"
          size={24}
          color="#FFB84D"
          onPress={() => navigation.navigate('Home')}
        />
      </Header>
      <FilterContainer>
        <SearchInput
          value={searchValue}
          onChangeText={setSearchValue}
          placeholder="Qual comida você procura?"
        />
      </FilterContainer>
      <ScrollView>
        <CategoryContainer>
          <Title>Categorias</Title>
          <CategorySlider
            contentContainerStyle={{
              paddingHorizontal: 20,
            }}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {categories.map(category => (
              <CategoryItem
                key={category.id}
                isSelected={category.id === selectedCategory}
                onPress={() => handleSelectCategory(category.id)}
                activeOpacity={0.6}
                testID={`category-${category.id}`}
              >
                <Image
                  style={{ width: 56, height: 56 }}
                  source={{ uri: category.image_url }}
                />
                <CategoryItemTitle>{category.title}</CategoryItemTitle>
              </CategoryItem>
            ))}
          </CategorySlider>
        </CategoryContainer>
        <FoodsContainer>
          <Title>Pratos</Title>
          <FoodList>
            {foods.map(food => (
              <Food
                key={food.id}
                onPress={() => handleNavigate(food.id)}
                activeOpacity={0.6}
                testID={`food-${food.id}`}
              >
                <FoodImageContainer>
                  <Image
                    style={{ width: 88, height: 88 }}
                    source={{ uri: food.thumbnail_url }}
                  />
                </FoodImageContainer>
                <FoodContent>
                  <FoodTitle>{food.name}</FoodTitle>
                  <FoodDescription>{food.description}</FoodDescription>
                  <FoodPricing>{food.formattedPrice}</FoodPricing>
                </FoodContent>
              </Food>
            ))}
          </FoodList>
        </FoodsContainer>
      </ScrollView>
    </Container>
  );
};

export default Dashboard;
