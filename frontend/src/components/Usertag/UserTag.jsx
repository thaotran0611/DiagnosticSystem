import React from "react";
//import user_img from "../../img/UserTag/user_img.png"
//import { Icon, Image } from "@chakra-ui/react";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { Image, Text, Stack } from '@chakra-ui/react'

const UserTag = (props) => {
    return (
    <Stack spacing={1} direction='row' border='1px solid rgba(17,17,17,0.2)' borderRadius='10px' height={50}>
        <Image
            boxSize='100px'
            objectFit='cover'
            src={'https://img.freepik.com/free-vector/hand-drawn-doc…gesture-character_40876-3115.jpg?size=626&ext=jpg'}
            // alt='Avatar'
        />
        <Text paddingTop={1} w={'200px'}>{props.name}</Text>
        </Stack>
    )
    
}

export default UserTag