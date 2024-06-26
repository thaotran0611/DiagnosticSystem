import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DoctorLayout } from "../../../layout/DoctorLayout";
import { AbsoluteCenter, Box, Divider, Grid, GridItem, ScaleFade } from "@chakra-ui/react";
import { Center } from "@chakra-ui/react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
  } from '@chakra-ui/react'
import { useNavigate } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Tabs, TabList, TabPanels, Tab, TabPanel, Text } from '@chakra-ui/react'
import Note from "../../../components/Note/Note";
import PatientTag from "../../../components/PatientTag/PatientTag";
import GeneralTab from "./GeneralTab";
import MedicalTestTab from "./MedicalTestTab";
import PrescriptionTab from "./PrescriptionTab";
import NoteTab from "./NoteTab";
import DiseasesTab from "./DiseasesTab";
import ProcedureTab from "./ProcedureTab";
import { useParams } from 'react-router-dom';
import { Select } from '@chakra-ui/react'
import _ from "lodash";
import { useLocation } from 'react-router-dom';
import {log} from '../../../functions';
import { format } from 'date-fns'

const DetailPatient = (props) => {
    const location = useLocation();
    if (!location || !location.state || !location.state.patient_Data) {
        console.error("Location state or patient data is null.");
    }
    const { patient_Data } = location.state;
    const navigate = useNavigate();

    const doctor_code = sessionStorage.getItem('user')
    ? JSON.parse(sessionStorage.getItem('user')).code
    : '0';
    const doctor_name = sessionStorage.getItem('user')
    ? JSON.parse(sessionStorage.getItem('user')).name
    : '';
    const { patientCode } = useParams();
    console.log(patientCode)
    const [hadmID, sethadmID] = useState('All Admission');
    const [allAdmission, setAllAdmission] = useState([{'Admission ID':'All Admission'}]);
    const [error, setError] = useState(null);

    const [infoTag, setInfoTag] = useState([]); // PASS AS PARAMETER


    const [pageSizeGeneral, setPageSizeGeneral] = useState(4);
    const [pageSizeMedicalTest, setPageSizeMedicalTest] = useState(4);
    const [activeTab, setActiveTab] = useState("General");

    const [addmission, setAddmission] = useState([]); // PASS AS PARAMETER
    const [loadingAdmission, setLoadingAdmission] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8001/patients-detail-admission', {
                    params: {
                        doctor_code: doctor_code,
                        subject_id: patientCode
                    }
                });
                setAddmission(response.data.admission);
                setAllAdmission(allAdmission.concat(_.unionBy(response.data.admission, "Admission ID")));
                setLoadingAdmission(false);
                setInfoTag(response.data.infomation_tag)
            } catch (error) {
                setError(error);
                setLoadingAdmission(false);
            }
        };
        if (addmission.length == 0){
            fetchData();
        }
    }, []);

    const [note, setNote] = useState([])
    const [loadingNote, setLoadingNote] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8001/patient-notes', {
                    params: {
                        doctor_code: doctor_code,
                        subject_id: patientCode
                    }
                });
                setNote(response.data.note);
                setLoadingNote(false);
            } catch (error) {
                setError(error);
                setLoadingNote(false);
            }
        };
        fetchData();
    }, []);

    const [procedure, setProcedure] = useState([]); // PASS AS PARAMETER
    const [loadingProcedure, setLoadingProcedure] = useState(true);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8001/patients-detail-procedure', {
                    params: {
                        doctor_code: doctor_code,
                        subject_id: patientCode
                    }
                });
                setProcedure(response.data.procedure);
                setLoadingProcedure(false);
            } catch (error) {
                setError(error);
                setLoadingProcedure(false);
            }
        };
        if (activeTab === "Procedure"){
            var log_data = {
                'user_code': doctor_code,
                'time': format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                'action': 'View Procedure of Patient',
                'related_item': 'Patient ' + patientCode
            }
            log(log_data);
        }
        if (procedure.length === 0 && activeTab === "Procedure") {
            fetchData();
        }
        }, [activeTab]);
    
    const [Prescription, setPrescription] = useState([]); // PASS AS PARAMETER
    const [loadingPrescription, setLoadingPrescription] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8001/patients-detail-prescription', {
                    params: {
                        doctor_code: doctor_code,
                        subject_id: patientCode
                    }
                });
                setPrescription(response.data.prescription);
                setLoadingPrescription(false);
                console.log(Prescription)
            } catch (error) {
                setError(error);
                setLoadingPrescription(false);
            }
        };
        if (activeTab === "Prescription"){
            var log_data = {
                'user_code': doctor_code,
                'time': format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                'action': 'View Prescription of Patient',
                'related_item': 'Patient ' + patientCode
              }
            log(log_data);
        }
        if (Prescription.length === 0  && activeTab === "Prescription") {
            fetchData();
        }    
    }, [activeTab]);


    const [note_event, setNoteEvent] = useState([]); // PASS AS PARAMETER
    const [loadingNoteEvent, setLoadingNoteEvent] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8001/patients-detail-note', {
                    params: {
                        doctor_code: doctor_code,
                        subject_id: patientCode
                    }
                });
                setNoteEvent(response.data.note);
                setLoadingNoteEvent(false);
            } catch (error) {
                setError(error);
                setLoadingNoteEvent(false);
            }
        };
        if (activeTab === "Note"){
            var log_data = {
                'user_code': doctor_code,
                'time': format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                'action': 'View NoteEvent of Patient',
                'related_item': 'Patient ' + patientCode
              }
            log(log_data);
        }
        if (note_event.length === 0 && activeTab === "Note") {
            fetchData();
        }
    }, [activeTab]);


    const [medicaltest, setMedicalTest] = useState([]); // PASS AS PARAMETER
    const [medicaltest1time, setMedicalTest1time] = useState([]); // PASS AS PARAMETER
    const [medicaltestmanytime, setMedicaltestmanytime] = useState([]);
    const [typeofmedicaltest1time, setTypeofmedicaltest1time] = useState([]);
    const [typeofmedicaltestmanytime, setTypeofmedicaltestmanytime] = useState([]);
    const [loadingMedicalTest, setLoadingMedicalTest] = useState(true);
    const isUnique = (arr, item) => {
        return arr.filter(obj => obj.hadm_id === item.hadm_id && obj.itemid === item.itemid).length === 1;
      };
    function sortByDatetimeAscending(a, b) {
        const dateA = new Date(a.charttime);
        const dateB = new Date(b.charttime);
        
        if (dateA < dateB) {
            return -1;
        }
        if (dateA > dateB) {
            return 1;
        }
        return 0;
    }
    const [componentChart, setComponentChart] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8001/patients-detail-medicaltest', {
                    params: {
                        doctor_code: doctor_code,
                        subject_id: patientCode
                    }
                });
                setMedicalTest(response.data.medicaltest);
                setMedicalTest1time(response.data.medicaltest.filter((item, index, array) => {
                    return isUnique(array, item);
                  })
                )
                setMedicaltestmanytime(response.data.medicaltest.filter((item, index, array) => {
                    return !isUnique(array, item);
                  }).sort(sortByDatetimeAscending)
                )
                setTypeofmedicaltest1time(_.uniqBy(response.data.medicaltest.filter((item, index, array) => {
                    return isUnique(array, item);
                }), item => `${item.hadm_id}-${item.fluid}`).map(image => ({hadm_id: image.hadm_id, fluid: image.fluid})))
                setTypeofmedicaltestmanytime(_.uniqBy(response.data.medicaltest.filter((item, index, array) => {
                    return !isUnique(array, item);
                }), item => `${item.hadm_id}-${item.label}`).map(image => ({hadm_id: image.hadm_id, label: image.label})))
                setLoadingMedicalTest(false);
                const temp = _.uniqBy(response.data.medicaltest.filter((item, index, array) => {
                    return !isUnique(array, item);
                }), item => `${item.hadm_id}-${item.label}`).map(image => ({hadm_id: image.hadm_id, label: image.label}));
                setComponentChart([{
                    id: 1,
                    charttype: hadmID === 'All Admission' && temp.length > 0 ? temp[0].label : temp.filter((item) => {
                        const itemValue = String(item.hadm_id);
                        return itemValue.includes(props.hadmID)
                    }).length > 0 ? temp.filter((item) => {
                        const itemValue = String(item.hadm_id);
                        return itemValue.includes(props.hadmID);
                    })[0].label : ""
                }])
            } catch (error) {
                setError(error);
                setLoadingMedicalTest(false);
            }
        };
        if (activeTab === "MedicalTest"){
            var log_data = {
                'user_code': doctor_code,
                'time': format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                'action': 'View MedicalTest of Patient',
                'related_item': 'Patient ' + patientCode
              }
            log(log_data);
        }
        if (medicaltest.length === 0 && activeTab === "MedicalTest") {
            fetchData();
        }
        }, [activeTab]);


    

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
    const keysToExtract = ['Gender','Ethnicity','Date of Birth','Marital Status','Admission Time','Discharge Time'];
    

    return(
        <DoctorLayout path={
                <Breadcrumb fontSize="xl">
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
                                <PatientTag patient={true} data={patient_Data} loading={false} keysToExtract = {keysToExtract}/>
                            </ScaleFade>
                        </GridItem> : null }

                        {!expand?
                        <GridItem area={'note'}>
                            <ScaleFade initialScale={0.8} in={!expand} style={{height: '100%'}}>
                                <Note loading ={loadingNote} pageSize={3} setNote={setNote} data={note} type={"patient-note"} subject_id={patientCode}/>
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
                <GridItem marginLeft={4} pl='2' area={'main'} bg={'#fff'} borderEndEndRadius={'40px'} padding={6} height="100%" position={'relative'}>
                    <Grid
                        h='40px'
                        templateColumns='repeat(6, 1fr)'
                        gap={4}
                        >
                        <GridItem textAlign={'right'} colStart={5} colSpan={1}>
                            <label htmlFor="Admission ID">
                            <Text paddingTop={1} fontWeight={600}>Admission ID:</Text></label>
                        </GridItem>
                        <GridItem colStart={6} colSpan={1}>
                            <Select id='Admission ID' onChange={(e) => {sethadmID(e.target.value)}} fontWeight={600} color={'#3E36B0'} variant={'outline'}>
                                {
                                    allAdmission.map(item => (
                                        <option selected={item === hadmID ? true : false} value={item['Admission ID']}>{item['Admission ID'] === 'All Admission' ? item['Admission ID'] : item['Admission ID'] + '   -   ' + item['Admission Time'] + '   -   ' + item['Admission Type']+ '   -   ' + item['Admission Location']}</option>
                                    ))
                                }
                            </Select>
                        </GridItem>
                    </Grid>
                    <Tabs isFitted variant='enclosed' size={'md'} height={'99%'} position={'relative'}>
                        <TabList>
                            <Tab fontWeight={'bold'} key={1} onClick={() => setActiveTab("General")}>General</Tab>
                            <Tab fontWeight={'bold'} key={2} onClick={() => setActiveTab("MedicalTest")}>Medical Test</Tab>
                            <Tab fontWeight={'bold'} key={3} onClick={() => setActiveTab("Procedure")}>Procedure</Tab>
                            <Tab fontWeight={'bold'} key={4} onClick={() => setActiveTab("Prescription")}>Prescription</Tab>
                            <Tab fontWeight={'bold'} key={5} onClick={() => setActiveTab("Note")}>Note</Tab>
                            <Tab fontWeight={'bold'} key={6} onClick={() => setActiveTab("Diseases")}>Diseases</Tab>
                        </TabList>
                        <TabPanels h={'93%'} position={'relative'}>
                            <TabPanel key={1} h={'100%'} position={'relative'}>
                                {activeTab === "General" && <GeneralTab addmission={addmission} generalTag={infoTag} expand={expand} pageSize={pageSizeGeneral} setPageSize={setPageSizeGeneral} hadmID={hadmID} sethadmID={sethadmID}/>}
                            </TabPanel>
                            <TabPanel key={2} h={'100%'}>
                                {activeTab === "MedicalTest" 
                                && <MedicalTestTab subject_id={patientCode} hadmID={hadmID} 
                                expand={expand} pageSize={pageSizeMedicalTest} setPageSize={setPageSizeMedicalTest}
                                medicaltest={medicaltest} medicaltest1time={medicaltest1time} medicaltestmanytime={medicaltestmanytime}
                                typeofmedicaltest1time={typeofmedicaltest1time} typeofmedicaltestmanytime={typeofmedicaltestmanytime}
                                componentChart={componentChart} setComponentChart={setComponentChart}/>}
                            </TabPanel>
                            <TabPanel key={3} h={'100%'}>
                                {activeTab === "Procedure" && <ProcedureTab procedure={procedure} subject_id={patientCode} hadmID={hadmID}/>}
                            </TabPanel>
                            <TabPanel key={4} h={'100%'}>
                                {activeTab === "Prescription" && <PrescriptionTab Prescription={Prescription} subject_id={patientCode} hadmID={hadmID}/>}
                            </TabPanel>
                            <TabPanel key={5} h={'100%'}>
                                {activeTab === "Note" && <NoteTab note={note_event} hadmID={hadmID} expand={expand} subject_id={patientCode}/>}
                            </TabPanel>
                            <TabPanel key={6} h={'100%'} position={'relative'}>
                                {activeTab === "Diseases" && <DiseasesTab subject_id={patientCode} allAdmission={allAdmission}/>}
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </GridItem>
        </DoctorLayout>
    )
};

export default DetailPatient;