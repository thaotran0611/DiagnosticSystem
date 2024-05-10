import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DoctorLayout } from "../../../layout/DoctorLayout";
import { AbsoluteCenter, Box, Divider, Grid, GridItem, HStack, IconButton, ScaleFade, Select, SimpleGrid } from "@chakra-ui/react";
import { Center } from "@chakra-ui/react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
  } from '@chakra-ui/react'
import { useNavigate } from "react-router-dom";
import { BellIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Tabs, TabList, TabPanels, Tab, TabPanel, Text } from '@chakra-ui/react'
import Note from "../../../components/Note/Note";
import PatientTag from "../../../components/PatientTag/PatientTag";
import MyPagination from "../../../components/Pagination/Pagination";
import { Pagination, ThemeProvider, createTheme } from "@mui/material";
import GeneralTab from "../../Doctor/DetailPatient/GeneralTab";
// import MedicalTestTab from "./MedicalTestTab";
// import PrescriptionTab from "./PrescriptionTab";
// import NoteTab from "./NoteTab";
// import DiseasesTab from "./DiseasesTab";
// import ProcedureTab from "./ProcedureTab";
import { AdminLayout } from "../../../layout/AdminLayout";
import MyTable2 from "../../../components/MyTable/MyTable2";
import { AreaChart } from "../../../components/Chart/AreaChart";
import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import _ from 'lodash';
import InputColor from 'react-input-color';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import BarChart from '../../../components/Chart/BarChart';
import { LineChart } from '../../../components/Chart/LineChart';

const theme = createTheme();

