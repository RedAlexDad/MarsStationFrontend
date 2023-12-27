import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {useDispatch, useSelector} from 'react-redux';
import {updateDateFormAfter, updateDateFormBefore} from '../../../store/Search.ts';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import dayjs from 'dayjs';
import {Dispatch, SetStateAction} from 'react';
import {RootState} from '../../../store/store.ts';

export default function ({setUpdateTriggerParent}: { setUpdateTriggerParent: Dispatch<SetStateAction<boolean>> }) {
    const dispatch = useDispatch();
    const date = useSelector((state: RootState) => state.search.date);
    const dayjsDateBefore = dayjs(date.input_before);
    const dayjsDateAfter = dayjs(date.input_after);

    const formatDate = (date: string) => dayjs(date).format('YYYY-MM-DD');

    const handleDateChange = (type: 'before' | 'after', date: Date | null) => {
        const formattedDate = date ? formatDate(date.toISOString()) : '';
        const updateAction = type === 'before' ? updateDateFormBefore : updateDateFormAfter;
        const currentDayjsDate = type === 'before' ? dayjsDateBefore : dayjsDateAfter;

        if (date && dayjs(date).isSame(currentDayjsDate)) {
            // Если выбрана та же самая дата, сбрасываем данные
            dispatch(
                updateAction({
                    [`date_${type}`]: '',
                    [`input_${type}`]: '',
                })
            );
        } else {
            // Иначе обновляем данные
            dispatch(
                updateAction({
                    [`date_${type}`]: formattedDate,
                    [`input_${type}`]: date ? date.toISOString() : '',
                })
            );
        }

        setUpdateTriggerParent(true);
    };

    const handleResetDates = () => {
        dispatch(updateDateFormBefore({date_before: '', input_before: ''}));
        dispatch(updateDateFormAfter({date_after: '', input_after: ''}));
        setUpdateTriggerParent(true);
    };

    return (
        <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box
                    display="flex"
                    alignItems="center"
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
                    <DatePicker
                        label="ПОСЛЕ"
                        value={dayjsDateAfter.isValid() ? dayjsDateAfter.toDate() : null}
                        onChange={(date) => handleDateChange('after', date)}
                        sx={{
                            '& input, & label, & .MuiIconButton-label, & .MuiIconButton-root': {color: 'white'},
                        }}
                    />
                    <Typography variant="body1" mx={2} sx={{color: 'white', borderColor: 'white'}}>
                        —
                    </Typography>
                    <DatePicker
                        label="ДО"
                        value={dayjsDateBefore.isValid() ? dayjsDateBefore.toDate() : null}
                        onChange={(date) => handleDateChange('before', date)}
                        sx={{
                            '& input, & label, & .MuiIconButton-label, & .MuiIconButton-root': {color: 'white'},
                        }}
                    />
                    <Typography variant="body1" mx={2}></Typography>
                    <Button variant="outlined" sx={{color: 'white', borderColor: 'white'}} onClick={handleResetDates}>
                        Сбросить даты
                    </Button>
                </Box>
            </LocalizationProvider>
        </div>
    );
}
