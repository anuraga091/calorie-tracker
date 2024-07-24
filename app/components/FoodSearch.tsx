import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { searchFood, getFoodDetails } from '../../services/api/foodApi';
import { Food } from '../types/food'; 
import { useDebounce } from '../hooks/useDebounce';
import Image from 'next/image';

interface FoodSearchProps {
  onAdd: (food: Food) => void;
  onBack: () => void;
}

interface SearchFormData {
  query: string;
}

const FoodSearch: React.FC<FoodSearchProps> = ({ onAdd, onBack }) => {
  const { register, watch, setValue, reset } = useForm<SearchFormData>();
  const [results, setResults] = useState<Food[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const query = watch('query');
  const debouncedQuery = useDebounce(query, 1000);

  useEffect(() => {
    const fetchFoodData = async () => {
      if (debouncedQuery) {
        setLoading(true);
        setError(null);
        try {
          const data = await searchFood(debouncedQuery);
          setResults(data);
          setShowResults(true);
        } catch (err) {
          setError('Failed to fetch food data. Please try again.');
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    };

    fetchFoodData();
  }, [debouncedQuery]);

  const handleSelectFood = async (item: any) => {
    try {
      const foodDetails = await getFoodDetails(item.id);
      const food: Food = {
        title: foodDetails.title,
        id: foodDetails.id,
        restaurantChain: foodDetails.restaurantChain,
        nutrients: {
          calories: foodDetails.nutrition.calories,
          protein: foodDetails.nutrition.protein,
          carbs: foodDetails.nutrition.carbs,
          fat: foodDetails.nutrition.fat,
        },
        image: foodDetails.images?.[0] || item.image,
      };
      onAdd(food);
      setValue('query', '');
      reset();
      setShowResults(false);
    } catch (err) {
      setError('Failed to fetch food details. Please try again.');
    }
  };

  const handleClear = () => {
    setValue('query', '');
    setResults([]);
    setShowResults(false);
  };

  return (
    <div className="mb-4">
      <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 mb-4">
        <Image src='/search.png' alt='search' height={24} width={24}/>
        <input
          type="text"
          {...register('query')}
          placeholder="Search..."
          className="bg-gray-100 ml-2 outline-none flex-grow"
          onFocus={() => setShowResults(true)}
        />
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {showResults && (
        <ul className='mb-4 bg-white p-4 rounded-lg shadow'>
          {results.map((item) => (
            <li
              key={item.id}
              className=" mb-1 p-1 hover:bg-gray-100  cursor-pointer"
              onClick={() => handleSelectFood(item)}
            >
              <div>
                <p>{item.title}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FoodSearch;
