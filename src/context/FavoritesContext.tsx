// FavoritesContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the structure of a GitHub user (for favorites)
interface GitHubUser {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
}

// Define what our Context will provide
interface FavoritesContextType {
  favorites: GitHubUser[];
  addToFavorites: (user: GitHubUser) => void;
  removeFromFavorites: (userId: number) => void;
  isFavorite: (userId: number) => boolean;
  getFavoritesCount: () => number;
  clearAllFavorites: () => void;
}

// Create the Context with undefined as default
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// Create a custom hook to use the context easily
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

// Constants for localStorage
const FAVORITES_STORAGE_KEY = 'github-search-favorites';

// Helper functions for localStorage operations
const loadFavoritesFromStorage = (): GitHubUser[] => {
  try {
    // Get the data from localStorage
    const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
    
    // If no data exists, return empty array
    if (!storedFavorites) {
      return [];
    }
    
    // Parse the JSON string back to JavaScript object
    const parsedFavorites = JSON.parse(storedFavorites);
    
    // Validate that it's an array
    if (!Array.isArray(parsedFavorites)) {
      console.warn('Invalid favorites data in localStorage, resetting...');
      return [];
    }
    
    return parsedFavorites;
  } catch (error) {
    // If there's any error (corrupt data, etc.), return empty array
    console.error('Error loading favorites from localStorage:', error);
    return [];
  }
};

const saveFavoritesToStorage = (favorites: GitHubUser[]): void => {
  try {
    // Convert JavaScript object to JSON string
    const favoritesJson = JSON.stringify(favorites);
    
    // Save to localStorage
    localStorage.setItem(FAVORITES_STORAGE_KEY, favoritesJson);
  } catch (error) {
    // Handle storage errors (storage full, etc.)
    console.error('Error saving favorites to localStorage:', error);
  }
};

// Create the Provider component that will wrap our app
interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {
  // Initialize state with data from localStorage
  const [favorites, setFavorites] = useState<GitHubUser[]>(() => {
    // This function runs only once when component mounts
    return loadFavoritesFromStorage();
  });

  // Save to localStorage whenever favorites change
  useEffect(() => {
    saveFavoritesToStorage(favorites);
  }, [favorites]); // This runs every time favorites array changes

  // Function to add a user to favorites
  const addToFavorites = (user: GitHubUser) => {
    setFavorites(prev => {
      // Check if user is already in favorites to avoid duplicates
      const isAlreadyFavorite = prev.some(fav => fav.id === user.id);
      if (isAlreadyFavorite) {
        return prev; // Don't add if already exists
      }
      
      const newFavorites = [...prev, user];
      // No need to manually save here - useEffect will handle it
      return newFavorites;
    });
  };

  // Function to remove a user from favorites
  const removeFromFavorites = (userId: number) => {
    setFavorites(prev => {
      const newFavorites = prev.filter(user => user.id !== userId);
      // No need to manually save here - useEffect will handle it
      return newFavorites;
    });
  };

  // Function to check if a user is in favorites
  const isFavorite = (userId: number) => {
    return favorites.some(user => user.id === userId);
  };

  // Function to get the count of favorites
  const getFavoritesCount = () => {
    return favorites.length;
  };

  // Function to clear all favorites (bonus feature)
  const clearAllFavorites = () => {
    setFavorites([]);
    // useEffect will automatically save the empty array to localStorage
  };

  // The value object that will be provided to all child components
  const value: FavoritesContextType = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    getFavoritesCount,
    clearAllFavorites
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};