import React from 'react';
import './UserCard.css';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

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
                {/* Replace <a> with <Link> to avoid full page reload */}
                <Link 
                    to={`/user/${user.login}`} // Navigates to /user/username
                    className="profile-link"
                >
                    View Profile
                </Link>
            </div>
        </div>
    );
};