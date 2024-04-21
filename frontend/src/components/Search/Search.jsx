import React, { useState } from "react";
import './Search.css'
import { Grid, GridItem, Input } from '@chakra-ui/react'
import { Button, ButtonGroup } from '@chakra-ui/react'

const Search = (props) => {
    const [capturechange, setCaptureChange] = useState('');
    return(
        <Grid w={'100%'} gridTemplateColumns={'90% 10%'}>
            <GridItem>
                <Input fontSize={'20px'} display={'block'} border={'2px solid #3E36B0'} style={{borderTopRightRadius: '0', borderBottomRightRadius: '0'}} onChange={(e) => {setCaptureChange(e.target.value); props.onChange(); props.setSearchInput(e.target.value)}} placeholder='Search' />
            </GridItem>
            <GridItem>
                <Button width={'150px'} bgColor={'#3E36B0'} color={'#fff'} onClick={() => props.onClick(capturechange)} style={{borderTopLeftRadius: '0', borderBottomLeftRadius: '0'}}>Search</Button>
            </GridItem>
        </Grid>
    )
}

export default Search;