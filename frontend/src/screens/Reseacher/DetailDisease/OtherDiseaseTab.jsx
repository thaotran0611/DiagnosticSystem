import { AbsoluteCenter, Box, Button, Center, Checkbox, Divider, Flex, Grid, GridItem, HStack, IconButton, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverTrigger, Select, Stack, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { PieChart } from "../../../components/Chart/PieChart";
import MyTable2 from "../../../components/MyTable/MyTable2";
import { AreaChart } from "../../../components/Chart/AreaChart";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import InputColor from "react-input-color";
import BarChart from "../../../components/Chart/BarChart";
import _ from 'lodash';
const OtherDiseaseTab = (props) => {
    
    const [expandOtherDiseases, setExpandOtherDiseases] = useState(2);
    let otherdiseasesValue = [{
            name: 'AA',
            label: 'Alcohol Abuse',
            value: 0,
        },{
            name: 'CND',
            label: 'Chronic Neuro Dystrophies',
            value: 0,
        },{
            name: 'SA',
            label: 'Subtance Abuse',
            value: 0,
        },{
            name: 'CP',
            label: 'Chronic Pain',
            value: 0,
        },{
            name: 'Dep',
            label: 'Depression',
            value: 0,
        },{
            name: 'MC',
            label: 'Metastatic Cancer',
            value: 0,
        },{
            name: 'Ob',
            label: 'Obesity',
            value: 0,
        },{
            name: 'PD',
            label: 'Psychiatric Disorders',
            value: 0,
        },{
            name: 'HD',
            label: 'Advanced Heart Disease',
            value: 0,
        },{
            name: 'LD',
            label: 'Advanced Lung Disease',
            value: 0,
        }
    ]
    props.otherdiseases.forEach(element => {
        for (let i = 0; i < 10; i++){
            if(element[otherdiseasesValue[i].name] === 1){
                otherdiseasesValue[i].value += 1;
            }
        }
    });
    otherdiseasesValue.sort((a, b) => {return b.value - a.value});
    console.log(otherdiseasesValue);
    const [color, setColor] = useState('#5e72e4');
    const [color2, setColor2] = useState('#5e72e4');
    const [decision, setDecision] = useState('All');
    const [decision2, setDecision2] = useState('All');
    let filterDataTable = [];
    if (decision === 'All'){
        filterDataTable = props.otherdiseases;
    } else {
        filterDataTable = props.otherdiseases.filter(item => {
            const index = otherdiseasesValue.findIndex(item => item.label === decision);
            return item[otherdiseasesValue[index].name] === 1;
        })
    }
    const [codiseases, setCodiseases] = useState([]);
    
    let filterOtherDiseases = props.otherdiseases.filter(item => 
        codiseases.every(disease => item[disease] === 1)
    )

    const handleOnChange = (disease) => {
        if (codiseases.findIndex(item => item === disease) !== -1){
            const index = codiseases.findIndex(item => item === disease)
            setCodiseases(codiseases.filter((_, i) =>  i !== index))
        } else {
            setCodiseases((prev) => [...prev, disease])
        }
        console.log(filterOtherDiseases);
    }
    const [statistics, setStatistics] = useState('gender');
    let labels2 = {
        gender: ['M', 'F'],
        ethnicity: _.uniqBy(filterOtherDiseases, 'ethnicity').map((item) => item.ethnicity),
        marital_status: _.uniqBy(filterOtherDiseases, 'marital_status').map((item) => item.marital_status),
        religion: _.uniqBy(filterOtherDiseases, 'religion').map((item) => item.religion),
    }
    let datas2 = {
        gender: ['M','F'].map((item) => filterOtherDiseases.reduce((accumulator, currentValue) => {
            if (currentValue.gender === item) {
              return accumulator + 1; // Increment the accumulator
            } else {
              return accumulator; // No change if the category doesn't match
            }
        }, 0)),
        ethnicity: labels2.ethnicity.map((item) => filterOtherDiseases.reduce((accumulator, currentValue) => {
            if (currentValue.ethnicity === item) {
              return accumulator + 1; // Increment the accumulator
            } else {
              return accumulator; // No change if the category doesn't match
            }
        }, 0)),
        marital_status: labels2.marital_status.map((item) => filterOtherDiseases.reduce((accumulator, currentValue) => {
            if (currentValue.marital_status === item) {
              return accumulator + 1; // Increment the accumulator
            } else {
              return accumulator; // No change if the category doesn't match
            }
        }, 0)),
        religion: labels2.religion.map((item) => filterOtherDiseases.reduce((accumulator, currentValue) => {
            if (currentValue.religion === item) {
              return accumulator + 1; // Increment the accumulator
            } else {
              return accumulator; // No change if the category doesn't match
            }
        }, 0))
    }
    let filterDataTable2 = [];
    if (decision2 === 'All'){
        filterDataTable2 = filterOtherDiseases;
    } else {
        filterDataTable2 = filterOtherDiseases.filter(item => {
            return item[statistics] === decision2
        })
    }
    return(
        <Grid gridTemplateRows={expandOtherDiseases === 1 ? '3% 97%' :
                                expandOtherDiseases === 2 ? '48.5% 3% 48.5%':
                                                            '97% 3%'} h={'100%'}>
            {expandOtherDiseases === 1 ? null :
                <GridItem h={'100%'} position={'relative'}>
                    <Grid gridTemplateColumns={'50% 50%'} h={'100%'} position={'relative'}>
                        <GridItem h={'95%'} position={'relative'} overflow={'auto'}>
                            <HStack spacing={1} marginBottom={1} textAlign={'left'}>
                                <Text fontSize={26} fontWeight={650} color={'#3E36B0'}>Co-morbidities</Text>
                                <Text paddingTop={2} fontWeight={600}>Color:</Text>
                                <InputColor
                                    // disabled={typeofchart === 'Table'? true : false}
                                    initialValue="#5e72e4"
                                    onChange={setColor}
                                    placement="right"
                                />
                            </HStack>
                            <Box h={'80%'} overflow={'auto'} position={'relative'} w={'95%'}>
                                {/* <PieChart /> */}
                                <BarChart setDecision={setDecision} data={otherdiseasesValue.map(item => item.value)} label={otherdiseasesValue.map(item => item.label)} color={color} level={'default'} unitY={'patients'}/>
                            </Box>
                        </GridItem>
                        <GridItem h={'100%'} position={'relative'}>
                            <MyTable2 
                                tablename={'Co-morbidities: ' + decision}
                                data={filterDataTable}
                                width={props.expand ? '850px' : '550px'}
                                height={expandOtherDiseases === 2 ? '240px' : '600px'}
                                onSelect = {()=>{}}/>
                        </GridItem>
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
                                    isDisabled = {expandOtherDiseases === 3 ? true: false}
                                    boxSize={'20px'}
                                    icon={<ChevronDownIcon/>}
                                    bg={'#3E36B0'}
                                    color={'white'}
                                    onClick={expandOtherDiseases === 2 ? ()=>{setExpandOtherDiseases(expandOtherDiseases + 1)} : ()=>{setExpandOtherDiseases(expandOtherDiseases + 1)}}
                                />
                                <IconButton
                                    marginLeft={2}
                                    isDisabled = {expandOtherDiseases === 1 ? true: false}
                                    boxSize={'20px'}
                                    icon={<ChevronUpIcon/>}
                                    bg={'#3E36B0'}
                                    color={'white'}
                                    onClick={expandOtherDiseases === 3 ? ()=>{setExpandOtherDiseases(expandOtherDiseases - 1)} : ()=>{setExpandOtherDiseases(expandOtherDiseases - 1)}}
                                />
                            </Center>
                        </Box>
                    </AbsoluteCenter>
                </Center>
            </GridItem>
            {expandOtherDiseases === 3 ? null :
                <GridItem h={'95%'} position={'relative'}>
                    <Grid gridTemplateColumns={'50% 50%'} h={'100%'}>
                        <GridItem h={'100%'} position={'relative'} overflow={'auto'}>
                            <HStack>
                            <Popover closeOnBlur={true}>
                                <PopoverTrigger>
                                    <Button>Add co-morbidities +</Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <PopoverArrow />
                                    <PopoverCloseButton />
                                    <PopoverBody maxH={'200px'} mt={2} overflow={'auto'}>
                                        <Stack pl={6} mt={3} spacing={1}>
                                            {
                                                otherdiseasesValue.map(item => (
                                                    <Checkbox onChange={(e) => handleOnChange(e.target.value)} value={item.name}>{item.label}</Checkbox>
                                                ))
                                            }
                                        </Stack>
                                    </PopoverBody>
                                </PopoverContent>
                            </Popover>
                                <Text paddingTop={2}>Statistic:</Text>
                                <Flex align={'flex-end'}>
                                    <Select w={100} onChange={(e) => {setStatistics(e.target.value)}}>
                                        <option value="ethnicity">ethnicity</option>
                                        <option defaultValue={true} value="gender">gender</option>
                                        <option value="marital_status">marital status</option>
                                        <option value="religion">religion</option>
                                    </Select>
                                </Flex>
                                <Text paddingTop={2}>Color:</Text>
                                <InputColor
                                    // disabled={typeofchart === 'Table'? true : false}
                                    initialValue="#5e72e4"
                                    onChange={setColor2}
                                    placement="right"
                                />
                            </HStack>
                            <Text fontSize={'14px'}>{filterOtherDiseases.length + ' patients:' + codiseases.map(item => " "+item )}</Text>
                            <Box h={'64%'} overflow={'auto'} position={'relative'} w={'95%'}>
                                <BarChart setDecision={setDecision2} data={datas2[statistics]} label={labels2[statistics]} level={'default'} unitY={'patients'} color={color2}/>
                            </Box>
                        </GridItem>
                        <GridItem h={'100%'} position={'relative'} >
                            <MyTable2 tablename={filterDataTable2.length + ' patients:'}
                                data={filterDataTable2}
                                width={props.expand ? '850px' : '550px'}
                                height={expandOtherDiseases === 2 ? '240px' : '600px'}
                                onSelect = {()=>{}}/>
                        </GridItem>
                    </Grid>
                </GridItem>
            }
        </Grid>
    )
}

export default OtherDiseaseTab;