import React, { useEffect, useState } from "react";
import OveralTag from "../../../components/OveralTag/OveralTag";
import Note from "../../../components/Note/Note";
import axios from 'axios';
import { Box, Center } from "@chakra-ui/react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
  } from '@chakra-ui/react'
import { useNavigate } from "react-router-dom";
import { Grid, GridItem,Text } from '@chakra-ui/react'
import { ResearcherLayout } from "../../../layout/ResearcherLayout";
import DiseaseList from "../../../components/DiseaseCard/DiseaseList";
import dayjs from 'dayjs';
const OverviewResearcher = () => {
    const navigate = useNavigate();
    const [patientdata, setPatientData] = useState([]); // PASS AS PARAMETER
    const [tagData, setTagData] = useState([]);
    const [loadingPatient, setLoadingPatient] = useState(true);
    const [error, setError] = useState(null);
    const researcher_code = sessionStorage.getItem('user')
    ? JSON.parse(sessionStorage.getItem('user')).code
    : '0';
    const researcher_name = sessionStorage.getItem('user')
    ? JSON.parse(sessionStorage.getItem('user')).name
    : '0';
    const [note, setNote] = useState([]);
    const [loadingNote, setLoadingNote] = useState(true);
    const [diseases, setDiseases] = useState([]);
    const [loadingDiseases, setLoadingDiseases] = useState(true);
    const [drugs, setDrugs] = useState([]);
    const [loadingDrugs, setLoadingDrugs] = useState(true);
    const joinArrays = (arr1, arr2, key) => {
        return arr1.map(item1 => {
          const matchingItem = arr2.find(item2 => item2[key] === item1[key]);
          return { ...item1, ...matchingItem };
        });
      };
    const mappingDiseases = [
        {
            disease_code: 'AA',
            disease_name: 'Alcohol Abuse',
        },
        {
            disease_code: 'CP',
            disease_name: 'Chronic Pain',
        },
        {
            disease_code: 'LD',
            disease_name: 'Lungs',
        },
        {
            disease_code: 'MC',
            disease_name: 'Cancer',
        },
        {
            disease_code: 'Dep',
            disease_name: 'Depression',
        },
        {
            disease_code: 'Ob',
            disease_name: 'Obesity',
        },
        {
            disease_code: 'PD',
            disease_name: 'Psychiatric Disorder',
        },
        {
            disease_code: 'SA',
            disease_name: 'Substance Abuse',
        },
        {
            disease_code: 'HD',
            disease_name: 'Heart',
        },
        {
            disease_code: 'CND',
            disease_name: 'Chronic Neurologic',
        }
    ]

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/researcher-overview-patient', {
                    params: {
                        researcher_code: researcher_code
                    }
                });
                setPatientData(response.data.patient);
                setTagData([{id: 1, title: 'Male patients', value: response.data.patient.filter((item) => {
                                const itemValue = item.gender;
                                return itemValue === 'M';
                            }).length},
                            {id: 2, title: 'Female patients', value: response.data.patient.filter((item) => {
                                const itemValue = item.gender;
                                return itemValue === 'F';
                            }).length}
                        ])
                setLoadingPatient(false);
            } catch (error) {
                setError(error);
                setLoadingPatient(false);
            }
        };
    
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/self-notes', {
                    params: {
                        user_code: researcher_code
                    }
                });
                setNote(response.data.data);
                alert('hello')
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
                const response = await axios.get('http://localhost:8000/researcher-overview-disease', {
                    params: {
                        researcher_code: researcher_code
                    }
                });
                setDiseases(joinArrays(response.data.diseases, mappingDiseases, 'disease_code'));
                setLoadingDiseases(false);
                console.log(joinArrays(response.data.diseases, mappingDiseases, 'disease_code'));
            } catch (error) {
                setError(error);
                setLoadingDiseases(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/researcher-overview-drug', {
                    params: {
                        researcher_code: researcher_code
                    }
                });
                setDrugs(response.data.drugs)
                setLoadingDrugs(false);
                console.log(response.data.drugs.length);
            } catch (error) {
                setError(error);
                setLoadingDiseases(false);
            }
        };
        fetchData();
    }, []);

    return(
        <ResearcherLayout path={
            <Breadcrumb fontSize="xl">
                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink href='#' style={{ fontSize: "25px"}}>Overview</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            }
            disease={false}>
                <GridItem position={'relative'} marginLeft={4} pl='2' area={'main'} gap={1}>
                    <Grid templateAreas={`"overal note"
                                          "list list"`}          
                          gridTemplateRows={'42.5% 54.5%'}
                          gridTemplateColumns={'59.5% 39.5%'}
                          h='100%'>
                        <GridItem area={'overal'}>
                            <Center h={'100%'} position={'relative'}>
                                <OveralTag title = "Number of patients" value = {patientdata.length} tagData={tagData}/>
                            </Center>
                        </GridItem>
                        <GridItem area={'note'} position={'relative'}>
                            <Center position={'relative'} height={'100%'}>
                                <Note loading ={loadingNote} pageSize={2} data={note} type={"self-note"} subject_id={""}/>
                            </Center>
                        </GridItem>
                        <GridItem h={'100%'} area={'list'} bg={'#fff'} borderRadius={'20px'} overflow={'auto'} position={'relative'}>
                            <Box position={'relative'} borderRadius={'20px'} overflow={'auto'}>
                                <DiseaseList diseases={diseases} drugs={drugs}/>
                            </Box>
                        </GridItem>
                    </Grid>
                </GridItem>
        </ResearcherLayout>
    )
};

export default OverviewResearcher;