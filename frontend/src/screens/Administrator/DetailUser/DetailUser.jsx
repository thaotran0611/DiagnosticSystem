import React, { useState } from "react";
import { DoctorLayout } from "../../../layout/DoctorLayout";
import { AbsoluteCenter, Box, Divider, Grid, GridItem, IconButton, ScaleFade, SimpleGrid } from "@chakra-ui/react";
import { Center } from "@chakra-ui/react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
  } from '@chakra-ui/react'
import { useNavigate } from "react-router-dom";
import { BellIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Tabs, TabList, TabPanels, Tab, TabPanel, Text } from '@chakra-ui/react'
import Note from "../../../components/Note/Note";
import PatientTag from "../../../components/PatientTag/PatientTag";
import MyPagination from "../../../components/Pagination/Pagination";
import { Pagination, ThemeProvider, createTheme } from "@mui/material";
import GeneralTab from "../../Doctor/DetailPatient/GeneralTab";
// import MedicalTestTab from "./MedicalTestTab";
// import PrescriptionTab from "./PrescriptionTab";
// import NoteTab from "./NoteTab";
// import DiseasesTab from "./DiseasesTab";
// import ProcedureTab from "./ProcedureTab";
import { AdminLayout } from "../../../layout/AdminLayout";
import MyTable2 from "../../../components/MyTable/MyTable2";
import { AreaChart } from "../../../components/Chart/AreaChart";

const theme = createTheme();

const DetailUser = (props) => {
    const navigate=useNavigate();
    const [expand, setExpand] = useState(false);
    const data = [ 
        { key: 'Role', value: 'Doctor' }, 
        { key: 'Gender', value: 'Male' }, 
        { key: 'Age', value: '45' }, 
        { key: 'Status', value: 'Online'}
    ];
    const expandPage = () => {
        setExpand(!expand); 
    };
    const shrinkPage = () => {
        setExpand(!expand); 
    };
    
    const [expandGeneral, setExpandGenaral] = useState(2);
    return(
        <AdminLayout path={
                <Breadcrumb>
                    <BreadcrumbItem>
                        <BreadcrumbLink href='./'>Users</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem isCurrentPage>
                        <BreadcrumbLink href="#">10</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
            }
            user={true}
            
            expand={expand}>
                <GridItem position={'relative'} marginLeft={4} pl='2' area={'nav'}>
                    <Grid
                        templateAreas={ !expand ? `"information divider"
                                                   "note divider"`:
                                                   `"divider"
                                                    "divider"`}  
                        h='100%'  
                        gridTemplateRows={'40% 59%'}
                        gridTemplateColumns={!expand ? '98% 2%' : '100%'}
                        gap={'1%'}              
                    >
                        {!expand?
                        <GridItem position={'relative'} area={'information'} marginTop={'8%'}>
                            <ScaleFade initialScale={0.8} in={!expand} style={{height: '100%'}}>
                                <PatientTag data={data} name='Dr.Kim' id='511'/>
                            </ScaleFade>
                        </GridItem> : null }

                        {!expand?
                        <GridItem area={'note'}>
                            <ScaleFade initialScale={0.8} in={!expand} style={{height: '100%'}}>
                                <Note pageSize='3'/>
                            </ScaleFade>
                        </GridItem>: null }
                        <GridItem area={'divider'}>
                            <Center height={'100%'} position='relative'>
                                <Divider style={{height: '100%', width: '2px'}} orientation='vertical' color={'#3E36B0'}/>
                                <AbsoluteCenter top={8} px='4'>
                                    <Box cursor={'pointer'} borderRadius={'50%'} boxSize={'30px'} bg={'#3E36B0'}>
                                        {expand ? 
                                            <ChevronRightIcon onClick={()=> {expandPage()}} marginLeft={1} marginTop={0.4} boxSize={'1.5em'} color={'#fff'}/>
                                            :
                                            <ChevronLeftIcon onClick={()=> {shrinkPage()}} marginLeft={0.9} marginTop={0.4} boxSize={'1.5em'} color={'#fff'}/>
                                        }
                                    </Box>
                                </AbsoluteCenter>
                                <AbsoluteCenter top={750} px='4'>
                                    <Box cursor={'pointer'} borderRadius={'50%'} boxSize={'30px'} bg={'#3E36B0'}>
                                        {expand ? 
                                            <ChevronRightIcon onClick={()=> {expandPage()}} marginLeft={1} marginTop={0.4} boxSize={'1.5em'} color={'#fff'}/>
                                            :
                                            <ChevronLeftIcon onClick={()=> {shrinkPage()}} marginLeft={0.9} marginTop={0.4} boxSize={'1.5em'} color={'#fff'}/>
                                        }   
                                    </Box>
                                </AbsoluteCenter>
                            </Center>
                        </GridItem>
                    </Grid>
                </GridItem>
                <GridItem marginLeft={4} pl='2' area={'main'} bg={'#fff'} borderEndEndRadius={'20px'} padding={6}>
                    <Grid gridTemplateRows={expandGeneral === 1 ? '3% 97%':
                                            expandGeneral === 2 ? '45% 3% 52%':
                                                                    '97% 3%'}
                            h='100%'>
                        {expandGeneral === 1 ? null : 
                        <GridItem position={'relative'}>
                            <AreaChart/>
                        </GridItem>}

                        <GridItem>
                            <Center height={'100%'} position='relative'>
                                <Divider orientation="horizontal" style={{height: '2px'}} color={'#3E36B0'}/>
                                <AbsoluteCenter>
                                    <Box position='relative' bg={'white'} w={'90px'}>
                                        <Center>
                                            <IconButton
                                                isDisabled = {expandGeneral === 3 ? true: false}
                                                boxSize={'20px'}
                                                icon={<ChevronDownIcon/>}
                                                bg={'#3E36B0'}
                                                color={'white'}
                                                onClick={expandGeneral === 2 ? ()=>{setExpandGenaral(expandGeneral + 1)}: ()=>{setExpandGenaral(expandGeneral + 1)}}
                                            />
                                            <IconButton
                                                marginLeft={2}
                                                isDisabled = {expandGeneral === 1 ? true: false}
                                                boxSize={'20px'}
                                                icon={<ChevronUpIcon/>}
                                                bg={'#3E36B0'}
                                                color={'white'}
                                                onClick={expandGeneral === 3 ? ()=>{setExpandGenaral(expandGeneral - 1)}: ()=>{setExpandGenaral(expandGeneral - 1)}}
                                            />
                                        </Center>
                                    </Box>
                                </AbsoluteCenter>
                            </Center>
                        </GridItem>
                        {expandGeneral === 3 ? null : <GridItem position={'relative'} paddingTop={'8'}>
                            <Box h={'100%'}>
                                <MyTable2 height={expandGeneral === 1 ? '620px': '330px'} width={expand ? '1700px' : '1100px'}/>
                            </Box>
                            </GridItem>}
                    </Grid>
                </GridItem>
        </AdminLayout>
    )
};

export default DetailUser;