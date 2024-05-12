import React, { useState, useEffect } from "react";
import axios from 'axios';
import SearchAndFilterBar from "../../../components/SearchAndFilterBar/SearchAndFilterBar";
import { Center, Textarea, Divider, SimpleGrid, Icon, Text, Select, Stack, Button, AbsoluteCenter, HStack, Flex  } from "@chakra-ui/react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
  } from '@chakra-ui/react'
import { ThemeProvider, createTheme } from "@mui/material";
import MyPagination from "../../../components/Pagination/Pagination";
import PatientGridCard from "../../../components/PatientGridCard/PatientGridCard";
import { ResearcherLayout } from "../../../layout/ResearcherLayout";
import { Grid, GridItem } from '@chakra-ui/react'
import { useNavigate } from "react-router-dom";
import DiseaseTag from "../../../components/DiseaseTag/DiseaseTag";
import { AnalystLayout } from "../../../layout/AnalystLayout";
import MyTable2 from "../../../components/MyTable/MyTable2";
import { AreaChart } from "../../../components/Chart/AreaChart";
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import BasicDateTimePicker from "../../../components/DateTimePicker/DateTimePicker";
import { format, set } from 'date-fns'
import {log} from '../../../functions';
import dayjs from 'dayjs';

const theme = createTheme();

