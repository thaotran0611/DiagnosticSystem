import React from "react";
import './Search.css'
import { Grid, GridItem, Input } from '@chakra-ui/react'
import { Button, ButtonGroup } from '@chakra-ui/react'

const Search = (props) => {
    return(
        <Grid w={'100%'} gridTemplateColumns={'90% 10%'}>
            <GridItem>
                <Input display={'block'} border={'2px solid #3E36B0'} onChangeCapture={props.onChangeCapture} style={{borderTopRightRadius: '0', borderBottomRightRadius: '0'}} onChange={props.onChange} placeholder='Search' />
            </GridItem>
            <GridItem>
                <Button bgColor={'#3E36B0'} color={'#fff'} onClick={props.onClick} style={{borderTopLeftRadius: '0', borderBottomLeftRadius: '0'}}>Search</Button>
            </GridItem>
        </Grid>
    )
}

export default Search;