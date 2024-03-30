import { Grid, GridItem, Heading, Text } from "@chakra-ui/react";
import React from "react";
import { AreaChart } from "../../../components/Chart/AreaChart";
import { LineChart } from "../../../components/Chart/LineChart";

const GeneralTab = ({expand}) => {
    return(
        <Grid gridTemplateRows={'50% 50%'} h={'100%'} w={'100%'}>
            <GridItem h={'100%'}>
                <Grid gridTemplateColumns={'50% 50%'} h={'100%'}>
                    <GridItem h={'100%'} position={'relative'}>
                        <Grid h={'100%'} gridTemplateRows={'20% 80%'}>
                            <GridItem>
                                <Text fontSize={26} fontWeight={650} color={'#3E36B0'}>Rate of age and gender</Text>
                            </GridItem>
                            <GridItem h={'100%'} overflow={'auto'} w={'100%'} position={'relative'}>
                                <AreaChart/>
                            </GridItem>
                        </Grid>
                    </GridItem>
                    <GridItem h={'100%'} position={'relative'}>
                        <Grid h={'100%'} gridTemplateRows={'20% 80%'}>
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
            <GridItem h={'100%'} position={'relative'}>
                <Grid h={'100%'} gridTemplateRows={'20% 80%'}>
                    <GridItem>
                        <Text fontSize={26} fontWeight={650} color={'#3E36B0'}>Number of patients</Text>
                    </GridItem>
                    <GridItem h={'100%'} overflow={'auto'} w={'100%'} position={'relative'}>
                        <LineChart/>
                    </GridItem>
                </Grid>
            </GridItem>
        </Grid>
    )
}

export default GeneralTab;