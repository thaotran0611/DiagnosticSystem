import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import { Button, Spacer } from '@chakra-ui/react';
import { Stack, TextField } from '@mui/material';

const theme = createTheme();

const GoToPage = (props) => {
    return (
        <ThemeProvider theme={theme}>
            <Stack direction="row" spacing="10" p="5">
                <Button onClick={props.handleGoToPage}>Page: </Button>
                <Spacer/>
                <TextField
                    defaultValue={1}
                    id="filled-hidden-label-small"
                    type="number"
                    InputProps={{
                        style: { width: '100%', maxWidth: '50px', textAlign: 'center', margin:'auto', marginLeft: '10px'}, // Adjust the width and height as needed
                        disableUnderline: true,
                        onKeyDown: (e) => {
                            if (e.key === 'Enter') {
                                props.handleGoToPage();
                            }
                        },
                    }}
                    variant="filled"
                    value={props.goToPage}
                    onChange={(e) => props.setGoToPage(e.target.value)}
                    size="small"
                    hiddenLabel
                />
            </Stack>
        </ThemeProvider>
    );
}

export default GoToPage;
