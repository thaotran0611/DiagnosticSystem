import React, { useEffect, useRef, useState } from "react";
import { AbsoluteCenter, Box, Button, Divider, Grid, GridItem, HStack, IconButton, ScaleFade, Select, SimpleGrid, Stack, Text, position } from "@chakra-ui/react";
import { Center } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { BellIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon } from "@chakra-ui/icons";
import MyPagination from "../../../components/Pagination/Pagination";
import { Pagination, ThemeProvider, createTheme } from "@mui/material";
import GeneralCard from "../../../components/GeneralCard/GeneralCard";
import MyTable from "../../../components/MyTable/MyTable";
import MyTable2 from "../../../components/MyTable/MyTable2";
import { HorizontalChart } from "../../../components/Chart/HorizontalChart";
import ChartEvents from "../../../components/Chart/ChartEvents";
import BarChart from "../../../components/Chart/BarChart";
import { LineChart } from "../../../components/Chart/LineChart";
import axios from 'axios';
import _ from "lodash";
import InputColor from "react-input-color";
import MedicalTestChart from "../../../components/Chart/MedicalTestChart";
import Scrollspy from 'react-scrollspy'


const theme = createTheme();
const MedicalTestTab = (props) => {

    const doctor_code = sessionStorage.getItem('user')
    ? JSON.parse(sessionStorage.getItem('user')).code
    : '0';

    // const [medicaltest, setMedicalTest] = useState([]); // PASS AS PARAMETER
    // const [medicaltest1time, setMedicalTest1time] = useState([]); // PASS AS PARAMETER
    // const [medicaltestmanytime, setMedicaltestmanytime] = useState([]);
    // const [typeofmedicaltest1time, setTypeofmedicaltest1time] = useState([]);
    // const [typeofmedicaltestmanytime, setTypeofmedicaltestmanytime] = useState([]);
    // const [loadingMedicalTest, setLoadingMedicalTest] = useState(true);
    
    const medicaltest = props.medicaltest;
    const medicaltest1time = props.medicaltest1time;
    const medicaltestmanytime = props.medicaltestmanytime;
    const typeofmedicaltest1time = props.typeofmedicaltest1time;
    const typeofmedicaltestmanytime = props.typeofmedicaltestmanytime;


    const [typeoftest1time,setTypeoftest1time] = useState('');
    const [typeoftestmanytime,setTypeoftestmanytime] = useState('');
    const [error, setError] = useState(null);
    const [typeofchart, setTypeofchart] = useState('LineChart');
    const Allcharts = ['LineChart', 'BarChart', 'Table'];
    const subject_id = props.subject_id;
    const [color, setColor] = useState({});
    const [drillup, setDrillup] = useState('Default');
    const AllDrillup = ['Default', 'date', 'month', 'year'];
    // const [componentChart, setComponentChart] = useState([1]);
    const addComponentChart = () => {
        props.setComponentChart([...props.componentChart, props.componentChart.length > 0 ? props.componentChart[props.componentChart.length - 1] + 1 : 1]); // You can use any unique identifier here
    };
   
    const deleteComponentChart = (index) => {
        console.log(props.componentChart);
        props.setComponentChart(props.componentChart.filter((_, i) => i !== index));
    };

    const [expandMedicalTest, setExpandMedicalTest] = useState(2);
    const [page, setPage] = useState(1);
    const handleChangePage = (event, newpage) => {
        setPage(newpage);
    };
    
    const startIndex = (page - 1) * props.pageSize;
    const endIndex = startIndex + props.pageSize;
    let medicaltest1timefilter = props.hadmID === 'All Admission' ? medicaltest1time.filter((item) => {
            const itemValue = String(item.fluid);
            return itemValue.includes(typeoftest1time);
        }) : medicaltest1time.filter((item) => {
            const itemValue = String(item.hadm_id);
            return itemValue.includes(props.hadmID);
        }).filter((item) => {
            const itemValue = String(item.fluid);
            return itemValue.includes(typeoftest1time);
        })
    let medicaltestmanytimefilter = props.hadmID === 'All Admission' ? medicaltestmanytime.filter((item) => {
            const itemValue = String(item.label);
            return itemValue === typeoftestmanytime;
        }) : medicaltestmanytime.filter((item) => {
            const itemValue = String(item.hadm_id);
            return itemValue.includes(props.hadmID);
        }).filter((item) => {
            const itemValue = String(item.label);
            return itemValue === typeoftestmanytime;
        })
    let slicedData = medicaltest1timefilter.slice(startIndex, endIndex)
    // props.generalTag.slice(startIndex, endIndex);
    return(
        <Grid gridTemplateRows={expandMedicalTest === 1 ? '3% 97%':
                                expandMedicalTest === 2 ? '35% 3% 62%':
                                                        '97% 3%'}
                h='100%'>
            {expandMedicalTest === 1 ? null : 

            <GridItem position={'relative'}>
                <Grid
                    h='40px'
                    templateColumns='repeat(6, 1fr)'
                    gap={4}
                    >
                        <GridItem colStart={1} colSpan={2}>
                        <Text color={'#3E36B0'} fontSize={'25px'} fontWeight={600}> One-time test</Text>
                    </GridItem>

                    <GridItem textAlign={'right'} colStart={5} colSpan={1}>
                        <Text paddingTop={1} fontWeight={600}>Type of test:</Text>
                    </GridItem>
                    
                    <GridItem colStart={6} colSpan={1}>
                        <Select onChange={(e) => {setTypeoftest1time(e.target.value)}} fontWeight={600} color={'#3E36B0'} variant={'outline'} defaultValue={props.hadmID === 'All Admission' && typeofmedicaltest1time.length > 0 ? typeofmedicaltest1time[0].fluid : typeofmedicaltest1time.filter((item) => {
                                    const itemValue = String(item.hadm_id);
                                    return itemValue.includes(props.hadmID)
                                }).length > 0 ? typeofmedicaltest1time.filter((item) => {
                                    const itemValue = String(item.hadm_id);
                                    return itemValue.includes(props.hadmID)
                                })[0].fluid : ""}>
                            {
                                props.hadmID === 'All Admission' ?
                                _.uniqBy(typeofmedicaltest1time, "fluid").map(item => (
                                    <option selected={item.fluid === typeoftest1time ? true : false} value={item.fluid}>{item.fluid}</option>
                                ))
                                :
                                _.uniqBy(typeofmedicaltest1time.filter((item) => {
                                    const itemValue = String(item.hadm_id);
                                    console.log(typeofmedicaltest1time)
                                    return itemValue.includes(props.hadmID)
                                }), "fluid").map(item => (
                                    <option selected={item.fluid === typeoftest1time ? true : false} value={item.fluid}>{item.fluid}</option>
                                ))
                            }
                        </Select>
                    </GridItem>
                </Grid>
                <ThemeProvider theme={theme}>
                    <SimpleGrid marginTop={1} h={expandMedicalTest === 2 ? '65%' : '80%'} columns={props.expand ? 6 : 4} spacing={8}>
                        {
                            slicedData.map(infor => (
                                <GeneralCard heading = {infor.label} content={infor.value + (infor.valueuom !== null ? "   " +infor.valueuom : "")} footer={infor.charttime}/>
                            ))
                        }
                    </SimpleGrid>
                
                    <Center>
                        <MyPagination
                            count={Math.ceil(medicaltest1timefilter.length / props.pageSize)}
                            page={page}
                            onChange={handleChangePage}
                        />
                    </Center>
                </ThemeProvider>
            </GridItem>}

            <GridItem>
                <Center height={'100%'} position='relative'>
                    <Divider orientation="horizontal" style={{height: '2px'}} color={'#3E36B0'}/>
                    <AbsoluteCenter>
                        <Box position='relative' bg={'white'} w={'90px'}>
                            <Center>
                                <IconButton
                                    isDisabled = {expandMedicalTest === 3 ? true: false}
                                    boxSize={'20px'}
                                    icon={<ChevronDownIcon/>}
                                    bg={'#3E36B0'}
                                    color={'white'}
                                    onClick={expandMedicalTest === 2 ? ()=>{setExpandMedicalTest(expandMedicalTest + 1); props.setPageSize(props.pageSize*3)}: ()=>{setExpandMedicalTest(expandMedicalTest + 1)}}
                                />
                                <IconButton
                                    marginLeft={2}
                                    isDisabled = {expandMedicalTest === 1 ? true: false}
                                    boxSize={'20px'}
                                    icon={<ChevronUpIcon/>}
                                    bg={'#3E36B0'}
                                    color={'white'}
                                    onClick={expandMedicalTest === 3 ? ()=>{setExpandMedicalTest(expandMedicalTest - 1); props.setPageSize(props.pageSize/3)}: ()=>{setExpandMedicalTest(expandMedicalTest - 1)}}
                                />
                            </Center>
                        </Box>
                    </AbsoluteCenter>
                </Center>
            </GridItem>
            {expandMedicalTest === 3 ? null : <GridItem position={'relative'} paddingTop={'2'} overflow={'auto'}>
                <Text color={'#3E36B0'} fontSize={'25px'} fontWeight={600}> Many-time test</Text>
                {/* <MyTable/> */}
                    {/* <MyTable2 height={expandMedicalTest === 1 ? '620px': '450px'} width={expand ? '1700px' : '1100px'}/> */}
                    {/* <Grid
                        h='40px'
                        templateColumns='repeat(12, 1fr)'
                        gap={4}
                        >
                        <GridItem colStart={1} colSpan={4}>
                            <Text color={'#3E36B0'} fontSize={'20px'} fontWeight={600}> many-time test</Text>
                        </GridItem>
                        <GridItem colStart={5} colSpan={1} paddingTop={2}>
                            <HStack textAlign={'left'} spacing={1}>
                                <Text fontWeight={600}>Color:</Text>
                                <InputColor
                                    disabled={typeofchart === 'Table'? true : false}
                                    initialValue="#5e72e4"
                                    onChange={setColor}
                                    placement="right"
                                />
                            </HStack>
                        </GridItem>
                        <GridItem colStart={6} colSpan={2}>
                            <HStack spacing={1}>
                                <Text  w={'90px'} paddingTop={1} fontWeight={600}>Display:</Text>
                                <Select onChange={(e) => {setTypeofchart(e.target.value)}} fontWeight={600} color={'#3E36B0'} variant={'outline'} defaultValue={Allcharts[0]}>
                                    {
                                        Allcharts.map(item => (
                                            <option selected={item === typeofchart ? true : false} value={item}>{item}</option>
                                        ))
                                    }
                                </Select>
                            </HStack>
                        </GridItem>
                        <GridItem colStart={8} colSpan={2}>
                            <HStack spacing={1}>
                                <Text w={'110px'} paddingTop={1} fontWeight={600}>Roll up:</Text>
                                <Select disabled={typeofchart === 'Table'? true : false} onChange={(e) => {setDrillup(e.target.value)}} fontWeight={600} color={'#3E36B0'} variant={'outline'} defaultValue={AllDrillup[0]}>
                                {
                                    AllDrillup.map(item => (
                                        <option selected={item === drillup ? true : false} value={item}>{item}</option>
                                    ))
                                }
                            </Select>
                            </HStack>
                        </GridItem>
                        <GridItem colStart={10} colSpan={3}>
                            <HStack spacing={1} textAlign={'right'}>
                                <Text w={'100px'} paddingTop={1} fontWeight={600}>Test:</Text>
                            
                                <Select  onChange={(e) => {setTypeoftestmanytime(e.target.value)}} fontWeight={600} color={'#3E36B0'} variant={'outline'} defaultValue={props.hadmID === 'All Admission' && typeofmedicaltestmanytime.length > 0 ? typeofmedicaltestmanytime[0].label : typeofmedicaltestmanytime.filter((item) => {
                                            const itemValue = String(item.hadm_id);
                                            return itemValue.includes(props.hadmID)
                                        }).length > 0 ? typeofmedicaltestmanytime.filter((item) => {
                                            const itemValue = String(item.hadm_id);
                                            return itemValue.includes(props.hadmID)
                                        })[0].label : ""}>
                                    {
                                        props.hadmID === 'All Admission' ?
                                        _.uniqBy(typeofmedicaltestmanytime, "label").map(item => (
                                            <option selected={item.label === typeoftestmanytime ? true : false} value={item.label}>{item.label}</option>
                                        )) :
                                        _.uniqBy(typeofmedicaltestmanytime.filter((item) => {
                                            const itemValue = String(item.hadm_id);
                                            return itemValue.includes(props.hadmID)
                                        }), "label").map(item => (
                                            <option selected={item.label === typeoftestmanytime ? true : false} value={item.label}>{item.label}</option>
                                        ))
                                    }
                                </Select>
                            </HStack>
                        </GridItem>
                    </Grid>
                    <Box h={'90%'} position={'relative'}>
                        {typeofchart === 'LineChart' ? 
                            <LineChart level={drillup} color={color} dataset={typeoftestmanytime + " " + (medicaltestmanytimefilter.length > 0 ? medicaltestmanytimefilter[0].valueuom !== null ? " (" + medicaltestmanytimefilter[0].valueuom + ")" : "" : "")} label={medicaltestmanytimefilter.map(item => item.charttime)} data={medicaltestmanytimefilter.map(item => item.value)}/> 
                        : typeofchart === 'BarChart' ?
                            <BarChart level={drillup} color={color} dataset={typeoftestmanytime + " " + (medicaltestmanytimefilter.length > 0 ? medicaltestmanytimefilter[0].valueuom !== null ? " (" + medicaltestmanytimefilter[0].valueuom + ")" : "" : "")} label={medicaltestmanytimefilter.map(item => item.charttime)} data={medicaltestmanytimefilter.map(item => item.value)}/>
                        :
                            <MyTable2 data={medicaltestmanytimefilter} height={expandMedicalTest === 1 ? '560px' : '260px'}
                            width={props.expand ? '1700px' : '1100px'} onSelect={()=>{}}/>
                        }
                    </Box> */}
                    {props.componentChart.map((item, index) => (
                        <div key={item} style={{height: '95%', position:'relative'}}>
                            <MedicalTestChart onClose={()=>{deleteComponentChart(index)}} hadmID = {props.hadmID} medicaltestmanytime={medicaltestmanytime} typeofmedicaltestmanytime={typeofmedicaltestmanytime} expandMedicalTest={expandMedicalTest} expand={props.expand}/> 
                        </div>
                    ))}
                    <Scrollspy style={{margin: '0', padding: '0'}} currentClassName="active" items={['end']}>
                        <Button id="end" onClick={addComponentChart}>Add Chart +</Button>
                    </Scrollspy>
                    {/* <div id="end" /> Ref to the end of the components list */}
                    {/* <MedicalTestChart hadmID = {props.hadmID} medicaltestmanytime={medicaltestmanytime} typeofmedicaltestmanytime={typeofmedicaltestmanytime} expandMedicalTest={expandMedicalTest} expand={props.expand}/> */}

                </GridItem>}
        </Grid>
    )
}

export default MedicalTestTab;