import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchAndFilterBar from "../../../components/SearchAndFilterBar/SearchAndFilterBar";
import { Center, Slider, Divider, SimpleGrid, Icon  } from "@chakra-ui/react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
  } from '@chakra-ui/react'
import { ThemeProvider, createTheme } from "@mui/material";
import MyPagination from "../../../components/Pagination/Pagination";
import PatientGridCard from "../../../components/PatientGridCard/PatientGridCard";
import { DoctorLayout } from "../../../layout/DoctorLayout";
import { Grid, GridItem, Spinner } from '@chakra-ui/react'
import { useNavigate } from "react-router-dom";

const theme = createTheme();

const Patient = () => {

    const doctor_code = sessionStorage.getItem('user')
    ? JSON.parse(sessionStorage.getItem('user')).code
    : '0';

    const [patientdata, setPatientData] = useState([]); // PASS AS PARAMETER
    const [loadingPatient, setLoadingPatient] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchData = async () => {
          try {
              const response = await axios.get('http://localhost:8000/patients', {
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
    
    const pageSize = 4;
    const [page, setPage] = useState(1);
    const handleChangePage = (event, newpage) => {
        setPage(newpage);
    };
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const slicedData = patientdata.slice(startIndex, endIndex);
    const navigate = useNavigate();

    const handleClick = (patientCode) => {
        navigate(`detailpatient/${patientCode}`); // Assuming the URL pattern is '/patient/:patientCode'
    };
    return(
        <DoctorLayout path={
          <Breadcrumb>
              <BreadcrumbItem isCurrentPage>
                  <BreadcrumbLink href='#'>Patient</BreadcrumbLink>
              </BreadcrumbItem>
          </Breadcrumb>
        }
        patient={false}>
                <GridItem bg={'#fff'} area={'main'}>
                <Center padding={'1% 4%'}>
                    <SearchAndFilterBar/>
                </Center>
                    <Divider size={{height: '3px'}} color={'#3E36B0'} orientation='horizontal'/>
                    {loadingPatient ?(
                        <Center h={'100%'} bg={'#fff'} borderRadius={'20px'}>
                            <Spinner size="xl" />
                        </Center>
                    ) :
                        <ThemeProvider theme={theme}>
                            <Center>
                                <SimpleGrid mt={0} columns={2} spacing={1}>
                                    {
                                        slicedData.map(item => (
                                            <PatientGridCard data={item} onClick={handleClick}/>
                                        ))
                                    }
                                </SimpleGrid>
                            </Center>
                            <Center mt={3} mb={3}>
                                <MyPagination 
                                    count={Math.ceil(patientdata.length / pageSize)} 
                                    page = {page} 
                                    onChange = {handleChangePage}/>
                            </Center>
                        </ThemeProvider>
                }
                </GridItem>
        </DoctorLayout>
    )
};

export default Patient;