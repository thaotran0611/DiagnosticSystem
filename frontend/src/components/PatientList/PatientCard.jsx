import React from "react";
import CircleComponent from '../CircleComponent/CircleComponent' 
import TypeCard from './TypeCard'
import { Card, CardBody, Box, StackDivider, Stack, Heading, Text, Spacer , Flex } from '@chakra-ui/react'; 
 
export default function PatientCard({patientList, onClick, selectedCardId, handleCardClickhighlight}){
    const handleCardClick = (patient) => {
        onClick(patient);
    };

    return (
        patientList.map(patient => (
            <Card key={patient.subject_id} _hover={{ bg: 'rgba(217, 217, 217, 0.3)' , borderRadius: "20px"}} borderRadius='20px' onClick={() => {handleCardClick(patient); handleCardClickhighlight(patient.subject_id)}} bg={selectedCardId === patient.subject_id ? 'rgba(217, 217, 217, 0.3)' : 'inherit'}> 
            <CardBody border="1px solid rgba(17, 17, 17, 0.3)" borderRadius="20px" p="2" m='1'> 
                <Stack divider={<StackDivider />} spacing="2"> 
                    <Flex> 
                        <CircleComponent gender = {patient.gender[0]} /> 
                        <Flex ml = {2} direction="column"> 
                            <Text margin={0} fontWeight="bold" > {patient.subject_id} - {patient.name} </Text> 
                            <Text margin={0}>{patient.dob}</Text> 
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
