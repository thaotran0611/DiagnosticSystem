import { Box, Grid, GridItem } from "@chakra-ui/react";
import React from "react";
import MyTable2 from "../../../components/MyTable/MyTable2";

const PrescriptionTab = () => {
    return(
        <Box h={'100%'}>
            <MyTable2 height={'680px'}/>
        </Box>
    )
}

export default PrescriptionTab;