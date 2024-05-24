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
import { Grid, GridItem } from '@chakra-ui/react'
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "../../../layout/AdminLayout";
import { Card, CardBody, Box, StackDivider, Stack, Heading, Text, Spacer , Flex } from '@chakra-ui/react'; 
import CircleComponent from "../../../components/CircleComponent/CircleComponent"
import { format } from 'date-fns'
import {log} from '../../../functions';
import _ from 'lodash'

const theme = createTheme();
const UserCard = (props) => { // Destructure user from props
    const handleClick = () => {
        props.onClick(props.user);
    };
  return ( // Add return statement here
    <Card w={props.width || '400px'} onClick={handleClick} key={props.user.code} _hover={{ bg: 'rgba(217, 217, 217, 0.3)' , borderRadius: "20px"}} borderRadius='20px'> 
      <CardBody border="1px solid rgba(17, 17, 17, 0.3)" borderRadius="20px" p="2" m='1'> 
          <Stack divider={<StackDivider />} spacing="2"> 
              <Flex> 
                  <CircleComponent gender={props.user.gender[0]} /> 
                  <Flex ml={2} direction="column"> 
                      <Text margin={0} fontWeight="bold"> {props.user.code} - {props.user.name} </Text> 
                      <Text margin={0}>{props.user['role']}</Text> 
                  </Flex>
                  <Spacer />
              </Flex> 
          </Stack> 
      </CardBody> 
    </Card> 
  ); // End of return statement
}
const User = () => {
     
    const handleClick = (data) => {
        var log_data = {
            'user_code': sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')).code: '0',
            'time': format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            'action': 'View Detail of User',
            'related_item': 'User ' + data.code
          }
        log(log_data);
        navigate(`detailuser/${data.code}`, { state: { selectedUser: data }} ); // Assuming the URL pattern is '/patient/:patientCode'
    };

    const [data, setData] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState(null);
    const [filteredResults, setFilteredResults] = useState([]);
    let gender = [];
    let role = [];
    const [filterData, setfilterData] = useState([]);
    useEffect(() => {
      const fetchData = async () => {
          try {
              const response = await axios.get('http://localhost:8004/get-users');
              console.log(response.data.users)
              setData(response.data.users);
              setFilteredResults(response.data.users);
              gender = _.uniqBy(response.data.users, 'gender').map((item) => item.gender);
              role = _.uniqBy(response.data.users, 'role').map((item) => item.role);
              console.log(role);
              setfilterData([
                {name: 'gender', data: gender},
                {name: 'role', data: role}]);
              setLoadingData(false);
          } catch (error) {
              setError(error);
              setLoadingData(false);
          }
      };
      fetchData();
  }, []);
  const [sortby, setSortBy] = useState('gender')
    const [ascending, setAscending] = useState(true)

    const [selectedLayout, setSelectedLayout] = useState('list');
    const handleLayoutChange = (layout) => {
        setSelectedLayout(layout);
    };
    const pageSizeList = [12, 24, 48];
    const [goToPage, setGoToPage] = useState("");

    useEffect(() => {
        if (data.length > 0){
          setGoToPage("1")
        }
      }, [data.length]);
    const [pageSize, setPageSize] = useState(pageSizeList[0]);
    const handleGoToPage = () => {
    const pageNumber = parseInt(goToPage);
    if (pageNumber >= 1 && pageNumber <= Math.ceil(filteredResults.length / pageSize)) {
        setPage(pageNumber);
    } else {
        alert(`Page number should be between 1 and ${Math.ceil(filteredResults.length / pageSize)}`);
    }
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
    
    const [page, setPage] = useState(1);
    const handleChangePage = (event, newpage) => {
        setPage(newpage);
    };
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const slicedData = filterSortResult.slice(startIndex, endIndex);
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState('');
    const [dynamicFilter, setDynamicFilter] = useState([]);
    const searchItems = () => {
        if (searchInput !== '' && dynamicFilter.length > 0) {
            // const applyFilter = (patientdata, searchInput, dynamicFilter) => {
                // Convert single searchInput to lowercase
            const normalizedSearchInput = searchInput.toLowerCase();
            
            // Filter based on both searchInput and dynamicFilter criteria
            const filteredData = data.filter((item) => {
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
            setFilteredResults(filteredData);
            
        }
        else if (searchInput !== '') {
            const filterData2 = data.filter((item) => {
                return Object.values(item).join('').toLowerCase().includes(searchInput.toLowerCase())
            })
            setFilteredResults(filterData2)
        }
        else if (dynamicFilter.length > 0) {
            const filterData2 = data.filter((item) => {
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
            setFilteredResults(filterData2);
        }
        else{
            setFilteredResults(data)
        }
    }
    return(
        <AdminLayout path={
          <Breadcrumb fontSize="xl">
              <BreadcrumbItem isCurrentPage>
                  <BreadcrumbLink href='#'>User</BreadcrumbLink>
              </BreadcrumbItem>
          </Breadcrumb>
        }
        disease={false}>
                <GridItem bg={'#fff'} area={'main'} borderRadius={'0 0 40px 40px'} overflow={'hidden'}>
                <Center padding={'1% 4%'}>
                    <SearchAndFilterBar setSortBy={setSortBy} ascending={ascending} setAscending={setAscending} handleLayoutChange={handleLayoutChange} selectedLayout={selectedLayout} handleGoToPage={handleGoToPage} goToPage={goToPage} setGoToPage={setGoToPage} pageSizeList={pageSizeList} setPageSize={setPageSize} pageSize={pageSize}
                     patient={false} setSearchInput={setSearchInput} searchItems={searchItems} dynamicFilter={dynamicFilter} setDynamicFilter={setDynamicFilter} onClick={searchItems} onChange={searchItems} filterData={filterData}/>
                </Center>
                    <Divider size={{height: '3px'}} color={'#3E36B0'} orientation='horizontal'/>
                        <ThemeProvider theme={theme}>
                        <Box p={5} h={'500px'} overflowY="auto" style={{scrollbarWidth: 'thin', 
                            scrollbarColor: '#A0AEC0 #ffffff', 
                          }}>
                            <Center>
                                {selectedLayout === 'list' ? 
                                <SimpleGrid mt={0} columns={1} spacing={1}>
                                    {
                                        slicedData.map(item => (
                                            <UserCard width={1600} user={item} onClick={handleClick} />
                                        ))
                                    }
                                </SimpleGrid>
                                :
                                    <SimpleGrid mt={0} columns={4} spacing={4}>
                                        {
                                            slicedData.map(item => (
                                                <UserCard user={item} onClick={handleClick} />
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
        </AdminLayout>
    )
};

export default User;