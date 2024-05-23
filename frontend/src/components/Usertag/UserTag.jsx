import React from "react";
//import user_img from "../../img/UserTag/user_img.png"
//import { Icon, Image } from "@chakra-ui/react";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { Image, Text, Stack, AbsoluteCenter, Center } from '@chakra-ui/react'
import avatar from '../../img/Avatar/img1.jpg'

const UserTag = (props) => {
    return (
    <Stack w={'260px'} paddingLeft={2}  spacing={1} direction='row' border='1px solid rgba(17,17,17,0.2)' borderRadius='10px' height={50}>
        <Center>
            <Image
                boxSize='45px'
                objectFit='cover'
                borderRadius={'50%'}
                src={avatar}
                alt='Avatar'
            />
        </Center>
            <Text paddingTop={1} w={'200px'}>{props.name}</Text>
        </Stack>
    )
    
}

export default UserTag