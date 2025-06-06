// FavoritesContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

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
}

// Create the Context with undefined as default (This create a container that will hold shared data)
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// Create a custom hook to use the context easily (This makes it easy to access our context data)
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

// Create the Provider component that will wrap our app
//This wraps our entire app and provides the favorites data to all child components
interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {
    
  // State to hold our favorites
  const [favorites, setFavorites] = useState<GitHubUser[]>([]);

  // Function to add a user to favorites
  const addToFavorites = (user: GitHubUser) => {
    setFavorites(prev => {
      // Check if user is already in favorites to avoid duplicates
      const isAlreadyFavorite = prev.some(fav => fav.id === user.id);
      if (isAlreadyFavorite) {
        return prev; // Don't add if already exists
      }
      return [...prev, user]; // Add to favorites
    });
  };

  // Function to remove a user from favorites
  const removeFromFavorites = (userId: number) => {
    setFavorites(prev => prev.filter(user => user.id !== userId));
  };

  // Function to check if a user is in favorites
  const isFavorite = (userId: number) => {
    return favorites.some(user => user.id === userId);
  };

  // Function to get the count of favorites
  const getFavoritesCount = () => {
    return favorites.length;
  };

  // The value object that will be provided to all child components
  const value: FavoritesContextType = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    getFavoritesCount
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};