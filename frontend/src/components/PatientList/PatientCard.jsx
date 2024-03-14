import React from "react";
import CircleComponent from '../CircleComponent/CircleComponent' 
import TypeCard from './TypeCard'
import { Card, CardBody, Box, StackDivider, Stack, Heading, Text, Spacer , Flex } from '@chakra-ui/react'; 
 
export default function PatientCard({patientList}){
    const gender = 'M' 
    return (
        patientList.map(patient => (
            <Card key={patient.SubjectID} _hover={{ bg: 'rgba(217, 217, 217, 0.3)' , borderRadius: "20px"}}> 
            <CardBody border="1px solid rgba(17, 17, 17, 0.3)" borderRadius="20px" p="2" m='1'> 
                <Stack divider={<StackDivider />} spacing="2"> 
                    <Flex> 
                        <CircleComponent gender = {patient.Gender[0]} /> 
                        <Flex ml = {2} direction="column"> 
                            <Text margin={0} fontWeight="bold" >{patient.Name} </Text> 
                            <Text margin={0}>{patient.AdmitTime}</Text> 
                        </Flex>
                        <Spacer />
                        <TypeCard type={patient.Type}/>
                    </Flex> 
                    
                </Stack> 
            </CardBody> 
            </Card> 
            )
        )
    )
};
