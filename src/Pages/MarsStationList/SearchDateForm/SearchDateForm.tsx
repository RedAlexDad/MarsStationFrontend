import React from 'react';
import Grid from '@mui/material/Grid';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import MobileTimePicker from '@mui/lab/MobileTimePicker';
import MobileDateTimePicker from '@mui/lab/MobileDateTimePicker';

export default function MaterialUIPickers() {
    // The first commit of Material-UI
    const [selectedDate, handleDateChange] = React.useState<Date | null>(
        new Date('2014-08-18T21:11:54'),
    );

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid container justifyContent="space-around">
                <MobileDatePicker
                    disableToolbar
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    label="Date picker inline"
                    value={selectedDate}
                    onChange={(date) => handleDateChange(date)}
                    renderInput={(params) => <TextField {...params} />}
                />
                <MobileDatePicker
                    margin="normal"
                    id="date-picker-dialog"
                    label="Date picker dialog"
                    format="MM/dd/yyyy"
                    value={selectedDate}
                    onChange={(date) => handleDateChange(date)}
                    renderInput={(params) => <TextField {...params} />}
                />
                <MobileTimePicker
                    margin="normal"
                    id="time-picker"
                    label="Time picker"
                    value={selectedDate}
                    onChange={(date) => handleDateChange(date)}
                    renderInput={(params) => <TextField {...params} />}
                />
            </Grid>
        </LocalizationProvider>
    );
}
