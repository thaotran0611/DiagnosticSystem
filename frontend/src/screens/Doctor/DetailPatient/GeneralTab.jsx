import React, { useState } from "react";
import { AbsoluteCenter, Box, Divider, Grid, GridItem, IconButton, ScaleFade, SimpleGrid } from "@chakra-ui/react";
import { Center } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { BellIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon } from "@chakra-ui/icons";
import MyPagination from "../../../components/Pagination/Pagination";
import { Pagination, ThemeProvider, createTheme } from "@mui/material";
import GeneralCard from "../../../components/GeneralCard/GeneralCard";
import MyTable from "../../../components/MyTable/MyTable";
import MyTable2 from "../../../components/MyTable/MyTable2";

const theme = createTheme();
const GeneralTab = ({addmission,generalTag, expand, pageSize, setPageSize, hadmID, sethadmID}) => {
    const [expandGeneral, setExpandGenaral] = useState(2);
    // const [pageSize, setPageSize] = useState(4);
    const [page, setPage] = useState(1);
    const handleChangePage = (event, newpage) => {
        setPage(newpage);
    };
    console.log(addmission)

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const slicedData = generalTag.slice(startIndex, endIndex);
    const handleRecordSelection = (record) => {
        sethadmID(record.hadm_id);
        console.log(hadmID)
    }
    return(
        <Grid gridTemplateRows={expandGeneral === 1 ? '3% 97%':
                                expandGeneral === 2 ? '25% 3% 72%':
                                                        '97% 3%'}
                h='100%'>
            {expandGeneral === 1 ? null : 
            <GridItem position={'relative'}>
                <ThemeProvider theme={theme}>
                    <SimpleGrid h={'80%'} columns={expand ? 6 : 4} spacing={8} autoRows={false}>
                        {
                            slicedData.map(infor => (
                                <GeneralCard heading = {infor.heading} content={infor.content}/>
                            ))
                        }
                    </SimpleGrid>
                
                    <Center>
                        <MyPagination
                            count={Math.ceil(generalTag.length / pageSize)}
                            page={page}
                            onChange={handleChangePage}
                        />
                    </Center>
                </ThemeProvider>
            </GridItem>}

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
                                    onClick={expandGeneral === 2 ? ()=>{setExpandGenaral(expandGeneral + 1); setPageSize(pageSize*3)}: ()=>{setExpandGenaral(expandGeneral + 1)}}
                                />
                                <IconButton
                                    marginLeft={2}
                                    isDisabled = {expandGeneral === 1 ? true: false}
                                    boxSize={'20px'}
                                    icon={<ChevronUpIcon/>}
                                    bg={'#3E36B0'}
                                    color={'white'}
                                    onClick={expandGeneral === 3 ? ()=>{setExpandGenaral(expandGeneral - 1); setPageSize(pageSize/3)}: ()=>{setExpandGenaral(expandGeneral - 1)}}
                                />
                            </Center>
                        </Box>
                    </AbsoluteCenter>
                </Center>
            </GridItem>
            {expandGeneral === 3 ? null : <GridItem position={'relative'} paddingTop={'8'}>
                <Box h={'100%'}>
                    <MyTable2 data = {addmission} height={expandGeneral === 1 ? '620px': '400px'} width={expand ? '1700px' : '1100px'}
                    onSelect={handleRecordSelection}/>
                </Box>
                </GridItem>}
        </Grid>
    )
}

export default GeneralTab;