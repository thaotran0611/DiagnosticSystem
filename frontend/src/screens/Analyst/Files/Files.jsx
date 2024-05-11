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
import { AnalystLayout } from "../../../layout/AnalystLayout";
import { Card, CardBody, Box, StackDivider, Stack, Heading, Text, Spacer , Flex } from '@chakra-ui/react'; 
import CircleComponent from "../../../components/CircleComponent/CircleComponent"
import { format } from 'date-fns'
import {log} from '../../../functions';

const theme = createTheme();
const ModelCard = (props) => { // Destructure user from props
    const handleClick = () => {
        props.onClick(props.user);
    };
  return ( // Add return statement here
    <Card onClick={handleClick} key={props.user.code} _hover={{ bg: 'rgba(217, 217, 217, 0.3)' , borderRadius: "20px"}} borderRadius='20px'> 
      <CardBody border="1px solid rgba(17, 17, 17, 0.3)" borderRadius="20px" p="2" m='1'> 
          <Stack divider={<StackDivider />} spacing="2"> 
              <Flex> 
                  <CircleComponent /> 
                  <Flex ml={2} direction="column"> 
                      <Text margin={0} fontWeight="bold"> {props.user.type_file} - {props.user.name} </Text> 
                      <Text margin={0}>{props.user.type_of_disease}</Text> 
                  </Flex>
                  <Spacer />
              </Flex> 
          </Stack> 
      </CardBody> 
    </Card> 
  ); // End of return statement
}
const Files = () => {
     
    const handleClick = (data) => {
        var log_data = {
            'user_code': sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')).code: '0',
            'time': format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            'action': 'View Detail of File',
            'related_item': 'File ' + data.code
          }
        log(log_data);
        navigate(`detailfiles/${data.code}`, { state: { selectedModel: data }} ); // Assuming the URL pattern is '/patient/:patientCode'
    };

    const [file, setFile] = useState([]);
    const [loadingFile, setLoadingFiles] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/files-system');
                console.log(response)
                setFile(response.data.file);
                setLoadingFiles(false);
            } catch (error) {
                setError(error);
                setLoadingFiles(false);
            }
        };
    
        fetchData();
    }, []);

    const pageSize = 24;
    const [page, setPage] = useState(1);
    const handleChangePage = (event, newpage) => {
        setPage(newpage);
    };
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const slicedData = file.slice(startIndex, endIndex);
    const navigate = useNavigate();

    return(
        <AnalystLayout path={
          <Breadcrumb fontSize="xl">
              <BreadcrumbItem isCurrentPage>
                  <BreadcrumbLink href='#'>Models</BreadcrumbLink>
              </BreadcrumbItem>
          </Breadcrumb>
        }
        disease={false}>
                <GridItem bg={'#fff'} area={'main'}>
                <Center padding={'1% 4%'}>
                    {/* <SearchAndFilterBar/> */}
                </Center>
                    <Divider size={{height: '3px'}} color={'#3E36B0'} orientation='horizontal'/>
                        <ThemeProvider theme={theme}>
                        <Box p={5} maxHeight="100vh" overflowY="auto" style={{scrollbarWidth: 'thin', 
                            scrollbarColor: '#A0AEC0 #ffffff', 
                          }}>
                            <Center>
                                <SimpleGrid mt={0} columns={4} spacing={1}>
                                    {
                                        slicedData.map(item => (
                                            <ModelCard user={item} onClick={handleClick} />
                                        ))
                                    }
                                </SimpleGrid>
                            </Center>
                        </Box>
                            <Center>
                                <MyPagination 
                                    count={Math.ceil(file.length / pageSize)} 
                                    page = {page} 
                                    onChange = {handleChangePage}/>
                            </Center>
                        </ThemeProvider>
                </GridItem>
        </AnalystLayout>
    )
};

export default Files;