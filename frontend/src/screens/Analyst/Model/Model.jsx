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
    
    // const [fileLocation, setLocation] = useState(file.url); 
    // const [changeLocation, setChangeLocation] = useState(false); 

    // const [model, setModel] = useState('CNN'); 
    // const [epoch, setEpoch] = useState(5); 
    // const [locationStore, setLocationStore] = useState('option1'); 
    // const today = dayjs();
    // const [fromdate, setFromDate] = useState (today);


    // const [selectedOption, setSelectedOption] = useState(''); 
    // const handleOptionChange = (event) => {
    //     setSelectedOption(event.target.value); 
    //   };
    
    // const save = () => {
    //     let insertData = {}
    //     insertData.created_at = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    //     insertData.analyst_code = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')).code: '0';
    //     insertData.type_of_disease = file.type_of_disease;
    //     insertData.type_file = file.type_file;
    //     insertData.epoch = epoch;
    //     insertData.type_of_model = model;
    //     insertData.location_store = locationStore;
    //     insertData.type = selectedOption;
    //     if (selectedOption === 'Schedule'){
    //         insertData.schedule = fromdate;
    //     }
    //     else{
    //         insertData.schedule = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    //     }
    //     const url = 'http://localhost:8000/retrain-model';
    //     axios({
    //         method: 'post',
    //         url: url,
    //         data: insertData,
    //       })
    //         .then((res) => {
    //           console.log(res)
    //           var log_data = {
    //             'user_code': sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')).code: '0',
    //             'time': insertData.created_at,
    //             'related_item': ""
    //           }
    //           if (selectedOption === 'Schedule'){
    //             log_data.action = "Schedule for retraining model for disease" + insertData.type_of_disease;
    //             }
    //             else{
    //                 log_data.action = "Manually retrain model for disease" + insertData.type_of_disease;
    //             }

    //         log(log_data);
    //         })
    //         .catch((res) => {
    //           console.log(res);
    //         });

    // };

    // const handleLocationChange = (event) => {
    //     setChangeLocation(false)
    //     const currentDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    //     const updatedData = selectedModel;
    //     updatedData['updated_at'] = currentDate;
    //     updatedData['url'] = fileLocation;
    //     let url = 'http://localhost:8000/update-file-location' ;
    //     axios({
    //         method: 'post',
    //         url: url,
    //         data: updatedData,
    //       })
    //         .then((res) => {
    //           console.log(res)
    //           setFile(updatedData)
    //           var log_data = {
    //             'user_code': sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')).code: '0',
    //             'time': format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    //             'action': 'Change location of file',
    //             'related_item': 'File ' + selectedModel.code
    //           }
    //         log(log_data);
    //         })
    //         .catch((res) => {
    //           console.log(res);
    //         });
    // };
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
                    <Grid gridTemplateColumns={'50% 50%'} h={'95%'} position={'relative'} bg={'#F7F5F8'} borderRadius={'0 0 40px 40px '}>
                           
                        <GridItem bg={'#fff'} m={2} borderRadius={'20px'}>
                            <Grid gridTemplateRows={'10% 90%'} h={'100%'} position={'relative'}>
                                <GridItem>
                                    <Center>
                                        <Text color={'#3E36B0'} fontSize={'24px'} fontWeight={'700'}>Detail of Prediction Model for {file.name}</Text>
                                    </Center>
                                </GridItem>
                                <GridItem h={'100%'} position={'relative'} p={2} overflow={'auto'}>
                                <SimpleGrid columns={2} spacing={0} > 
                                    {selectModel_keyvalue.map((item, index) => ( 
                                    <React.Fragment key={index}> 
                                        <Text  fontWeight="bold" fontSize={'20px'}>{item.key}:</Text> 
                                        <Text  fontSize={'20px'}>{item.value}</Text> 
                                    </React.Fragment> 
                                    ))} 
                                </SimpleGrid> 
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
                                    <MyTable2 data={trainingData} onSelect={setSelectedRecord} height={'500px'}/>
                                </GridItem>
                            </Grid>
                        </GridItem>
                    </Grid>
                </GridItem>
        </AnalystLayout>
    )
};

export default Model;