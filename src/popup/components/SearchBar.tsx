import React from 'react';
import Icon from './Icon';

interface SearchBarProps {
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onChange, placeholder, value }) => (
  <label className="ff-search">
    <Icon name="analyze" />
    <input
      aria-label={placeholder}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      type="search"
      value={value}
    />
  </label>
);

export default SearchBar;
