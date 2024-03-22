import React, { useState } from "react";
import { AbsoluteCenter, Box, Divider, Grid, GridItem, IconButton, ScaleFade, SimpleGrid } from "@chakra-ui/react";
import { Center } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { BellIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon } from "@chakra-ui/icons";
import MyPagination from "../../../components/Pagination/Pagination";
import { Pagination, ThemeProvider, createTheme } from "@mui/material";
import GeneralCard from "../../../components/GeneralCard/GeneralCard";
import MyTable from "../../../components/MyTable/MyTable";
import MyTable2 from "../../../components/MyTable/MyTable2";
import { HorizontalChart } from "../../../components/Chart/HorizontalChart";
import ChartEvents from "../../../components/Chart/ChartEvents";
import BarChart from "../../../components/Chart/BarChart";
import { LineChart } from "../../../components/Chart/LineChart";

const theme = createTheme();
const MedicalTestTab = ({generalTag, expand, pageSize, setPageSize}) => {
    const [expandMedicalTest, setExpandMedicalTest] = useState(2);
    const [page, setPage] = useState(1);
    const handleChangePage = (event, newpage) => {
        setPage(newpage);
    };
    
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const slicedData = generalTag.slice(startIndex, endIndex);
    return(
        <Grid gridTemplateRows={expandMedicalTest === 1 ? '3% 97%':
                                expandMedicalTest === 2 ? '25% 3% 72%':
                                                        '97% 3%'}
                h='100%'>
            {expandMedicalTest === 1 ? null : 
            <GridItem position={'relative'}>
                <ThemeProvider theme={theme}>
                    <SimpleGrid h={'80%'} columns={expand ? 6 : 4} spacing={8}>
                        {
                            slicedData.map(infor => (
                                <GeneralCard heading = {infor.heading} content={infor.content}/>
                            ))
                        }
                    </SimpleGrid>
                
                    <Center>
                        <MyPagination
                            count={Math.ceil(generalTag.length / pageSize)}
                            page={page}
                            onChange={handleChangePage}
                        />
                    </Center>
                </ThemeProvider>
            </GridItem>}

            <GridItem>
                <Center height={'100%'} position='relative'>
                    <Divider orientation="horizontal" style={{height: '2px'}} color={'#3E36B0'}/>
                    <AbsoluteCenter>
                        <Box position='relative' bg={'white'} w={'90px'}>
                            <Center>
                                <IconButton
                                    isDisabled = {expandMedicalTest === 3 ? true: false}
                                    boxSize={'20px'}
                                    icon={<ChevronDownIcon/>}
                                    bg={'#3E36B0'}
                                    color={'white'}
                                    onClick={expandMedicalTest === 2 ? ()=>{setExpandMedicalTest(expandMedicalTest + 1); setPageSize(pageSize*3)}: ()=>{setExpandMedicalTest(expandMedicalTest + 1)}}
                                />
                                <IconButton
                                    marginLeft={2}
                                    isDisabled = {expandMedicalTest === 1 ? true: false}
                                    boxSize={'20px'}
                                    icon={<ChevronUpIcon/>}
                                    bg={'#3E36B0'}
                                    color={'white'}
                                    onClick={expandMedicalTest === 3 ? ()=>{setExpandMedicalTest(expandMedicalTest - 1); setPageSize(pageSize/3)}: ()=>{setExpandMedicalTest(expandMedicalTest - 1)}}
                                />
                            </Center>
                        </Box>
                    </AbsoluteCenter>
                </Center>
            </GridItem>
            {expandMedicalTest === 3 ? null : <GridItem position={'relative'} paddingTop={'8'} overflow={'hidden'}>
                {/* <MyTable/> */}
                    {/* <MyTable2 height={expandMedicalTest === 1 ? '620px': '450px'} width={expand ? '1700px' : '1100px'}/> */}
                    <Box h={'92%'} position={'relative'}>
                        {/* <BarChart/> */}
                        <LineChart/>
                    </Box>
                </GridItem>}
        </Grid>
    )
}

export default MedicalTestTab;