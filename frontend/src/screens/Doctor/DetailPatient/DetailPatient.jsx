import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
import GeneralTab from "./GeneralTab";
import MedicalTestTab from "./MedicalTestTab";
import PrescriptionTab from "./PrescriptionTab";
import NoteTab from "./NoteTab";
import DiseasesTab from "./DiseasesTab";
import ProcedureTab from "./ProcedureTab";
import { useParams } from 'react-router-dom';

const theme = createTheme();

const DetailPatient = (props) => {
    const navigate = useNavigate();

    const doctor_code = sessionStorage.getItem('user')
    ? JSON.parse(sessionStorage.getItem('user')).code
    : '0';
    const { patientCode } = useParams();
    console.log(patientCode)
    const [patientdata, setPatientData] = useState([]); // PASS AS PARAMETER
    const [loadingPatient, setLoadingPatient] = useState(true);

    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/patients-detail-overview', {
                    params: {
                        doctor_code: doctor_code,
                        subject_id: patientCode
                    }
                });
                console.log(response)
                setPatientData(response.data.patientDetail);
                setLoadingPatient(false);
            } catch (error) {
                setError(error);
                setLoadingPatient(false);
            }
        };
        fetchData();
    }, []);

    const [addmission, setAddmission] = useState([]); // PASS AS PARAMETER
    const [loadingAdmission, setLoadingAdmission] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/patients-detail-admission', {
                    params: {
                        doctor_code: doctor_code,
                        subject_id: patientCode
                    }
                });
                setAddmission(response.data.admission);
                setLoadingAdmission(false);
                console.log(addmission)
            } catch (error) {
                setError(error);
                setLoadingAdmission(false);
            }
        };
        fetchData();
    }, []);

    const [note, setNote] = useState([])
    const [loadingNote, setLoadingNote] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/patient-notes', {
                    params: {
                        doctor_code: doctor_code,
                        subject_id: patientCode
                    }
                });
                console.log(response)
                setNote(response.data.note);
                setLoadingNote(false);
            } catch (error) {
                setError(error);
                setLoadingNote(false);
            }
        };
        fetchData();
        // const intervalId = setInterval(fetchData, 5000);
        // return () => clearInterval(intervalId);
    }, []);

    const [expand, setExpand] = useState(false);
    // const data = [ 
    //     { key: 'Full name', value: 'Lucy Biaca' }, 
    //     { key: 'Birthday', value: '12/12/2012' }, 
    //     { key: 'Job', value: 'Teacher' }, 
    //     { key: 'Gender', value: 'Female' }, 
    //     { key: 'Address', value: 'London, UK' }, 
    //     { key: 'Phone', value: '1234658' }, 
    // ];
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
    const generalTag = [
        {
            heading: 'Number of addmission',
            content: '4'
        },
        {
            heading: 'Number of addmission',
            content: '4'
        },
        {
            heading: 'Number of addmission',
            content: '4'
        },
        {
            heading: 'Number of addmission',
            content: '4'
        },
        {
            heading: 'Number of addmission lalalalaal',
            content: '4'
        },
        {
            heading: 'Number of addmission',
            content: '4'
        },
        {
            heading: 'Number of addmission',
            content: '4'
        },
        {
            heading: 'Number of addmission',
            content: '4'
        },
        {
            heading: 'Number of addmission',
            content: '4'
        },
        {
            heading: 'Number of addmission',
            content: '4'
        },
        {
            heading: 'Number of addmission',
            content: '4'
        },
        {
            heading: 'Number of addmission',
            content: '4'
        },
        {
            heading: 'Number of addmission',
            content: '4'
        },
        {
            heading: 'Number of addmission',
            content: '4'
        },
        {
            heading: 'Number of addmission',
            content: '4'
        },
        {
            heading: 'Number of addmission',
            content: '4'
        },
        {
            heading: 'Number of addmission',
            content: '4'
        },
        {
            heading: 'Number of addmission',
            content: '4'
        }
    ];
    
    const [pageSizeGeneral, setPageSizeGeneral] = useState(4);
    const [pageSizeMedicalTest, setPageSizeMedicalTest] = useState(4);
    return(
        <DoctorLayout path={
                <Breadcrumb>
                    <BreadcrumbItem>
                        <BreadcrumbLink href='./'>Patient</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem isCurrentPage>
                        <BreadcrumbLink href="#">10</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
            }
            patient={true}
            
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
                                <PatientTag data={patientdata} loading={loadingPatient}/>
                            </ScaleFade>
                        </GridItem> : null }

                        {!expand?
                        <GridItem area={'note'}>
                            <ScaleFade initialScale={0.8} in={!expand} style={{height: '100%'}}>
                                <Note loading ={loadingNote} pageSize={3} data={note} type={"patient-note"} subject_id={patientCode}/>
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
                    <Tabs isFitted variant='enclosed' size={'md'} height={'99%'}>
                        <TabList>
                            <Tab fontWeight={'bold'} key={1}>General</Tab>
                            <Tab fontWeight={'bold'} key={2}>Medical Test</Tab>
                            <Tab fontWeight={'bold'} key={3}>Procedure</Tab>
                            <Tab fontWeight={'bold'} key={4}>Prescription</Tab>
                            <Tab fontWeight={'bold'} key={5}>Note</Tab>
                            <Tab fontWeight={'bold'} key={6}>Diseases</Tab>
                        </TabList>
                        <TabPanels h={'99%'}>
                            <TabPanel key={1} h={'100%'}>
                                <GeneralTab addmission={addmission} generalTag={generalTag} expand={expand} pageSize={pageSizeGeneral} setPageSize={setPageSizeGeneral}/>
                            </TabPanel>
                            <TabPanel key={2} h={'100%'}>
                                <MedicalTestTab generalTag={generalTag} expand={expand} pageSize={pageSizeMedicalTest} setPageSize={setPageSizeMedicalTest}/>
                            </TabPanel>
                            <TabPanel key={3} h={'100%'}>
                                <ProcedureTab/>
                            </TabPanel>
                            <TabPanel key={4} h={'100%'}>
                                <PrescriptionTab/>
                            </TabPanel>
                            <TabPanel key={5} h={'100%'}>
                                <NoteTab expand={expand}/>
                            </TabPanel>
                            <TabPanel key={6} h={'100%'}>
                                <DiseasesTab/>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </GridItem>
        </DoctorLayout>
    )
};

export default DetailPatient;