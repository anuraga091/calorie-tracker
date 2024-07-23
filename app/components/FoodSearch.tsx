import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { searchFood, getFoodDetails } from '../services/api/foodApi';
import { Food } from '../types/food'; 
import { useDebounce } from '../hooks/useDebounce';

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
      <div className="flex items-center mb-4 bg-gray-100 p-2 rounded">
        <button onClick={onBack} className="mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <input
          type="text"
          {...register('query')}
          placeholder="Search for food"
          className="border p-2 flex-grow rounded"
          onFocus={() => setShowResults(true)}
        />
        <button onClick={handleClear} className="ml-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {showResults && (
        <ul>
          {results.map((item) => (
            <li
              key={item.id}
              className="flex justify-between items-center bg-gray-100 p-2 mb-2 rounded cursor-pointer"
              onClick={() => handleSelectFood(item)}
            >
              <div>
                <h4>{item.title}</h4>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FoodSearch;
