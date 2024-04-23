import React, { useEffect, useState } from "react";
import { AbsoluteCenter, Box, Divider, Grid, GridItem, HStack, IconButton, ScaleFade, Select, SimpleGrid, Stack, Text } from "@chakra-ui/react";
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

const theme = createTheme();
const MedicalTestTab = (props) => {

    const doctor_code = sessionStorage.getItem('user')
    ? JSON.parse(sessionStorage.getItem('user')).code
    : '0';

    const [medicaltest, setMedicalTest] = useState([]); // PASS AS PARAMETER
    const [medicaltest1time, setMedicalTest1time] = useState([]); // PASS AS PARAMETER
    const [medicaltestmanytime, setMedicaltestmanytime] = useState([]);
    const [typeofmedicaltest1time, setTypeofmedicaltest1time] = useState([]);
    const [typeofmedicaltestmanytime, setTypeofmedicaltestmanytime] = useState([]);
    const [typeoftest1time,setTypeoftest1time] = useState('');
    const [typeoftestmanytime,setTypeoftestmanytime] = useState('');
    const [loadingMedicalTest, setLoadingMedicalTest] = useState(true);
    const [error, setError] = useState(null);
    const [typeofchart, setTypeofchart] = useState('LineChart');
    const Allcharts = ['LineChart', 'BarChart'];
    const subject_id = props.subject_id;
    const [color, setColor] = useState({});
    const isUnique = (arr, item) => {
        // Check if there's only one occurrence of this combination in the array
        return arr.filter(obj => obj.hadm_id === item.hadm_id && obj.itemid === item.itemid).length === 1;
      };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/patients-detail-medicaltest', {
                    params: {
                        doctor_code: doctor_code,
                        subject_id: subject_id
                    }
                });
                setMedicalTest(response.data.medicaltest);
                setMedicalTest1time(response.data.medicaltest.filter((item, index, array) => {
                    return isUnique(array, item);
                  })
                )
                setMedicaltestmanytime(response.data.medicaltest.filter((item, index, array) => {
                    return !isUnique(array, item);
                  })
                )
                setTypeofmedicaltest1time(_.uniqBy(response.data.medicaltest.filter((item, index, array) => {
                    return isUnique(array, item);
                }), "fluid").map((image) => image.fluid))
                setTypeofmedicaltestmanytime(_.uniqBy(response.data.medicaltest.filter((item, index, array) => {
                    return !isUnique(array, item);
                }), "label").map((image) => image.label))
                setLoadingMedicalTest(false);
                console.log(response.data.medicaltest.filter((item, index, array) => {
                    return !isUnique(array, item);
                  })
                )
            } catch (error) {
                setError(error);
                setLoadingMedicalTest(false);
            }
        };
        if (medicaltest.length === 0) {
            fetchData();
        }
        }, [medicaltest, doctor_code, subject_id]);
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
    let medicaltestmanytimefilter = props.hadmID === 'All Admission' ? [] : medicaltestmanytime.filter((item) => {
        const itemValue = String(item.label);
        return itemValue.includes(typeoftestmanytime);
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
                        <Text color={'#3E36B0'} fontSize={'20px'} fontWeight={600}> Implement-1-time test</Text>
                    </GridItem>

                    <GridItem textAlign={'right'} colStart={5} colSpan={1}>
                        <Text paddingTop={1} fontWeight={600}>Type of test:</Text>
                    </GridItem>
                    
                    <GridItem colStart={6} colSpan={1}>
                        <Select onChange={(e) => {setTypeoftest1time(e.target.value)}} fontWeight={600} color={'#3E36B0'} variant={'outline'} defaultValue={typeofmedicaltest1time[0]}>
                            {
                                typeofmedicaltest1time.map(item => (
                                    <option selected={item === typeoftest1time ? true : false} value={item}>{item}</option>
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
            {expandMedicalTest === 3 ? null : <GridItem position={'relative'} paddingTop={'8'} overflow={'hidden'}>
                {/* <MyTable/> */}
                    {/* <MyTable2 height={expandMedicalTest === 1 ? '620px': '450px'} width={expand ? '1700px' : '1100px'}/> */}
                    <Grid
                        h='40px'
                        templateColumns='repeat(11, 1fr)'
                        gap={4}
                        >
                            <GridItem colStart={1} colSpan={3}>
                            <Text color={'#3E36B0'} fontSize={'20px'} fontWeight={600}> Implement-many-time test</Text>
                        </GridItem>
                        <GridItem colStart={4} colSpan={1} paddingTop={2}>
                            <HStack spacing={1}>
                                <Text fontWeight={600}>Color:</Text>
                                <InputColor
                                    initialValue="#5e72e4"
                                    onChange={setColor}
                                    placement="right"
                                />
                            </HStack>
                        </GridItem>
                        <GridItem textAlign={'right'} colStart={5} colSpan={3}>
                            <HStack spacing={1}>
                            <Text paddingTop={1} fontWeight={600}>Type of chart:</Text>
                            <Select w={'140px'} onChange={(e) => {setTypeofchart(e.target.value); console.log(color.rgba)}} fontWeight={600} color={'#3E36B0'} variant={'outline'} defaultValue={Allcharts[0]}>
                                {
                                    Allcharts.map(item => (
                                        <option selected={item === typeofchart ? true : false} value={item}>{item}</option>
                                    ))
                                }
                            </Select>
                            </HStack>
                        </GridItem>
                        <GridItem textAlign={'right'} colStart={8} colSpan={4}>
                            <HStack spacing={1}>
                                <Text w={'150px'} paddingTop={1} fontWeight={600}>Type of test:</Text>
                            
                                <Select  onChange={(e) => {setTypeoftestmanytime(e.target.value)}} fontWeight={600} color={'#3E36B0'} variant={'outline'} defaultValue={typeoftestmanytime[0]}>
                                    {
                                        typeofmedicaltestmanytime.map(item => (
                                            <option selected={item === typeoftestmanytime ? true : false} value={item}>{item}</option>
                                        ))
                                    }
                                </Select>
                                {/* <Text paddingTop={1} fontWeight={600}>{medicaltestmanytimefilter[0].valueuom}</Text> */}
                            </HStack>
                        </GridItem>
                    </Grid>
                    <Box h={'90%'} position={'relative'}>
                        {typeofchart === 'LineChart' ? 
                            <LineChart color={color} dataset={typeoftestmanytime + " " + (medicaltestmanytimefilter[0].valueuom !== null ? " (" + medicaltestmanytimefilter[0].valueuom + ")" : "")} label={medicaltestmanytimefilter.map(item => item.charttime)} data={medicaltestmanytimefilter.map(item => item.value)}/> 
                            :
                            <BarChart color={color} dataset={typeoftestmanytime + " " + (medicaltestmanytimefilter[0].valueuom !== null ? " (" + medicaltestmanytimefilter[0].valueuom + ")": "")} label={medicaltestmanytimefilter.map(item => item.charttime)} data={medicaltestmanytimefilter.map(item => item.value)}/>
                        }
                    </Box>
                </GridItem>}
        </Grid>
    )
}

export default MedicalTestTab;