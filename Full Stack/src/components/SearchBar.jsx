import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchUsers } from '../redux/Auth/Action';
import debounce from 'lodash/debounce';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
    const dispatch = useDispatch();
    const { results = [] } = useSelector((state) => state.auth || {});
    const [query, setQuery] = useState('');
    const navigate = useNavigate();
    
    // Debounced dispatch function
    const debouncedSearch = useCallback(
        debounce((value) => {
        if (value.trim().length >= 1) {
            dispatch(searchUsers(value.trim(), localStorage.getItem("jwt")));
        }
        }, 300),
        []
    );

    useEffect(() => {
        debouncedSearch(query);
        return debouncedSearch.cancel; // Clean up debounce on unmount
    }, [query, debouncedSearch]);

    return (
        <div className="mb-4">
            <input
                type="text"
                className="form-control"
                placeholder="Search users..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            {query.trim().length >= 1 && (
                results.length > 0 ? (
                    <ul className="list-group mt-2">
                        {results.map((user) => (
                            <li 
                            key={user.id} 
                            className="list-group-item cursor-pointer hover:bg-gray-100"
                            onClick={() => navigate(`/user/${user.userName}`)}
                          >
                            <strong>{user.name}</strong> @{user.userName}
                          </li>
                        ))}
                    </ul>
                ) : (
                    <p className="mt-2 text-muted">No users found.</p>
                )
            )}
        </div>
    );
};

export default SearchBar;
