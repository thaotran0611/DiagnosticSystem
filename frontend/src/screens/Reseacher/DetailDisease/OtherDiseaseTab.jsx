import { AbsoluteCenter, Box, Center, Divider, Grid, GridItem, IconButton } from "@chakra-ui/react";
import React, { useState } from "react";
import { PieChart } from "../../../components/Chart/PieChart";
import MyTable2 from "../../../components/MyTable/MyTable2";
import { AreaChart } from "../../../components/Chart/AreaChart";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";

const OtherDiseaseTab = (props) => {
    const [expandOtherDiseases, setExpandOtherDiseases] = useState(2);
    return(
        <Grid gridTemplateRows={expandOtherDiseases === 1 ? '3% 97%' :
                                expandOtherDiseases === 2 ? '48.5% 3% 48.5%':
                                                            '97% 3%'} h={'100%'}>
            {expandOtherDiseases === 1 ? null :
                <GridItem h={'100%'} position={'relative'}>
                    <Grid gridTemplateColumns={'50% 50%'} h={'100%'} position={'relative'}>
                        <GridItem h={'100%'} position={'relative'} overflow={'auto'}>
                            <Box h={'92%'} overflow={'auto'} position={'relative'}>
                                <PieChart />
                            </Box>
                        </GridItem>
                        <GridItem h={'100%'}>
                            <MyTable2 height={expandOtherDiseases === 2 ? '300px' : '600px'}/>
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
                <GridItem h={'100%'} position={'relative'}>
                    <Grid gridTemplateColumns={'50% 50%'} h={'100%'}>
                        <GridItem h={'100%'} position={'relative'} overflow={'auto'}>
                            <AreaChart/>
                        </GridItem>
                        <GridItem h={'100%'}>
                            <MyTable2 height={expandOtherDiseases === 2 ? '300px' : '600px'}/>
                        </GridItem>
                    </Grid>
                </GridItem>
            }
        </Grid>
    )
}

export default OtherDiseaseTab;