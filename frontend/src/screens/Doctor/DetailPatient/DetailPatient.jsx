import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DoctorLayout } from "../../../layout/DoctorLayout";
import { AbsoluteCenter, Box, Button, Divider, Grid, GridItem, IconButton, ScaleFade, SimpleGrid } from "@chakra-ui/react";
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
import { Select } from '@chakra-ui/react'
import _ from "lodash";

const theme = createTheme();

const DetailPatient = (props) => {
    const navigate = useNavigate();

    const doctor_code = sessionStorage.getItem('user')
    ? JSON.parse(sessionStorage.getItem('user')).code
    : '0';
    const doctor_name = sessionStorage.getItem('user')
    ? JSON.parse(sessionStorage.getItem('user')).name
    : '';
    const { patientCode } = useParams();
    console.log(patientCode)
    const [patientdata, setPatientData] = useState([]); // PASS AS PARAMETER
    const [loadingPatient, setLoadingPatient] = useState(true);
    const [hadmID, sethadmID] = useState('All Admission');
    const [allAdmission, setAllAdmission] = useState(['All Admission']);
    const [error, setError] = useState(null);

    const [infoTag, setInfoTag] = useState([]); // PASS AS PARAMETER

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/patients-detail-overview', {
                    params: {
                        doctor_code: doctor_code,
                        subject_id: patientCode
                    }
                });
                // console.log(response)
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
                setAllAdmission(allAdmission.concat(_.unionBy(response.data.admission, "hadm_id").map((image) => image.hadm_id)));
                setLoadingAdmission(false);
                setInfoTag(response.data.infomation_tag)
                console.log(allAdmission)
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
                // console.log(response)
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
    const [activeTab, setActiveTab] = useState("General");

    return(
        <DoctorLayout path={
                <Breadcrumb>
                    <BreadcrumbItem>
                        <BreadcrumbLink href='../'>Patient</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem isCurrentPage>
                        <BreadcrumbLink href="#">{patientCode}</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
            }
            patient={true}
            name={doctor_name}
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
                <GridItem marginLeft={4} pl='2' area={'main'} bg={'#fff'} borderEndEndRadius={'20px'} padding={6} maxHeight="100vh" overflowY="auto" style={{
                        scrollbarWidth: 'thin', 
                        scrollbarColor: '#A0AEC0 #ffffff', 
                    }}>
                <Grid
                    h='40px'
                    templateColumns='repeat(6, 1fr)'
                    gap={4}
                    >
                    <GridItem textAlign={'right'} colStart={5} colSpan={1}>
                        <Text paddingTop={1} fontWeight={600}>Hadm_ID:</Text>
                    </GridItem>
                    <GridItem colStart={6} colSpan={1}>
                        <Select onChange={(e) => {sethadmID(e.target.value)}} fontWeight={600} color={'#3E36B0'} variant={'outline'}>
                            {
                                allAdmission.map(item => (
                                    <option selected={item === hadmID ? true : false} value={item}>{item}</option>
                                ))
                            }
                        </Select>
                    </GridItem>
                </Grid>
                    <Tabs isFitted variant='enclosed' size={'md'} height={'94%'}>
                        <TabList>
                            <Tab fontWeight={'bold'} key={1} onClick={() => setActiveTab("General")}>General</Tab>
                            <Tab fontWeight={'bold'} key={2} onClick={() => setActiveTab("MedicalTest")}>Medical Test</Tab>
                            <Tab fontWeight={'bold'} key={3} onClick={() => setActiveTab("Procedure")}>Procedure</Tab>
                            <Tab fontWeight={'bold'} key={4} onClick={() => setActiveTab("Prescription")}>Prescription</Tab>
                            <Tab fontWeight={'bold'} key={5} onClick={() => setActiveTab("Note")}>Note</Tab>
                            <Tab fontWeight={'bold'} key={6} onClick={() => setActiveTab("Diseases")}>Diseases</Tab>
                        </TabList>
                        <TabPanels h={'99%'}>
                            <TabPanel key={1} h={'100%'}>
                                {activeTab === "General" && <GeneralTab addmission={addmission} generalTag={infoTag} expand={expand} pageSize={pageSizeGeneral} setPageSize={setPageSizeGeneral} hadmID={hadmID} sethadmID={sethadmID}/>}
                            </TabPanel>
                            <TabPanel key={2} h={'100%'}>
                                {activeTab === "MedicalTest" && <MedicalTestTab subject_id={patientCode} hadmID={hadmID} generalTag={generalTag} expand={expand} pageSize={pageSizeMedicalTest} setPageSize={setPageSizeMedicalTest}/>}
                            </TabPanel>
                            <TabPanel key={3} h={'100%'}>
                                {activeTab === "Procedure" && <ProcedureTab subject_id={patientCode} hadmID={hadmID}/>}
                            </TabPanel>
                            <TabPanel key={4} h={'100%'}>
                                {activeTab === "Prescription" && <PrescriptionTab subject_id={patientCode} hadmID={hadmID}/>}
                            </TabPanel>
                            <TabPanel key={5} h={'100%'}>
                                {activeTab === "Note" && <NoteTab hadmID={hadmID} expand={expand} subject_id={patientCode}/>}
                            </TabPanel>
                            <TabPanel key={6} h={'100%'}>
                                {activeTab === "Diseases" && <DiseasesTab subject_id={patientCode}/>}
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </GridItem>
        </DoctorLayout>
    )
};

export default DetailPatient;