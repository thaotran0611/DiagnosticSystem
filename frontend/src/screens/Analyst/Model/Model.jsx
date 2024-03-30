import React, { useState } from "react";
import SearchAndFilterBar from "../../../components/SearchAndFilterBar/SearchAndFilterBar";
import { Center, Slider, Divider, SimpleGrid, Icon, Text, Select, Stack, Button, AbsoluteCenter, HStack  } from "@chakra-ui/react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
  } from '@chakra-ui/react'
import { ThemeProvider, createTheme } from "@mui/material";
import MyPagination from "../../../components/Pagination/Pagination";
import PatientGridCard from "../../../components/PatientGridCard/PatientGridCard";
import { ResearcherLayout } from "../../../layout/ResearcherLayout";
import { Grid, GridItem } from '@chakra-ui/react'
import { useNavigate } from "react-router-dom";
import DiseaseTag from "../../../components/DiseaseTag/DiseaseTag";
import { AnalystLayout } from "../../../layout/AnalystLayout";
import MyTable2 from "../../../components/MyTable/MyTable2";
import { AreaChart } from "../../../components/Chart/AreaChart";

const theme = createTheme();

const Model = () => {
    const navigate = useNavigate();

    return(
        <AnalystLayout path={
          <Breadcrumb>
              <BreadcrumbItem isCurrentPage>
                  <BreadcrumbLink href='#'>Model</BreadcrumbLink>
              </BreadcrumbItem>
          </Breadcrumb>
        }
        disease={false}>
            <GridItem bg={'#fff'} area={'main'} borderRadius={'0 0 40px 40px'}>
                <Center padding={'1% 4%'}>
                    <SearchAndFilterBar/>
                </Center>
                    <Divider size={{height: '3px'}} color={'#3E36B0'} orientation='horizontal'/>
                    <Grid gridTemplateColumns={'50% 50%'} h={'73%'} position={'relative'} bg={'#F7F5F8'} borderRadius={'0 0 40px 40px '}>
                        <GridItem position={'relative'}>
                            <Grid gridTemplateRows={'45% 55%'} h={'100%'}>
                                <GridItem bg={'#fff'} m={2} borderRadius={'20px'}>
                                    <Grid gridTemplateRows={'15% 55% 30%'} h={'100%'}>
                                        <GridItem>
                                            <Center>
                                                <Text color={'#3E36B0'} fontSize={'24px'} fontWeight={'700'}>Set time to train model</Text>
                                            </Center>
                                        </GridItem>
                                        <GridItem position={'relative'} p={2}>
                                            <Grid gridTemplateRows={'50% 50%'} h={'100%'}>
                                                <GridItem>
                                                    <Grid gridTemplateColumns={'20% 80%'}>
                                                        <GridItem>
                                                            <Center>
                                                                <Text color={'#111'} fontSize={'20px'} fontWeight={'500'}>Start time</Text>
                                                            </Center>
                                                        </GridItem>
                                                        <GridItem>
                                                            <Select placeholder='Select option'>
                                                                <option value='option1'>Option 1</option>
                                                                <option value='option2'>Option 2</option>
                                                                <option value='option3'>Option 3</option>
                                                            </Select>
                                                        </GridItem>
                                                    </Grid>
                                                </GridItem>
                                                <GridItem>
                                                    <Grid gridTemplateColumns={'20% 80%'}>
                                                        <GridItem>
                                                            <Center>
                                                                <Text color={'#111'} fontSize={'20px'} fontWeight={'500'}>Duration</Text>
                                                            </Center>
                                                        </GridItem>
                                                        <GridItem>
                                                            <Select placeholder='Select option'>
                                                                <option value='option1'>Option 1</option>
                                                                <option value='option2'>Option 2</option>
                                                                <option value='option3'>Option 3</option>
                                                            </Select>
                                                        </GridItem>
                                                    </Grid>
                                                </GridItem>
                                            </Grid>
                                        </GridItem>
                                        <GridItem p={2}>
                                            <HStack float={'right'}>
                                                <Button colorScheme='teal' size='md'>Load Immediately</Button>
                                                <Button w={'200px'} colorScheme='teal' size='md'>Set</Button>
                                            </HStack>
                                        </GridItem>
                                    </Grid>
                                </GridItem>
                                <GridItem bg={'#fff'} m={2} borderRadius={'20px'}>
                                    <Grid gridTemplateRows={'10% 90%'} h={'100%'}>
                                        <GridItem>
                                            <Center>
                                                <Text color={'#3E36B0'} fontSize={'24px'} fontWeight={'700'}>Accuracy of model</Text>
                                            </Center>
                                        </GridItem>
                                        <GridItem position={'relative'} p={2}>
                                            <AreaChart/>
                                        </GridItem>
                                    </Grid>
                                </GridItem>
                            </Grid>
                        </GridItem>

                        <GridItem position={'relative'}>
                            <Grid gridTemplateRows={'35% 65%'} h={'100%'}>
                                <GridItem bg={'#fff'} m={2} borderRadius={'20px'}>
                                    <Grid gridTemplateRows={'25% 50% 25%'} gap={4}>
                                        <GridItem>
                                            <Center>
                                                <Text color={'#3E36B0'} fontSize={'24px'} fontWeight={'700'}>Set location</Text>
                                            </Center>
                                        </GridItem>
                                        <GridItem position={'relative'} p={2}>
                                            <Grid h={'100%'} gridTemplateColumns={'20% 80%'}>
                                                <GridItem>
                                                    <Center>
                                                        <Text color={'#111'} fontSize={'18px'} fontWeight={'500'}>Location</Text>
                                                    </Center>
                                                </GridItem>
                                                <GridItem>
                                                    <Select placeholder='Select option'>
                                                        <option value='option1'>Option 1</option>
                                                        <option value='option2'>Option 2</option>
                                                        <option value='option3'>Option 3</option>
                                                    </Select>
                                                </GridItem>
                                            </Grid>
                                            <GridItem position={'relative'} float={'right'}>
                                                <Button w={'200px'} colorScheme='teal' size='md'>Save</Button>
                                            </GridItem>
                                        </GridItem>
                                    </Grid>
                                </GridItem>
                                <GridItem bg={'#fff'} m={2} borderRadius={'20px'}>
                                    <Grid templateRows={'10% 90%'} h={'100%'}>
                                        <GridItem>
                                            <Center>
                                                <Text color={'#3E36B0'} fontSize={'24px'} fontWeight={'700'}>History of model</Text>
                                            </Center>   
                                        </GridItem>
                                        <GridItem p={2}>
                                            <MyTable2 height={'280px'}/>
                                        </GridItem>
                                    </Grid>
                                </GridItem>
                            </Grid>
                        </GridItem>
                    </Grid>
                    {/* <ThemeProvider theme={theme}>
                        <Center>
                            <SimpleGrid mt={0} columns={4} spacing={10}>
                                {
                                    slicedData.map(item => (
                                        <DiseaseTag data={item}/>
                                    ))
                                }
                            </SimpleGrid>
                        </Center>
                        <Center>
                            <MyPagination 
                                count={Math.ceil(data.length / pageSize)} 
                                page = {page} 
                                onChange = {handleChangePage}/>
                        </Center>
                    </ThemeProvider> */}
            </GridItem>
        </AnalystLayout>
    )
};

export default Model;