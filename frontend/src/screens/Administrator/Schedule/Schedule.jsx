import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OveralTag from "../../../components/OveralTag/OveralTag";
import Note from "../../../components/Note/Note";
import PatientList from "../../../components/PatientList/PatientList";
import { Button, Center, HStack, Select, SimpleGrid } from "@chakra-ui/react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
  } from '@chakra-ui/react'
import { useNavigate } from "react-router-dom";
import { Grid, GridItem,Text, Flex } from '@chakra-ui/react'
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
import TimePicker from 'react-time-picker';
import dayjs from 'dayjs';
import BasicDatePicker from "../../../components/DateTimePicker/DatePicker";
import BasicTimePicker from "../../../components/DateTimePicker/TimePicker";
import { format } from 'date-fns';
import {log} from '../../../functions';

const theme = createTheme();
const Scheduler = () => {
    const user_code = sessionStorage.getItem('user')
    ? JSON.parse(sessionStorage.getItem('user')).code
    : '0';
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

    const today = dayjs();

    const [fromdate, setFromDate] = useState(today);
    const [selectedOption, setSelectedOption] = useState(''); // Initial value

    const handleOptionChange = (event) => {
      setSelectedOption(event.target.value); // Update selected option
    };

    const [selectedTime, setSelectedTime] = useState(today);
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const daysInMonth = Array.from({ length: 31 }, (_, index) => index + 1);
    const minInHour = Array.from({ length: 61 }, (_, index) => index);

    const hour = [1, 2, 4 , 6, 8, 12];

    const [selectedDayInWeek, setSelectedDayInWeek] = useState(daysOfWeek[0]);
    const [selectedDayInMonth, setSelectedDayInMonth] = useState(daysInMonth[0]);
    const [selectedHour, setSelectedHour] = useState(hour[0]);
    const [selectedMin, setSelectedMin] = useState(minInHour[0]);
    const generateRandomString = (length) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    const save = () =>{
        let insertData = {}
        insertData.id = generateRandomString(10);
        insertData.type = selectedOption;
        insertData.start_date = fromdate;
        insertData.created = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
        insertData.administrator_code = user_code;
        if(selectedOption=='Hourly'){
            insertData.minute=selectedMin;
            insertData.time=null;
        }
        else{
            insertData.minute=null;
            insertData.time=selectedTime;

        }
        if(selectedOption=='Daily'){
            insertData.duration=null;
        }
        else if(selectedOption=='Weekly'){
            insertData.duration=selectedDayInWeek;
        }
        else if(selectedOption=='Monthly'){
            insertData.duration=selectedDayInMonth;
        }
        else{
            insertData.duration=selectedHour;
        }
        console.log(insertData)
        const url = 'http://localhost:8000/insert-load-schedule';
        axios({
            method: 'post',
            url: url,
            data: insertData,
          })
            .then((res) => {
              console.log(res)
              var log_data = {
                'user_code': sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')).code: '0',
                'time': format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                'action': 'Add Schedule for Loading Data',
                'related_item': 'Schedule ID ' + insertData.id
              }
            log(log_data);
            })
            .catch((res) => {
              console.log(res);
            });
    }
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

    const [scheduleLog, setScheduleLog] = useState([]);
    const [loadingScheduleLog, setLoadingScheduleLog] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/get-admin-schedule', {
                    params: {
                        user_code: user_code
                    }
                });
                // console.log(response)
                setScheduleLog(response.data.schedule_log);
                setLoadingScheduleLog(false);
            } catch (error) {
                setError(error);
                setLoadingScheduleLog(false);
            }
        };
        fetchData();
    }, []);
    return(
        <AdminLayout path={
            <Breadcrumb fontSize="xl">
                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink href='#' style={{ fontSize: "25px"}}>Scheduler</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            }
            disease={false}>
                <GridItem position={'relative'} marginLeft={4} pl='2' area={'main'} gap={'1%'}>
                    <Grid templateAreas={`"load note"
                                          "list list"`}          
                          gridTemplateRows={'42.5% 56.5%'}
                          gridTemplateColumns={'60% 40%'}
                          h='100%'>
                        <GridItem bg={'#fff'} margin={1} p={2} borderRadius={'20px'} area={'load'} position={'relative'}>
                            <Grid gridTemplateRows={'15% 55% 30%'} h={'100%'}>
                                <GridItem>
                                    <Center>
                                        <Text color={'#3E36B0'} fontSize={'24px'} fontWeight={'700'}>Set time to load data</Text>
                                    </Center>
                                </GridItem>
                                <GridItem position={'relative'} p={2}>
                                    <Grid gridTemplateRows={'50% 50%'} h={'100%'}>
                                        
                                        <GridItem>
                                            <Grid gridTemplateColumns={'20% 80%'} >
                                                <GridItem>
                                                    <Flex justifyContent="flex-start"> {/* Align content to the left */}
                                                        <Text color={'#111'} fontSize={'20px'} fontWeight={'500'}>Start Date</Text>
                                                    </Flex>
                                                </GridItem>
                                                <GridItem>
                                                    <BasicDatePicker 
                                                        defaultValue={today} 
                                                        value = {fromdate}
                                                        minDate={today} 
                                                        onChange={setFromDate} // Convert back to dayjs
                                                    />
                                                </GridItem>
                                                <GridItem>
                                                    <Flex justifyContent="flex-start"> {/* Align content to the left */}
                                                        <Text color={'#111'} fontSize={'20px'} fontWeight={'500'}>Every</Text>
                                                    </Flex>
                                                </GridItem>
                                                <GridItem style={{ width: "40%"}}>
                                                    <Select value={selectedOption} onChange={handleOptionChange} placeholder="Options" marginBottom={2}>
                                                        <option value='Hourly'>Hourly</option>
                                                        <option value='Daily'>Day</option>
                                                        <option value='Weekly'>Week</option>
                                                        <option value='Monthly'>Month</option>
                                                    </Select>
                                                </GridItem>
                                                {
                                                    selectedOption !=='' && selectedOption !== 'Daily' ? <GridItem>
                                                    <Flex justifyContent="flex-start"> {/* Align content to the left */}
                                                        <Text color={'#111'} fontSize={'20px'} fontWeight={'500'}>On</Text>
                                                    </Flex>
                                                    </GridItem>
                                                    : null
                                                }
                                                
                                                {selectedOption === "Hourly" && (
                                                    <GridItem style={{ width: "40%"}}>
                                                        <Select value = {selectedHour} onChange={(event) => setSelectedHour(event.target.value)} marginBottom={2}>
                                                            {hour.map((hour) => (
                                                            <option key={hour} value={hour}>
                                                                Every {hour} {hour==1 ? 'hour' :'hours'}
                                                            </option>
                                                            ))}
                                                        </Select>
                                                    </GridItem>
                                                )}
                                                {selectedOption === "Weekly" && (
                                                    <GridItem style={{ width: "40%"}}>
                                                        <Select value = {selectedDayInWeek} onChange={(event) => setSelectedDayInWeek(event.target.value)} marginBottom={2}>
                                                            {daysOfWeek.map((day) => (
                                                            <option key={day} value={day}>
                                                                {day}
                                                            </option>
                                                            ))}
                                                        </Select>
                                                    </GridItem>
                                                )}
                                                {selectedOption === "Monthly" && (
                                                    <GridItem style={{ width: "40%"}}>
                                                    <Select value={selectedDayInMonth} onChange={(event) => setSelectedDayInMonth(event.target.value)} marginBottom={2}>
                                                        {daysInMonth.map((day) => (
                                                        <option key={day} value={day}>
                                                            {day}
                                                        </option>
                                                        ))}
                                                    </Select>
                                                    </GridItem>
                                                )}
                                                {
                                                    selectedOption !=='' && (selectedOption !=='Hourly' ? 
                                                    <GridItem marginTop={3}>
                                                        <Flex justifyContent="flex-start"> {/* Align content to the left */}
                                                            <Text color={'#111'} fontSize={'20px'} fontWeight={'500'}>At</Text>
                                                        </Flex>
                                                    </GridItem>
                                                    : <GridItem>
                                                    <Flex justifyContent="flex-start"> {/* Align content to the left */}
                                                        <Text color={'#111'} fontSize={'20px'} fontWeight={'500'}>At</Text>
                                                    </Flex>
                                                </GridItem>
                                                )}
                                                
                                                {selectedOption !== '' && (
                                                    selectedOption === 'Monthly' || selectedOption === 'Daily' || selectedOption === 'Weekly' ? (
                                                        <GridItem marginTop={3}> <BasicTimePicker value={selectedTime} defaultValue={today} onChange={setSelectedTime} /> </GridItem>
                                                    ) : (
    
                                                        <GridItem style={{ width: "40%"}}>
                                                            <Select value={selectedMin} onChange={(event) => setSelectedMin(event.target.value)}>
                                                                {minInHour.map((min) => (
                                                                <option key={min} value={min}>
                                                                    {min} {min !== 1 ? 'minutes' : 'minute'} past the hour
                                                                </option>
                                                                ))}
                                                            </Select>
                                                        </GridItem>
                                                    )
                                                )}
                                                

                                            </Grid>
                                        </GridItem>
                                    </Grid>
                                </GridItem>
                                <GridItem p={2}>
                                <HStack spacing={4} justifyContent="flex-end">
                                    <Button colorScheme='teal' size='md'>Load Immediately</Button>
                                    <Button w={'100px'} colorScheme='teal' size='md' onClick={save}>Set</Button>
                                </HStack>
                                </GridItem>
                            </Grid>
                        </GridItem>
                        
                        <GridItem bg={'#fff'} margin={1} p={1} borderRadius={'20px'} area={'note'} position={'relative'}>
                            <Center position={'relative'} height={'100%'}>
                                <Note loading ={loadingNote} pageSize={2} setNote={setNote} data={note} type={"self-note"} subject_id={""} />
                            </Center>
                        </GridItem>
                        <GridItem area={'list'} bg={'#fff'} borderRadius={'20px'}>
                            <Grid gridTemplateRows={'12% 88%'} h={'100%'}>
                                <GridItem p={3}>
                                    <Text fontWeight={600} color={"#111111"} fontSize={'28px'}>Schedule History</Text>
                                </GridItem>
                                <GridItem padding={'0 10px'}>
                                    <MyTable2 data={scheduleLog} height={'350px'}/>
                                </GridItem>
                            </Grid>
                        </GridItem>
                    </Grid>
                </GridItem>
        </AdminLayout>
    )
};

export default Scheduler;