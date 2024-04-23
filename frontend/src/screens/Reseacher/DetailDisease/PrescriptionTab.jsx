import { Box, Grid, GridItem } from "@chakra-ui/react";
import React from "react";
import MyTable2 from "../../../components/MyTable/MyTable2";

const PrescriptionTab = () => {
    return(
        <Box h={'98%'}>
            <MyTable2 tablename='Table of prescription' height={'630px'}/>
        </Box>
    )
}

export default PrescriptionTab;