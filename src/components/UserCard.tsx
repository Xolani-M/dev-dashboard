import React from 'react';
import './UserCard.css';
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';

interface UserCardProps {
    user: {
        id: number;
        login: string;
        avatar_url: string;
        html_url: string;
    };
}

export const UserCard = ({ user }: UserCardProps) => {
    const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
    
    const handleFavoriteClick = () => {
        if (isFavorite(user.id)) {
            removeFromFavorites(user.id);
        } else {
            addToFavorites(user);
        }
    };

    return (
        <div className="user-card">
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
                onClick={handleFavoriteClick}
                style={{
                    marginLeft: 'auto',
                    padding: '8px 12px',
                    backgroundColor: isFavorite(user.id) ? '#ff4757' : '#5dade2',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'background-color 0.2s ease'
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.opacity = '0.8';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.opacity = '1';
                }}
            >
                {isFavorite(user.id) ? '💔 Remove' : '❤️ Add'}
            </button>
        </div>
    );
};