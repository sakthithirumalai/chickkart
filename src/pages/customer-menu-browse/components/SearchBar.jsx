import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';

const SearchBar = ({ onSearch, placeholder = "Search for delicious food..." }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm !== '') {
        setIsSearching(true);
        setTimeout(() => {
          onSearch(searchTerm);
          setIsSearching(false);
        }, 300);
      } else {
        onSearch('');
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, onSearch]);

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div className="relative">
      <div className="relative">
        <Icon 
          name="Search" 
          size={18} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
        />
        <Input
          type="search"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {isSearching ? (
              <Icon name="Loader2" size={16} className="animate-spin" />
            ) : (
              <Icon name="X" size={16} />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;