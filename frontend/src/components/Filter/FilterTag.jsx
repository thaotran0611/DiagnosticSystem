import React from "react";
import {
    Tag,
    TagLabel,
    TagLeftIcon,
    TagRightIcon,
    TagCloseButton,
  } from '@chakra-ui/react'
import { HStack } from "@chakra-ui/react";

const FilterTag = (props) => {
    return(
        <div>
            {/* <HStack spacing={4}> */}
                <Tag
                size={'lg'}
                key={props.key}
                borderRadius='full'
                variant='solid'
                colorScheme='gray'
                _disabled={props.disabled}
                onClick={props.onClickTag}
                cursor={'pointer'}
                >
                    <TagLabel>{props.text}</TagLabel>
                    <TagCloseButton onClick={props.onClick} />
                </Tag>
            {/* </HStack> */}
        </div>
    )
}

export default FilterTag;