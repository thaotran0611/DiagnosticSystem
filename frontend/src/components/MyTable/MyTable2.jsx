import React, { useState, useEffect } from 'react'; 
import { useDemoData } from '@mui/x-data-grid-generator';
import { DataGrid, GridToolbar, useGridApiRef} from '@mui/x-data-grid';
import { ThemeProvider, createTheme } from '@mui/material';
import "./MyTable2.css"
import MyPagination from '../Pagination/Pagination' 
import { Stack, Flex, Center, Spacer, Box} from '@chakra-ui/react'; 
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
  // console.log(props.data)
  // const columns = [
  //   { field: 'id', headerName: 'ID', width: 90 },
  //   {
  //     field: 'firstName',
  //     headerName: 'First name',
  //     width: 150,
  //     editable: true,
  //   },
  //   {
  //     field: 'lastName',
  //     headerName: 'Last name',
  //     width: 150,
  //     editable: true,
  //   },
  //   {
  //     field: 'age',
  //     headerName: 'Age',
  //     type: 'number',
  //     width: 110,
  //     editable: true,
  //   },
    // {
    //   field: 'fullName',
    //   headerName: 'Full name',
    //   description: 'This column has a value getter and is not sortable.',
    //   sortable: false,
    //   width: 160,
    //   valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
    // },
  // ];
  
  // const data = [
  //   { id: 1, lastName: 'Snow', firstName: 'Jon', age: 14 },
  //   { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 31 },
  //   { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 31 },
  //   { id: 4, lastName: 'Stark', firstName: 'Arya', age: 11 },
  //   { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  //   { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  //   { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  //   { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  //   { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
  //   { id: 10, lastName: 'Snow', firstName: 'Jon', age: 14 },
  //   { id: 12, lastName: 'Lannister', firstName: 'Cersei', age: 31 },
  //   { id: 13, lastName: 'Lannister', firstName: 'Jaime', age: 31 },
  //   { id: 14, lastName: 'Stark', firstName: 'Arya', age: 11 },
  //   { id: 15, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  //   { id: 16, lastName: 'Melisandre', firstName: null, age: 150 },
  //   { id: 17, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  //   { id: 18, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  //   { id: 19, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
  // ];

  const data = props.data || [];
  const columnNames = data.length > 0 ? Object.keys(data[0]) : [];

  // Generating columns dynamically
  const columns = columnNames.map((columnName) => ({
    field: columnName,
    headerName: columnName.charAt(0).toUpperCase() + columnName.slice(1), // Capitalizing first letter
    width: 150,
    editable: false,
  }));

  const rows = data.map((row, index) => ({
    id: row.id || index, // Use the provided id or index as a fallback
    ...row,
  }));


  const [selectedRow, setSelectedRow] = useState(null);

  // Event handler for row selection change
  const handleRowSelectionChange = (selection) => {
    setSelectedRow(selection[0] !== undefined ? rows[selection[0].index] : null); // Update selectedRow based on the index of the selection
    if (props.onSelect && selection[0] !== undefined) {
      const selectedRowIndex = selection[0].index;
      console.log(rows[selectedRowIndex])
      const selectedRowText = rows[selectedRowIndex].text; // Assuming 'text' is the field containing the note text
      props.onSelect(selectedRowText);
    }
  };

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
  const slicedData = rows.slice(startIndex, endIndex);

  return (
    <div style={{height: props.height, width: props.width}}>
        <ThemeProvider theme={theme}>
            <h5>Table Name</h5> {/* Add table name here */}
            <DataGrid 
            rows={slicedData}
            columns={columns}
            // loading={loading} 
            onRowSelectionModelChange={(ids) => {
              const selectedIDs = new Set(ids);
              const selectedRowData = rows.filter((row) =>
                selectedIDs.has(row.id)
              )
              if (selectedRowData.length > 0) {
                props.onSelect(selectedRowData[0])
              }
              // console.log(selectedRowData);
              // console.log(selectedIDs)
            }}
            slots={{ toolbar: GridToolbar }} 
            hideFooter
            />
            <Flex justifyContent="flex-end" alignItems="center" marginTop={3} marginBottom={2}>
              <Spacer/>
              <GoToPage handleGoToPage={handleGoToPage} goToPage={goToPage} setGoToPage ={setGoToPage}/>
              <Box marginLeft="10px" />
              <select className='itemPerPage' onChange={e => setPageSize(Number(e.target.value))} value={pageSize}> 
                {pageSizeList.map(size => ( 
                  <option key={size} value={size}> 
                    Show {size} 
                  </option> 
                ))} 
              </select> 
              <Box marginLeft="10px" />
              <MyPagination 
                count={Math.ceil(data.length / pageSize)} 
                page={page} 
                onChange={handleChangePage} 
              /> 
            </Flex>
        </ThemeProvider>
    </div>
  );
}