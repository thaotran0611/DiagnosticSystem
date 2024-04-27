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
// import { DoctorLayout } from "../../../layout/DoctorLayout";
import { ResearcherLayout } from "../../../layout/ResearcherLayout";
import { Grid, GridItem } from '@chakra-ui/react'
import { useNavigate } from "react-router-dom";
import DiseaseTag from "../../../components/DiseaseTag/DiseaseTag";

const theme = createTheme();

const Disease = () => {
    const [data, setData] = useState([
        {
            name: "Advanced lung",
            type: "LD",
            quantity: 500,
            percent: '30%'
        },
        {
            name: "Advanced cancer",
            type: "MC",
            quantity: 500,
            percent: '30%'
        },
        {
            name: "Advanced cancer",
            type: "MC",
            quantity: 500,
            percent: '30%'
        },
        {
            name: "Advanced cancer",
            type: "MC",
            quantity: 500,
            percent: '30%'
        },
        {
            name: "Advanced cancer",
            type: "MC",
            quantity: 500,
            percent: '30%'
        },
        {
            name: "Advanced cancer",
            type: "MC",
            quantity: 500,
            percent: '30%'
        },
        {
            name: "Advanced cancer",
            type: "MC",
            quantity: 500,
            percent: '30%'
        },
        {
            name: "Advanced cancer",
            type: "MC",
            quantity: 500,
            percent: '30%'
        },
        {
            name: "Advanced cancer",
            type: "MC",
            quantity: 500,
            percent: '30%'
        },
        {
            name: "Advanced cancer",
            type: "MC",
            quantity: 500,
            percent: '30%'
        },
        {
            name: "Advanced cancer",
            type: "MC",
            quantity: 500,
            percent: '30%'
        },
        {
            name: "Advanced cancer",
            type: "MC",
            quantity: 500,
            percent: '30%'
        },
        {
            name: "Advanced cancer",
            type: "MC",
            quantity: 500,
            percent: '30%'
        },
        {
            name: "Advanced cancer",
            type: "MC",
            quantity: 500,
            percent: '30%'
        },
        {
            name: "Advanced cancer",
            type: "MC",
            quantity: 500,
            percent: '30%'
        },
        {
            name: "Advanced cancer",
            type: "MC",
            quantity: 500,
            percent: '30%'
        },
        {
            name: "Advanced cancer",
            type: "MC",
            quantity: 500,
            percent: '30%'
        },
        {
            name: "Advanced cancer",
            type: "MC",
            quantity: 500,
            percent: '30%'
        },
        {
            name: "Advanced cancer",
            type: "MC",
            quantity: 500,
            percent: '30%'
        }
    ]); 
    const pageSize = 16;
    const [page, setPage] = useState(1);
    const handleChangePage = (event, newpage) => {
        setPage(newpage);
    };
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const slicedData = data.slice(startIndex, endIndex);
    const navigate = useNavigate();

    return(
        <ResearcherLayout path={
          <Breadcrumb>
              <BreadcrumbItem isCurrentPage>
                  <BreadcrumbLink href='#'>Disease</BreadcrumbLink>
              </BreadcrumbItem>
          </Breadcrumb>
        }
        disease={false}>
                <GridItem bg={'#fff'} area={'main'} borderRadius={'0 0 40px 40px'}>
                <Center padding={'1% 4%'}>
                    {/* <SearchAndFilterBar/> */}
                </Center>
                    <Divider size={{height: '3px'}} color={'#3E36B0'} orientation='horizontal'/>
                        <ThemeProvider theme={theme}>
                            <Center>
                                <SimpleGrid mt={0} columns={4} spacing={10}>
                                    {
                                        slicedData.map(item => (
                                            <DiseaseTag data={item}/>
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
        </ResearcherLayout>
    )
};

export default Disease;