const DetailUser = (props) => {
    const navigate=useNavigate();
    const { userCode } = useParams();

    const location = useLocation();
    if (!location || !location.state || !location.state.patient_Data) {
        // Handle the case where location or location.state or location.state.patient_Data is null
        console.error("Location state or patient data is null.");
        // return null; // Or render some fallback UI
    }
    const { selectedUser } = location.state;
    const admin_code = sessionStorage.getItem('user')
    ? JSON.parse(sessionStorage.getItem('user')).code
    : '0';
    const keysToExtract = ['code','name','gender','role'];


    const [note, setNote] = useState([])
    const [loadingNote, setLoadingNote] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/user-notes', {
                    params: {
                        admin_code: admin_code,
                        user_code: userCode
                    }
                });
                // console.log(response)
                setNote(response.data.note);
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

    const [actionLog, setActionLog] = useState([])
    const [loadingActionLog, setLoadingActionLog] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/detail-user-action-log', {
                    params: {
                        user_code: userCode
                    }
                });
                console.log(response)
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
        // const intervalId = setInterval(fetchData, 5000);
        // return () => clearInterval(intervalId);
    }, []);

    const [expand, setExpand] = useState(false);
    
    const expandPage = () => {
        setExpand(!expand); 
    };
    const shrinkPage = () => {
        setExpand(!expand); 
    };

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
    const [typeAction, setTypeAction] = useState('Login');
    const [chart, setChart] = useState('bar chart');
    const [expandGeneral, setExpandGenaral] = useState(2);
    const [color, setColor] = useState('#5e72e4');
    let label = generateDateLabels(fromdate, todate);
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
    if(fromdate === null || todate === null){
        filterData = actionLog.filter(item => {return item.action === typeAction});
    } else {
        filterData = actionLog.filter(item => {return item.action === typeAction}).filter(item => {
            return dayjs(new Date(item.time)) >= dayjs(new Date(fromdate).setHours(0,0,0,0)) && dayjs(new Date(item.time)) <= dayjs(new Date(todate).setHours(23,59,0,0))});
    }
    let chartdata = mapDateValues(filterData.map((item) => ({'time': item.time, 'action': item.action})), label);
    const [decision, setDecision] = useState('All');
    return(
        <AdminLayout path={
                <Breadcrumb fontSize="xl">
                    <BreadcrumbItem>
                        <BreadcrumbLink href='../'>Users</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem isCurrentPage>
                        <BreadcrumbLink href="#">{userCode}</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
            }
            user={true}
            
            expand={expand}>
                <GridItem position={'relative'} marginLeft={4} pl='2' area={'nav'}>
                    <Grid
                        templateAreas={ !expand ? `"information divider"
                                                   "note divider"`:
                                                   `"divider"
                                                    "divider"`}  
                        h='100%'  
                        gridTemplateRows={'40% 59%'}
                        gridTemplateColumns={!expand ? '98% 2%' : '100%'}
                        gap={'1%'}              
                    >
                        {!expand?
                        <GridItem position={'relative'} area={'information'} marginTop={'8%'}>
                            <ScaleFade initialScale={0.8} in={!expand} style={{height: '100%'}}>
                                <PatientTag patient={true} data={selectedUser} loading={false} keysToExtract = {keysToExtract}/>
                            </ScaleFade>
                        </GridItem> : null }

                        {!expand?
                        <GridItem area={'note'}>
                            <ScaleFade initialScale={0.8} in={!expand} style={{height: '100%'}}>
                                <Note loading ={loadingNote} pageSize={3} setNote={setNote} data={note} type={"user-note"} subject_id='' user_code={userCode}/>
                            </ScaleFade>
                        </GridItem>: null }
                        <GridItem area={'divider'}>
                            <Center height={'100%'} position='relative'>
                                <Divider style={{height: '100%', width: '2px'}} orientation='vertical' color={'#3E36B0'}/>
                                <AbsoluteCenter top={8} px='4'>
                                    <Box cursor={'pointer'} borderRadius={'50%'} boxSize={'30px'} bg={'#3E36B0'}>
                                        {expand ? 
                                            <ChevronRightIcon onClick={()=> {expandPage()}} marginLeft={1} marginTop={0.4} boxSize={'1.5em'} color={'#fff'}/>
                                            :
                                            <ChevronLeftIcon onClick={()=> {shrinkPage()}} marginLeft={0.9} marginTop={0.4} boxSize={'1.5em'} color={'#fff'}/>
                                        }
                                    </Box>
                                </AbsoluteCenter>
                                <AbsoluteCenter top={750} px='4'>
                                    <Box cursor={'pointer'} borderRadius={'50%'} boxSize={'30px'} bg={'#3E36B0'}>
                                        {expand ? 
                                            <ChevronRightIcon onClick={()=> {expandPage()}} marginLeft={1} marginTop={0.4} boxSize={'1.5em'} color={'#fff'}/>
                                            :
                                            <ChevronLeftIcon onClick={()=> {shrinkPage()}} marginLeft={0.9} marginTop={0.4} boxSize={'1.5em'} color={'#fff'}/>
                                        }   
                                    </Box>
                                </AbsoluteCenter>
                            </Center>
                        </GridItem>
                    </Grid>
                </GridItem>
                <GridItem marginLeft={4} pl='2' area={'main'} bg={'#fff'} borderEndEndRadius={'20px'} padding={6}>
                    <Grid gridTemplateRows={expandGeneral === 1 ? '3% 97%':
                                            expandGeneral === 2 ? '45% 3% 52%':
                                                                    '97% 3%'}
                            h='100%'>
                        {expandGeneral === 1 ? null : 
                        <GridItem position={'relative'}>
                            <HStack h={'8%'} spacing={2}>
                                <Text w={'50%'} paddingTop={0} color={'#3E36B0'} fontSize={'22px'} fontWeight={600}>{'Table of action'}</Text>
                                
                                <Box w={'25%'}>
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
                                <Box w={'25%'}>
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
                            <HStack marginTop={2} h={'8%'} spacing={2}>
                            <Text>Action type:</Text>
                                <Select w={'20%'} onChange={(e) => setTypeAction(e.target.value)}>
                                    {actiontype.map((item) => (
                                        <option defaultValue={item === 'Login' ? true : false} value={item}>{item}</option>
                                    ))}
                                </Select>
                                <Text>Time:</Text>
                                <Select w={'20%'} onChange={(e) => setDrillup(e.target.value)}>
                                    <option value={'date'}>date</option>
                                    <option value={'month'}>month</option>
                                    <option value={'year'}>year</option>
                                </Select>
                                <Text>Chart:</Text>
                                <Select w={'20%'} onChange={(e) => setChart(e.target.value)}>
                                    <option defaultValue={true} value="bar chart">Bar chart</option>
                                    <option value="line chart">Line chart</option>
                                </Select>
                                <Text>Color:</Text>
                                <InputColor
                                    initialValue="#5e72e4"
                                    onChange={setColor}
                                    placement="right"
                                />
                            </HStack>
                            <Box h={'80%'} position={'absolute'} w={'100%'}>
                            {chart === 'bar chart' ? 
                                    <BarChart setDecision={setDecision} level={drillup} dataset={null} label={chartdata.map(item => item.date)} data={chartdata.map(item => item.count)} color={color} UnitY='times'/>
                                : 
                                    <LineChart setDecision={setDecision} level={drillup} dataset={null} label={chartdata.map(item => item.date)} data={chartdata.map(item => item.count)} color={color} UnitY='times'/> }
                            </Box>
                        </GridItem>}

                        <GridItem>
                            <Center height={'100%'} position='relative'>
                                <Divider orientation="horizontal" style={{height: '2px'}} color={'#3E36B0'}/>
                                <AbsoluteCenter>
                                    <Box position='relative' bg={'white'} w={'90px'}>
                                        <Center>
                                            <IconButton
                                                isDisabled = {expandGeneral === 3 ? true: false}
                                                boxSize={'20px'}
                                                icon={<ChevronDownIcon/>}
                                                bg={'#3E36B0'}
                                                color={'white'}
                                                onClick={expandGeneral === 2 ? ()=>{setExpandGenaral(expandGeneral + 1)}: ()=>{setExpandGenaral(expandGeneral + 1)}}
                                            />
                                            <IconButton
                                                marginLeft={2}
                                                isDisabled = {expandGeneral === 1 ? true: false}
                                                boxSize={'20px'}
                                                icon={<ChevronUpIcon/>}
                                                bg={'#3E36B0'}
                                                color={'white'}
                                                onClick={expandGeneral === 3 ? ()=>{setExpandGenaral(expandGeneral - 1)}: ()=>{setExpandGenaral(expandGeneral - 1)}}
                                            />
                                        </Center>
                                    </Box>
                                </AbsoluteCenter>
                            </Center>
                        </GridItem>
                        {expandGeneral === 3 ? null : <GridItem position={'relative'}>
                            <Box h={'100%'}>
                                <MyTable2 tablename={'Action list'} data={decision === 'All' ? actionLog : actionLog.filter((item) => {
                                    const currentDate = new Date(item.time);
                                    return item.action === typeAction && (drillup === 'date' ? `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}` === decision 
                                    : drillup === 'month' ? `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}` ===  decision
                                    : `${currentDate.getFullYear()}` === decision)})} 
                                    height={expandGeneral === 1 ? '620px': '320px'} width={expand ? '1700px' : '1100px'}/>
                            </Box>
                            </GridItem>}
                    </Grid>
                </GridItem>
        </AdminLayout>
    )
};

export default DetailUser;