import React from 'react';
import { Pagination} from '@mui/material';

const MyPagination = (props) =>{
    return (
        <Pagination
        count = {props.count}
        page={props.page}
        onChange={props.onChange}
        shape="rounded"
        showFirstButton
        showLastButton
    />
    )
}
export default MyPagination;