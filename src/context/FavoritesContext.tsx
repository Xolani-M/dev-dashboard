import React, { createContext, useContext, useState, useEffect} from 'react';
import type { ReactNode } from 'react';

// Define the structure of a GitHub user
interface GitHubUser {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
}

interface FavoritesContextType {
  favorites: GitHubUser[];
  addToFavorites: (user: GitHubUser) => void;
  removeFromFavorites: (userId: number) => void;
  isFavorite: (userId: number) => boolean;
  getFavoritesCount: () => number;
  clearAllFavorites: () => void;
}

// Create the Context
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// Custom hook for easy access
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

// Local storage helpers
const FAVORITES_STORAGE_KEY = 'github-search-favorites';

const loadFavoritesFromStorage = (): GitHubUser[] => {
  try {
    const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!storedFavorites) return [];
    const parsedFavorites = JSON.parse(storedFavorites);
    if (!Array.isArray(parsedFavorites)) {
      console.warn('Invalid favorites data in localStorage, resetting...');
      return [];
    }
    return parsedFavorites;
  } catch (error) {
    console.error('Error loading favorites from localStorage:', error);
    return [];
  }
};

const saveFavoritesToStorage = (favorites: GitHubUser[]): void => {
  try {
    const favoritesJson = JSON.stringify(favorites);
    localStorage.setItem(FAVORITES_STORAGE_KEY, favoritesJson);
  } catch (error) {
    console.error('Error saving favorites to localStorage:', error);
  }
};

// Provider component
interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {
  const [favorites, setFavorites] = useState<GitHubUser[]>(() => loadFavoritesFromStorage());

  useEffect(() => {
    saveFavoritesToStorage(favorites);
  }, [favorites]);

  const addToFavorites = (user: GitHubUser) => {
    setFavorites(prev => {
      if (prev.some(fav => fav.id === user.id)) return prev;
      return [...prev, user];
    });
  };

  const removeFromFavorites = (userId: number) => {
    setFavorites(prev => prev.filter(user => user.id !== userId));
  };

  const isFavorite = (userId: number) => favorites.some(user => user.id === userId);

  const getFavoritesCount = () => favorites.length;

  const clearAllFavorites = () => setFavorites([]);

  const value: FavoritesContextType = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    getFavoritesCount,
    clearAllFavorites,
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};
