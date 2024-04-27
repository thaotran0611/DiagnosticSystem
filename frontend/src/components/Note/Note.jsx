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
import { Center, Grid, GridItem, Input, InputGroup, InputLeftAddon, Text } from "@chakra-ui/react";
import BasicDateTimePicker from "../DateTimePicker/DateTimePicker";
import dayjs from 'dayjs';
import { Button } from "bootstrap";
import {Spinner } from "@chakra-ui/react";


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
    const slicedData = props.data ? props.data.slice(startIndex, endIndex) : [];

    const [showAlert, setShowAlert] = useState(false);
    const [searchvalue, setSearchvalue] = useState('');

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
        const updatedNotes = props.data.filter(note => note.note_id !== note_id);
        props.setNote(updatedNotes);
        const url = props.type == "self-note" ? 'http://localhost:8000/delete-self-note': 'http://localhost:8000/delete-patient-note';
        axios({
            method: 'post',
            url: url,
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
                templateRows={'repeat(2, 1fr)'}
                h='80px'
            >
                <GridItem colSpan={2}>
                    <Text className="header">Note</Text> 
                    <Popup trigger={<PlusSquareIcon marginBottom={1} boxSize={'1.2em'} className="icon-add"/>}
                        nested modal contentStyle={{background: 'none', border: 'none'}}>
                        {close => <Takenote data={props.data} setNote={props.setNote} onSubmit={close} new={true} type={props.type} subject_id={props.subject_id}/>}
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
                <GridItem rowStart={2} colSpan={11}>
                    <InputGroup size={'sm'} padding={'0 10px'}>
                        <InputLeftAddon bgColor={'#d9d9d9'} border={'1px solid #d9d9d9'} fontWeight={500} fontSize={'18px'} color={'#111'} borderTopLeftRadius={'10px'} borderBottomLeftRadius={'10px'}>Title</InputLeftAddon>
                        <Input w={'100%'} display={'block'} border={'1px solid #d9d9d9'} fontSize={'18px'} fontWeight={400} style={{borderTopRightRadius: '10px', borderBottomRightRadius: '10px'}} onChange={(e)=>{setSearchvalue(e.target.value)}}/>
                    </InputGroup>
                </GridItem>
            </Grid>
            <div className="NoteList">
                {props.loading ?(
                        
                                <Center h={'50%'} bg={'#fff'} borderRadius={'20px'}>
                                    <Spinner size="xl" />
                                </Center>
                            
                        ) :
                <ThemeProvider theme={theme}>
                    <div className="NoteDetail" style={{width: '100%'}}>
                        {
                            searchvalue!== '' ? 
                            slicedData.filter((item) => {
                                const itemValue = String(item.title).toLowerCase();
                                return itemValue.includes(searchvalue);
                            }).map(note => (
                                <MiniNote data={props.data} setNote={props.setNote} type={props.type} onDelete={onDelete} priority={note.priority} content={note.content} note_id={note.note_id} created_at={format(note.created_at, 'yyyy-MM-dd hh:mm:ss')} title={note.title} subject_id={props.subject_id}/>
                            ))
                            :
                            slicedData.map(note => (
                                <MiniNote data={props.data} setNote={props.setNote} type={props.type} onDelete={onDelete} priority={note.priority} content={note.content} note_id={note.note_id} created_at={format(note.created_at, 'yyyy-MM-dd hh:mm:ss')} title={note.title} subject_id={props.subject_id}/>
                            ))
                        }
                    </div>
                    <div className="pagination-note-container">
                    
                    <Pagination
                        count={Math.ceil(props.data ? props.data.length / pageSize: 0)}
                        page={page}
                        onChange={handleChangePage}
                        shape="rounded"
                        showFirstButton
                        showLastButton
                    />
                    </div>
                </ThemeProvider>
                }
            </div>
        </div>
    );
};

export default Note;