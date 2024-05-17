import React, { useEffect, useState } from "react";
import SearchAndFilterBar from "../../../components/SearchAndFilterBar/SearchAndFilterBar";
import { Center, Divider, SimpleGrid,  Box  } from "@chakra-ui/react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
  } from '@chakra-ui/react'
import { ThemeProvider, createTheme } from "@mui/material";
import MyPagination from "../../../components/Pagination/Pagination";
import { ResearcherLayout } from "../../../layout/ResearcherLayout";
import { GridItem } from '@chakra-ui/react'
import { useNavigate } from "react-router-dom";
import DiseaseTag from "../../../components/DiseaseTag/DiseaseTag";
import axios from "axios";
import _ from 'lodash';
import { format } from 'date-fns'
import {log} from '../../../functions';
const theme = createTheme();

const Disease = () => {
    const [diseases, setDiseases] = useState([]);
    const researcher_code = sessionStorage.getItem('user')
    ? JSON.parse(sessionStorage.getItem('user')).code
    : '0';
    const researcher_name = sessionStorage.getItem('user')
    ? JSON.parse(sessionStorage.getItem('user')).name
    : '0';
    const joinArrays = (arr1, arr2, key) => {
        return arr1.map(item1 => {
          const matchingItem = arr2.find(item2 => item2[key] === item1[key]);
          return { ...item1, ...matchingItem };
        });
    };
    const [loadingDiseases, setLoadingDiseases] = useState(true);
    const [error, setError] = useState(null);
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
    const [filteredResults, setFilteredResults] = useState([]);
    const [dynamicFilter, setDynamicFilter] = useState([]);
    const [sum_of_admission, setSum_of_admission] = useState(0);
    let disease_code = [];
    let disease_name = [];
    const [filterData, setfilterData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/researcher-overview-disease', {
                    params: {
                        researcher_code: researcher_code
                    }
                });
                setDiseases(joinArrays(response.data.diseases, mappingDiseases, 'disease_code'));
                setFilteredResults(joinArrays(response.data.diseases, mappingDiseases, 'disease_code'))
                setLoadingDiseases(false);
                disease_code = joinArrays(response.data.diseases, mappingDiseases, 'disease_code').map((image) => image.disease_code);
                disease_name = joinArrays(response.data.diseases, mappingDiseases, 'disease_code').map((image) => image.disease_name);
                setSum_of_admission(joinArrays(response.data.diseases, mappingDiseases));
                setfilterData([{name: 'disease_code', data: disease_code},
                               {name: 'disease_name', data: disease_name}]);
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
                const response = await axios.get('http://localhost:8000/researcher-disease-all-admission', {
                    params: {
                        researcher_code: researcher_code
                    }
                });
                sum_of_admission = response.data.admissions.length;
            } catch (error) {
                setError(error);
                setLoadingDiseases(false);
            }
        };
        fetchData();
    }, []);

    const handleClick = (data) => {
        var log_data = {
            'user_code': researcher_code,
            'time': format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            'action': 'View Detail of Disease',
            'related_item': 'Disease ' + data.disease_code
          }
          log(log_data);
        navigate(`detaildisease/${data.disease_code}`, {state: {data: data}}); // Assuming the URL pattern is '/patient/:patientCode'
    };

    const [searchInput, setSearchInput] = useState('');
    const searchItems = () => {
        if (searchInput !== '' && dynamicFilter.length > 0) {
            // const applyFilter = (patientdata, searchInput, dynamicFilter) => {
                // Convert single searchInput to lowercase
            const normalizedSearchInput = searchInput.toLowerCase();
            
            // Filter based on both searchInput and dynamicFilter criteria
            const filteredData = diseases.filter((item) => {
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
            const filterData2 = diseases.filter((item) => {
                return Object.values(item).join('').toLowerCase().includes(searchInput.toLowerCase())
            })
            setFilteredResults(filterData2)
        }
        else if (dynamicFilter.length > 0) {
            const filterData2 = diseases.filter((item) => {
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
            setFilteredResults(diseases)
        }
    }
    const [sortby, setSortBy] = useState('disease_code')
    const [ascending, setAscending] = useState(true)

    const [selectedLayout, setSelectedLayout] = useState('list');
    const handleLayoutChange = (layout) => {
        setSelectedLayout(layout);
    };
    const pageSizeList = [16, 32, 64];
    const [goToPage, setGoToPage] = useState("");
    useEffect(() => {
        if (diseases.length > 0){
          setGoToPage("1")
        }
      }, [diseases.length]);
    const [pageSize, setPageSize] = useState(pageSizeList[0]);
    const handleGoToPage = () => {
    const pageNumber = parseInt(goToPage);
    if (pageNumber >= 1 && pageNumber <= Math.ceil(filteredResults.length / pageSize)) {
        setPage(pageNumber);
    } else {
        alert(`Page number should be between 1 and ${Math.ceil(filteredResults.length / pageSize)}`);
    }
    };
    
    const [page, setPage] = useState(1);
    const handleChangePage = (event, newpage) => {
        setPage(newpage);
    };
    let filterSortResult = ascending ? [...filteredResults].sort((a, b) => {
        if (sortby === 'subject_id'){
          return a[sortby] - b[sortby];
        } else {
          return a[sortby] !== null && b[sortby] !== null && a[sortby].toString().localeCompare(b[sortby].toString())
        }})
        : [...filteredResults].sort((a, b) => {
        if (sortby === 'subject_id'){
          return b[sortby] - a[sortby];
        } else {
          return a[sortby] !== null && b[sortby] !== null && b[sortby].toString().localeCompare(a[sortby].toString());
        }});
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const slicedData = filterSortResult.slice(startIndex, endIndex);
    const navigate = useNavigate();

    return(
        <ResearcherLayout path={
          <Breadcrumb>
              <BreadcrumbItem isCurrentPage>
                  <BreadcrumbLink href='#'>Disease</BreadcrumbLink>
              </BreadcrumbItem>
          </Breadcrumb>
        }
        name={researcher_name}
        disease={false}>
            <GridItem bg={'#fff'} area={'main'} borderRadius={'0 0 40px 40px'}position={'relative'}>
                <Center padding={'1% 4%'}>
                    <SearchAndFilterBar setSortBy={setSortBy} ascending={ascending} setAscending={setAscending} handleLayoutChange={handleLayoutChange} selectedLayout={selectedLayout} handleGoToPage={handleGoToPage} goToPage={goToPage} setGoToPage={setGoToPage} pageSizeList={pageSizeList} setPageSize={setPageSize} pageSize={pageSize}
                                        patient={false} setSearchInput={setSearchInput} searchItems={searchItems} dynamicFilter={dynamicFilter} setDynamicFilter={setDynamicFilter} onClick={searchItems} onChange={searchItems} filterData={filterData}/>   
                </Center>
                <Divider size={{height: '3px'}} color={'#3E36B0'} orientation='horizontal'/>
                <ThemeProvider theme={theme}>
                    <Box overflow={'auto'} h={'500px'} style={{
                                        scrollbarWidth: 'thin', 
                                        scrollbarColor: '#A0AEC0 #ffffff'
                                    }}>
                        <Center>

                        {selectedLayout === 'list' ? 
                        <SimpleGrid mt={0} columns={1} spacing={8} paddingTop={8}>
                            {
                                slicedData.map(item => (
                                    <DiseaseTag width={1600} sum_of_admission={sum_of_admission} data={item} onClick={handleClick}/>
                                ))
                            }
                        </SimpleGrid>
                        :
                        <SimpleGrid mt={0} columns={4} spacing={10}>
                            {
                                slicedData.map(item => (
                                    <DiseaseTag sum_of_admission={sum_of_admission} data={item} onClick={handleClick}/>
                                ))
                            }
                        </SimpleGrid>
                        }
                        </Center>

                    </Box>
                </ThemeProvider>
                <ThemeProvider theme={theme}>
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

export default Disease;