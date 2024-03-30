import { AbsoluteCenter, Box, Center, Divider, Grid, GridItem, Heading, IconButton, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { AreaChart } from "../../../components/Chart/AreaChart";
import { LineChart } from "../../../components/Chart/LineChart";
import MyTable2 from "../../../components/MyTable/MyTable2";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";

const GeneralTab = ({expand}) => {
    const [expandGeneral, setExpandGenaral] = useState(2);
    return(
        <Grid gridTemplateRows={expandGeneral === 1 ? '3% 97%':
                                expandGeneral === 2 ? '48.5% 3% 48.5%':
                                                        '97% 3%'} 
              h={'100%'}>
            {expandGeneral === 1 ? null : 
            <GridItem h={'100%'}>
                <Grid gridTemplateColumns={'50% 50%'} h={'100%'}>
                    <GridItem h={'100%'} position={'relative'}>
                        <Grid h={'100%'} gridTemplateRows={expandGeneral === 3 ? '10% 90%' : '20% 80%'}>
                            <GridItem>
                                <Text fontSize={26} fontWeight={650} color={'#3E36B0'}>Rate of age and gender</Text>
                            </GridItem>
                            <GridItem h={'100%'} overflow={'auto'} w={'100%'} position={'relative'}>
                                <AreaChart/>
                            </GridItem>
                        </Grid>
                    </GridItem>
                    <GridItem h={'100%'} position={'relative'}>
                        <Grid h={'100%'} gridTemplateRows={expandGeneral === 3 ? '10% 90%' :'20% 80%'}>
                            <GridItem>
                                <Text fontSize={26} fontWeight={650} color={'#3E36B0'}>Death rate</Text>
                            </GridItem>
                            <GridItem h={'100%'} overflow={'auto'} w={'100%'} position={'relative'}>
                                <AreaChart/>
                            </GridItem>
                        </Grid>
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
                <Grid h={'100%'} gridTemplateRows={ expandGeneral === 1 ?'10% 90%' : '20% 80%'}>
                    <GridItem>
                        <Text fontSize={26} fontWeight={650} color={'#3E36B0'}>Diseases</Text>
                    </GridItem>
                    <GridItem h={'100%'} overflow={'auto'} w={'100%'} position={'relative'}>
                        <Center>
                            <MyTable2 height={expandGeneral === 1? '540px':'210px'} width={expand ? '1700px' : '1000px'}/>
                        </Center>
                    </GridItem>
                </Grid>
            </GridItem>
            }
        </Grid>
    )
}

export default GeneralTab;