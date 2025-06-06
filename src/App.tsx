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

// FAVORITES PAGE COMPONENT
const FavoritesPage = () => {
    const { favorites, removeFromFavorites } = useFavorites();

    return (
        <div className="page">
            <h1>Favorite Developers ({favorites.length})</h1>
            <Link to="/">← Back to Home</Link>
            
            {favorites.length === 0 ? (
                <p style={{ marginTop: '20px', color: '#666' }}>
                    No favorite developers yet. Search for users and add them to favorites!
                </p>
            ) : (
                <div style={{ marginTop: '20px' }}>
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

// NAVIGATION COMPONENT (now shows favorites count)
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

// MAIN APP COMPONENT (wrapped with Context Provider)
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