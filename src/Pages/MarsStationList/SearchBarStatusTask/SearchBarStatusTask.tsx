import {useTheme} from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import {useDispatch} from 'react-redux';
import {updateStatusTask} from '../../../store/Search';
import {Dispatch, SetStateAction} from 'react';
import {useAuth} from '../../../hooks/useAuth';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
            color: 'white', // Цвет текста в выпадающем списке
        },
    },
};

export default function SearchBarStatusTask({status_task, setUpdateTriggerParent}: {
    status_task: string[];
    setUpdateTriggerParent: Dispatch<SetStateAction<boolean>>;
}) {
    const {is_moderator} = useAuth();
    const dispatch = useDispatch();
    const theme = useTheme();

    const statusOptions = is_moderator
        ? [
            {value: '2', label: 'В работе'},
            {value: '3', label: 'Завершена'},
            {value: '4', label: 'Отменена'},
        ]
        : [
            {value: '2', label: 'В работе'},
            {value: '3', label: 'Завершена'},
            {value: '4', label: 'Отменена'},
        ];

    const handleChange = (event: SelectChangeEvent<typeof status_task>) => {
        const {
            target: {value},
        } = event;
        const updatedStatus = Array.isArray(value) ? value : [value];

        dispatch(updateStatusTask(updatedStatus));
        setUpdateTriggerParent(true);
    };

    return (
        <div>
            <FormControl sx={{m: 1, width: 300}}>
                <InputLabel
                    id="demo-multiple-chip-label"
                    sx={{color: 'white'}} // Цвет текста над выпадающим списком
                >
                    Статус заявки
                </InputLabel>
                <Select
                    labelId="demo-multiple-chip-label"
                    id="demo-multiple-chip"
                    multiple
                    value={status_task}
                    onChange={handleChange}
                    input={<OutlinedInput id="select-multiple-chip" label="Статус заявки"/>}
                    renderValue={(selected) => (
                        <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5, color: 'white'}}>
                            {selected.map((value) => (
                                <Chip key={value} label={statusOptions.find((opt) => opt.value === value)?.label}/>
                            ))}
                        </Box>
                    )}
                    MenuProps={MenuProps}
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
                        '& .MuiChip-root': {color: 'white'}
                    }}
                >
                    {statusOptions.map((option) => (
                        <MenuItem
                            key={option.value}
                            value={option.value}
                            style={{
                                fontWeight: status_task.includes(option.value) ? theme.typography.fontWeightMedium : theme.typography.fontWeightRegular,
                                color: 'black', // Цвет текста в выпадающем списке
                            }}
                        >
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}
