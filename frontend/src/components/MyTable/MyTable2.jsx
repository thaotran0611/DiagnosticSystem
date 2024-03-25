import React, { useState, useEffect } from 'react'; 
import { useDemoData } from '@mui/x-data-grid-generator';
import { DataGrid, GridToolbar, useGridApiRef} from '@mui/x-data-grid';
import { ThemeProvider, createTheme } from '@mui/material';
import "./MyTable2.css"
import MyPagination from '../Pagination/Pagination' 
import { Stack, Flex, Center, Spacer} from '@chakra-ui/react'; 
import GoToPage from '../GoToPage/GoToPage';


const theme = createTheme({ 
    palette: { 
      primary: { 
        main: '#1976d2', // Change primary color 
      }, 
    }, 
  }); 

export default function MyTable2(props) {
  const apiRef = useGridApiRef();

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'firstName',
      headerName: 'First name',
      width: 150,
      editable: true,
    },
    {
      field: 'lastName',
      headerName: 'Last name',
      width: 150,
      editable: true,
    },
    {
      field: 'age',
      headerName: 'Age',
      type: 'number',
      width: 110,
      editable: true,
    },
    {
      field: 'fullName',
      headerName: 'Full name',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
      valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
    },
  ];
  
  const data = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 14 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 31 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 31 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 11 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
    { id: 10, lastName: 'Snow', firstName: 'Jon', age: 14 },
    { id: 12, lastName: 'Lannister', firstName: 'Cersei', age: 31 },
    { id: 13, lastName: 'Lannister', firstName: 'Jaime', age: 31 },
    { id: 14, lastName: 'Stark', firstName: 'Arya', age: 11 },
    { id: 15, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 16, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 17, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 18, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 19, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
  ];
  const [page, setPage] = useState(1);
  const pageSizeList = [10, 20, 30];
  const [pageSize, setPageSize] = useState(pageSizeList[0]);
  const [goToPage, setGoToPage] = useState("");
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setGoToPage(newPage.toString()); // Update the input field when page changes
  };

  const handleGoToPage = () => {
    const pageNumber = parseInt(goToPage);
    if (pageNumber >= 1 && pageNumber <= Math.ceil(data.length / pageSize)) {
      setPage(pageNumber);
    } else {
      alert(`Page number should be between 1 and ${Math.ceil(data.length / pageSize)}`);
    }
  };

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const slicedData = data.slice(startIndex, endIndex);

  return (
    <div style={{height: props.height, width: props.width}}>
        <ThemeProvider theme={theme}>
            <DataGrid 
            rows={slicedData}
            columns={columns}
            // loading={loading} 
            slots={{ toolbar: GridToolbar }} 
            hideFooterPagination
            />
            <Flex justifyContent="flex-end" >
              <Stack direction="row" spacing="4" p="2" m='0' marginLeft="auto">
                <GoToPage handleGoToPage={handleGoToPage} goToPage={goToPage} setGoToPage ={setGoToPage}/>
                <Spacer/>
                <select className='itemPerPage' onChange={e => setPageSize(Number(e.target.value))} value={pageSize}> 
                  {pageSizeList.map(size => ( 
                    <option key={size} value={size}> 
                      Show {size} 
                    </option> 
                  ))} 
                </select> 
                <MyPagination 
                  count={Math.ceil(data.length / pageSize)} 
                  page={page} 
                  onChange={handleChangePage} 
                /> 
              </Stack>
            </Flex>
        </ThemeProvider>
    </div>
  );
}