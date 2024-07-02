import { createTheme } from "@mui/material";
import {
  color_blue,
  color_dark_blue,
  color_light_blue,
  color_main,
  color_main_light,
} from "../Consts/Consts";

const baseTheme = createTheme({});

export const theme = createTheme({
  direction: "rtl",
  typography: {
    fontFamily: ["Assistant", "sans-serif"].join(","),
    body2: {
      color: "#EEA900",
      fontSize: 18,
    },
  },
  palette: {
    secondary: baseTheme.palette.augmentColor({
      color: { main: color_dark_blue, light: color_light_blue },
      name: "seondary",
    }),
    primary: baseTheme.palette.augmentColor({
      color: { main: color_main, light: color_main_light },
      name: "primary",
    }),
    warning: baseTheme.palette.augmentColor({
      color: { main: "#EEA900" },
      name: "warning",
    }),
    text: {
      secondary: color_blue,
      primary: "#0D0633",
    },
    grey: {
      "400": "#F3F3F3",
    },
    divider: color_main,
  },
  components: {
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: "#EEA900",
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
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: "40px",
        },
      },
    },
  },
});
