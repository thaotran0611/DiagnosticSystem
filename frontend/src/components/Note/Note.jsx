import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AiOutlinePlusSquare, AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import CalendarCustomize from "../Calendar/Calendar";
import './Note.css'
import { format } from 'date-fns'
import Takenote from "./Takenote";
import Popup from "reactjs-popup";
import { Pagination, ThemeProvider, createTheme} from "@mui/material";
import MiniNote from "./MiniNote";
import { ChevronDownIcon, ChevronUpIcon, MinusIcon, PlusSquareIcon, TimeIcon } from "@chakra-ui/icons";

import 'reactjs-popup/dist/index.css';
import Search from "../Search/Search";
import { Center, Grid, GridItem, Text } from "@chakra-ui/react";
import BasicDateTimePicker from "../DateTimePicker/DateTimePicker";
import dayjs from 'dayjs';
import { Button } from "bootstrap";


const theme = createTheme();

const Note = (props) => {

    const [fromdate, setFromDate] = useState(dayjs(new Date()));
    const [todate, setToDate] = useState(fromdate)
    const pageSize = props.pageSize;
    const [page, setPage] = useState(1);
    
    const handleChangePage = (event, newpage) => {
        setPage(newpage);
    };
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const slicedData = props.data.slice(startIndex, endIndex);

    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        setShowAlert(true);

        const timer = setTimeout(() => {
            setShowAlert(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const onEdit = (note_id) =>{

    }
    const onDelete = (note_id) =>{
        axios({
            method: 'post',
            url: 'http://localhost:8000/delete-self-note',
            data: {
                note_id:note_id
            },
          })
            .then((res) => {
              console.log(res)
            })
            .catch((res) => {
              console.log(res);
            });
    }
    return (
        <div className="Note">
            <Grid 
                templateColumns={'repeat(11, 1fr)'}
                h='40px'
            >
                <GridItem colSpan={2}>
                    <Text className="header">Note</Text> 
                    <Popup trigger={<PlusSquareIcon marginBottom={1} boxSize={'1.2em'} className="icon-add"/>}
                        nested modal contentStyle={{background: 'none', border: 'none'}}>
                        {close => <Takenote onSubmit={close} new={true} />}
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
                                <MiniNote onDelete={onDelete} priority={note.priority} content={note.content} note_id={note.note_id} created_at={format(note.created_at, 'yyyy-MM-dd hh:mm:ss')} title={note.title}/>
                            ))
                        }
                    </div>
                    <div className="pagination-note-container">
                    
                    <Pagination
                        count={Math.ceil(props.data.length / pageSize)}
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