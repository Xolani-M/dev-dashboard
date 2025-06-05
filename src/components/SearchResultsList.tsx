import React from 'react';
import "./SearchResultsList.css";
import { SearchResults } from './SearchResults';

interface SearchResultsListProps {
    results: any[];
}

export const SearchResultsList = ({ results }: SearchResultsListProps) => {
    return (
        <div className="results-list">
            {results.map((result, id) => {
                return <SearchResults result={result} key={id} />
            })}
        </div>
    );
};