import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { ThemeProvider, createTheme } from '@mui/material';

export default function BasicTimePicker(props) {
    const theme = createTheme();

    return (
        <ThemeProvider theme={theme}>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
        {/* <DemoContainer components={['TimePicker']}> */}
            <TimePicker label="Time" 
                defaultValue={props.defaultValue}
                value={props.value} 
                onChange={props.onChange}
            />
        {/* </DemoContainer> */}
        </LocalizationProvider>
        </ThemeProvider>

    );
}
