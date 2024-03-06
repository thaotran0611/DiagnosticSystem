import { Button } from "@chakra-ui/react";
import React from "react";

const Submit_button = (props) => {
    return(
        <div>
            <Button width={'150px'} backgroundColor={'#3E36B0'} onClick={props.onClick} color={'#fff'}>{props.text}</Button>
        </div>
    )
};

export default Submit_button;