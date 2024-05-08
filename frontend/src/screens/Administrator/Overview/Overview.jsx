import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OveralTag from "../../../components/OveralTag/OveralTag";
import Note from "../../../components/Note/Note";
import PatientList from "../../../components/PatientList/PatientList";
import { Center, SimpleGrid , Spinner} from "@chakra-ui/react";
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
    const img = {'DOCTOR':DoctorLogo, 'RESEARCHER':ResearcherLogo, 'ADMINISTRATOR':AdminLogo, 'ANALYST':AnalystLogo}
    const navigate = useNavigate();
    const admin_code = sessionStorage.getItem('user')
    ? JSON.parse(sessionStorage.getItem('user')).code
    : '0';
    const admin_name = sessionStorage.getItem('user')
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
                        user_code: admin_code
                    }
                });
                // console.log(response)
                setNote(response.data.data);
                setLoadingNote(false);
            } catch (error) {
                setError(error);
                setLoadingNote(false);
            }
        };
    
        fetchData();
    }, []);

    const [loginUser, setLoginUser] = useState([]);
    const [loadingLoginUser, setLoadingLoginUser] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/currentLogin');
                const updatedLoginUser = response.data.result.map(user => {
                    return {
                        ...user,
                        img: img[user.name]
                    };
                });
                setLoginUser(updatedLoginUser);
                setLoadingLoginUser(false);
                console.log(loginUser)
            } catch (error) {
                setError(error);
                setLoadingLoginUser(false);
            }
        };
        fetchData();
        // const intervalId = setInterval(fetchData, 10000);
        // return () => clearInterval(intervalId);
    }, []);

    const [systemLog, setSystemLog] = useState([]);
    const [loadingSytemLog, setLoadingSystemLog] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/system-log');
                // console.log(response)
                setSystemLog(response.data.system_log);
                setLoadingSystemLog(false);
            } catch (error) {
                setError(error);
                setLoadingSystemLog(false);
            }
        };
    
        fetchData();
    }, []);

    const [actionLog, setActionLog] = useState([]);
    const [loadingActionLog, setLoadingActionLog] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/user-action-log');
                // console.log(response)
                setActionLog(response.data.user_action_log);
                setLoadingActionLog(false);
            } catch (error) {
                setError(error);
                setLoadingActionLog(false);
            }
        };
        fetchData();
    }, []);

    

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
    const slicedData = loginUser.slice(startIndex, endIndex);
    const [option, setOption] = useState('System Log')
    const [selectedUser, setSelectedUser] = useState('')
    const [selectedRow, setSelectedRow] = useState('')

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
                                    {loadingLoginUser ? (
                                            <GridItem>
                                                <Center h={'100%'}>
                                                    <Spinner size="xl" />
                                                </Center>
                                            </GridItem>
                                    ) : (
                                        slicedData.map(infor => (
                                            <GridItem>
                                                <Tag data={infor}/>
                                            </GridItem>
                                        ))
                                    )}
                                </Grid>

                                <Center marginTop={6}>
                                    <MyPagination
                                        count={Math.ceil(loginUser.length / pageSize)}
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
                                <Note loading ={loadingNote} pageSize={2} setNote={setNote} data={note} type={"self-note"} subject_id={""} />
                            </Center>
                        </GridItem>
                        <GridItem area={'list'} bg={'#fff'} borderRadius={'20px'}>
                            <Grid gridTemplateRows={'12% 88%'} h={'100%'}>
                                <GridItem p={3}>
                                <Text pt="2" fontSize={35} fontWeight="bold" marginRight="auto" variant={'outline'}>

                                <select onChange={(e) => {setOption(e.target.value)}}>
                                    <option value='System Log'>System Log</option>
                                    <option value='User Action Log'>User Action Log</option>
                                </select>
                                </Text>
                                </GridItem>
                                <GridItem marginTop={3} padding={'10px 10px'}>
                                    {option == 'System Log' ? <MyTable2 data = {systemLog} height={'350px'} onSelect={setSelectedRow}/> : <MyTable2 data = {actionLog} height={'350px'} onSelect={setSelectedUser}/>}
                                </GridItem>
                            </Grid>
                        </GridItem>
                    </Grid>
                </GridItem>
        </AdminLayout>
    )
};

export default OverviewAdmin;