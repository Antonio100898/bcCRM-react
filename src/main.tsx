import ReactDOM from "react-dom/client";
import "./index.css";
import { SnackbarProvider } from "notistack";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import App from "./App";
import { UserContextProvider } from "./Context/UserContext";
import { theme } from "./utils/theme";
import EmotionCache from "./utils/EmotionCache";
import { TOKEN_KEY } from "./Consts/Consts";

export const workerKey = localStorage.getItem(TOKEN_KEY);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <BrowserRouter>
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ vertical: "top", horizontal: "left" }}
    >
      <EmotionCache>
        <UserContextProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
          </ThemeProvider>
        </UserContextProvider>
      </EmotionCache>
    </SnackbarProvider>
  </BrowserRouter>
);
