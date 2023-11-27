import "./SearchBar.sass"
import {Dispatch} from "react";

const SearchBar = ({ feature, setQuery }: {feature:string, setQuery: Dispatch<string>}) => {

    const handleChange = (value: string) => {
        setQuery(value)
    }

    return (
        <form className="search-bar-wrapper">
            <input
                type="text"
                placeholder="Поиск..."
                name="feature"
                autoComplete="off"
                value={feature}
                onChange={(e) => handleChange(e.target.value)}
            />
        </form>
    )
}

export default SearchBar;