import React from "react";
import { Card, CardHeader, CardBody, CardFooter, Button, Heading, Image, Stack, Text, HStack, Box, Icon, Center, AbsoluteCenter, Flex } from '@chakra-ui/react'
import { BellIcon } from "@chakra-ui/icons";
import DiseaseCard from "../DiseaseCard/DiseaseCard";
import { GiMedicines } from "react-icons/gi";
const DiseaseTag = ({data, medicine, sum_of_admission, onClick}) => {
    console.log(data)
    const handleClick = () => {
        onClick(data);
    };
    return(
        <Card
            onClick={handleClick}
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
                                    {
                                        medicine ? 
                                        <Box w={10} overflow="hidden">
                                            <Box>
                                                <Icon boxSize={10} as={GiMedicines}/>
                                            </Box>
                                        </Box> :
                                        <DiseaseCard hidden={true} text={data.disease_code}/>
                                    }
                                </AbsoluteCenter>
                            </Box>
                        </AbsoluteCenter>
                    </Box>
                </CardHeader>
                
                <CardBody p={1}>
                
                <Text fontSize={'24px'} fontWeight={'600'} w={'230px'}>{medicine ? data.drug_name_poe : data.disease_name}</Text>

                <Text py='2' color={'rgba(0,0,0,0.3)'} fontWeight={'500'}>
                    {data.sum_of_admission} admissions
                </Text>
                </CardBody>

                <CardFooter alignContent={'right'} justifyContent="flex-end">
                    <Text color={'#F62020'}>{medicine ? data.drug_type : ((((data.sum_of_male + data.sum_of_female)/sum_of_admission)*100).toFixed(2)).toString() + '%'} </Text>
                </CardFooter>
            </HStack>
        </Card>
    );
}

export default DiseaseTag;