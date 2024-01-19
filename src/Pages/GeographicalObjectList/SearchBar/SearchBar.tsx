import "./SearchBar.sass";
import {InputAdornment, TextField} from "@mui/material";
import {Dispatch, SetStateAction, useState} from "react";
import SearchIcon from '@mui/icons-material/Search';
import IconButton from "@mui/material/IconButton";

export default function SearchBar({ feature, setFeature, setParentUpdateTrigger }: {
    feature: string,
    setFeature: React.Dispatch<React.SetStateAction<string>>,
    setParentUpdateTrigger: Dispatch<SetStateAction<boolean>>;
}) {
    const [searchFeature, setSearchFeature] = useState<string>('' || feature)

    const handleChange = (value: string) => {
        setSearchFeature(value)
    };

    // Выполняем поиск при нажатии на клавише Enter (код клавиши 13)
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter") {
            setFeature(searchFeature);
            setParentUpdateTrigger(true);
        }
    };

    // Выполняем поиск при нажатии на кнопку поиска
    const handleSearchClick = () => {
        setFeature(searchFeature);
        setParentUpdateTrigger(true);
    };

    return (
        <TextField
            type="text"
            id="outlined-basic"
            label="Поиск..."
            variant="outlined"
            autoComplete="feature"
            value={searchFeature}
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