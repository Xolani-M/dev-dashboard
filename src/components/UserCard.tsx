// UserCard.tsx
import React from 'react';
import './UserCard.css';

interface UserCardProps {
    user: {
        id: number;
        login: string;
        avatar_url: string;
        html_url: string;
    };
}

export const UserCard = ({ user }: UserCardProps) => {
    return (
        <div className="user-card">
            <img 
                src={user.avatar_url} 
                alt={user.login}
                className="user-avatar"
            />
            <div className="user-info">
                <h4 className="user-name">{user.login}</h4>
                <a 
                    href={user.html_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="profile-link"
                >
                    View Profile
                </a>
            </div>
        </div>
    );
};