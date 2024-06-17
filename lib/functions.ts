import axios from 'axios';
import { ImageType, PixabayImageResponse, WallhavenImageResponse  } from './types';

export const fetchWallhavenImages = async (query: string, page: number = 1, parameters: string = ''): Promise<WallhavenImageResponse[]> => {
  const WALLHAVEN_BASE_URL = 'https://wallhaven.cc/api/v1';
  const queryString = `${WALLHAVEN_BASE_URL}/search${parameters ? `?${parameters}` : ''}`;

  try {
      const response = await axios.get(queryString, {
          params: {
              q: query || undefined,
              apikey: process.env.EXPO_PUBLIC_WALLHAVEN_KEY,
              page,
          },
      });
      return response.data.data as WallhavenImageResponse[];
  } catch (error) {
      console.trace('Error fetching Wallhaven images:', error);
      return [];
  }
};
    