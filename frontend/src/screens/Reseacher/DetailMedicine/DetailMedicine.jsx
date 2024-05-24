import React, { useEffect, useState } from "react";
import { DoctorLayout } from "../../../layout/DoctorLayout";
import { AbsoluteCenter, Box, Divider, Grid, GridItem, IconButton, ScaleFade, SimpleGrid, Spinner } from "@chakra-ui/react";
import { Center } from "@chakra-ui/react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
  } from '@chakra-ui/react'
import { useLocation, useNavigate } from "react-router-dom";
import { BellIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Tabs, TabList, TabPanels, Tab, TabPanel, Text } from '@chakra-ui/react'
import Note from "../../../components/Note/Note";
import PatientTag from "../../../components/PatientTag/PatientTag";
import MyPagination from "../../../components/Pagination/Pagination";
import { Pagination, ThemeProvider, createTheme } from "@mui/material";
// import PrescriptionTab from "./PrescriptionTab";
// import ClinicalSignTab from "./ClinicalSignTab";
// import GeneralTab from "./GeneralTab";
import { ResearcherLayout } from "../../../layout/ResearcherLayout";
import ClinicalSignTab from "./ClinicalSignTab";
import PrescriptionTab from "./PrescriptionTab";
import GeneralTab from "./GeneralTab";
import axios from "axios";
// import OtherDiseaseTab from "./OtherDiseaseTab";

const theme = createTheme();

const DetailMedicine = (props) => {
    const researcher_code = sessionStorage.getItem('user')
    ? JSON.parse(sessionStorage.getItem('user')).code
    : '0';

    const location = useLocation();
    const medicine = location.state.data;
    const medicineKey = {
        drug: medicine.drug,
        drug_name_poe: medicine.drug_name_poe,
        drug_type: medicine.drug_type,
        formulary_drug_cd: medicine.formulary_drug_cd
    }
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
    const keysToExtract = ['drug', 'drug_name_poe', 'drug_type', 'formulary_drug_cd', 'sum_of_male', 'sum_of_female']
    const [medicineStatistic, setMedicineStatistic] = useState([]);
    const [error, setError] = useState(null);
    const [loadingMedicine, setLoadingMedicine] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8002/detailmedicine-general', {
                    params: {
                        drug: medicine.drug,
                        drug_name_poe: medicine.drug_name_poe,
                        drug_type: medicine.drug_type,
                        formulary_drug_cd: medicine.formulary_drug_cd
                    }
                });
                setMedicineStatistic(response.data.drugs);
                console.log(response.data.drugs);
                setLoadingMedicine(false);
            } catch (error) {
                setError(error);
                setLoadingMedicine(false);
            }
        };
        if (medicineStatistic.length == 0){
            fetchData();
        }
    }, []);
    const [loadingOtherMedicine, setLoadingOtherMedicine] = useState(true);
    const [otherdrugs, setOtherDrugs] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8002/detailmedicine-co-prescribed-medication', {
                    params: {
                        drug: medicine.drug,
                        drug_name_poe: medicine.drug_name_poe,
                        drug_type: medicine.drug_type,
                        formulary_drug_cd: medicine.formulary_drug_cd
                    }
                });
                setOtherDrugs(response.data.otherdrugs);
                console.log(response.data.otherdrugs);
                setLoadingOtherMedicine(false);
            } catch (error) {
                setError(error);
                setLoadingOtherMedicine(false);
            }
        };
        if (otherdrugs.length == 0){
            fetchData();
        }
    }, []);


    const [note, setNote] = useState([])
    const [loadingNote, setLoadingNote] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8002/medicine-notes', {
                    params: {
                        user_code: researcher_code,
                        drug: medicine.drug,
                        drug_name_poe: medicine.drug_name_poe,
                        drug_type: medicine.drug_type,
                        formulary_drug_cd: medicine.formulary_drug_cd                    }
                });
                setNote(response.data.note);
                setLoadingNote(false);
            } catch (error) {
                setLoadingNote(false);
            }
        };
        fetchData();
        // const intervalId = setInterval(fetchData, 5000);
        // return () => clearInterval(intervalId);
    }, []);
    const mapping = {
        drug: 'Drug',
        drug_name_poe: 'Drug name POE',
        formulary_drug_cd: 'Formulary drug cd',
        drug_type: 'Drug type',
        sum_of_male: 'Sum of male',
        sum_of_female: 'Sum of female',
        Alcohol_Abuse: 'Alcohol Abuse',
        Chronic_Neurologic_Dystrophies: 'Chronic Neurologic Dystrophies',
        Substance_Abuse: 'Subtance Abuse',
        Chronic_Pain: 'Chronic Pain',
        Depression: 'Depression',
        Adv_Heart_Disease: 'Adv Heart Disease',
        Metastatic_Cancer: 'Metastatic Cancer',
        Adv_Lung_Disease: 'Adv Lung Disease',
        Obesity: 'Obesity',
        Psychiatric_Disorders: 'Psychiatric Disorders',
        hadm_id: 'Admission ID',
        gender: 'Gender',
        dob: 'Date of Birth',
        dod: 'Date of Death',
        admission_type: 'Admission type',
        admission_location: 'Admission location',
        religion: 'Religion',
        marital_status: 'Marital Status',
        ethnicity: 'Ethnicity',
        insurance: 'Insurance'
    }
    return(
        <ResearcherLayout path={
                <Breadcrumb fontSize="xl">
                    <BreadcrumbItem>
                        <BreadcrumbLink href='../'>Medicine</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem isCurrentPage>
                        <BreadcrumbLink href="#">{medicine.drug_name_poe}</BreadcrumbLink>
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
                                <PatientTag keysToExtract={keysToExtract} medicine = {true} data={medicine}/>
                            </ScaleFade>
                        </GridItem> : null }

                        {!expand?
                        <GridItem area={'note'}>
                            <ScaleFade initialScale={0.8} in={!expand} style={{height: '100%'}}>
                                <Note loading ={loadingNote} pageSize={3} setNote={setNote} data={note} type={"medicine-note"} medicine_code={medicineKey}/>
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
                            {/* <Tab fontWeight={'bold'} key={2}>Clinical sign</Tab> */}
                            <Tab fontWeight={'bold'} key={2}>co-prescribed medications</Tab>
                        </TabList>
                        <TabPanels h={'99%'}>
                            <TabPanel key={1} h={'100%'} w={'100%'} position={'relative'}>
                                {
                                    !loadingMedicine ? <GeneralTab mapping={mapping} medicineStatistic={medicineStatistic} expand={expand}/> : 
                                    <Center>
                                        <Spinner/> 
                                    </Center>
                                }
                            </TabPanel>
                            {/* <TabPanel key={2} h={'100%'}>
                                <ClinicalSignTab/>
                            </TabPanel> */}
                            <TabPanel key={2} h={'100%'}>
                                {
                                    !loadingOtherMedicine ? <PrescriptionTab mapping={mapping} otherdrugs={otherdrugs}/> : 
                                    <Center>
                                        <Spinner/> 
                                    </Center>
                                }
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </GridItem>
        </ResearcherLayout>
    )
};

export default DetailMedicine;