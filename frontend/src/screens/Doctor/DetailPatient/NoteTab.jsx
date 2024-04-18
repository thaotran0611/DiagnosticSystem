import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AbsoluteCenter, Box, Divider, Grid, GridItem, IconButton, ScaleFade, SimpleGrid, Textarea } from "@chakra-ui/react";
import { Center } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { BellIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon } from "@chakra-ui/icons";
import MyPagination from "../../../components/Pagination/Pagination";
import { Pagination, ThemeProvider, createTheme } from "@mui/material";
import GeneralCard from "../../../components/GeneralCard/GeneralCard";
// import MyTable from "../../../components/MyTable/MyTable";
import MyTable2 from "../../../components/MyTable/MyTable2";
import { textData } from "../../../components/Note/NoteData";

const theme = createTheme();
const NoteTab = ({expand, subject_id}) => {
    const [expandNote, setExpandNote] = useState(2);

    const doctor_code = sessionStorage.getItem('user')
    ? JSON.parse(sessionStorage.getItem('user')).code
    : '0';

    const [note, setNote] = useState([]); // PASS AS PARAMETER
    const [loadingNote, setLoadingNote] = useState(true);
    const [error, setError] = useState(null);

    const [selectedNote, setSelectedNote] = useState(null); // PASS AS PARAMETER
    const handleRecordSelection = (record) => {
        setSelectedNote(record);
        console.log('Selected Note:', record); // Add this line to log the selected note
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/patients-detail-note', {
                    params: {
                        doctor_code: doctor_code,
                        subject_id: subject_id
                    }
                });
                setNote(response.data.note);
                setLoadingNote(false);
                // console.log(note)
            } catch (error) {
                setError(error);
                setLoadingNote(false);
            }
        };
        fetchData();
    }, []);


    return(
        <Grid gridTemplateRows={expandNote === 1 ? '3% 96%':
                                expandNote === 2 ? '52% 3% 45%':
                                                        '97% 3%'}
                h='100%'>
            {expandNote === 1 ? null : 
            <GridItem h={'100%'} position={'relative'} >
                <Box h={'100%'}>
                    <MyTable2 data={note} height={expandNote === 3 ? '600px' : '300px'}
                              width={expand ? '1700px' : '1100px'} onSelect={handleRecordSelection}/>
                </Box>
            </GridItem>}

            <GridItem h={'100%'} marginTop={2}>
                <Center height={'100%'} position='relative'>
                    <Divider orientation="horizontal" style={{height: '2px'}} color={'#3E36B0'}/>
                    <AbsoluteCenter>
                        <Box position='relative' bg={'white'} w={'90px'}>
                            <Center>
                                <IconButton
                                    isDisabled = {expandNote === 3 ? true: false}
                                    boxSize={'20px'}
                                    icon={<ChevronDownIcon/>}
                                    bg={'#3E36B0'}
                                    color={'white'}
                                    onClick={expandNote === 2 ? ()=>{setExpandNote(expandNote + 1)}: ()=>{setExpandNote(expandNote + 1)}}
                                />
                                <IconButton
                                    marginLeft={2}
                                    isDisabled = {expandNote === 1 ? true: false}
                                    boxSize={'20px'}
                                    icon={<ChevronUpIcon/>}
                                    bg={'#3E36B0'}
                                    color={'white'}
                                    onClick={expandNote === 3 ? ()=>{setExpandNote(expandNote - 1)}: ()=>{setExpandNote(expandNote - 1)}}
                                />
                            </Center>
                        </Box>
                    </AbsoluteCenter>
                </Center>
            </GridItem>
            {expandNote === 3 ? null : <GridItem h={'100%'} position={'relative'} paddingTop={'4'}>
                <Textarea scr borderRadius={20} p={8} value={selectedNote} bg={'rgba(17,17,17,0.2)'} h={'100%'} resize={'none'} readOnly placeholder='Here is a sample placeholder' />
            </GridItem>}
        </Grid>
    )
}

export default NoteTab;