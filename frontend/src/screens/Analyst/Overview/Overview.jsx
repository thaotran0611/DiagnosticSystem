import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

const theme = createTheme();
const OverviewAnalyst = () => {
    const navigate = useNavigate();
    const user_code = sessionStorage.getItem('user')
    ? JSON.parse(sessionStorage.getItem('user')).code
    : '0';
    const user_name = sessionStorage.getItem('user')
    ? JSON.parse(sessionStorage.getItem('user')).name
    : '0';

    const [note, setNote] = useState([]);
    const [loadingNote, setLoadingNote] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/self-notes', {
                    params: {
                        user_code: user_code
                    }
                });
                console.log(response)
                setNote(response.data.data);
                setLoadingNote(false);
            } catch (error) {
                setError(error);
                setLoadingNote(false);
            }
        };
    
        fetchData();
        // const intervalId = setInterval(fetchData, 5000);
        // return () => clearInterval(intervalId);
    }, []);

    const [file, setFile] = useState([]);
    const [generalTag, setGeneralTag] = useState([]);

    const [loadingFile, setLoadingFiles] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/files-system');
                console.log(response)
                setFile(response.data.file);
                const updatedFiles = response.data.general.map(model => {
                    return {
                        ...model,
                        img: AIlogo
                    };
                });
                setGeneralTag(updatedFiles);
                setLoadingFiles(false);
            } catch (error) {
                setError(error);
                setLoadingFiles(false);
            }
        };
    
        fetchData();
    }, []);

    const [page, setPage] = useState(1);
    const handleChangePage = (event, newpage) => {
        setPage(newpage);
    };
    const [pageSize, setPageSize] = useState(6);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const slicedData = generalTag.slice(startIndex, endIndex);
    const [selectedRecord, setSelectedRecord] = useState(null);

    return(
        <AnalystLayout path={
            <Breadcrumb fontSize="xl">
                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink href='#' style={{ fontSize: "25px"}}>Overview</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            }
            disease={false}
            name={user_name}
            >
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
                                <Grid h={'80%'} gridTemplateColumns={'31% 31% 31%'} gridTemplateRows={'46% 46%'} gap={4}>
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
                                <Note loading ={loadingNote} pageSize={2} setNote={setNote} data={note} type={"self-note"} />
                            </Center>
                        </GridItem>
                        <GridItem area={'list'} bg={'#fff'} borderRadius={'20px'}>
                            <Grid gridTemplateRows={'12% 88%'} h={'100%'}>
                                <GridItem p={3}>
                                    <Text fontWeight={600} color={"#111111"} fontSize={'28px'}>Model List</Text>
                                </GridItem>
                                <GridItem padding={'0 10px'}>
                                    <MyTable2 data={file}  onSelect={setSelectedRecord} height={'350px'}/>
                                </GridItem>
                            </Grid>
                        </GridItem>
                    </Grid>
                </GridItem>
        </AnalystLayout>
    )
};

export default OverviewAnalyst;