const Model = () => {
    const navigate = useNavigate();
    const { fileCode } = useParams();


    const location = useLocation();
    if (!location || !location.state || !location.state.selectedModel) {
        console.error("Location state or patient data is null.");
    }
    const { selectedModel } = location.state;
    const [file, setFile] = useState(selectedModel);

    const [trainingData, setTrainingData] = useState([])
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/get-training-data',{
                    params: {
                        disease: selectedModel.type_of_disease
                    }
                });
                console.log(response)
                setTrainingData(response.data.training_data);
            } catch (error) {
                setError(error);
            }
        };
    
        fetchData();
    }, []);

    let selectModel_keyvalue = [];
    if (file !== null){
        selectModel_keyvalue= Object.entries(file)
                            .map(([key, value]) => { return { key: key, value: value };
                            });
    }
    
    const [fileLocation, setLocation] = useState(file.url); 
    const [changeLocation, setChangeLocation] = useState(false); 

    const [model, setModel] = useState('CNN'); 
    const [epoch, setEpoch] = useState(5); 
    const [locationStore, setLocationStore] = useState('option1'); 
    const today = dayjs();
    const [fromdate, setFromDate] = useState (today);


    const [selectedOption, setSelectedOption] = useState(''); 
    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value); 
      };
    
    const save = () => {
        let insertData = {}
        insertData.created_at = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
        insertData.analyst_code = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')).code: '0';
        insertData.type_of_disease = file.type_of_disease;
        insertData.type_file = file.type_file;
        insertData.epoch = epoch;
        insertData.type_of_model = model;
        insertData.location_store = locationStore;
        insertData.type = selectedOption;
        if (selectedOption === 'Schedule'){
            insertData.schedule = fromdate;
        }
        else{
            insertData.schedule = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
        }
        const url = 'http://localhost:8000/retrain-model';
        axios({
            method: 'post',
            url: url,
            data: insertData,
          })
            .then((res) => {
              console.log(res)
              var log_data = {
                'user_code': sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')).code: '0',
                'time': insertData.created_at,
                'related_item': ""
              }
              if (selectedOption === 'Schedule'){
                log_data.action = "Schedule for retraining model for disease" + insertData.type_of_disease;
                }
                else{
                    log_data.action = "Manually retrain model for disease" + insertData.type_of_disease;
                }

            log(log_data);
            })
            .catch((res) => {
              console.log(res);
            });

    };

    const handleLocationChange = (event) => {
        setChangeLocation(false)
        const currentDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
        const updatedData = selectedModel;
        updatedData['updated_at'] = currentDate;
        updatedData['url'] = fileLocation;
        let url = 'http://localhost:8000/update-file-location' ;
        axios({
            method: 'post',
            url: url,
            data: updatedData,
          })
            .then((res) => {
              console.log(res)
              setFile(updatedData)
              var log_data = {
                'user_code': sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')).code: '0',
                'time': format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                'action': 'Change location of file',
                'related_item': 'File ' + selectedModel.code
              }
            log(log_data);
            })
            .catch((res) => {
              console.log(res);
            });
    };
    const [selectedRecord, setSelectedRecord] = useState(null);
    return(
        <AnalystLayout path={
            <Breadcrumb fontSize="xl">
            <BreadcrumbItem>
                <BreadcrumbLink href='../'>Files</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink href="#">{file.name}</BreadcrumbLink>
            </BreadcrumbItem>
        </Breadcrumb>
        }
        disease={false}
        >
            <GridItem bg={'#fff'} area={'main'} borderRadius={'0 0 40px 40px'}>
                    {/* <Divider size={{height: '3px'}} color={'#3E36B0'} orientation='horizontal'/> */}
                    <Grid gridTemplateColumns={'50% 50%'} h={'73%'} position={'relative'} bg={'#F7F5F8'} borderRadius={'0 0 40px 40px '}>
                        <GridItem position={'relative'}>
                            <Grid gridTemplateRows={'50% 50%'} h={'100%'}>
                                <GridItem bg={'#fff'} borderRadius={'20px'} h={'100%'} position={'relative'}>
                                    <Grid gridTemplateRows={'15% 70% 15%'} h={'100%'}>
                                        <GridItem h={'100%'}>
                                            <Center>
                                                <Text color={'#3E36B0'} fontSize={'24px'} fontWeight={'700'}>Set time to train model</Text>
                                            </Center>
                                        </GridItem>
                                        <GridItem position={'relative'} p={1}>
                                            <Grid gridTemplateRows={'20% 20% 20% 20% 20%'} h={'100%'}>
                                                <GridItem>
                                                    <Grid gridTemplateColumns={'20% 80%'}>
                                                        <GridItem>
                                                            <Flex justifyContent="flex-start"> 
                                                                <Text color={'#111'} fontSize={'20px'} fontWeight={'500'}>Retrain Type</Text>
                                                            </Flex>
                                                        </GridItem>
                                                        <GridItem style={{ width: "50%"}}>
                                                            <Select value={selectedOption} onChange={handleOptionChange} placeholder="Options">
                                                                    <option value='Schedule'>Schedule</option>
                                                                    <option value='Intermediately'>Intermediately</option>
                                                            </Select>
                                                        </GridItem>
                                                    </Grid>
                                                </GridItem>
                                                <GridItem>
                                                    <Grid gridTemplateColumns={'20% 80%'}>
                                                        <GridItem>
                                                            <Flex justifyContent="flex-start"> 
                                                                <Text color={'#111'} fontSize={'20px'} fontWeight={'500'}>Type of Model</Text>
                                                            </Flex>
                                                        </GridItem>
                                                        <GridItem style={{ width: "50%"}}>
                                                            <Select placeholder='Select Model' onClick={(e) => setModel(e.target.value)}>
                                                                <option value='CNN'>CNN</option>
                                                                <option value='N-grams'>N-grams</option>
                                                            </Select>
                                                        </GridItem>
                                                    </Grid>
                                                </GridItem>
                                                <GridItem>
                                                    <Grid gridTemplateColumns={'20% 80%'}>
                                                        <GridItem>
                                                        <Flex justifyContent="flex-start"> 
                                                            <Text color={'#111'} fontSize={'20px'} fontWeight={'500'}>Epoch</Text>
                                                        </Flex>
                                                        </GridItem>
                                                        <GridItem style={{ width: "50%"}}>
                                                            <Select placeholder='Select Epoch' onClick={(e) => setEpoch(e.target.value)}>
                                                                <option value={5}>5</option>
                                                                <option value={10}>10</option>
                                                                <option value={15}>15</option>
                                                                <option value={20}>20</option>
                                                            </Select>
                                                        </GridItem>
                                                    </Grid>
                                                </GridItem>
                                                <GridItem>
                                                    <Grid gridTemplateColumns={'20% 80%'}>
                                                        <GridItem>
                                                        <Flex justifyContent="flex-start"> 
                                                            <Text color={'#111'} fontSize={'20px'} fontWeight={'500'}>Location to store</Text>
                                                        </Flex>
                                                        </GridItem>
                                                        <GridItem style={{ width: "50%"}}>
                                                            <Select placeholder='Select Location' onClick={(e) => setLocationStore(e.target.value)}>
                                                                <option value='option1'>Option 1</option>
                                                                <option value='option2'>Option 2</option>
                                                                <option value='option3'>Option 3</option>
                                                            </Select>
                                                        </GridItem>
                                                    </Grid>
                                                </GridItem>
                                                <GridItem>
                                                    <Grid gridTemplateColumns={'20% 80%'}>
                                                        {selectedOption === 'Schedule' ? (
                                                        <React.Fragment>
                                                            <GridItem>
                                                                <Flex justifyContent="flex-start"> 
                                                                    <Text color={'#111'} fontSize={'20px'} fontWeight={'500'}>
                                                                        Start time
                                                                    </Text>
                                                                </Flex>
                                                            </GridItem>
                                                            <GridItem>
                                                                <BasicDateTimePicker value={fromdate} onChange={setFromDate}/> 
                                                            </GridItem>
                                                        </React.Fragment>
                                                    ) : null}
                                                    </Grid>
                                                </GridItem>
                                            </Grid>
                                        </GridItem>
                                        <GridItem p={2}>
                                            <HStack float={'right'} marginRight={10}>
                                                <Button w={'100px'}  colorScheme='teal' size='md' onClick={save}>Set</Button>
                                            </HStack>
                                        </GridItem>
                                    </Grid>
                                </GridItem>
                                <GridItem bg={'#fff'} m={2} borderRadius={'20px'}>
                                    <Grid gridTemplateRows={'10% 90%'} h={'100%'} position={'relative'}>
                                        <GridItem>
                                            <Center>
                                                <Text color={'#3E36B0'} fontSize={'24px'} fontWeight={'700'}>Detail of Model</Text>
                                            </Center>
                                        </GridItem>
                                        <GridItem h={'100%'} position={'relative'} p={2} overflow={'auto'}>
                                        <SimpleGrid columns={2} spacing={0} > 
                                            {selectModel_keyvalue.map((item, index) => ( 
                                            <React.Fragment key={index}> 
                                                <Text fontSize={'md'} fontWeight="bold">{item.key}:</Text> 
                                                <Text fontSize={'md'}>{item.value}</Text> 
                                            </React.Fragment> 
                                            ))} 
                                        </SimpleGrid> 
                                        </GridItem>
                                    </Grid>
                                </GridItem>
                            </Grid>
                        </GridItem>

                        <GridItem position={'relative'}>
                            <Grid gridTemplateRows={'35% 65%'} h={'100%'}>
                                <GridItem bg={'#fff'} m={2} borderRadius={'20px'}>
                                    <Grid gridTemplateRows={'25% 50% 25%'} gap={4}>
                                        <GridItem>
                                            <Center>
                                                <Text color={'#3E36B0'} fontSize={'24px'} fontWeight={'700'}>Set location</Text>
                                            </Center>
                                        </GridItem>
                                        <GridItem position={'relative'} p={2}>
                                            <Grid h={'100%'} gridTemplateColumns={'20% 80%'}>
                                                <GridItem>
                                                    <Center>
                                                        <Text color={'#111'} fontSize={'18px'} fontWeight={'500'}>Location</Text>
                                                    </Center>
                                                </GridItem>
                                                <GridItem>
                                                    {changeLocation ? (
                                                        <Textarea
                                                        w="100%" // Set the desired fixed width here
                                                        value={fileLocation}
                                                        onChange={(event) => setLocation(event.target.value)}

                                                    />
                                                    ): <Text>{file.url}</Text>
                                                }
                                                    {/* <Select placeholder='Select option'>
                                                        <option value='option1'>Option 1</option>
                                                        <option value='option2'>Option 2</option>
                                                        <option value='option3'>Option 3</option>
                                                    </Select> */}
                                                </GridItem>
                                            </Grid>
                                            <GridItem position={'relative'} float={'right'}>
                                            {changeLocation ? (
                                                <HStack spacing="2">
                                                <Button flex="1" colorScheme="teal" size="md" onClick={handleLocationChange}>
                                                    Save
                                                </Button>
                                                <Button flex="1"  size="md" onClick={() => setChangeLocation(false)}>
                                                    Cancel
                                                </Button>
                                            </HStack>
                                                ) : (
                                                <Button w={'200px'} colorScheme='teal' size='md' onClick={() => setChangeLocation(true)}>
                                                    Change
                                                </Button>
                                            )}
                                        </GridItem>
                                        </GridItem>
                                    </Grid>
                                </GridItem>
                                <GridItem bg={'#fff'} m={2} borderRadius={'20px'}>
                                    <Grid templateRows={'10% 90%'} h={'100%'}>
                                        <GridItem>
                                            <Center>
                                                <Text color={'#3E36B0'} fontSize={'24px'} fontWeight={'700'}>Training Data</Text>
                                            </Center>   
                                        </GridItem>
                                        <GridItem p={2}>
                                            <MyTable2 data={trainingData} onSelect={setSelectedRecord} height={'380px'}/>
                                        </GridItem>
                                    </Grid>
                                </GridItem>
                            </Grid>
                        </GridItem>
                    </Grid>
               </GridItem>
        </AnalystLayout>
    )
};

export default Model;