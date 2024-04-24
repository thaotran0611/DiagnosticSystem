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
                                <Note pageSize='2'/>
                            </Center>
                        </GridItem>
                        <GridItem h={'100%'} area={'list'} bg={'#fff'} borderRadius={'20px'} overflow={'auto'} position={'relative'}>
                            <Box position={'relative'} borderRadius={'20px'} overflow={'auto'}>
                                <DiseaseList/>
                            </Box>
                        </GridItem>
                    </Grid>
                </GridItem>
        </ResearcherLayout>
    )
};

export default OverviewResearcher;