import React from "react";
import { Card, CardHeader, CardBody, CardFooter, Button, Heading, Image, Stack, Text, HStack, Box, Icon, Center, AbsoluteCenter } from '@chakra-ui/react'
import { BellIcon } from "@chakra-ui/icons";
import DiseaseCard from "../DiseaseCard/DiseaseCard";
import { GiMedicines } from "react-icons/gi";
const DiseaseTag = ({data, medicine}) => {
    return(
        <Card
            direction={{ base: 'column', sm: 'row' }}
            overflow='hidden'
            variant='outline'
            borderRadius={20}
            border={'1px solid #A6DEF7'}
            >
            <HStack>
                <CardHeader w={'max-content'} p={1}>
                    <Box borderRadius={'50%'} boxSize={16} border={'1px solid #A6DEF7'}position={'relative'}> 
                        <AbsoluteCenter>
                            <Box borderRadius={'50%'} bg={'rgba(166,222,247,0.4)'} boxSize={14} position={'relative'}>
                                <AbsoluteCenter>
                                    {medicine ? 
                                        <Box w={10} overflow="hidden">
                                            <Box>
                                                <Icon boxSize={10} as={GiMedicines}/>
                                            </Box>
                                      </Box> :
                                        <DiseaseCard hidden={true} text={data.type}/>
                                    }
                                </AbsoluteCenter>
                            </Box>
                        </AbsoluteCenter>
                    </Box>
                </CardHeader>
                
                <CardBody p={1}>
                
                <Text fontSize={'24px'} fontWeight={'600'}>{data.name}</Text>

                <Text py='2' color={'rgba(0,0,0,0.3)'} fontWeight={'500'}>
                    {data.quantity} patients
                </Text>
                </CardBody>

                <CardFooter>
                <Text color={'#F62020'}>{data.percent}</Text>
                </CardFooter>
            </HStack>
        </Card>
    );
}

export default DiseaseTag;