import React from "react";
//import user_img from "../../img/UserTag/user_img.png"
//import { Icon, Image } from "@chakra-ui/react";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { Image, Text, Stack, AbsoluteCenter, Center } from '@chakra-ui/react'

const UserTag = (props) => {
    return (
    <Stack w={'260px'} paddingLeft={2}  spacing={1} direction='row' border='1px solid rgba(17,17,17,0.2)' borderRadius='10px' height={50}>
        <Center>
            <Image
                boxSize='45px'
                objectFit='cover'
                borderRadius={'50%'}
                src={'https://th.bing.com/th/id/R.b0e5ac38e53cd4e029b0baa7826c2bcc?rik=juzP%2fkPGjEKWcA&pid=ImgRaw&r=0'}
                // alt='Avatar'
            />
        </Center>
            <Text paddingTop={1} w={'250px'}>{props.name}</Text>
        </Stack>
    )
    
}

export default UserTag