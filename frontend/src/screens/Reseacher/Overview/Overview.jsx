import React from "react";
import OveralTag from "../../../components/OveralTag/OveralTag";
import Note from "../../../components/Note/Note";
import PatientList from "../../../components/PatientList/PatientList";
import PatientInfor from "../../../components/PatientInfor/PatientInfor";
import { Box, Center } from "@chakra-ui/react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
  } from '@chakra-ui/react'
import { DoctorLayout } from "../../../layout/DoctorLayout";
import { useNavigate } from "react-router-dom";
import { Grid, GridItem,Text } from '@chakra-ui/react'
import { ResearcherLayout } from "../../../layout/ResearcherLayout";
import DiseaseList from "../../../components/DiseaseCard/DiseaseList";
const OverviewResearcher = () => {
    const navigate = useNavigate();
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
                                <OveralTag title = "Number of patients" value = "10567"/>
                            </Center>
                        </GridItem>
                        <GridItem area={'note'} position={'relative'}>
                            <Center position={'relative'} height={'100%'}>
                                <Note pageSize='2'/>
                            </Center>
                        </GridItem>
                        <GridItem h={'100%'} area={'list'} bg={'#fff'} borderRadius={'20px'} overflow={'auto'} position={'relative'}>
                                {/* <PatientList/> */}
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