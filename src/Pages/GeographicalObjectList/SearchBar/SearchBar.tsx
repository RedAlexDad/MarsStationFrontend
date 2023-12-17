import "./SearchBar.sass"
import { useDispatch } from "react-redux";
import { updateFeatureGeographicalObject } from "../../../store/Search.ts";
import {TextField} from "@mui/material";

const SearchBar = ({ feature }: {feature:string}) => {
    const dispatch = useDispatch();
    const handleChange = (value: string) => {
        dispatch(updateFeatureGeographicalObject(value));
    };
    return (
        <TextField
            type="text"
            id="outlined-basic"
            label="Поиск..."
            variant="outlined"
            autoComplete="feature"
            value={feature}
            onChange={(e) => handleChange(e.target.value)}
            sx={{ '& input, & label, & .MuiIconButton-label': { color: 'white' } }}
        />
    );
};

export default SearchBar;