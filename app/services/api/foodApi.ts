import axios from 'axios';

const API_KEY = '93b30b58a5msh2a20ff8240fafebp1fdffajsnbc29d5bd7c58';
const API_HOST = 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com';

const apiClient = axios.create({
  baseURL: `https://${API_HOST}`,
  headers: {
    'x-rapidapi-host': API_HOST,
    'x-rapidapi-key': API_KEY,
  },
});

export const searchFood = async (query: string) => {
  const response = await apiClient.get(`/food/menuItems/search`, {
    params: {
      query,
      number: 10,
    },
  });
  return response.data.menuItems;
};

export const getFoodDetails = async (id: number) => {
  const response = await apiClient.get(`/food/menuItems/${id}`);
  return response.data;
};
