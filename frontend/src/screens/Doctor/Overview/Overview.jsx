import React from "react";
import OveralTag from "../../../components/OveralTag/OveralTag";
import Note from "../../../components/Note/Note";
import PatientList from "../../../components/PatientList/PatientList";
import PatientInfor from "../../../components/PatientInfor/PatientInfor";
import { Center } from "@chakra-ui/react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
  } from '@chakra-ui/react'
import { DoctorLayout } from "../../../layout/DoctorLayout";
import { useNavigate } from "react-router-dom";
import { Grid, GridItem,Text } from '@chakra-ui/react'
const Overview = () => {
    const navigate = useNavigate();
    return(
        <DoctorLayout path={
            <Breadcrumb fontSize="xl">
                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink href='#' style={{ fontSize: "25px"}}>Overview</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            }
            patient={false}>
                <GridItem position={'relative'} marginLeft={4} pl='2' area={'main'} gap={'1%'}>
                    <Grid templateAreas={`"overal note"
                                          "list infor"`}          
                          gridTemplateRows={'42.5% 56.5%'}
                          gridTemplateColumns={'59.5% 39.5%'}
                          h='100%'>
                        <GridItem area={'overal'}>
                            <Center h={'100%'} position={'relative'}>
                                <OveralTag title = "Visit for today" value = "50"/>
                            </Center>
                        </GridItem>
                        <GridItem area={'note'} position={'relative'}>
                            <Center position={'relative'} height={'100%'}>
                                <Note pageSize='2'/>
                            </Center>
                        </GridItem>
                        <GridItem area={'list'} bg={'#fff'} borderRadius={'20px'}>
                                <PatientList/>
                        </GridItem>
                        <GridItem area={'infor'}>
                            <Center h={'100%'} position={'relative'}>
                                <PatientInfor/>
                            </Center>
                        </GridItem>
                    </Grid>
                </GridItem>
        </DoctorLayout>
    )
};

export default Overview;