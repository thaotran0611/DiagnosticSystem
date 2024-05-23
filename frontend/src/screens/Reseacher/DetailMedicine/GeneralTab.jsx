import { AbsoluteCenter, Box, Button, Center, Checkbox, Divider, Flex, Grid, GridItem, HStack, Heading, IconButton, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverTrigger, Select, Stack, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { AreaChart } from "../../../components/Chart/AreaChart";
import { LineChart } from "../../../components/Chart/LineChart";
import MyTable2 from "../../../components/MyTable/MyTable2";
import { ColorScheme } from "../../../components/ColorScheme/ColorScheme";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { PieChart } from "../../../components/Chart/PieChart";
import _ from 'lodash';
const GeneralTab = (props) => {
    
    const [expandGeneral, setExpandGenaral] = useState(2);
    const [scheme, setScheme] = useState('Tableau10');
    const [decision, setDecision] = useState('All');
    const [changeChart, setChangeChart] = useState(1);
    
    const [codiseases, setCodiseases] = useState([]);
    let filterByDisease = [];
    if (codiseases.length === 0){
        filterByDisease = props.medicineStatistic;
    }
    else {
        filterByDisease = props.medicineStatistic.filter((item) => {
            return codiseases.every((disease) => item[disease] === 1)
        })
    }
    let male = filterByDisease.reduce((accumulator, currentValue) => {
        // Check if the 'category' field matches the value to count
        if (currentValue.gender === 'M') {
          return accumulator + 1; // Increment the accumulator
        } else {
          return accumulator; // No change if the category doesn't match
        }
      }, 0);
    let female = filterByDisease.reduce((accumulator, currentValue) => {
        // Check if the 'category' field matches the value to count
        if (currentValue.gender === 'F') {
          return accumulator + 1; // Increment the accumulator
        } else {
          return accumulator; // No change if the category doesn't match
        }
    }, 0);
    let uniqueEthnicity = _.uniqBy(filterByDisease, 'ethnicity').map((item) => item.ethnicity);
    let uniqueMarital_status = _.uniqBy(filterByDisease, 'marital_status').map((item) => item.marital_status);
    let uniqueReligion = _.uniqBy(filterByDisease, 'religion').map((item) => item.religion);
    let uniqueAdmissionLocation = _.unionBy(filterByDisease, 'admission_location').map((item) => item.admission_location);
    let uniqueAdmissionType = _.unionBy(filterByDisease, 'admission_type').map((item) => item.admission_type);
    let uniqueInsurance = _.unionBy(filterByDisease, 'insurance').map((item) => item.insurance);
    let labels = {
        gender: ['M', 'F'],
        ethnicity: uniqueEthnicity,
        marital_status: uniqueMarital_status,
        religion: uniqueReligion,
        admission_location: uniqueAdmissionLocation,
        admission_type: uniqueAdmissionType,
        insurance: uniqueInsurance
    };
    let datas = {
        gender: [male, female],
        ethnicity: uniqueEthnicity.map((item) => filterByDisease.reduce((accumulator, currentValue) => {
            if (currentValue.ethnicity === item) {
              return accumulator + 1; // Increment the accumulator
            } else {
              return accumulator; // No change if the category doesn't match
            }
        }, 0)),
        marital_status: uniqueMarital_status.map((item) => filterByDisease.reduce((accumulator, currentValue) => {
            if (currentValue.marital_status === item) {
              return accumulator + 1; // Increment the accumulator
            } else {
              return accumulator; // No change if the category doesn't match
            }
        }, 0)),
        religion: uniqueReligion.map((item) => filterByDisease.reduce((accumulator, currentValue) => {
            if (currentValue.religion === item) {
              return accumulator + 1; // Increment the accumulator
            } else {
              return accumulator; // No change if the category doesn't match
            }
        }, 0)),
        admission_location: uniqueAdmissionLocation.map((item) => filterByDisease.reduce((accumulator, currentValue) => {
            if (currentValue.admission_location === item) {
              return accumulator + 1; // Increment the accumulator
            } else {
              return accumulator; // No change if the category doesn't match
            }
        }, 0)),
        admission_type: uniqueAdmissionType.map((item) => filterByDisease.reduce((accumulator, currentValue) => {
            if (currentValue.admission_type === item) {
              return accumulator + 1; // Increment the accumulator
            } else {
              return accumulator; // No change if the category doesn't match
            }
        }, 0)),
        insurance: uniqueInsurance.map((item) => filterByDisease.reduce((accumulator, currentValue) => {
            if (currentValue.insurance === item) {
              return accumulator + 1; // Increment the accumulator
            } else {
              return accumulator; // No change if the category doesn't match
            }
        }, 0)),
    };
    const ColorLabel = [];
    for (const [colorname, value] of Object.entries(ColorScheme)) {
        ColorLabel.push(colorname);
    }
    const [label, setLabel]=useState('gender');
    let filterDataTable = [];
    if (decision === 'All') {
        filterDataTable = props.medicineStatistic;
    }
    else if (changeChart === 1) {
        filterDataTable = filterByDisease.filter((item) => {return item[label] === decision})
    }
    const getLastTenKeys = (objArray) => {
        // Get the keys of the last object in the array
        const lastObjectKeys = Object.keys(objArray[objArray.length - 1]);
        
        // Get the last 10 keys from the array
        const lastTenKeys = lastObjectKeys.slice(-10);
        
        return lastTenKeys;
    }
    const diseases = getLastTenKeys(props.medicineStatistic);
    const handleOnChange = (disease) => {
        if (codiseases.findIndex(item => item === disease) !== -1){
            const index = codiseases.findIndex(item => item === disease)
            setCodiseases(codiseases.filter((_, i) =>  i !== index))
        } else {
            setCodiseases((prev) => [...prev, disease])
        }
    }
    return(
        <Grid gridTemplateRows={expandGeneral === 1 ? '3% 97%':
                                expandGeneral === 2 ? '48.5% 3% 48.5%':
                                                        '97% 3%'} 
              h={'100%'}>
            {expandGeneral === 1 ? null : 
            <GridItem h={'100%'}>
                <Grid gridTemplateColumns={'30% 70%'} h={'100%'}>
                    <GridItem h={'100%'} position={'relative'} >
                        <Text fontSize={26} fontWeight={650} w={'max-content'} color={'#3E36B0'}>Rate of patient</Text>
                        <Text>{filterByDisease.length + ' patients with diseases:'}</Text>
                        <Stack pl={6} mt={3} spacing={1} overflow={'auto'} style={{
                                        scrollbarWidth: 'thin', 
                                        scrollbarColor: '#A0AEC0 #ffffff', 
                                    }}>
                            {
                                diseases.map(item => (
                                    <Checkbox onChange={(e) => handleOnChange(e.target.value)} isChecked={codiseases.findIndex(disease => disease === item) !== -1 ? true : false} value={item}>{props.mapping[item]}</Checkbox>
                                ))
                            }
                        </Stack>
                    </GridItem>
                    <GridItem h={'100%'} position={'relative'}>
                        <Grid h={'100%'} gridTemplateRows={expandGeneral === 3 ? '10% 85%' : '20% 80%'}>
                            <GridItem h={'100%'}>
                                <HStack spacing={1} marginBottom={1} textAlign={'right'}>
                                    {/* <Text fontSize={26} fontWeight={650} w={'max-content'} color={'#3E36B0'}>Rate of patient</Text> */}
                                    <Text paddingTop={2}>Scheme:</Text>
                                    <Select onChange={(e) => {setScheme(e.target.value)}} w={'50%'} style={{
                                        scrollbarWidth: 'thin', 
                                        scrollbarColor: '#A0AEC0 #ffffff', 
                                    }}>
                                        {
                                            ColorLabel.map(item => (
                                                <option value={item}> {item} </option>
                                            ))
                                        }
                                    </Select>
                                    <Text paddingTop={2}>Statistic:</Text>
                                        <Select w={'50%'} onChange={(e) => {setLabel(e.target.value)}}>
                                            <option defaultValue={true} value="gender">gender</option>
                                            <option value="ethnicity">ethnicity</option>
                                            <option value="marital_status">marital status</option>
                                            <option value="religion">religion</option>
                                            <option value="admission_location">admission location</option>
                                            <option value="admission_type">admission type</option>
                                            <option value="insurance">insurance</option>
                                        </Select>
                                    {/* <Popover closeOnBlur={true}>
                                        <PopoverTrigger>
                                            <Button>Add co-morbidities +</Button>
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <PopoverArrow />
                                            <PopoverCloseButton />
                                            <PopoverBody maxH={'200px'} mt={2} overflow={'auto'}>
                                                <Stack pl={6} mt={3} spacing={1}>
                                                    {
                                                        diseases.map(item => (
                                                            <Checkbox onChange={(e) => handleOnChange(e.target.value)} value={item}>{item}</Checkbox>
                                                        ))
                                                    }
                                                </Stack>
                                            </PopoverBody>
                                        </PopoverContent>
                                    </Popover> */}
                                </HStack>
                            </GridItem>
                            <GridItem h={'90%'} overflow={'auto'} w={'100%'} position={'relative'} style={{
                                        scrollbarWidth: 'thin', 
                                        scrollbarColor: '#A0AEC0 #ffffff', 
                                    }}>
                                
                                <PieChart scheme={ColorScheme[scheme]} setDecision={setDecision} changeChart={changeChart} setChangeChart={setChangeChart} decision={decision} labels={labels[label]} data={datas[label]}/>
                            </GridItem>
                        </Grid>
                    </GridItem>
                    {/* <GridItem h={'100%'} position={'relative'}>
                        <Grid h={'100%'} gridTemplateRows={expandGeneral === 3 ? '10% 90%' :'20% 80%'}>
                            <GridItem>
                                <Text fontSize={26} fontWeight={650} color={'#3E36B0'}>Death rate</Text>
                            </GridItem>
                            <GridItem h={'100%'} overflow={'auto'} w={'100%'} position={'relative'}>
                                <AreaChart/>
                            </GridItem>
                        </Grid>
                    </GridItem> */}
                </Grid>
            </GridItem>
            }
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
            {expandGeneral === 3 ? null :
            <GridItem h={'100%'} position={'relative'}>
                <MyTable2
                            tablename={ (changeChart === 1 ? 'Patients with ' + label + ': ' + decision : null)}
                            data={filterDataTable.map(item => {
                                const newItem = {};
                                for (const [oldKey, newKey] of Object.entries(props.mapping)) {
                                    if (item.hasOwnProperty(oldKey)) {
                                    newItem[newKey] = item[oldKey];
                                    }
                                }
                                return newItem;
                            })} 
                            width={props.expand ? '1700px' : '1100px'} height={expandGeneral === 2 ? '240px' : '600px'} onSelect={()=>{}}/>
            </GridItem>
            }
        </Grid>
    )
}

export default GeneralTab;