// SearchResults.tsx
import React from 'react';
import { UserCard } from './UserCard';

interface SearchResultsProps {
    result: {
        id: number;
        login: string;
        avatar_url: string;
        html_url: string;
    };
}

export const SearchResults = ({ result }: SearchResultsProps) => {
    return <UserCard user={result} />;
};