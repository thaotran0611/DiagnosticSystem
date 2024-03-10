import React from "react";
import { AiOutlinePlusSquare, AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import CalendarCustomize from "../Calendar/Calendar";
import './Note.css'
import { format } from 'date-fns'
import { useState } from "react";
import Takenote from "./Takenote";
import Popup from "reactjs-popup";
import { ThemeProvider, createTheme} from "@mui/material";
import { NoteData } from "./NoteData";
import MiniNote from "./MiniNote";
import MyPagination from '../Pagination/Pagination'

import 'reactjs-popup/dist/index.css';

const theme = createTheme();


const Note = () => {
    const [calendar, setCalendar] = useState(false);
    const [date, setDate] = useState(new Date());
    const pageSize = 2;
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
            <p className="header">Note</p> 
            <Popup trigger={<AiOutlinePlusSquare className="icon-add"/>}
                   nested modal contentStyle={{background: 'none', border: 'none'}}>
                   <Takenote/>
            </Popup>
            <p className="date">{format(date, 'dd-MMM-yyyy')}</p>
            {!calendar ? (
                <AiOutlineDown onClick={() => setCalendar(!calendar)} className="icon-calendar"/>
            ) : (
                <AiOutlineUp onClick={() => setCalendar(!calendar)} className="icon-calendar"/>
            )}
            {calendar ? (
            <div style={{
                position: 'absolute',
                zIndex: '1'
            }}>
                <CalendarCustomize
                    onChange={setDate}
                    value={date}
                />
            </div>
            ) : (
                null
            ) }
            <div className="NoteList">
                <ThemeProvider theme={theme}>
                    <div className="NoteDetail">
                        {
                            slicedData.map(note => (
                                <MiniNote important={note.important} text={note.text} id={note.id} date={format(note.date, 'dd-MMM-yyyy hh:mm:ss a')}/>
                            ))
                        }
                    </div>
                    <div className="pagination-note-container">
                    <MyPagination
                        count={Math.ceil(data.length / pageSize)}
                        page={page}
                        onChange={handleChangePage}
                    />
                    </div>
                </ThemeProvider>
            </div>
        </div>
    );
};

export default Note;