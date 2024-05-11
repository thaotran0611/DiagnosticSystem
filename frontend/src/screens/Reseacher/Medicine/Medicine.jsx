import React, { useEffect, useState } from "react";
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
// import { DoctorLayout } from "../../../layout/DoctorLayout";
import { ResearcherLayout } from "../../../layout/ResearcherLayout";
import { Grid, GridItem } from '@chakra-ui/react'
import { useNavigate } from "react-router-dom";
import DiseaseTag from "../../../components/DiseaseTag/DiseaseTag";
import axios from "axios";
import _ from 'lodash';
import { format } from 'date-fns'
import {log} from '../../../functions';
const theme = createTheme();

const Medicine = () => {
    const [drugs, setDrugs] = useState([]);
    const [loadingDrugs, setLoadingDrugs] = useState(true);
    const researcher_code = sessionStorage.getItem('user')
    ? JSON.parse(sessionStorage.getItem('user')).code
    : '0';
    const researcher_name = sessionStorage.getItem('user')
    ? JSON.parse(sessionStorage.getItem('user')).name
    : '0';
    
    const [filteredResults, setFilteredResults] = useState([]);
    const [dynamicFilter, setDynamicFilter] = useState([]);
    const [error, setError] = useState(null);
    const [filterData, setfilterData] = useState([]);
    let drug_name_poe = [];
    let drug_type = [];
    let formulary_drug_cd = [];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/researcher-overview-drug', {
                    params: {
                        researcher_code: researcher_code
                    }
                });
                console.log(response);
                setDrugs(response.data.drugs)
                setFilteredResults(response.data.drugs);
                drug_name_poe = _.uniqBy(response.data.drugs, 'drug_name_poe').map((item) => item.drug_name_poe);
                console.log(_.uniqBy(response.data.drugs, 'formulary_drug_cd').map((item) => item.formulary_drug_cd));
                drug_type = _.uniqBy(response.data.drugs, 'drug_type').map((item) => item.drug_type);
                formulary_drug_cd = _.uniqBy(response.data.drugs, 'formulary_drug_cd').map((item) => item.formulary_drug_cd);
                setfilterData([
                               {name: 'drug_type', data: drug_type}]);
                setLoadingDrugs(false);
            } catch (error) {
                setError(error);
                setLoadingDrugs(false);
            }
        };
        fetchData();
    }, []);

    const [searchInput, setSearchInput] = useState('');
    const searchItems = () => {
        if (searchInput !== '' && dynamicFilter.length > 0) {
            // const applyFilter = (patientdata, searchInput, dynamicFilter) => {
                // Convert single searchInput to lowercase
            const normalizedSearchInput = searchInput.toLowerCase();
            
            // Filter based on both searchInput and dynamicFilter criteria
            const filteredData = drugs.filter((item) => {
                // Check if any property value contains the single searchInput
                const includesSearchInput = Object.values(item)
                    .join('')
                    .toLowerCase()
                    .includes(normalizedSearchInput);
            
                // Check if item matches all dynamicFilter criteria
                const uniqueFilter = _.uniqBy(dynamicFilter, 'name').map((item) => item.name);
                const uniquematchesdynamicFilter = uniqueFilter.every((name) => {
                    const matchesdynamicFilter = dynamicFilter.filter((item) => {return item.name === name}).some(({name, value}) => {
                        const itemValue = String(item[name]).toLowerCase();
                        return itemValue.includes(String(value).toLowerCase());
                    })
                    return matchesdynamicFilter;
                })
                return includesSearchInput && uniquematchesdynamicFilter;
            });
            setFilteredResults(filteredData);
            
        }
        else if (searchInput !== '') {
            const filterData2 = drugs.filter((item) => {
                return Object.values(item).join('').toLowerCase().includes(searchInput.toLowerCase())
            })
            setFilteredResults(filterData2)
        }
        else if (dynamicFilter.length > 0) {
            const filterData2 = drugs.filter((item) => {
                // Check if item matches all search criteria
                const uniqueFilter = _.uniqBy(dynamicFilter, 'name').map((item) => item.name);
                const uniquematchesdynamicFilter = uniqueFilter.every((name) => {
                    const matchesdynamicFilter = dynamicFilter.filter((item) => {return item.name === name}).some(({name, value}) => {
                        const itemValue = String(item[name]).toLowerCase();
                        return itemValue.includes(String(value).toLowerCase());
                    })
                    return matchesdynamicFilter;
                })
                return uniquematchesdynamicFilter;
            });
            setFilteredResults(filterData2);
        }
        else{
            setFilteredResults(drugs);
        }
    }
    
    const pageSize = 12;
    const [page, setPage] = useState(1);
    const handleChangePage = (event, newpage) => {
        setPage(newpage);
    };
    let startIndex = (page - 1) * pageSize;
    let endIndex = startIndex + pageSize;
    let slicedData = filteredResults.slice(startIndex, endIndex);
    const navigate = useNavigate();
    const handleClick = (data) => {
        var log_data = {
            'user_code': researcher_code,
            'time': format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            'action': 'View Detail of Medicine',
            'related_item': 'Medicine ' + data.drug_name_poe
          }
          log(log_data);
        navigate(`detailmedicine/${data.drug_name_poe}`, {state: {data: data}}); // Assuming the URL pattern is '/patient/:patientCode'
    };
    return(
        <ResearcherLayout path={
          <Breadcrumb>
              <BreadcrumbItem isCurrentPage>
                  <BreadcrumbLink href='#'>Medicine</BreadcrumbLink>
              </BreadcrumbItem>
          </Breadcrumb>
        }
        name={researcher_name}
        disease={false}>
                <GridItem bg={'#fff'} area={'main'} borderRadius={'0 0 40px 40px'}>
                <Center padding={'1% 4%'}>
                    <SearchAndFilterBar patient={false} setSearchInput={setSearchInput} searchItems={searchItems} dynamicFilter={dynamicFilter} setDynamicFilter={setDynamicFilter} onClick={searchItems} onChange={searchItems} filterData={filterData}/>   
                </Center>
                    <Divider size={{height: '3px'}} color={'#3E36B0'} orientation='horizontal'/>
                        <ThemeProvider theme={theme}>
                            <Center>
                                <SimpleGrid mt={0} columns={4} spacing={10}>
                                    {
                                        slicedData.map(item => (
                                            <DiseaseTag  onClick={handleClick} sum_of_admission={1} medicine={true} data={item}/>
                                        ))
                                    }
                                </SimpleGrid>
                            </Center>
                            <Center>
                                <MyPagination 
                                    count={Math.ceil(filteredResults.length / pageSize)} 
                                    page = {page} 
                                    onChange = {handleChangePage}/>
                            </Center>
                        </ThemeProvider>
                </GridItem>
        </ResearcherLayout>
    )
};

export default Medicine;