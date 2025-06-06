import React, { createContext, useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

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

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

// ✅ Favorites Page Component (Merged)
export const FavoritesPage = () => {
  const { favorites, removeFromFavorites, clearAllFavorites } = useFavorites();

  const handleClearAll = () => {
    if (
      window.confirm(
        `Are you sure you want to remove all ${favorites.length} favorites? This action cannot be undone.`
      )
    ) {
      clearAllFavorites();
    }
  };

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Favorite Developers ({favorites.length})</h1>
        {favorites.length > 0 && (
          <button
            onClick={handleClearAll}
            style={{
              padding: '8px 16px',
              backgroundColor: '#ff6b6b',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            Clear All Favorites
          </button>
        )}
      </div>

      <Link to="/">← Back to Home</Link>

      {favorites.length === 0 ? (
        <div style={{ marginTop: '20px' }}>
          <p style={{ color: '#666', fontSize: '16px' }}>
            No favorite developers yet. Search for users and add them to favorites!
          </p>
          <p style={{ color: '#999', fontSize: '14px', marginTop: '10px' }}>
            💡 Your favorites are automatically saved in your browser and will persist across sessions.
          </p>
        </div>
      ) : (
        <div style={{ marginTop: '20px' }}>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>
            ✅ Your {favorites.length} favorite{favorites.length !== 1 ? 's are' : ' is'} automatically saved in your browser
          </p>

          {favorites.map(user => (
            <div key={user.id} className="user-card" style={{ marginBottom: '10px' }}>
              <img src={user.avatar_url} alt={user.login} className="user-avatar" />
              <div className="user-info">
                <h4 className="user-name">{user.login}</h4>
                <Link to={`/user/${user.login}`} className="profile-link">
                  View Profile
                </Link>
              </div>
              <button
                onClick={() => removeFromFavorites(user.id)}
                style={{
                  marginLeft: 'auto',
                  padding: '5px 10px',
                  backgroundColor: '#ff4757',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ✅ LocalStorage utility
const FAVORITES_STORAGE_KEY = 'github-search-favorites';

const loadFavoritesFromStorage = (): GitHubUser[] => {
  try {
    const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!storedFavorites) return [];
    const parsedFavorites = JSON.parse(storedFavorites);
    return Array.isArray(parsedFavorites) ? parsedFavorites : [];
  } catch (error) {
    console.error('Error loading favorites from localStorage:', error);
    return [];
  }
};

const saveFavoritesToStorage = (favorites: GitHubUser[]) => {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites to localStorage:', error);
  }
};

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

  const isFavorite = (userId: number) => {
    return favorites.some(user => user.id === userId);
  };

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
