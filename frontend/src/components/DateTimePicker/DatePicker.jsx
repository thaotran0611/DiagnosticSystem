import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ThemeProvider, createTheme } from '@mui/material';

export default function BasicDatePicker(props) {
const theme = createTheme();
  return (
    <ThemeProvider theme={theme}>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
        {/* <DemoContainer components={['DatePicker']}> */}
            <DatePicker label="Start Date" 
                minDate={props.minDate} 
                defaultValue={props.defaultValue}
                value={props.value} 
                onChange={props.onChange}
            />
        {/* </DemoContainer> */}
        </LocalizationProvider>
    </ThemeProvider>

  );
}
