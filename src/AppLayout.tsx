import {
  AppBar as MuiAppBar,
  Box,
  IconButton,
  Toolbar,
  styled,
  AppBarProps as MuiAppBarProps,
  LinearProgress,
  CssBaseline,
  useTheme,
  useMediaQuery,
  useScrollTrigger,
  Slide,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import React, { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import AppDrawer from "./components/AppDrawer";
import SpeedDialAddNumber from "./components/SpeedDialMenu/SpeedDialAddNumber";
import SpeedDialAnswerPhone from "./components/SpeedDialMenu/SpeedDialAnswerPhone";
import Search from "./components/Search/Search";
import { useUser } from "./Context/useUser";
import { ProblemDialog } from "./Dialogs/ProblemDialog/ProblemDialog";

const drawerWidth = 240;

export type MenuEntity = {
  label: string;
  icon: React.ReactNode;
  to: string;
  onlyDepartments?: number[];
};

export type MenuCategory = {
  label: string;
  entities: MenuEntity[];
};

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: drawerWidth,
    }),
  },
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  [theme.breakpoints.up("sm")]: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: drawerWidth,
    }),
  },
}));

export type AppLayoutProps = PropsWithChildren<{
  loading: boolean;
}>;

export default function AppLayout({ loading, children }: AppLayoutProps) {
  const theme = useTheme();
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(true);
  const {
    user,
    departments,
    currentProblem,
    updateProblem,
    handleProblemClose,
    showProblemDialog,
  } = useUser();

  const [searchOpen, setSearchOpen] = useState(false);

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 20,
  });

  const mainElevetion = useMemo(() => {
    if (isMobile) {
      return !searchOpen && trigger ? 4 : 0;
    }
    return trigger ? 4 : 0;
  }, [isMobile, searchOpen, trigger]);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setAnchorEl(null);
  }, [pathname]);

  useEffect(() => {
    if (isMobile) setOpen(false);
  }, [isMobile]);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {currentProblem && (
        <ProblemDialog
          key={currentProblem?.id}
          open={showProblemDialog}
          onClose={handleProblemClose}
          problem={currentProblem}
          updateProblem={updateProblem}
        />
      )}
      <AppBar
        position="fixed"
        color="inherit"
        open={open}
        elevation={mainElevetion}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Slide appear={false} in={!open} direction="left">
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="end"
                onClick={handleDrawerOpen}
                sx={{ ...(open && { visibility: "hidden" }) }}
              >
                <MenuIcon />
              </IconButton>
            </Slide>
            {isMobile && (
              <IconButton
                color="inherit"
                edge="end"
                onClick={() =>
                  setSearchOpen((s) => isMobile && pathname === "/" && !s)
                }
              >
                <SearchIcon />
              </IconButton>
            )}
          </Box>
          {!isMobile && <Search />}
          <img
            src="beecommLogo.svg"
            alt="logo"
            height={36}
            style={{ objectFit: "contain" }}
          />
        </Toolbar>
        <LinearProgress
          sx={{
            mt: "-4px",
            opacity: loading ? 1 : 0,
            transition: "opacity 0.3s ease-in-out",
          }}
        />
      </AppBar>

      <Slide appear={false} direction="down" in={searchOpen}>
        <AppBar
          position="fixed"
          color="secondary"
          sx={{ top: 56, zIndex: theme.zIndex.appBar - 1 }}
          elevation={trigger ? 4 : 0}
        >
          <Toolbar>
            <Search />
          </Toolbar>
        </AppBar>
      </Slide>

      <Main open={open}>
        <Box sx={{ pt: "64px" }}>
          {children}
          <Box
            sx={{
              position: "fixed",
              bottom: 0,
              m: 2,
              display: "flex",
            }}
          >
            <SpeedDialAddNumber />
            <SpeedDialAnswerPhone />
          </Box>
        </Box>
      </Main>
      <AppDrawer
        anchorEl={anchorEl}
        departments={departments}
        drawerOpen={open}
        handleAnchor={handleClick}
        handleMenuClose={handleClose}
        handleDrawerClose={handleDrawerClose}
        isMobile={isMobile}
        searchParams={searchParams}
        user={user}
      />
    </Box>
  );
}
