import PropTypes from "prop-types";
import { useState } from "react";

const SearchBar = ({ onSearch, searchQuery }) => {
    const [query, setQuery] = useState("");

    const handleSearch = (e) => {
        setQuery(e.target.value);
        onSearch(e.target.value);
    };

    return (
        <div className="lg:w-1/3">
            <input
                type="text"
                value={query}
                onChange={handleSearch}
                placeholder={searchQuery}
                className="w-full px-4 py-2 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:focus:ring-blue-400 transition duration-300 ease-in-out"
            />
        </div>
    );
};

SearchBar.propTypes = {
    onSearch: PropTypes.func.isRequired,
    searchQuery: PropTypes.string.isRequired,
};

export default SearchBar;
