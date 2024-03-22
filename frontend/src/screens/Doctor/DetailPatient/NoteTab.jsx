import React, { useState } from "react";
import { AbsoluteCenter, Box, Divider, Grid, GridItem, IconButton, ScaleFade, SimpleGrid, Textarea } from "@chakra-ui/react";
import { Center } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { BellIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon } from "@chakra-ui/icons";
import MyPagination from "../../../components/Pagination/Pagination";
import { Pagination, ThemeProvider, createTheme } from "@mui/material";
import GeneralCard from "../../../components/GeneralCard/GeneralCard";
import MyTable from "../../../components/MyTable/MyTable";
import MyTable2 from "../../../components/MyTable/MyTable2";
import { textData } from "../../../components/Note/NoteData";

const theme = createTheme();
const NoteTab = ({expand}) => {
    const [expandNote, setExpandNote] = useState(2);
    return(
        <Grid gridTemplateRows={expandNote === 1 ? '3% 97%':
                                expandNote === 2 ? '40% 3% 57%':
                                                        '97% 3%'}
                h='100%'>
            {expandNote === 1 ? null : 
            <GridItem h={'100%'} position={'relative'}>
                <Box h={'100%'}>
                    <MyTable2 height={expandNote === 3 ? '650px' : '300px'}
                              width={expand ? '1700px' : '1100px'}/>
                </Box>
            </GridItem>}

            <GridItem h={'100%'}>
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
            {expandNote === 3 ? null : <GridItem h={'100%'} position={'relative'} paddingTop={'8'}>
                <Textarea scr borderRadius={20} p={8} value={textData} bg={'rgba(17,17,17,0.2)'} h={'100%'} resize={'none'} readOnly placeholder='Here is a sample placeholder' />
            </GridItem>}
        </Grid>
    )
}

export default NoteTab;