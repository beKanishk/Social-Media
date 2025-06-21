import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchUsers } from '../redux/Auth/Action';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon, User } from 'lucide-react';
import UserProfile from '../components/UserProfile';
import debounce from 'lodash/debounce';
import Navbar from '../components/Navbar';

const Search = () => {
  const dispatch = useDispatch();
  const { results = [] } = useSelector((state) => state.auth || {});
  const [query, setQuery] = useState('');
  const [selectedUserName, setSelectedUserName] = useState(null);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((value) => {
      if (value.trim().length >= 1) {
        dispatch(searchUsers(value.trim(), localStorage.getItem('jwt')));
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(query);
    return debouncedSearch.cancel;
  }, [query, debouncedSearch]);

  const handleUserClick = (user) => {
    setSelectedUserName(user.userName);
  };

  const handleBack = () => setSelectedUserName(null);

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-start min-h-screen pt-24 px-4 md:ml-64">
        <div className="mb-6 relative w-full max-w-2xl">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search users..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        {selectedUserName ? (
          <>
            <Button onClick={handleBack} variant="outline" size="sm" className="mb-4">Back to results</Button>
            <div className="w-full max-w-2xl mx-auto mb-10">
              <UserProfile userName={selectedUserName} variant="inline" />
            </div>

          </>
        ) : (
          query.trim().length >= 1 && (
            <Card className="shadow-lg w-full max-w-2xl mx-auto">
              <CardContent className="p-0">
                {results.length > 0 ? (
                  <div className="max-h-80 overflow-y-auto divide-y">
                    {results.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center space-x-3 p-4 hover:bg-muted cursor-pointer"
                        onClick={() => handleUserClick(user)}
                      >
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg font-bold text-muted-foreground">
                          {user.name?.[0] || user.userName?.[0] || <User className="w-5 h-5" />}
                        </div>
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
          )
        )}
      </div>
    </>
  );
};

export default Search; 