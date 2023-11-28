import { createTheme } from '@mui/material';

const baseTheme = createTheme({});

export const theme = createTheme({
  direction: 'rtl',
  typography: {
    fontFamily: ['Rubik', 'sans-serif'].join(','),
    body2: {
      color: '#EEA900',
      fontSize: 18,
    },
  },
  palette: {
    secondary: baseTheme.palette.augmentColor({
      color: { main: '#eae6e3' },
      name: 'green',
    }),
    primary: baseTheme.palette.augmentColor({
      color: { main: '#EEA900' },
      name: 'green',
    }),
    warning: baseTheme.palette.augmentColor({
      color: { main: '#EEA900' },
      name: 'green',
    }),
  },
  components: {
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: '#EEA900',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        outlined: {
          padding: 10,
        },
      },
    },
  },
});
