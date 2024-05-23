import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AbsoluteCenter, Box, Divider, Grid, GridItem, IconButton, ScaleFade, SimpleGrid, Text, Textarea } from "@chakra-ui/react";
import { Center } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { BellIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon } from "@chakra-ui/icons";
import MyPagination from "../../../components/Pagination/Pagination";
import { Pagination, ThemeProvider, createTheme } from "@mui/material";
import GeneralCard from "../../../components/GeneralCard/GeneralCard";
// import MyTable from "../../../components/MyTable/MyTable";
import MyTable2 from "../../../components/MyTable/MyTable2";
import { textData } from "../../../components/Note/NoteData";

const ClinicalSignTab = (props) => {
    const [expandNote, setExpandNote] = useState(2);

    const researcher_code = sessionStorage.getItem('user')
    ? JSON.parse(sessionStorage.getItem('user')).code
    : '0';
    const note = props.clinicalsign ?? []; 
    const [selectedNote, setSelectedNote] = useState(null); // PASS AS PARAMETER

    useEffect(() => {
        setSelectedNote(props.clinicalsign[0])
    }, [props.clinicalsign]);
    // const [note, setNote] = useState([]); // PASS AS PARAMETER
    // const [loadingNote, setLoadingNote] = useState(true);
    const [error, setError] = useState(null);
    const handleRecordSelection = (record) => {
        setSelectedNote(record);
        // console.log('Selected Note:', record.Text); // Add this line to log the selected note
    };



    return(
        <Grid gridTemplateRows={expandNote === 1 ? '3% 96%':
                                expandNote === 2 ? '52% 3% 45%':
                                                        '97% 3%'}
                h='100%'>
            {expandNote === 1 ? null : 
            <GridItem h={'100%'} position={'relative'} >
                <Box h={'98%'}>
                    <MyTable2 tablename='Table of Note events' data={props.clinicalsign.map(item => {
                                    const newItem = {};
                                    for (const [oldKey, newKey] of Object.entries(props.mapping)) {
                                        if (item.hasOwnProperty(oldKey)) {
                                        newItem[newKey] = item[oldKey];
                                        }
                                    }
                                    return newItem;
                                })} height={expandNote === 3 ? '560px' : '260px'}
                              width={props.expand ? '1700px' : '1100px'} onSelect={handleRecordSelection}/>
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
                {selectedNote  ? <Text fontSize={'20px'} fontWeight={500} color={'#3E36B0'}>{selectedNote['Admission ID']} - {selectedNote['Category']} - {selectedNote['Chart Time']} note</Text> : null }
                {selectedNote  ? <Textarea scr borderRadius={20} p={8} value={selectedNote.Text} bg={'rgba(17,17,17,0.1)'} h={'90%'} resize={'none'} readOnly placeholder='Here is a sample placeholder' /> : null}
            </GridItem>}
        </Grid>
    )
}

export default ClinicalSignTab;