import { FaSearch } from "react-icons/fa";
import "./SearchBar.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

interface SearchBarProps {
    setResults: (results: any[]) => void;
}

export const SearchBar = ({ setResults }: SearchBarProps) => {
    const [input, setInput] = useState("");

    const fetchData = (value: string) => {
        axios.get(`https://api.github.com/search/users?q=${value}`)
            .then((response) => {
                const results = response.data.items.filter((user: any) => {
                    return (
                        value &&
                        user &&
                        user.login &&
                        user.login.toLowerCase().includes(value.toLowerCase())
                    );
                });
                setResults(results);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setResults([]);
            });
    };

    // DEBOUNCING
    useEffect(() => {
        // Set a timer for 500ms
        const timer = setTimeout(() => {
            if (input.trim()) {
                fetchData(input);
            } else {
                setResults([]);
            }
        }, 500); // Wait 500ms after user stops typing

        // Clean up: if user types again before 500ms, cancel the previous timer
        return () => clearTimeout(timer);
    }, [input]); // Run this effect every time 'input' changes

    const handleChange = (value: string) => {
        setInput(value);
    };

    return (
        <div className="input-wrapper">
            <FaSearch id="search-icon" />
            <input
                type="text"
                placeholder="Search GitHub users..."
                value={input}
                onChange={(event) => handleChange(event.target.value)}
            />
        </div>
    );
};