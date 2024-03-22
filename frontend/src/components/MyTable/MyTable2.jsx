import * as React from 'react';
import { useDemoData } from '@mui/x-data-grid-generator';
import { DataGrid, GridToolbar, useGridApiRef} from '@mui/x-data-grid';
import { ThemeProvider, createTheme } from '@mui/material';
import "./MyTable2.css"
const theme = createTheme({ 
    palette: { 
      primary: { 
        main: '#1976d2', // Change primary color 
      }, 
    }, 
  }); 



export default function MyTable2(props) {
  const apiRef = useGridApiRef();

  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 10,
    editable: props.editable,
  });
  

  return (
    <div style={{height: props.height, width: props.width}}>
        <ThemeProvider theme={theme}>
            <DataGrid {...data} loading={loading} slots={{ toolbar: GridToolbar }} />
        </ThemeProvider>
    </div>
  );
}