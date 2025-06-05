import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import { SearchBar } from './components/SearchBar';
import { SearchResultsList } from './components/SearchResultsList';
import UserProfile from './pages/UserProfile';

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

// ⭐ FAVORITES PAGE COMPONENT (placeholder for now)
const FavoritesPage = () => {
    return (
        <div className="page">
            <h1>Favorite Developers</h1>
            <Link to="/">← Back to Home</Link>
        </div>
    );
};

// NAVIGATION COMPONENT
const Navigation = () => {
    return (
        <nav className="navigation">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/favorites" className="nav-link">Favorites</Link>
        </nav>
    );
};

// MAIN APP COMPONENT
function App() {
    return (
        <Router>
            <div className="App">
                <Navigation /> 
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/user/:username" element={<UserProfile />} /> {/* Updated! */}
                    <Route path="/favorites" element={<FavoritesPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;