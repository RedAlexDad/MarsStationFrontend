import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {useDispatch, useSelector} from "react-redux";
import {updateDateFormAfter, updateDateFormBefore} from "../../../store/Search.ts";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import * as dayjs from "dayjs";
import {Dispatch, SetStateAction} from "react";
import {RootState} from "../../../store/store.ts";

const SearchDateForm = ({setUpdateTriggerParent}: {
    setUpdateTriggerParent: Dispatch<SetStateAction<boolean>>,
}) => {
    const dispatch = useDispatch();
    const date = useSelector((state: RootState) => state.search.date);
    let dayjsDateBefore = dayjs(date.input_before);
    let dayjsDateAfter = dayjs(date.input_after);

    const formatDate = (date: string) => dayjs(date).format("YYYY-MM-DD");
    const handleBeforeDateChange = (date: Date | any) => {
        const formattedDate: string = formatDate(date);
        dispatch(
            updateDateFormBefore({
                date_before: formattedDate,
                input_before: dayjsDateBefore.isValid() ? dayjsDateBefore.toISOString() : "",
            })
        );
        setUpdateTriggerParent(true);
    };
    const handleAfterDateChange = (date: any) => {
        const formattedDate: string = formatDate(date);
        dispatch(
            updateDateFormAfter({
                date_after: formattedDate,
                input_after: dayjsDateAfter.isValid() ? dayjsDateAfter.toISOString() : "",
            })
        );
        setUpdateTriggerParent(true);
    };

    return (
        <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box display="flex" alignItems="center">
                    <DatePicker
                        label="ПОСЛЕ"
                        value={dayjsDateAfter.isValid() ? dayjsDateAfter.toDate() : null}
                        onChange={handleAfterDateChange}
                        sx={{ '& input, & label, & .MuiIconButton-label': { color: 'white' } }}
                    />
                    <Typography variant="body1" mx={2}>
                        —
                    </Typography>
                    <DatePicker
                        label="ДО"
                        value={dayjsDateBefore.isValid() ? dayjsDateBefore.toDate() : null}
                        onChange={handleBeforeDateChange}
                        sx={{ '& input, & label, & .MuiIconButton-label': { color: 'white' } }}
                    />
                </Box>
            </LocalizationProvider>
        </div>
    );
}

export default SearchDateForm;