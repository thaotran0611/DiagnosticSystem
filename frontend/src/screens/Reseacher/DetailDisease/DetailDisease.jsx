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
import PrescriptionTab from "./PrescriptionTab";
import ClinicalSignTab from "./ClinicalSignTab";
import GeneralTab from "./GeneralTab";
import { ResearcherLayout } from "../../../layout/ResearcherLayout";
import OtherDiseaseTab from "./OtherDiseaseTab";

const theme = createTheme();

const DetailDisease = (props) => {
    const navigate=useNavigate();
    const [expand, setExpand] = useState(false);
    const data = [ 
        { key: 'Male', value: '1000' }, 
        { key: 'Female', value: '200' }, 
        { key: 'No of die', value: '100' }, 
        { key: 'Age', value: '18 - 30' }
    ];
    const expandPage = () => {
        setExpand(!expand); 
        setPageSizeGeneral(pageSizeGeneral*4/6);
        setPageSizeMedicalTest(pageSizeMedicalTest*4/6);
    };
    const shrinkPage = () => {
        setExpand(!expand); 
        setPageSizeGeneral(pageSizeGeneral*6/4);
        setPageSizeMedicalTest(pageSizeMedicalTest*6/4);
    };
    
    const [pageSizeGeneral, setPageSizeGeneral] = useState(4);
    const [pageSizeMedicalTest, setPageSizeMedicalTest] = useState(4);
    return(
        <ResearcherLayout path={
                <Breadcrumb>
                    <BreadcrumbItem>
                        <BreadcrumbLink href='./'>Disease</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem isCurrentPage>
                        <BreadcrumbLink href="#">10</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
            }
            disease={true}
            
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
                                <PatientTag disease = {true} type={"Lungs"} data={data} name='Lung Disease' id='1200 patients'/>
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
                <GridItem marginLeft={4} pl='2' area={'main'} bg={'#fff'} borderEndEndRadius={'40px'} padding={6}>
                    <Tabs isFitted variant='enclosed' size={'md'} height={'99%'}>
                        <TabList>
                            <Tab fontWeight={'bold'} key={1}>General</Tab>
                            <Tab fontWeight={'bold'} key={2}>Other Diseases</Tab>
                            <Tab fontWeight={'bold'} key={3}>Clinical sign</Tab>
                            <Tab fontWeight={'bold'} key={4}>Prescription</Tab>
                        </TabList>
                        <TabPanels h={'99%'}>
                            <TabPanel key={1} h={'100%'} w={'100%'} position={'relative'}>
                                <GeneralTab expand={expand}/>
                            </TabPanel>
                            <TabPanel key={2} h={'100%'}>
                                <OtherDiseaseTab/>
                            </TabPanel>
                            <TabPanel key={3} h={'100%'}>
                                <ClinicalSignTab/>
                            </TabPanel>
                            <TabPanel key={4} h={'100%'}>
                                <PrescriptionTab/>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </GridItem>
        </ResearcherLayout>
    )
};

export default DetailDisease;