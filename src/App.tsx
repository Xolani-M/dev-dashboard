import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import { SearchBar } from './components/SearchBar';
import { SearchResultsList } from './components/SearchResultsList';
import UserProfile from './pages/UserProfile';
import { FavoritesProvider, useFavorites } from './context/FavoritesContext';

// HOME PAGE COMPONENT
const HomePage = () => {
    const [results, setResults] = useState([]);

    return (
        <div className="page">
            <h1>GitHub Developer Search</h1>
            <div className="search-bar-container">
                <SearchBar setResults={setResults} />
                <SearchResultsList results={results} />
            </div>
        </div>
    );
};

// FAVORITES PAGE COMPONENT with Clear All functionality
const FavoritesPage = () => {
    const { favorites, removeFromFavorites, clearAllFavorites } = useFavorites();

    const handleClearAll = () => {
        if (window.confirm(`Are you sure you want to remove all ${favorites.length} favorites? This action cannot be undone.`)) {
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
                            fontWeight: '500'
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
                            <img 
                                src={user.avatar_url} 
                                alt={user.login}
                                className="user-avatar"
                            />
                            <div className="user-info">
                                <h4 className="user-name">{user.login}</h4>
                                <Link 
                                    to={`/user/${user.login}`}
                                    className="profile-link"
                                >
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
                                    cursor: 'pointer'
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

// NAVIGATION COMPONENT
const Navigation = () => {
    const { getFavoritesCount } = useFavorites();
    
    return (
        <nav className="navigation">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/favorites" className="nav-link">
                Favorites ({getFavoritesCount()})
            </Link>
        </nav>
    );
};

// MAIN APP COMPONENT
function App() {
    return (
        <FavoritesProvider>
            <Router>
                <div className="App">
                    <Navigation /> 
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/user/:username" element={<UserProfile />} />
                        <Route path="/favorites" element={<FavoritesPage />} />
                    </Routes>
                </div>
            </Router>
        </FavoritesProvider>
    );
}

export default App;
