import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';
import { Box } from '@chakra-ui/react';

const CalendarCustomize = (props) => {
  return (
    <Box>
    <Calendar
      onChange={props.onChange}
      value={props.value}
    />
    </Box>
  );
}

export default CalendarCustomize;