import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchAndFilterBar from "../../../components/SearchAndFilterBar/SearchAndFilterBar";
import { Center, Slider, Divider, SimpleGrid, Icon, Box  } from "@chakra-ui/react";
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
import _ from "lodash";
import dayjs from 'dayjs';
import { format } from 'date-fns'
import {log} from '../../../functions';

const theme = createTheme();

const Patient = () => {

    const doctor_code = sessionStorage.getItem('user')
    ? JSON.parse(sessionStorage.getItem('user')).code
    : '0';
    const doctor_name = sessionStorage.getItem('user')
    ? JSON.parse(sessionStorage.getItem('user')).name
    : '0';
    const [patientdata, setPatientData] = useState([]); // PASS AS PARAMETER
    const [loadingPatient, setLoadingPatient] = useState(true);
    const [error, setError] = useState(null);
    const [filteredResults, setFilteredResults] = useState([]);
    const [dynamicFilter, setDynamicFilter] = useState([]);
    let admission_location = [];
    let admission_type = [];
    let ethnicity = [];
    let insurance = [];
    let marital_status = [];
    let gender = [];
    const [filterData, setfilterData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/patients-overview', {
                    params: {
                        doctor_code: doctor_code
                    }
                });
                console.log(response.data.data);
                setPatientData(response.data.data);
                setFilteredResults(response.data.data);
                admission_location = _.uniqBy(response.data.data, "Admission Location").map((image) => image['Admission Location']);
                admission_type = _.uniqBy(response.data.data, "Admission Type").map((image) => image['Admission Type']);
                ethnicity = _.uniqBy(response.data.data, "Ethnicity").map((image) => image.Ethnicity);
                insurance = _.uniqBy(response.data.data, "Insurance").map((image) => image.Insurance);
                marital_status = _.uniqBy(response.data.data, "Marital Status").map((image) => image['Marital Status']);
                gender = _.uniqBy(response.data.data, "Gender").map((image) => image.Gender);
                setfilterData([{name: "Admission Location", data: admission_location}, 
                               {name: "Admission Type", data: admission_type}, 
                               {name:"Ethnicity", data: ethnicity}, 
                               {name: "Insurance", data: insurance}, 
                               {name: "Marital Status", data: marital_status},
                               {name: "Gender", data: gender}]);
                setLoadingPatient(false);
            } catch (error) {
                setError(error);
                setLoadingPatient(false);
            }
        };
        fetchData();
    }, []);
    
    const handleClick = (data) => {
        var log_data = {
            'user_code': doctor_code,
            'time': format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            'action': 'View Detail of Patient',
            'related_item': 'Patient ' + data.subject_id
          }
          log(log_data);
        navigate(`detailpatient/${data.subject_id}`, { state: { patient_Data: data }} ); // Assuming the URL pattern is '/patient/:patientCode'
    };

    const [searchInput, setSearchInput] = useState('');
    const [adms, setAdms] = useState(null);
    const [disc, setDisc] = useState(null);
    const searchItems = () => {
        // setSearchInput(searchValue)
        if (searchInput !== '' && dynamicFilter.length > 0) {
            // const applyFilter = (patientdata, searchInput, dynamicFilter) => {
                // Convert single searchInput to lowercase
            const normalizedSearchInput = searchInput.toLowerCase();
            
            // Filter based on both searchInput and dynamicFilter criteria
            const filteredData = patientdata.filter((item) => {
                // Check if any property value contains the single searchInput
                const includesSearchInput = Object.values(item)
                    .join('')
                    .toLowerCase()
                    .includes(normalizedSearchInput);
            
                // Check if item matches all dynamicFilter criteria
                const uniqueFilter = _.uniqBy(dynamicFilter, 'name').map((item) => item.name);
                console.log(uniqueFilter)
                const uniquematchesdynamicFilter = uniqueFilter.every((name) => {
                    const matchesdynamicFilter = dynamicFilter.filter((item) => {return item.name === name}).some(({name, value}) => {
                        const itemValue = String(item[name]).toLowerCase();
                        return itemValue.includes(String(value).toLowerCase());
                    })
                    return matchesdynamicFilter;
                })
                return includesSearchInput && uniquematchesdynamicFilter;
            });
            if(adms!== null && disc!==null) {
                setFilteredResults(filteredData.filter((item) => {
                    return new Date(item['Admission Time']) >= adms && new Date(item['Discharge Time']) <= disc;
                }))
            }
            else if(adms!==null){
                setFilteredResults(filteredData.filter((item) => {
                    return new Date(item['Admission Time']) >= adms;
                }))
            }
            else if(disc!==null){
                setFilteredResults(filteredData.filter((item) => {
                    return new Date(item['Discharge Time']) <= disc;
                }))
            }
            else{
                setFilteredResults(filteredData);
            }
        }
        else if (searchInput !== '') {
            const filterData2 = patientdata.filter((item) => {
                return Object.values(item).join('').toLowerCase().includes(searchInput.toLowerCase())
            })
            if(adms!== null && disc!==null) {
                setFilteredResults(filterData2.filter((item) => {
                    return new Date(item['Admission Time']) >= adms && new Date(item['Discharge Time']) <= disc;
                }))
            }
            else if(adms!==null){
                setFilteredResults(filterData2.filter((item) => {
                    return new Date(item['Admission Time']) >= adms;
                }))
            }
            else if(disc!==null){
                setFilteredResults(filterData2.filter((item) => {
                    return new Date(item['Discharge Time']) <= disc;
                }))
            }
            else{
                setFilteredResults(filterData2)
            }
        }
        else if (dynamicFilter.length > 0) {
            const filterData2 = patientdata.filter((item) => {
                // Check if item matches all search criteria
                const uniqueFilter = _.uniqBy(dynamicFilter, 'name').map((item) => item.name);
                console.log(uniqueFilter)
                const uniquematchesdynamicFilter = uniqueFilter.every((name) => {
                    const matchesdynamicFilter = dynamicFilter.filter((item) => {return item.name === name}).some(({name, value}) => {
                        const itemValue = String(item[name]).toLowerCase();
                        return itemValue.includes(String(value).toLowerCase());
                    })
                    return matchesdynamicFilter;
                })
                return uniquematchesdynamicFilter;
            });
            if(adms!== null && disc!== null) {
                setFilteredResults(filterData2.filter((item) => {
                    return new Date(item['Admission Time']) >= adms && new Date(item['Discharge Time']) <= disc;
                }))
            }
            else if(adms!==null){
                setFilteredResults(filterData2.filter((item) => {
                    return new Date(item['Admission Time']) >= adms;
                }))
            }
            else if(disc!==null){
                setFilteredResults(filterData2.filter((item) => {
                    return new Date(item['Discharge Time']) <= disc;
                }))
            }
            else{
                setFilteredResults(filterData2);
            }
        }
        else{
            if(adms!== null && disc!== null) {
                setFilteredResults(patientdata.filter((item) => {
                    return new Date(item['Admission Time']) >= adms && new Date(item['Discharge Time']) <= disc;
                }));
            }
            else if(adms!== null){
                setFilteredResults(patientdata.filter((item) => {
                    return new Date(item['Admission Time']) >= adms;
                }));
            }
            else if(disc!== null){
                setFilteredResults(patientdata.filter((item) => {
                    return new Date(item['Discharge Time']) <= disc;
                }));
            }
            else{
            setFilteredResults(patientdata)
            }
        }
        // console.log(filterData.find(item => item.name === 'admission_location'))
    }

    const pageSize = 4;
    const [page, setPage] = useState(1);
    const handleChangePage = (event, newpage) => {
        setPage(newpage);
    };
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const slicedData = filteredResults.slice(startIndex, endIndex);
    
    const navigate = useNavigate();

    return(
        <DoctorLayout path={
          <Breadcrumb fontSize="xl">
              <BreadcrumbItem isCurrentPage>
                  <BreadcrumbLink href='#'>Patient</BreadcrumbLink>
              </BreadcrumbItem>
          </Breadcrumb>
        }
        patient={false}
        name={doctor_name}
        >
            <GridItem h={'100%'} bg={'#fff'} area={'main'} borderRadius={'0 0 40px 40px'}>
            <Center padding={'1% 4%'}>
                <SearchAndFilterBar patient={true} adms={adms} disc={disc} setAdms={setAdms} setDisc={setDisc} setSearchInput={setSearchInput} searchItems={searchItems} dynamicFilter={dynamicFilter} setDynamicFilter={setDynamicFilter} onClick={searchItems} onChange={searchItems} filterData={filterData}/>
            </Center>
                <Divider size={{height: '3px'}} color={'#3E36B0'} orientation='horizontal'/>
                <Box h={'100%'} position={'relative'}>

                    {loadingPatient ?(
                        <Center h={'60%'} w={'100%'} bg={'#fff'} borderRadius={'20px'} position={'absolute'}>
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
                                    count={Math.ceil(filteredResults.length / pageSize)} 
                                    page = {page} 
                                    onChange = {handleChangePage}/>
                            </Center>
                        </ThemeProvider>
                    }
                </Box>

            </GridItem>
        </DoctorLayout>
    )
};

export default Patient;