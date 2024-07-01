import React from 'react';

interface SearchBoxProps {
    searchTerm: string;
    handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
    clearSearch: () => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ searchTerm, handleSearch, clearSearch }) => {
    return (
        <div className="relative w-1/2">
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full p-2 border border-gray-300 rounded-md focus:border-gray-600"
            />
            {searchTerm && (
                <button
                    onClick={clearSearch}
                    className="absolute right-2 top-2 text-gray-600 hover:text-gray-800"
                >
                    ✕
                </button>
            )}
        </div>
    );
};

export default SearchBox;
