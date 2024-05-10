import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OveralTag from "../../../components/OveralTag/OveralTag";
import Note from "../../../components/Note/Note";
import PatientList from "../../../components/PatientList/PatientList";
import { Box, Center, HStack, Select, SimpleGrid , Spinner} from "@chakra-ui/react";
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
import DoctorLogo from "../../../img/Admin/DoctorLogo.png";
import ResearcherLogo from "../../../img/Admin/ResearcherLogo.png";
import AnalystLogo from "../../../img/Admin/AnalystLogo.png";
import AdminLogo from "../../../img/Admin/AdminLogo.png";
import BarChart from "../../../components/Chart/BarChart";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import _ from 'lodash';
import { toDate } from 'date-fns';
import InputColor from 'react-input-color';
import { LineChart } from '../../../components/Chart/LineChart';

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
    const [minDate, setMinDate] = useState(null);
    const [maxDate, setMaxDate] = useState(null);
    const [actiontype, setActiontype] = useState([]);
    const [fromdate, setFromDate] = useState(minDate);
    const [todate, setToDate] = useState(maxDate);
    const generateDateLabels = (fromDate, toDate) => {
        const labels = [];
        const currentDate = new Date(fromDate);
        
        currentDate.setHours(0, 0, 0, 0);
        const lastDate = new Date(toDate);

       
        while (currentDate <= lastDate) {
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based
            const day = String(currentDate.getDate()).padStart(2, '0');
            labels.push(`${year}-${month}-${day}`); // Format date as desired
            currentDate.setDate(currentDate.getDate() + 1); // Increment currentDate by one day
        }
        return labels;
    }
    const [drillup, setDrillup] = useState('date');
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/user-action-log');
                setActionLog(response.data.user_action_log);
                let maxDate = response.data.user_action_log.reduce((max, obj) => {
                    const currentDate = dayjs(obj.time);
                    return currentDate > max ? dayjs(currentDate) : dayjs(max);
                  }, dayjs(new Date(0)))
                setMaxDate(maxDate);
                setToDate(maxDate);
                let minDate = response.data.user_action_log.reduce((min, obj) => {
                    const currentDate = dayjs(obj.time);
                    return currentDate < min ? dayjs(currentDate) : dayjs(min);
                  }, dayjs(new Date()))
                setFromDate(minDate);
                setMinDate(minDate);
                setActiontype(_.uniqBy(response.data.user_action_log, 'action').map((item) => item.action));
                
                setLoadingActionLog(false);
            } catch (error) {
                setError(error);
                setLoadingActionLog(false);
            }
        };
        fetchData();
    }, []);
    let label = generateDateLabels(fromdate, todate);
    const [page, setPage] = useState(1);
    const handleChangePage = (event, newpage) => {
        setPage(newpage);
    };
    const [pageSize, setPageSize] = useState(4);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const slicedData = loginUser.slice(startIndex, endIndex);
    const [option, setOption] = useState('System Log');
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedRow, setSelectedRow] = useState('');
    
    let filterData = [];
    const mapDateValues = (data, labels) => {
        // Initialize an empty object to store counts for each date
        const dateCountMap = {};
      
        // Iterate over the data array
        data.forEach(({ time }) => {
          // Extract the date part from the time string
            const currentDate = new Date(time)
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based
            const day = String(currentDate.getDate()).padStart(2, '0');

            const date = `${year}-${month}-${day}`;
            
            // const date = new Date(time.split(' ')[0]).toISOString().split('T')[0];
      
          // Increment the count for the date or initialize it to 1 if not present
          dateCountMap[date] = (dateCountMap[date] || 0) + 1;
        });
      
        // Create an array of objects containing the date label and its count
        const mappedData = labels.map((label) => ({
          date: label,
          count: dateCountMap[label] || 0, // Set count to 0 if the date is not found in the data
        }));
      
        return mappedData;
    }
    const [selectedTag, setSelectedTag] = useState('doctor');
    const [typeAction, setTypeAction] = useState('Login');
    if(fromdate === null || todate === null){
        filterData = actionLog.filter(item => {return item.action === typeAction && item.role === selectedTag});
    } else {
        filterData = actionLog.filter(item => {return item.action === typeAction && item.role === selectedTag}).filter(item => {
            return dayjs(new Date(item.time)) >= dayjs(new Date(fromdate).setHours(0,0,0,0)) && dayjs(new Date(item.time)) <= dayjs(new Date(todate).setHours(23,59,0,0))});
    }
    let chartdata = mapDateValues(filterData.map((item) => ({'time': item.time, 'action': item.action})), label);
    const [color, setColor] = useState('#5e72e4');
    const [chart, setChart] = useState('bar chart');
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
                                                <Tag selectedTag={selectedTag} setSelectedTag={setSelectedTag} data={infor}/>
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
                            <HStack h={'20%'}>
                                <Text>Action:</Text>
                                <Select w={'20%'} onChange={(e) => setTypeAction(e.target.value)}>
                                    {actiontype.map(item => (
                                        <option value={item} defaultValue={item === 'login' ? true : false}>{item}</option>
                                    ))}
                                    
                                </Select>
                                <Box w={'200px'}>
                                    <ThemeProvider theme={theme}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker label="from" 
                                                        value={fromdate ? fromdate : minDate}
                                                        onChange={setFromDate}
                                                        minDate={minDate}
                                                        maxDate={maxDate}/>
                                        </LocalizationProvider>
                                    </ThemeProvider>
                                </Box>
                                <Box w={'200px'}>
                                    <ThemeProvider theme={theme}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker label="to" 
                                            value={todate ? todate : maxDate}
                                            onChange={setToDate}
                                            minDate={fromdate ? fromdate : minDate}
                                            maxDate={maxDate}/>
                                        </LocalizationProvider>
                                    </ThemeProvider>
                                </Box>
                                
                            </HStack>
                            <HStack h={'10%'} spacing={1}>
                                <Text>Time:</Text>
                                <Select w={100} onChange={(e) => setDrillup(e.target.value)}>
                                    <option defaultValue={true} value={'date'}>date</option>
                                    <option value={'month'}>month</option>
                                    <option value={'year'}>year</option>
                                </Select>
                                <Text>Color:</Text>
                                <InputColor
                                    initialValue="#5e72e4"
                                    onChange={setColor}
                                    placement="right"
                                />
                                <Text>Chart:</Text>
                                <Select w={'50%'} onChange={(e) => setChart(e.target.value)}>
                                    <option defaultValue={true} value={'bar chart'}>Bar chart</option>
                                    <option value={'line chart'}>Line chart</option>
                                </Select>
                            </HStack>
                            {/* <AreaChart /> */}
                            <Box h={'66%'}>
                                {chart === 'bar chart' ? 
                                    <BarChart level={drillup} dataset={null} label={chartdata.map(item => item.date)} data={chartdata.map(item => item.count)} color={color}/>
                                : 
                                    <LineChart level={drillup} dataset={null} label={chartdata.map(item => item.date)} data={chartdata.map(item => item.count)} color={color}/> }
                            </Box>
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