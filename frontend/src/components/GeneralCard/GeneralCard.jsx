import { Card, CardBody, CardFooter, CardHeader, Text } from "@chakra-ui/react";
import React from "react";

const GeneralCard = (props) => {
    return(
        <Card height={150} bg={'rgba(166,222,247,0.3)'} borderRadius={20} padding={4}>
            <CardHeader paddingBottom={0}>
                <Text fontSize={18} fontWeight={'bold'}>{props.heading}</Text>
            </CardHeader>
            <CardBody paddingBottom={0}>
                <Text color={'#F19121'} fontSize={18} fontWeight={'medium'}>{props.content}</Text>
            </CardBody>
            {props.footer ?
            <CardFooter>
                <Text color={'d9d9d9'} fontSize={14} fontWeight={'medium'}>{props.footer}</Text>
            </CardFooter> 
            : null }
        </Card>
    )
};

export default GeneralCard;