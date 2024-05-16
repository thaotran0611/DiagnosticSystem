import React from "react";
import {
    Tag,
    TagLabel,
    TagLeftIcon,
    TagRightIcon,
    TagCloseButton,
    Text,
    PopoverTrigger,
  } from '@chakra-ui/react'
import { HStack } from "@chakra-ui/react";

const FilterTag = (props) => {
    return(
        <div>
            {/* <HStack spacing={4}> */}
                <Text w={'max-content'} fontSize={'14px'}  cursor={'pointer'}>{props.name}</Text>
                <Tag
                size={'md'}
                key={props.key}
                borderRadius='full'
                variant='solid'
                colorScheme='gray'
                _disabled={props.disabled}
                onClick={props.onClickTag}
                cursor={'pointer'}
                w={'max-content'}
                >
                <PopoverTrigger>
                    <TagLabel>{props.text}</TagLabel>
                </PopoverTrigger>

                    <TagCloseButton onClick={props.onClick} />
                </Tag>
            {/* </HStack> */}
        </div>
    )
}

export default FilterTag;