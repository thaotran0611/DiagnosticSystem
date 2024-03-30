import React, { useState } from "react";
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

const theme = createTheme();

const User = () => {
    const [data, setData] = useState([[ 
        { key: 'Ethnicity', value: 'Asian' }, 
        { key: 'Addmission date', value: '12/12/2012' }, 
        { key: 'Discharge date', value: '20/12/2012' }, 
        { key: 'Marital status', value: 'Emergency' }, 
        { key: 'Insurance', value: 'Private' }, 
        { key: 'Diagnose', value: 'Overdose' }, 
      ],
      [ 
        { key: 'Ethnicity', value: 'Asian' }, 
        { key: 'Addmission date', value: '12/12/2012' }, 
        { key: 'Discharge date', value: '20/12/2012' }, 
        { key: 'Marital status', value: 'Emergency' }, 
        { key: 'Insurance', value: 'Private' }, 
        { key: 'Diagnose', value: 'Overdose' }, 
      ],
      [ 
        { key: 'Ethnicity', value: 'Asian' }, 
        { key: 'Addmission date', value: '12/12/2012' }, 
        { key: 'Discharge date', value: '20/12/2012' }, 
        { key: 'Marital status', value: 'Emergency' }, 
        { key: 'Insurance', value: 'Private' }, 
        { key: 'Diagnose', value: 'Overdose' }, 
      ],
      [ 
        { key: 'Ethnicity', value: 'Asian' }, 
        { key: 'Addmission date', value: '12/12/2012' }, 
        { key: 'Discharge date', value: '20/12/2012' }, 
        { key: 'Marital status', value: 'Emergency' }, 
        { key: 'Insurance', value: 'Private' }, 
        { key: 'Diagnose', value: 'Overdose' }, 
      ],
      [ 
        { key: 'Ethnicity', value: 'Asian' }, 
        { key: 'Addmission date', value: '12/12/2012' }, 
        { key: 'Discharge date', value: '20/12/2012' }, 
        { key: 'Marital status', value: 'Emergency' }, 
        { key: 'Insurance', value: 'Private' }, 
        { key: 'Diagnose', value: 'Overdose' }, 
      ],
      [ 
        { key: 'Ethnicity', value: 'Asian' }, 
        { key: 'Addmission date', value: '12/12/2012' }, 
        { key: 'Discharge date', value: '20/12/2012' }, 
        { key: 'Marital status', value: 'Emergency' }, 
        { key: 'Insurance', value: 'Private' }, 
        { key: 'Diagnose', value: 'Overdose' }, 
      ],
      [ 
        { key: 'Ethnicity', value: 'Asian' }, 
        { key: 'Addmission date', value: '12/12/2012' }, 
        { key: 'Discharge date', value: '20/12/2012' }, 
        { key: 'Marital status', value: 'Emergency' }, 
        { key: 'Insurance', value: 'Private' }, 
        { key: 'Diagnose', value: 'Overdose' }, 
      ],
      [ 
        { key: 'Ethnicity', value: 'Asian' }, 
        { key: 'Addmission date', value: '12/12/2012' }, 
        { key: 'Discharge date', value: '20/12/2012' }, 
        { key: 'Marital status', value: 'Emergency' }, 
        { key: 'Insurance', value: 'Private' }, 
        { key: 'Diagnose', value: 'Overdose' }, 
      ],
      [ 
        { key: 'Ethnicity', value: 'Asian' }, 
        { key: 'Addmission date', value: '12/12/2012' }, 
        { key: 'Discharge date', value: '20/12/2012' }, 
        { key: 'Marital status', value: 'Emergency' }, 
        { key: 'Insurance', value: 'Private' }, 
        { key: 'Diagnose', value: 'Overdose' }, 
      ]]); 
    const pageSize = 4;
    const [page, setPage] = useState(1);
    const handleChangePage = (event, newpage) => {
        setPage(newpage);
    };
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const slicedData = data.slice(startIndex, endIndex);
    const navigate = useNavigate();

    return(
        <AdminLayout path={
          <Breadcrumb>
              <BreadcrumbItem isCurrentPage>
                  <BreadcrumbLink href='#'>User</BreadcrumbLink>
              </BreadcrumbItem>
          </Breadcrumb>
        }
        disease={false}>
                <GridItem bg={'#fff'} area={'main'}>
                <Center padding={'1% 4%'}>
                    <SearchAndFilterBar/>
                </Center>
                    <Divider size={{height: '3px'}} color={'#3E36B0'} orientation='horizontal'/>
                        <ThemeProvider theme={theme}>
                            <Center>
                                <SimpleGrid mt={0} columns={2} spacing={1}>
                                    {
                                        slicedData.map(item => (
                                            <PatientGridCard data={item}/>
                                        ))
                                    }
                                </SimpleGrid>
                            </Center>
                            <Center>
                                <MyPagination 
                                    count={Math.ceil(data.length / pageSize)} 
                                    page = {page} 
                                    onChange = {handleChangePage}/>
                            </Center>
                        </ThemeProvider>
                </GridItem>
        </AdminLayout>
    )
};

export default User;