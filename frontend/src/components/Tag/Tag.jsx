import { AbsoluteCenter, Box, Card, CardBody, CardFooter, CardHeader, Flex, HStack, Icon, Image, Text } from "@chakra-ui/react";
import React from "react";
import AIlogo from '../../img/Analyst/AIlogo.png'


const Tag = ({selectedTag,setSelectedTag, data}) => {
    
    return(
        <Card
            onClick={() => {setSelectedTag(data.name.toLowerCase())}}
            direction={{ base: 'column', sm: 'row' }}
            overflow='hidden'
            variant='outline'
            borderRadius={20}
            border={'1px solid #A6DEF7'}
            bg={'rgba(166,222,247,0.4)'}
            boxShadow={selectedTag === data.name.toLowerCase() ? '0 0 10px rgba(0, 0, 0, 0.5)' : ''}
            _hover={{boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)', 
            cursor: 'pointer'}}
            >
            <HStack>
                <CardHeader w={'max-content'} p={1}>
                    <Box boxSize={16} position={'relative'}> 
                        <AbsoluteCenter boxSize={14}>
                            <Image objectFit='cover' boxSize={14} src={data.img}/>
                        </AbsoluteCenter>
                    </Box>
                </CardHeader>
                
                <CardBody p={1}>
                
                <Text fontSize={'24px'} fontWeight={'600'}>{data.name}</Text>

                <Text py='2' color={'rgba(0,0,0,0.3)'} fontWeight={'500'}>
                    {data.disease !== null && data.disease !== undefined ? data.disease : 
                    data.online !== null && data.online !== undefined ? data.online + ' / ' + data.total + ' online' : null}
                </Text>
                </CardBody>

                {/* <CardFooter>
                <Text color={'#F62020'}>{data.percent}</Text>
                </CardFooter> */}
            </HStack>
        </Card>
    )
};

export default Tag;