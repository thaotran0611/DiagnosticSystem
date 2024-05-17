import { Grid, GridItem, HStack, Select, Text, Box, Switch } from "@chakra-ui/react"
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
    const [typeoftestmanytime,setTypeoftestmanytime] = useState(props.charttype);
    // useState(props.hadmID === 'All Admission' && props.typeofmedicaltestmanytime.length > 0 ? props.typeofmedicaltestmanytime[0].label : props.typeofmedicaltestmanytime.filter((item) => {
    //     const itemValue = String(item.hadm_id);
    //     return itemValue.includes(props.hadmID)
    // }).length > 0 ? props.typeofmedicaltestmanytime.filter((item) => {
    //     const itemValue = String(item.hadm_id);
    //     return itemValue.includes(props.hadmID);
    // })[0].label : "");
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

    const handleOnChange = (charttype) => {
        if (props.componentChart.findIndex(item => item.charttype === charttype)!==-1){
            props.scrollToDiv(props.componentChart.findIndex(item => item.charttype === charttype));
        }
        else {
            // props.addComponentChart(charttype);
            // props.deleteComponentChart(typeoftestmanytime);
            const updatedChart = props.componentChart.map(item => {
                // If the item's id matches the provided id, update its charttype
                console.log(item)
                if (item.charttype === typeoftestmanytime) {
                    console.log(item.charttype)
                    return { ...item, charttype: charttype };
                }
                // Otherwise, return the original item
                return item;
            });
            props.setComponentChart(updatedChart);
            setTypeoftestmanytime(charttype);
        }
    }
    
    return (
        <div style={{height: '90%', position: 'relative', width: '100%'}}>
            <Grid
                h='40px'
                templateColumns='repeat(12, 1fr)'
                gap={4}
                marginTop={2}
                >
                <GridItem colStart={1} colSpan={4}>
                    <HStack>
                        <Text paddingTop={0} color={'red'} fontSize={'20px'} fontWeight={600}>{typeoftestmanytime}</Text>
                        {/* <SmallCloseIcon onClick={props.onClose} cursor={'pointer'}/> */}
                        <Switch isChecked={true} onChange={props.onClose}/>
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
                        <Text w={'90px'} paddingTop={1} fontWeight={600}>Time:</Text>
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
                    
                        <Select  onChange={(e) => {handleOnChange(e.target.value)}} fontWeight={600} color={'#3E36B0'} variant={'outline'} defaultValue={ typeoftestmanytime
                            // props.hadmID === 'All Admission' && props.typeofmedicaltestmanytime.length > 0 ? props.typeofmedicaltestmanytime[0].label : props.typeofmedicaltestmanytime.filter((item) => {
                                //     const itemValue = String(item.hadm_id);
                                //     return itemValue.includes(props.hadmID)
                                // }).length > 0 ? props.typeofmedicaltestmanytime.filter((item) => {
                                //     const itemValue = String(item.hadm_id);
                                //     return itemValue.includes(props.hadmID)
                                // })[0].label : ""
                                }>
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
            <Box h={'90%'} position={'absolute'} w={'100%'}>
                {typeofchart === 'LineChart' ? 
                    <LineChart unitY = {medicaltestmanytimefilter.length > 0 ? medicaltestmanytimefilter[0].valueuom !== null ? " (" + medicaltestmanytimefilter[0].valueuom + ")" : "" : ""} level={drillup} color={color} dataset={typeoftestmanytime + " " + (medicaltestmanytimefilter.length > 0 ? medicaltestmanytimefilter[0].valueuom !== null ? " (" + medicaltestmanytimefilter[0].valueuom + ")" : "" : "")} label={medicaltestmanytimefilter.map(item => item.charttime)} data={medicaltestmanytimefilter.map(item => item.value)}/> 
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