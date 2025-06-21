import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchUsers } from '../redux/Auth/Action';
import debounce from 'lodash/debounce';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, User } from 'lucide-react';

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
        <div className="relative">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                    type="text"
                    placeholder="Search users..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-10"
                />
            </div>
            
            {query.trim().length >= 1 && (
                <Card className="absolute top-full left-0 right-0 z-50 mt-2 shadow-lg">
                    <CardContent className="p-0">
                        {results.length > 0 ? (
                            <div className="max-h-60 overflow-y-auto">
                                {results.map((user) => (
                                    <div
                                        key={user.id}
                                        className="flex items-center space-x-3 p-3 hover:bg-muted cursor-pointer border-b last:border-b-0"
                                        onClick={() => navigate(`/user/${user.userName}`)}
                                    >
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <div className="font-medium">{user.name}</div>
                                            <div className="text-sm text-muted-foreground">@{user.userName}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-4 text-center text-muted-foreground">
                                No users found.
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default SearchBar;
