import React, { useState, useEffect, useCallback } from "react";

type SearchBarProps = {
  onSearch: (searchText: string) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchText, setSearchText] = useState("");

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchText(event.target.value);
    },
    []
  );

  useEffect(() => {
    onSearch(searchText);
  }, [searchText, onSearch]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search by title or description"
        value={searchText}
        onChange={handleSearch}
        className="placeholder:italic w-full sm:w-80 px-4 py-2 border border-gray-500 rounded-lg shadow-sm  focus:outline-none focus:border-blue-600 focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
      />
    </div>
  );
};

export default SearchBar;
