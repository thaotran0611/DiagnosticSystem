import { AbsoluteCenter, Box, Center, Divider, Flex, Grid, GridItem, HStack, Heading, IconButton, Select, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { AreaChart } from "../../../components/Chart/AreaChart";
import { LineChart } from "../../../components/Chart/LineChart";
import { PieChart } from "../../../components/Chart/PieChart";
import _ from 'lodash';
import InputColor from "react-input-color";
import MyTable2 from "../../../components/MyTable/MyTable2";
import { ColorScheme } from "../../../components/ColorScheme/ColorScheme";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";

const GeneralTab = (props) => {
    const [expandGeneral, setExpandGeneral] = useState(2);
    const male = props.diseaseStatistic.reduce((accumulator, currentValue) => {
        // Check if the 'category' field matches the value to count
        if (currentValue.gender === 'M') {
          return accumulator + 1; // Increment the accumulator
        } else {
          return accumulator; // No change if the category doesn't match
        }
      }, 0);
    const female = props.diseaseStatistic.reduce((accumulator, currentValue) => {
        // Check if the 'category' field matches the value to count
        if (currentValue.gender === 'F') {
          return accumulator + 1; // Increment the accumulator
        } else {
          return accumulator; // No change if the category doesn't match
        }
    }, 0);
    const uniqueEthnicity = _.uniqBy(props.diseaseStatistic, 'ethnicity').map((item) => item.ethnicity);
    const uniqueMarital_status = _.uniqBy(props.diseaseStatistic, 'marital_status').map((item) => item.marital_status);
    const uniqueReligion = _.uniqBy(props.diseaseStatistic, 'religion').map((item) => item.religion);
    const labels = {
        gender: ['M', 'F'],
        ethnicity: uniqueEthnicity,
        marital_status: uniqueMarital_status,
        religion: uniqueReligion
    };
    const datas = {
        gender: [male, female],
        ethnicity: uniqueEthnicity.map((item) => props.diseaseStatistic.reduce((accumulator, currentValue) => {
            if (currentValue.ethnicity === item) {
              return accumulator + 1; // Increment the accumulator
            } else {
              return accumulator; // No change if the category doesn't match
            }
        }, 0)),
        marital_status: uniqueMarital_status.map((item) => props.diseaseStatistic.reduce((accumulator, currentValue) => {
            if (currentValue.marital_status === item) {
              return accumulator + 1; // Increment the accumulator
            } else {
              return accumulator; // No change if the category doesn't match
            }
        }, 0)),
        religion: uniqueReligion.map((item) => props.diseaseStatistic.reduce((accumulator, currentValue) => {
            if (currentValue.religion === item) {
              return accumulator + 1; // Increment the accumulator
            } else {
              return accumulator; // No change if the category doesn't match
            }
        }, 0))
    };
    
    const [label, setLabel]=useState('gender');

    const backgroundColor = [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)'
    ]
    const borderColor = [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)'
    ]
    const ageGroups = {}; // Object to hold age groups

    // Initialize age groups
    for (let i = 0; i < 100; i += 10) {
        const label = `${i}-${i + 9}`;
        ageGroups[label] = 0;
    }
    ageGroups['>100'] = 0;
    props.diseaseStatistic.forEach((person) => {
        if (person.yearold / 10 >= 10 ) {
            ageGroups['>100']++;
        }
        else if(person.yearold < 0){}
        else{
            const ageGroup = Math.floor(person.yearold / 10) * 10; // Calculate age group
            const label = `${ageGroup}-${ageGroup + 9}`;
            ageGroups[label]++; // Increment count for the age group
        }
    });
    const labelsAgeGroup = [];
    const valuesAgeGroup = [];
    for (const [ageGroup, count] of Object.entries(ageGroups)) {
        labelsAgeGroup.push(ageGroup);
        valuesAgeGroup.push(count);
    }
    const ColorLabel = [];
    for (const [colorname, value] of Object.entries(ColorScheme)) {
        ColorLabel.push(colorname);
    }
    console.log(ColorLabel);
    const [scheme, setScheme] = useState('Tableau10');
    const labels2 = {
        agegroup: labelsAgeGroup,
        gender: ['M', 'F'],
        ethnicity: uniqueEthnicity,
        marital_status: uniqueMarital_status,
        religion: uniqueReligion
    }
    const datas2 = {
        agegroup: valuesAgeGroup,
        gender: ['M','F'].map((item) => props.diseaseStatistic.filter((item) => {return item.yearold > 0}).reduce((accumulator, currentValue) => {
            if (currentValue.gender === item) {
              return accumulator + 1; // Increment the accumulator
            } else {
              return accumulator; // No change if the category doesn't match
            }
        }, 0)),
        ethnicity: uniqueEthnicity.map((item) => props.diseaseStatistic.filter((item) => {return item.yearold > 0}).reduce((accumulator, currentValue) => {
            if (currentValue.ethnicity === item) {
              return accumulator + 1; // Increment the accumulator
            } else {
              return accumulator; // No change if the category doesn't match
            }
        }, 0)),
        marital_status: uniqueMarital_status.map((item) => props.diseaseStatistic.filter((item) => {return item.yearold > 0}).reduce((accumulator, currentValue) => {
            if (currentValue.marital_status === item) {
              return accumulator + 1; // Increment the accumulator
            } else {
              return accumulator; // No change if the category doesn't match
            }
        }, 0)),
        religion: uniqueReligion.map((item) => props.diseaseStatistic.filter((item) => {return item.yearold > 0}).reduce((accumulator, currentValue) => {
            if (currentValue.religion === item) {
              return accumulator + 1; // Increment the accumulator
            } else {
              return accumulator; // No change if the category doesn't match
            }
        }, 0)) 
    }
    const [label2, setLabel2]=useState('agegroup');
    const [color, setColor] = useState('#5e72e4');
    const [decision, setDecision] = useState('All');
    const [decision2, setDecision2] = useState('All');
    const [changeChart, setChangeChart] = useState(1);
    let filterDataTable = [];
    let filterDataTable2 = [];

    if (decision === 'All') {
        filterDataTable = props.diseaseStatistic;
    }
    else {
        filterDataTable = props.diseaseStatistic.filter((item) => {return item[label] === decision})
    }

    if (decision2 === 'All'){
        filterDataTable2 = props.diseaseStatistic;
    }
    else {
        if (label2 === 'agegroup'){
            const [start, end] = decision2.split("-").map(Number);
            filterDataTable2 = props.diseaseStatistic.filter((item) => {return item.yearold > start && item.yearold < end})
        } else{
            filterDataTable2 = props.diseaseStatistic.filter((item) => {return item[label2] === decision2});
        }
    }
    // else if (changeChart === 1) {
    //     filterDataTable = props.diseaseStatistic.filter((item) => {return item[label] === decision})
    // }
    // else if (changeChart === 2) {
    //     if (label2 === 'agegroup'){
    //         const [start, end] = decision.split("-").map(Number);
    //         filterDataTable = props.diseaseStatistic.filter((item) => {return item.yearold > start && item.yearold < end})
    //     } else{
    //         filterDataTable = props.diseaseStatistic.filter((item) => {return item[label2] === decision});
    //     }
    // }
    return(
        <Grid gridTemplateRows={expandGeneral === 1 ? '3% 97%' :
                                expandGeneral === 2 ? '48.5% 3% 48.5%':
                                    '97% 3%'} h={'100%'} w={'100%'}>
            {expandGeneral === 1 ? null :
            <GridItem h={'100%'}>
                <Grid gridTemplateColumns={'50% 50%'} h={'100%'}>
                    <GridItem h={'100%'} position={'relative'}>
                        <Grid h={'100%'} gridTemplateRows={'20% 80%'}>
                            <GridItem h={'100%'}>
                                <HStack spacing={1} marginBottom={1} textAlign={'right'}>
                                    <Text fontSize={26} fontWeight={650} w={'max-content'} color={'#3E36B0'}>Rate of patient</Text>
                                    <Text paddingTop={2}>Scheme:</Text>
                                    <Select onChange={(e) => {setScheme(e.target.value)}} w={100} style={{
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
                                    <Flex align={'flex-end'}>
                                        <Select w={100} onChange={(e) => {setLabel(e.target.value)}}>
                                            <option defaultValue={true} value="gender">gender</option>
                                            <option value="ethnicity">ethnicity</option>
                                            <option value="marital_status">marital status</option>
                                            <option value="religion">religion</option>
                                        </Select>
                                    </Flex>

                                </HStack>
                            </GridItem>
                            <GridItem h={'90%'} overflow={'auto'} w={'100%'} position={'relative'} style={{
                                        scrollbarWidth: 'thin', 
                                        scrollbarColor: '#A0AEC0 #ffffff', 
                                    }}>
                                
                                <PieChart scheme={ColorScheme[scheme]} setDecision={setDecision} changeChart={changeChart} setChangeChart={setChangeChart} decision={decision} labels={labels[label]} data={datas[label]} backgroundColor={backgroundColor} borderColor={borderColor}/>
                            </GridItem>
                        </Grid>
                    </GridItem>
                    <GridItem h={'100%'} position={'relative'}>
                        <MyTable2
                                tablename={ 'Patients with ' + label + ': ' + decision }
                                data={filterDataTable.map(item => {
                                    const newItem = {};
                                    for (const [oldKey, newKey] of Object.entries(props.mapping)) {
                                        if (item.hasOwnProperty(oldKey)) {
                                        newItem[newKey] = item[oldKey];
                                        }
                                    }
                                    return newItem;
                                })} 
                                width={props.expand ? '1100px' : '550px'} height={expandGeneral === 2 ? '240px' : '590px'} onSelect={()=>{}}/>
                        {/* <Grid h={'100%'} gridTemplateRows={'20% 80%'}>
                            <GridItem>
                            <HStack textAlign={'left'} spacing={1}>
                                <Text fontSize={26} fontWeight={650} color={'#3E36B0'}>Statistics of Death</Text>
                                <Text paddingTop={2} fontWeight={600}>Color:</Text>
                                <InputColor
                                    // disabled={typeofchart === 'Table'? true : false}
                                    initialValue="#5e72e4"
                                    onChange={setColor}
                                    placement="right"
                                />
                                <Text paddingTop={2}>Statistic:</Text>
                                <Flex align={'flex-end'}>
                                    <Select w={120} onChange={(e) => {setLabel2(e.target.value)}}>
                                        <option defaultValue={true} value="agegroup">age group</option>
                                        <option value="ethnicity">ethnicity</option>
                                        <option value="gender">gender</option>
                                        <option value="marital_status">marital status</option>
                                        <option value="religion">religion</option>
                                    </Select>
                                </Flex>
                            </HStack>
                            </GridItem>
                            <GridItem h={'100%'} overflow={'auto'} w={'100%'} position={'relative'}>
                                <LineChart changeChart={changeChart} setChangeChart={setChangeChart} setDecision={setDecision} color={color} data={datas2[label2]} label={labels2[label2]} level={'default'}/>
                            </GridItem>
                        </Grid> */}
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
                                    isDisabled = {expandGeneral === 3 ? true: false}
                                    boxSize={'20px'}
                                    icon={<ChevronDownIcon/>}
                                    bg={'#3E36B0'}
                                    color={'white'}
                                    onClick={expandGeneral === 2 ? ()=>{setExpandGeneral(expandGeneral + 1)} : ()=>{setExpandGeneral(expandGeneral + 1)}}
                                />
                                <IconButton
                                    marginLeft={2}
                                    isDisabled = {expandGeneral === 1 ? true: false}
                                    boxSize={'20px'}
                                    icon={<ChevronUpIcon/>}
                                    bg={'#3E36B0'}
                                    color={'white'}
                                    onClick={expandGeneral === 3 ? ()=>{setExpandGeneral(expandGeneral - 1)} : ()=>{setExpandGeneral(expandGeneral - 1)}}
                                />
                            </Center>
                        </Box>
                    </AbsoluteCenter>
                </Center>
            </GridItem>
            {expandGeneral === 3 ? null :
            <GridItem h={'100%'} position={'relative'}>
                <Grid gridTemplateColumns={'50% 50%'} h={'100%'}>
                    <GridItem h={'100%'} position={'relative'}>
                        <Grid h={'100%'} gridTemplateRows={'20% 80%'}>
                            <GridItem>
                            <HStack textAlign={'left'} spacing={1}>
                                <Text fontSize={26} fontWeight={650} color={'#3E36B0'}>Statistics of Death</Text>
                                <Text paddingTop={2} fontWeight={600}>Color:</Text>
                                <InputColor
                                    // disabled={typeofchart === 'Table'? true : false}
                                    initialValue="#5e72e4"
                                    onChange={setColor}
                                    placement="right"
                                />
                                <Text paddingTop={2}>Statistic:</Text>
                                <Flex align={'flex-end'}>
                                    <Select w={120} onChange={(e) => {setLabel2(e.target.value)}}>
                                        <option defaultValue={true} value="agegroup">age group</option>
                                        <option value="ethnicity">ethnicity</option>
                                        <option value="gender">gender</option>
                                        <option value="marital_status">marital status</option>
                                        <option value="religion">religion</option>
                                    </Select>
                                </Flex>
                            </HStack>
                            </GridItem>
                            <GridItem h={'100%'} overflow={'auto'} w={'100%'} position={'relative'}>
                                <LineChart changeChart={changeChart} setChangeChart={setChangeChart} setDecision={setDecision2} color={color} data={datas2[label2]} label={labels2[label2]} level={'default'}/>
                            </GridItem>
                        </Grid>
                    </GridItem>
                    <GridItem h={'100%'} position={'relative'}>
                        <MyTable2
                                    tablename={'Died patients with ' + label2 + ': ' + decision2}
                                    data={filterDataTable2.map(item => {
                                        const newItem = {};
                                        for (const [oldKey, newKey] of Object.entries(props.mapping)) {
                                            if (item.hasOwnProperty(oldKey)) {
                                            newItem[newKey] = item[oldKey];
                                            }
                                        }
                                        return newItem;
                                    })} 
                                    width={props.expand ? '1100px' : '550px'} height={expandGeneral === 2 ? '240px' : '590px'} onSelect={()=>{}}/>
                    </GridItem>
                </Grid>
            </GridItem>
            }
        </Grid>
    )
}

export default GeneralTab;