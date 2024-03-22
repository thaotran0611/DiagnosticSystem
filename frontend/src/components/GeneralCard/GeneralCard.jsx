import { Card, CardBody, CardHeader, Text } from "@chakra-ui/react";
import React from "react";

const GeneralCard = (props) => {
    return(
        <Card height={140} bg={'rgba(166,222,247,0.3)'} borderRadius={20} padding={4}>
            <CardHeader paddingBottom={0}>
                <Text fontSize={20} fontWeight={'bold'}>{props.heading}</Text>
            </CardHeader>
            <CardBody paddingBottom={0}>
                <Text color={'#F19121'} fontSize={25} fontWeight={'medium'}>{props.content}</Text>
            </CardBody>
        </Card>
    )
};

export default GeneralCard;