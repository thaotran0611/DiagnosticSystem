import React, { useState } from "react";
import OveralTag from "../../../components/OveralTag/OveralTag";
import Note from "../../../components/Note/Note";
import PatientList from "../../../components/PatientList/PatientList";
import { Center, SimpleGrid } from "@chakra-ui/react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
  } from '@chakra-ui/react'
import { useNavigate } from "react-router-dom";
import { Grid, GridItem,Text } from '@chakra-ui/react'
import { AnalystLayout } from "../../../layout/AnalystLayout";
import MyTable2 from "../../../components/MyTable/MyTable2";
import { AreaChart } from "../../../components/Chart/AreaChart";
import Tag from "../../../components/Tag/Tag";
import AIlogo from "../../../img/Analyst/AIlogo.png"
import { ThemeProvider } from "@emotion/react";
import MyPagination from "../../../components/Pagination/Pagination";
import { createTheme } from "@mui/material";
import { AdminLayout } from "../../../layout/AdminLayout";
import DoctorLogo from "../../../img/Admin/DoctorLogo.png"
import ResearcherLogo from "../../../img/Admin/ResearcherLogo.png"
import AnalystLogo from "../../../img/Admin/AnalystLogo.png"
import AdminLogo from "../../../img/Admin/AdminLogo.png"

const theme = createTheme();
const OverviewAdmin = () => {
    const navigate = useNavigate();
    const generalTag = [
        {
            img: DoctorLogo,
            name: 'Doctor',
            online: 10,
            total: 60
        },
        {
            img: ResearcherLogo,
            name: 'Researcher',
            online: 10,
            total: 60
        },
        {
            img: AnalystLogo,
            name: 'Analyst',
            online: 10,
            total: 60
        },
        {
            img: AdminLogo,
            name: 'Admin',
            online: 10,
            total: 60
        }
    ]
    const [page, setPage] = useState(1);
    const handleChangePage = (event, newpage) => {
        setPage(newpage);
    };
    const [pageSize, setPageSize] = useState(4);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const slicedData = generalTag.slice(startIndex, endIndex);
    return(
        <AdminLayout path={
            <Breadcrumb fontSize="xl">
                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink href='#' style={{ fontSize: "25px"}}>Overview</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            }
            disease={false}>
                <GridItem position={'relative'} marginLeft={4} pl='2' area={'main'} gap={'1%'}>
                    <Grid templateAreas={`"overal chart note"
                                          "list list list"`}          
                          gridTemplateRows={'42.5% 56.5%'}
                          gridTemplateColumns={'33% 33% 33%'}
                          h='100%'>
                        <GridItem bg={'#fff'} margin={1} p={2} borderRadius={'20px'} area={'overal'} position={'relative'}>
                            {/* <Center h={'100%'} position={'relative'}>
                                <OveralTag title = "Number of patients" value = "10567"/>
                            </Center> */}
                            <ThemeProvider theme={theme}>
                                <Grid h={'80%'} gridTemplateColumns={'48% 48%'} gridTemplateRows={'48% 48%'} gap={4}>
                                    {
                                        slicedData.map(infor => (
                                            <GridItem>
                                                <Tag data={infor}/>
                                            </GridItem>
                                        ))
                                    }
                                </Grid>

                                <Center marginTop={6}>
                                    <MyPagination
                                        count={Math.ceil(generalTag.length / pageSize)}
                                        page={page}
                                        onChange={handleChangePage}
                                    />
                                </Center>
                            </ThemeProvider>
                            {/* <Tag /> */}
                        </GridItem>
                        <GridItem bg={'#fff'} margin={1} p={1} borderRadius={'20px'} area={'chart'} position={'relative'}>
                            <AreaChart />
                        </GridItem>
                        <GridItem bg={'#fff'} margin={1} p={1} borderRadius={'20px'} area={'note'} position={'relative'}>
                            <Center position={'relative'} height={'100%'}>
                                <Note pageSize='2'/>
                            </Center>
                        </GridItem>
                        <GridItem area={'list'} bg={'#fff'} borderRadius={'20px'}>
                            <Grid gridTemplateRows={'12% 88%'} h={'100%'}>
                                <GridItem p={3}>
                                    <Text fontWeight={600} color={"#111111"} fontSize={'28px'}>Actions List</Text>
                                </GridItem>
                                <GridItem padding={'0 10px'}>
                                    <MyTable2 height={'350px'}/>
                                </GridItem>
                            </Grid>
                        </GridItem>
                    </Grid>
                </GridItem>
        </AdminLayout>
    )
};

export default OverviewAdmin;