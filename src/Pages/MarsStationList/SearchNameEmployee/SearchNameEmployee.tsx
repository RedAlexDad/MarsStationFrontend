import "./SearchNameEmployee.sass";
import {useDispatch, useSelector} from "react-redux";
import {updateFullNameEmployee} from "../../../store/Search.ts";
import {InputAdornment, TextField} from "@mui/material";
import {useState} from "react";
import SearchIcon from '@mui/icons-material/Search';
import IconButton from "@mui/material/IconButton";
import {RootState} from "../../../store/store.ts";

export default function SearchNameEmployee() {
    const dispatch = useDispatch();
    const full_name = useSelector((state: RootState) => state.search.full_name);
    const [searchFullName, setSearchFullName] = useState<string>('' || full_name)

    const handleChange = (value: string) => {
        setSearchFullName(value)
    };

    // Выполняем поиск при нажатии на клавише Enter (код клавиши 13)
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter") {
            dispatch(updateFullNameEmployee(searchFullName));
        }
    };

    // Выполняем поиск при нажатии на кнопку поиска
    const handleSearchClick = () => {
        dispatch(updateFullNameEmployee(searchFullName));
    };

    return (
        <TextField
            type="text"
            id="outlined-basic"
            label="Поиск ФИО сотрудника..."
            variant="outlined"
            autoComplete="full_name"
            value={searchFullName}
            onChange={(e) => handleChange(e.target.value)}
            // Добавляем обработчик события для клавиши Enter
            onKeyDown={handleKeyDown}
            // Добавляем InputAdornment с кнопкой поиска
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                            onClick={handleSearchClick}
                            edge="end"
                            sx={{color: 'white'}}
                        >
                            <SearchIcon/>
                        </IconButton>
                    </InputAdornment>
                ),
            }}
            sx={{
                '& input, & label, & .MuiIconButton-label': {color: 'white'},
                '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white',
                },
            }}
        />
    );
}