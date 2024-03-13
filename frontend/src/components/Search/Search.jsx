import React from "react";
import './Search.css'
import { Input } from '@chakra-ui/react'
import { Button, ButtonGroup } from '@chakra-ui/react'

const Search = (props) => {
    return(
        <div className="Search_container">
            <Input onChangeCapture={props.onChangeCapture} style={{borderTopRightRadius: '0', borderBottomRightRadius: '0'}} onChange={props.onChange} variant='filled' placeholder='Search' />
            <Button onClick={props.onClick} style={{borderTopLeftRadius: '0', borderBottomLeftRadius: '0'}} colorScheme='blue'>search</Button>
        </div>
    )
}

export default Search;