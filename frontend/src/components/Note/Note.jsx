import React from "react";
import { AiOutlinePlusSquare, AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import CalendarCustomize from "../Calendar/Calendar";
import './Note.css'
import { format } from 'date-fns'
import { useState } from "react";
import Takenote from "./Takenote";
import Popup from "reactjs-popup";
import { Pagination, ThemeProvider, createTheme} from "@mui/material";
import { NoteData } from "./NoteData";
import MiniNote from "./MiniNote";
import { ChevronDownIcon, ChevronUpIcon, MinusIcon, PlusSquareIcon, TimeIcon } from "@chakra-ui/icons";

import 'reactjs-popup/dist/index.css';
import Search from "../Search/Search";
import { Center, Grid, GridItem, Text } from "@chakra-ui/react";
// import DateTimePickerValue from "../DateTimePicker/DateTimePicker";
import BasicDateTimePicker from "../DateTimePicker/DateTimePicker";
import dayjs from 'dayjs';
import { Button } from "bootstrap";

const theme = createTheme();


const Note = (props) => {
    // const [calendar, setCalendar] = useState(false);
    const [fromdate, setFromDate] = useState(dayjs(new Date()));
    const [todate, setToDate] = useState(fromdate)
    const pageSize = props.pageSize;
    const [page, setPage] = useState(1);
    const [data, setData] = useState(NoteData);
    const handleChangePage = (event, newpage) => {
        setPage(newpage);
    };
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const slicedData = data.slice(startIndex, endIndex);
    

    return (
        <div className="Note">
            <Grid 
                // templateRows={'repeat(2, 1fr'}
                templateColumns={'repeat(11, 1fr)'}
                h='40px'
            >
                <GridItem marginTop={1} colSpan={2}>
                    <Text className="header">Note</Text> 
                    <Popup trigger={<PlusSquareIcon marginBottom={1} boxSize={'1.2em'} className="icon-add"/>}
                        nested modal contentStyle={{background: 'none', border: 'none'}}>
                        <Takenote/>
                    </Popup>
                </GridItem>
                <GridItem colSpan={4} rowSpan={1}>
                    <BasicDateTimePicker value={fromdate} onChange={setFromDate}/> 
                </GridItem>
                <GridItem marginTop={6} colSpan={1}>
                    <Center>
                        <MinusIcon boxSize={'0.5em'}/>
                    </Center>
                </GridItem>
                <GridItem colSpan={4}>
                    <BasicDateTimePicker value={todate} minDateTime={fromdate} onChange={setToDate}/> 
                </GridItem>
            </Grid>
            <div className="NoteList">
                <ThemeProvider theme={theme}>
                    <div className="NoteDetail" style={{width: '100%'}}>
                        {
                            slicedData.map(note => (
                                <MiniNote important={note.important} text={note.text} id={note.id} date={format(note.date, 'dd-MMM-yyyy hh:mm:ss a')}/>
                            ))
                        }
                    </div>
                    <div className="pagination-note-container">
                    
                    <Pagination
                        count={Math.ceil(data.length / pageSize)}
                        page={page}
                        onChange={handleChangePage}
                        shape="rounded"
                        showFirstButton
                        showLastButton
                    />
                    </div>
                </ThemeProvider>
            </div>
        </div>
    );
};

export default Note;