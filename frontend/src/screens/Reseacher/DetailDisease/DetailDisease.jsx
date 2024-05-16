import React, { useEffect, useState } from "react";
import { DoctorLayout } from "../../../layout/DoctorLayout";
import { AbsoluteCenter, Box, Divider, Grid, GridItem, IconButton, ScaleFade, SimpleGrid } from "@chakra-ui/react";
import { Center } from "@chakra-ui/react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
  } from '@chakra-ui/react'
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
import axios from "axios";

const theme = createTheme();

const DetailDisease = (props) => {
    const mappingTagDisease = {
        disease_code: 'Code',
        sum_of_admission: 'Admissions',
        sum_of_male: 'Male',
        sum_of_female: 'Female',
        disease_name: 'Name'
    }
    const mapping = {
        hadm_id: 'Admission ID',
        disease_code: 'Disease Code',
        name: 'Name',
        gender: 'Gender',
        marital_status: 'Marital Status',
        religion: 'Religion',
        ethnicity: 'Ethnicity',
        dob: 'Date of Birth',
        dod: 'Date of Death',
        yearold: 'Life Expectancy'
    }
    const location = useLocation();
    const disease = location.state.data;
    const researcher_code = sessionStorage.getItem('user')
    ? JSON.parse(sessionStorage.getItem('user')).code
    : '0';
    const researcher_name = sessionStorage.getItem('user')
    ? JSON.parse(sessionStorage.getItem('user')).name
    : '';
    const { diseaseCode } = useParams();
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
    const [note, setNote] = useState([])
    const [loadingNote, setLoadingNote] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/disease-notes', {
                    params: {
                        user_code: researcher_code,
                        disease_code: diseaseCode
                    }
                });
                // console.log(response)
                setNote(response.data.note);
                setLoadingNote(false);
            } catch (error) {
                // setError(error);
                setLoadingNote(false);
            }
        };
        fetchData();
        // const intervalId = setInterval(fetchData, 5000);
        // return () => clearInterval(intervalId);
    }, []);

    const [pageSizeGeneral, setPageSizeGeneral] = useState(4);
    const [pageSizeMedicalTest, setPageSizeMedicalTest] = useState(4);
    const keysToExtract = ['disease_code', 'sum_of_admission', 'sum_of_male', 'sum_of_female', 'disease_name']
    const [diseaseStatistic, setDiseaseStatistic] = useState([]);
    const [error, setError] = useState(null);
    const [loadingDisease, setLoadingDisease] = useState(true);
    const calculateYearDifference = (date1, date2) => {
        const year1 = new Date(date1).getFullYear();
        const year2 = new Date(date2).getFullYear();
        return year1 - year2;
      };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/detaildisease-general', {
                    params: {
                        disease_code: diseaseCode
                    }
                });
                setDiseaseStatistic(response.data.disease.map(item => ({
                    ...item,
                    yearold: calculateYearDifference(item.dod, item.dob)
                })));
                console.log(response.data.disease.map(item => ({
                    ...item,
                    yearold: calculateYearDifference(item.dod, item.dob)
                })));
                setLoadingDisease(false);
            } catch (error) {
                setError(error);
                setLoadingDisease(false);
            }
        };
        if (diseaseStatistic.length == 0){
            fetchData();
        }
    }, []);
    const [otherdiseases, setOtherDiseases] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/detaildisease-otherdiseases', {
                    params: {
                        disease_code: diseaseCode
                    }
                });
                setOtherDiseases(response.data.otherdiseases.map(item => ({
                    ...item,
                    yearold: calculateYearDifference(item.dod, item.dob)
                })));
                console.log(response.data.otherdiseases.map(item => ({
                    ...item,
                    yearold: calculateYearDifference(item.dod, item.dob)
                })));
            } catch (error) {
                setError(error);
            }
        };
        if (otherdiseases.length == 0){
            fetchData();
        }
    }, []);
    const [prescription, setPrescription] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/detaildisease-prescriptions', {
                    params: {
                        disease_code: diseaseCode
                    }
                });
                setPrescription(response.data.prescriptions);
                console.log(response.data.prescriptions);
            } catch (error) {
                setError(error);
            }
        };
        if (prescription.length == 0){
            fetchData();
        }
    }, []);
    return(
        <ResearcherLayout path={
                <Breadcrumb fontSize="xl">
                    <BreadcrumbItem>
                        <BreadcrumbLink href='../'>Disease</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem isCurrentPage>
                        <BreadcrumbLink href="#">{diseaseCode}</BreadcrumbLink>
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
                                <PatientTag disease = {true} type={"Lungs"} data={disease} keysToExtract={keysToExtract}/>
                            </ScaleFade>
                        </GridItem> : null }

                        {!expand?
                        <GridItem area={'note'}>
                            <ScaleFade initialScale={0.8} in={!expand} style={{height: '100%'}}>
                                <Note loading ={loadingNote} pageSize={3} setNote={setNote} data={note} type={"disease-note"} disease_code={diseaseCode}/>

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
                            {/* <Tab fontWeight={'bold'} key={3}>Clinical sign</Tab> */}
                            <Tab fontWeight={'bold'} key={3}>Prescription</Tab>
                        </TabList>
                        <TabPanels h={'99%'}>
                            <TabPanel key={1} h={'100%'} w={'100%'} position={'relative'}>
                                <GeneralTab mapping={mapping} expand={expand} diseaseStatistic={diseaseStatistic}/>
                            </TabPanel>
                            <TabPanel key={2} h={'100%'}>
                                <OtherDiseaseTab mapping={mapping} expand={expand} otherdiseases={otherdiseases}/>
                            </TabPanel>
                            {/* <TabPanel key={3} h={'100%'}>
                                <ClinicalSignTab/>
                            </TabPanel> */}
                            <TabPanel key={3} h={'100%'}>
                                <PrescriptionTab mapping={mapping} prescription={prescription}/>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </GridItem>
        </ResearcherLayout>
    )
};

export default DetailDisease;