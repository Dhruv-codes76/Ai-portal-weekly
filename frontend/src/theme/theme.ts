import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#171717',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#E5E5E5',
            contrastText: '#171717',
        },
        text: {
            primary: '#171717',
            secondary: '#737373',
        },
        background: {
            default: '#FFFFFF',
            paper: '#FFFFFF',
        },
        divider: '#E5E5E5',
    },
    typography: {
        fontFamily: 'var(--font-inter), sans-serif',
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 0,
                },
            },
        },
    },
});

export default theme;
