import "./SearchBar.sass"
import { useDispatch } from "react-redux";
import { updateFeatureGeographicalObject } from "../../../store/SearchFeature.ts";

const SearchBar = ({ feature }: {feature:string}) => {
    const dispatch = useDispatch();

    const handleChange = (value: string) => {
        dispatch(updateFeatureGeographicalObject(value));
    };

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
    );
};

export default SearchBar;