import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OveralTag from "../../../components/OveralTag/OveralTag";
import Note from "../../../components/Note/Note";
import PatientList from "../../../components/PatientList/PatientList";
import PatientInfor from "../../../components/PatientInfor/PatientInfor";
import { Center, Spinner } from "@chakra-ui/react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
  } from '@chakra-ui/react'
import { DoctorLayout } from "../../../layout/DoctorLayout";
import { Grid, GridItem } from '@chakra-ui/react'
const Overview = () => {
    const doctor_code = sessionStorage.getItem('user')
    ? JSON.parse(sessionStorage.getItem('user')).code
    : '0';
    const doctor_name = sessionStorage.getItem('user')
    ? JSON.parse(sessionStorage.getItem('user')).name
    : '0';
    const [patientdata, setPatientData] = useState([]); // PASS AS PARAMETER
    const [loadingPatient, setLoadingPatient] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPatient, setSelectedPatient] = useState(null); // New state to hold selected patient

    const [note, setNote] = useState([]);
    const [loadingNote, setLoadingNote] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8001/self-notes', {
                    params: {
                        user_code: doctor_code
                    }
                });
                setNote(response.data.data);
                setLoadingNote(false);
            } catch (error) {
                setError(error);
                setLoadingNote(false);
            }
        };
    
        fetchData();
    }, []);
    const [tagData, setTagData] = useState([]); // PASS AS PARAMETER

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8001/patients-overview', {
                    params: {
                        doctor_code: doctor_code
                    }
                });
                setPatientData(response.data.data);
                setTagData(response.data.genderData)
                if (response.data.data.length > 0) {
                    setSelectedPatient(response.data.data[0]);
                }
                setLoadingPatient(false);
            } catch (error) {
                setError(error);
                setLoadingPatient(false);
            }
        };
    
        fetchData();
    }, []);

    const handlePatientSelect = (patient) => {
        setSelectedPatient(patient);
    };

    return(
        <DoctorLayout path={
            <Breadcrumb fontSize="xl">
                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink href='#' style={{ fontSize: "25px"}}>Overview</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            }
            patient={false}
            name={doctor_name}
            >
                <GridItem position={'relative'} marginLeft={4} pl='2' area={'main'} gap={'1%'}>
                    <Grid templateAreas={`"overal note"
                                          "list infor"`}          
                          gridTemplateRows={'42.5% 56.5%'}
                          gridTemplateColumns={'59.5% 39.5%'}
                          h='100%'>
                        <GridItem area={'overal'}>
                            <Center h={'100%'} position={'relative'}>
                                <OveralTag tagData={tagData} title = "Visit for today" value = {tagData.reduce((total, item) => total + item.value, 0)}/>
                            </Center>
                        </GridItem>
                        <GridItem area={'note'} position={'relative'}>
                            <Center position={'relative'} height={'100%'}>
                                <Note loading ={loadingNote} pageSize={2} setNote={setNote} data={note} type={"self-note"} subject_id={""} />
                            </Center>
                        </GridItem>
                        {loadingPatient ? (
                            <GridItem area={'list'} bg={'#fff'} borderRadius={'20px'} h={'96%'}>
                                <Center h={'100%'}>
                                    <Spinner size="xl" />
                                </Center>
                            </GridItem>
                        ) : (
                            <GridItem area={'list'} bg={'#fff'} borderRadius={'20px'}>
                                <PatientList setSelectedPatient={setSelectedPatient} data={patientdata} onPatientSelect={handlePatientSelect} selectedPatient={selectedPatient}/>
                            </GridItem>
                        )}
                        <GridItem area={'infor'}>
                            <Center h={'100%'} position={'relative'}>
                                <PatientInfor data={selectedPatient}/>
                            </Center>
                        </GridItem>
                    </Grid>
                </GridItem>
        </DoctorLayout>
    )
};

export default Overview;