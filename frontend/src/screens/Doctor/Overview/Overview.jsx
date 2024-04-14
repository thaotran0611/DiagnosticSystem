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
    BreadcrumbSeparator,
  } from '@chakra-ui/react'
import { DoctorLayout } from "../../../layout/DoctorLayout";
import { useNavigate } from "react-router-dom";
import { Grid, GridItem,Text } from '@chakra-ui/react'
const Overview = () => {
    const navigate = useNavigate();
    const doctor_code = sessionStorage.getItem('user')
    ? JSON.parse(sessionStorage.getItem('user')).code
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
                const response = await axios.get('http://localhost:8000/self-notes', {
                    params: {
                        doctor_code: doctor_code
                    }
                });
                console.log(response)
                setNote(response.data.data);
                setLoadingNote(false);
            } catch (error) {
                setError(error);
                setLoadingNote(false);
            }
        };
    
        fetchData();
        const intervalId = setInterval(fetchData, 5000);
        return () => clearInterval(intervalId);
    }, []);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/patients-overview', {
                    params: {
                        doctor_code: doctor_code
                    }
                });
                console.log(response)
                setPatientData(response.data.data);
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
            patient={false}>
                <GridItem position={'relative'} marginLeft={4} pl='2' area={'main'} gap={'1%'}>
                    <Grid templateAreas={`"overal note"
                                          "list infor"`}          
                          gridTemplateRows={'42.5% 56.5%'}
                          gridTemplateColumns={'59.5% 39.5%'}
                          h='100%'>
                        <GridItem area={'overal'}>
                            <Center h={'100%'} position={'relative'}>
                                <OveralTag title = "Visit for today" value = "50"/>
                            </Center>
                        </GridItem>
                        <GridItem area={'note'} position={'relative'}>
                            <Center position={'relative'} height={'100%'}>
                                <Note loading ={loadingNote} pageSize={2} data={note} type={"self-note"} subject_id={""} />
                            </Center>
                        </GridItem>
                        {loadingPatient ? (
                            <GridItem area={'list'} bg={'#fff'} borderRadius={'20px'}>
                                <Center h={'100%'}>
                                    <Spinner size="xl" />
                                </Center>
                            </GridItem>
                        ) : (
                            <GridItem area={'list'} bg={'#fff'} borderRadius={'20px'}>
                                <PatientList data={patientdata} onPatientSelect={handlePatientSelect}/>
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