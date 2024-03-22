import { Box, Grid, GridItem } from "@chakra-ui/react";
import React from "react";
import MyTable2 from "../../../components/MyTable/MyTable2";

const DiseasesTab = () => {
    return(
        <Box h={'100%'}>
            <MyTable2 editable={true} height={'680px'}/>
        </Box>
    )
}

export default DiseasesTab;