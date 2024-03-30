import { Center, Grid, GridItem } from "@chakra-ui/react";
import React from "react";
import { PieChart } from "../../../components/Chart/PieChart";
import MyTable2 from "../../../components/MyTable/MyTable2";
import { AreaChart } from "../../../components/Chart/AreaChart";

const OtherDiseaseTab = (props) => {
    return(
        <Grid gridTemplateRows={'50% 50%'} h={'100%'}>
            <GridItem h={'100%'} position={'relative'}>
                <Grid gridTemplateColumns={'50% 50%'} h={'100%'} position={'relative'}>
                    <GridItem h={'100%'} position={'relative'} overflow={'auto'}>
                        {/* <Center h={'100%'} overflow={'auto'} position={'relative'}> */}
                            <PieChart />
                        {/* </Center> */}
                    </GridItem>
                    <GridItem h={'100%'}>
                        <MyTable2 height='300px'/>
                    </GridItem>
                </Grid>
            </GridItem>
            <GridItem>
                <Grid gridTemplateColumns={'50% 50%'} h={'100%'}>
                    <GridItem h={'100%'} position={'relative'} overflow={'auto'}>
                        <AreaChart/>
                    </GridItem>
                    <GridItem h={'100%'}>
                        <MyTable2 height='300px'/>
                    </GridItem>
                </Grid>
            </GridItem>
        </Grid>
    )
}

export default OtherDiseaseTab;