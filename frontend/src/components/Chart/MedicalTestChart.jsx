import { Grid, GridItem, HStack, Select, Text, Box } from "@chakra-ui/react"
import React, { useState } from "react"
import InputColor from "react-input-color"
import { LineChart } from "./LineChart"
import BarChart from "./BarChart"
import MyTable2 from "../MyTable/MyTable2"
import _ from "lodash";
import { SmallCloseIcon } from "@chakra-ui/icons"
const MedicalTestChart = (props) => {
    const [typeofchart, setTypeofchart] = useState('LineChart');
    const Allcharts = ['LineChart', 'BarChart', 'Table'];
    const [color, setColor] = useState({});
    const [drillup, setDrillup] = useState('Default');
    const AllDrillup = ['Default', 'date', 'month', 'year'];
    const [typeoftestmanytime,setTypeoftestmanytime] = useState(props.hadmID === 'All Admission' && props.typeofmedicaltestmanytime.length > 0 ? props.typeofmedicaltestmanytime[0].label : props.typeofmedicaltestmanytime.filter((item) => {
        const itemValue = String(item.hadm_id);
        return itemValue.includes(props.hadmID)
    }).length > 0 ? props.typeofmedicaltestmanytime.filter((item) => {
        const itemValue = String(item.hadm_id);
        return itemValue.includes(props.hadmID)
    })[0].label : "");
    let medicaltestmanytimefilter = props.hadmID === 'All Admission' ? props.medicaltestmanytime.filter((item) => {
        const itemValue = String(item.label);
        return itemValue === typeoftestmanytime;
    }) : props.medicaltestmanytime.filter((item) => {
        const itemValue = String(item.hadm_id);
        return itemValue.includes(props.hadmID);
    }).filter((item) => {
        const itemValue = String(item.label);
        return itemValue === typeoftestmanytime;
    })
    return (
        <div style={{height: '90%', position: 'relative'}}>
            <Grid
                h='40px'
                templateColumns='repeat(12, 1fr)'
                gap={4}
                >
                <GridItem colStart={1} colSpan={4}>
                    <HStack>
                    <Text paddingTop={1} color={'#3E36B0'} fontSize={'16px'} fontWeight={600}>{typeoftestmanytime + " " + (medicaltestmanytimefilter.length > 0 ? medicaltestmanytimefilter[0].valueuom !== null ? " (" + medicaltestmanytimefilter[0].valueuom + ")" : "" : "")}</Text>
                    <SmallCloseIcon onClick={props.onClose} cursor={'pointer'}/>
                    </HStack>
                </GridItem>
                <GridItem colStart={5} colSpan={1} paddingTop={1}>
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
                    
                        <Select  onChange={(e) => {setTypeoftestmanytime(e.target.value)}} fontWeight={600} color={'#3E36B0'} variant={'outline'} defaultValue={props.hadmID === 'All Admission' && props.typeofmedicaltestmanytime.length > 0 ? props.typeofmedicaltestmanytime[0].label : props.typeofmedicaltestmanytime.filter((item) => {
                                    const itemValue = String(item.hadm_id);
                                    return itemValue.includes(props.hadmID)
                                }).length > 0 ? props.typeofmedicaltestmanytime.filter((item) => {
                                    const itemValue = String(item.hadm_id);
                                    return itemValue.includes(props.hadmID)
                                })[0].label : ""}>
                            {
                                props.hadmID === 'All Admission' ?
                                _.uniqBy(props.typeofmedicaltestmanytime, "label").map(item => (
                                    <option selected={item.label === typeoftestmanytime ? true : false} value={item.label}>{item.label}</option>
                                )) :
                                _.uniqBy(props.typeofmedicaltestmanytime.filter((item) => {
                                    const itemValue = String(item.hadm_id);
                                    return itemValue.includes(props.hadmID)
                                }), "label").map(item => (
                                    <option selected={item.label === typeoftestmanytime ? true : false} value={item.label}>{item.label}</option>
                                ))
                            }
                        </Select>
                        {/* <Text paddingTop={1} fontWeight={600}>{medicaltestmanytimefilter[0].valueuom}</Text> */}
                    </HStack>
                </GridItem>
            </Grid>
            <Box h={'90%'} position={'relative'}>
                {typeofchart === 'LineChart' ? 
                    <LineChart level={drillup} color={color} dataset={typeoftestmanytime + " " + (medicaltestmanytimefilter.length > 0 ? medicaltestmanytimefilter[0].valueuom !== null ? " (" + medicaltestmanytimefilter[0].valueuom + ")" : "" : "")} label={medicaltestmanytimefilter.map(item => item.charttime)} data={medicaltestmanytimefilter.map(item => item.value)}/> 
                : typeofchart === 'BarChart' ?
                    <BarChart level={drillup} color={color} dataset={typeoftestmanytime + " " + (medicaltestmanytimefilter.length > 0 ? medicaltestmanytimefilter[0].valueuom !== null ? " (" + medicaltestmanytimefilter[0].valueuom + ")" : "" : "")} label={medicaltestmanytimefilter.map(item => item.charttime)} data={medicaltestmanytimefilter.map(item => item.value)}/>
                :
                    <MyTable2 data={medicaltestmanytimefilter} height={props.expandMedicalTest === 1 ? '560px' : '260px'}
                    width={props.expand ? '1700px' : '1100px'} onSelect={()=>{}}/>
                }
            </Box>
        </div>
    )
}

export default MedicalTestChart;