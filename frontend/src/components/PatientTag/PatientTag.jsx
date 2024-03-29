import { Card, CardHeader, Flex, Avatar, Box, Heading, IconButton, Text, BsThreeDotsVertical, AbsoluteCenter, Center, CardBody, SimpleGrid, Divider } from "@chakra-ui/react";
import React from "react";
import MoreVertIcon from '@mui/icons-material/MoreVert';

const PatientTag = (props) => { 
    const halfIndex = Math.ceil(props.data.length / 2);
    return(
        <Card width={'98%'} shadow={'none'} height={'100%'} borderRadius={'20px'}>
            <CardHeader>
                <AbsoluteCenter top={0}>
                    <Box bg={'#fff'} borderRadius={'50%'} width={'100px'} height={'100px'}>
                        <AbsoluteCenter>
                            <Box borderRadius={'50%'} width={'90px'} height={'90px'} border={'1px solid #A6DEF7'}>
                                <AbsoluteCenter>
                                    <Box borderRadius={'50%'} width={'80px'} height={'80px'} bg={'rgba(166,222,247,0.4)'}>
                                        <AbsoluteCenter bottom={-5}>
                                            <Text color={'#A6DEF7'} fontWeight={'medium'} fontSize={'40px'}>10</Text>
                                        </AbsoluteCenter>
                                    </Box>
                                </AbsoluteCenter>
                            </Box>
                        </AbsoluteCenter>
                    </Box>
                </AbsoluteCenter>
                <Center marginTop={8}>
                    <Text fontWeight={'500'} fontSize={'22px'}>{props.name} -</Text>
                    <Text color={'#F62020'} marginLeft={2} fontWeight={'500'} fontSize={'22px'}>{props.id}</Text>
                </Center>
            </CardHeader>
            <CardBody>
                <SimpleGrid columns={3} spacing={2} gridTemplateColumns={'48% 4% 48%'}>
                    <SimpleGrid columns={2} spacing={1}>
                        {props.data ? props.data.slice(0, halfIndex).map((item, index) => ( 
                        <React.Fragment key={index}> 
                            <Text fontWeight="bold">{item.key}:</Text> 
                            <Text>{item.value}</Text> 
                        </React.Fragment> 
                        )): null} 
                    </SimpleGrid>
                    <Center position={'relative'} height={'100%'}>
                        <Divider style={{height: '100%', width: '1px'}} orientation="vertical"/>
                    </Center>
                    <SimpleGrid columns={2} spacing={1}> 
                        {props.data ? props.data.slice(halfIndex).map((item, index) => ( 
                        <React.Fragment key={index}> 
                            <Text fontWeight="bold">{item.key}:</Text> 
                            <Text>{item.value}</Text> 
                        </React.Fragment> 
                    )): null} 
                </SimpleGrid> 
                </SimpleGrid>
            </CardBody>
        </Card>
    )
}

export default PatientTag;