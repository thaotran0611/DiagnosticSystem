import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';

const CalendarCustomize = (props) => {
  return (
    <Calendar
      onChange={props.onChange}
      value={props.value}
    />
  );
}

export default CalendarCustomize;