import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { ThemeProvider, createTheme } from '@mui/material';

export default function BasicDateTimePicker(props) {
    const theme = createTheme();
    return (
        <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                {/* <DemoContainer components={['DateTimePicker']}> */}
                    <DateTimePicker sx={{border: 'none'}}
                        minDate={props.minDate} 
                        minTime={props.minTime} 
                        maxDate={props.maxDate}
                        maxTime={props.maxTime}
                        value={props.value} 
                        onChange={props.onChange} 
                        label={props.text}
                        defaultValue={props.defaultValue}
                        minDateTime={props.minDateTime}
                        />
                {/* </DemoContainer> */}
            </LocalizationProvider>
        </ThemeProvider>
    );
}