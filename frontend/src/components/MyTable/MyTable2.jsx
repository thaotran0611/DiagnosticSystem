import React, { useState, useEffect } from 'react'; 
import { useDemoData } from '@mui/x-data-grid-generator';
import { DataGrid, GridToolbar, useGridApiRef} from '@mui/x-data-grid';
import { ThemeProvider, createTheme } from '@mui/material';
import "./MyTable2.css"
import MyPagination from '../Pagination/Pagination' 
import { Stack, Flex, Center, Spacer, Box, Text} from '@chakra-ui/react'; 
import GoToPage from '../GoToPage/GoToPage';
import { alpha, styled } from '@mui/material/styles';
import { gridClasses } from '@mui/x-data-grid';


const theme = createTheme({ 
    palette: { 
      primary: { 
        main: '#1976d2', // Change primary color 
      }, 
    }, 
  }); 

  const ODD_OPACITY = 0.2;

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: theme.palette.grey[200],
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
    '&.Mui-selected': {
      backgroundColor: alpha(
        theme.palette.primary.main,
        ODD_OPACITY + theme.palette.action.selectedOpacity,
      ),
      '&:hover': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY +
            theme.palette.action.selectedOpacity +
            theme.palette.action.hoverOpacity,
        ),
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY + theme.palette.action.selectedOpacity,
          ),
        },
      },
    },
  },
}));

export default function MyTable2(props) {
  const apiRef = useGridApiRef();
  const [page, setPage] = useState(1);
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


  const pageSizeList = [10, 20, 30];
  const [pageSize, setPageSize] = useState(pageSizeList[0]);
  const [goToPage, setGoToPage] = useState(data.length > 0 ? "1" : "0");



  useEffect(() => {
    if (data.length > 0){
      setGoToPage("1")
    }
  }, [data.length]);


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
        <Text color={'#3E36B0'} fontSize={'25px'} fontWeight={600}>{props.tablename}</Text> {/* Add table name here */}
            <StripedDataGrid 
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
                console.log(selectedRowData[0])
              }
              
            }}
            getRowClassName={(params) =>
              params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
            }
            slots={{ toolbar: GridToolbar }} 
            hideFooter
            />
            <Flex justifyContent="flex-end" alignItems="center" marginTop={3} marginBottom={2}>
              <Spacer/>
              <GoToPage handleGoToPage={handleGoToPage} goToPage={goToPage} setGoToPage ={setGoToPage}/>
              <Box marginLeft="10px" />
              <label htmlFor="show" style={{display: 'none'}}></label>
              <select id='show' className='itemPerPage' onChange={e => setPageSize(Number(e.target.value))} value={pageSize}> 
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
        <style>
        {`
          .even-row {
            background-color: #f0f8ff; /* Specify your desired color for even rows */
          }

          .odd-row {
            background-color: #ffffff; /* Specify your desired color for odd rows */
          }
        `}
      </style>
    </div>
  );
}